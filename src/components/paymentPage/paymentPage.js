import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";

import axios from "../../utils/Network";
import toastGen from "../../utils/toastGenerator";

import StyleSheet from "./paymentPage.module.css";
import greenTick from "../../assets/images/green-tick.png";
import phoneMoonLeft from "../../assets/images/payment-left-moon.png";
import phoneMoonUnCompRight from "../../assets/images/moon-un-comp.png";

const PaymentPage = (props) => {
	const [userToken] = useState(
		new URLSearchParams(useLocation().search).get("t")
	);
	const [orderId, setOrderId] = useState(null);
	const [payementInfo, setPaymentInfo] = useState(null);
	const [courseInfo, setCourseInfo] = useState(null);
	const [useWallet, setUseWallet] = useState(false);
	const [discountCode, setDiscountCode] = useState("");
	const [walletLoading, setWalletLoading] = useState(false);
	const [BTNAble, setBTNAble] = useState(true);
	const [sendOrderLoading, setSendOrderLoading] = useState(false);
	const [cancelOrderLoading, setCancelOrderLoading] = useState(false);

	const { courseId } = useParams();
	const history = useHistory();

	useEffect(() => {
		return axios
			.post("/payment/course", {
				user_token: userToken,
				course_id: courseId,
			})
			.then((res) => res.data)
			.then((response) => {
				const inforamtion = response.data;
				setOrderId(inforamtion.order_id);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [courseId, userToken, setOrderId]);

	useEffect(() => {
		if (orderId) {
			return axios
				.post(`/payment/course/info?wallet=false`, {
					user_token: userToken,
					course_id: courseId,
					order_id: orderId,
					discount_code: discountCode,
				})
				.then((res) => res.data)
				.then((response) => {
					const inforamtion = response.data;
					setPaymentInfo(inforamtion.payment_info);
					setCourseInfo(inforamtion.course);
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			return null;
		}
	}, [
		orderId,
		courseId,
		// discountCode,
		userToken,
		setPaymentInfo,
		setCourseInfo,
	]);

	const editPaymentNumbers = useCallback((number) => {
		const strNum = number.toString();
		return strNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}, []);

	const handleUseWallet = useCallback(() => {
		if (orderId && BTNAble) {
			const thisUseWallet = useWallet;
			setUseWallet(!thisUseWallet);
			setWalletLoading(true);
			axios
				.post(`/payment/course/info?wallet=${!thisUseWallet}`, {
					user_token: userToken,
					course_id: courseId,
					order_id: orderId,
					discount_code: discountCode,
				})
				.then((res) => res.data)
				.then((response) => {
					const inforamtion = response.data;
					setPaymentInfo(inforamtion.payment_info);
					setWalletLoading(false);
				})
				.catch((err) => {
					console.log(err);
					// if (err.response) console.log(err.response.data);
				});
		}
	}, [
		orderId,
		BTNAble,
		useWallet,
		courseId,
		userToken,
		discountCode,
		setUseWallet,
		setWalletLoading,
		setPaymentInfo,
	]);

	const handleDiscountCodeEffect = useCallback(() => {
		if (orderId && BTNAble) {
			axios
				.post(`/payment/course/info?wallet=${useWallet}`, {
					user_token: userToken,
					course_id: courseId,
					order_id: orderId,
					discount_code: discountCode,
				})
				.then((res) => res.data)
				.then((response) => {
					const inforamtion = response.data;
					setPaymentInfo(inforamtion.payment_info);

					const message = response.message;
					if (message) {
						setDiscountCode("");
						// alert(message.message);
						toastGen(message.message, message.type);
					}
				})
				.catch((err) => {
					console.log(err);
					// if (err.response) console.log(err.response.data);
				});
		}
	}, [
		orderId,
		BTNAble,
		useWallet,
		courseId,
		userToken,
		discountCode,
		setDiscountCode,
		setPaymentInfo,
	]);

	const handleOrderLink = useCallback(() => {
		if (orderId) {
			setBTNAble(false);
			setSendOrderLoading(true);
			axios
				.post(`/payment/course/link?wallet=${useWallet}`, {
					user_token: userToken,
					order_id: orderId,
					discount_code: discountCode,
				})
				.then((res) => res.data)
				.then((response) => {
					const inforamtion = response.data;
					const finalLink = inforamtion.link;
					if (finalLink) {
						window.location = finalLink;
					}
				})
				.catch((err) => {
					const response = err.response.data;
					const message = response.message;
					if (message) {
						setDiscountCode("");
						// alert(message.message);
						toastGen(message.message, message.type);
					}
					setBTNAble(true);
					setSendOrderLoading(false);
				});
		}
	}, [useWallet, orderId, userToken, discountCode, setBTNAble]);

	const handleCancelOrder = useCallback(() => {
		if (orderId) {
			setBTNAble(false);
			setCancelOrderLoading(true);
			axios
				.post(`/payment/course/cancel`, {
					user_token: userToken,
					order_id: orderId,
				})
				.then((res) => {
					/* this url should change to cancel order page */
					// window.location = "http://pms-ui.myfreenet.ir/pay";
					history.push("/payment/course/fail/0");
				})
				.catch((err) => {
					console.log(err);
					// if (err.response) console.log(err.response.data);
				});
		}
	}, [orderId, userToken, setBTNAble, history]);

	return (
		<div className={StyleSheet.Main}>
			{courseInfo && payementInfo ? (
				<div className={`container-fluid`} style={{ position: "relative" }}>
					<img src={phoneMoonLeft} className={StyleSheet.MoonLeft} alt="" />
					<img
						src={phoneMoonUnCompRight}
						className={StyleSheet.MoonRight}
						alt=""
					/>
					<div className={`col-sm-12 col-md-5 col-lg-4 mx-auto`}>
						<p className={`${StyleSheet.Title} text-center`}>
							<strong>آکادمی ثروت آفرینان</strong>
						</p>
						<div className={`${StyleSheet.CourseCard} mx-auto`}>
							<div
								className={StyleSheet.CourseImage}
								style={{
									backgroundColor: courseInfo.color
										? courseInfo.color
										: "white",
								}}
							>
								<img src={courseInfo.image} alt={courseInfo.title} />
							</div>
							<div className={`${StyleSheet.CourseText} px-2 py-2`}>
								<span>دوره {courseInfo.level}</span>
								<p
									className={`mb-1`}
									style={{
										fontSize: courseInfo.title.length > 20 ? "1.1em" : "1.25em",
									}}
								>
									<strong>{courseInfo.title}</strong>
								</p>
								<p className={`${StyleSheet.CourseDesc} mb-1`}>
									{courseInfo.short_description}
								</p>
							</div>
						</div>
					</div>
					{/* course info */}
					<div className={`col-sm-12 col-md-5 col-lg-5 mx-auto`}>
						<div className={StyleSheet.Payment}>
							<div className={`${StyleSheet.PaymentRow} mx-auto mt-3 mb-2`}>
								<div className={`${StyleSheet.Label} py-1 px-2`}>
									قیمت محصول
								</div>
								<div className={`${StyleSheet.Amount} text-center py-1 px-2`}>
									{editPaymentNumbers(payementInfo.total_price)}
								</div>
							</div>
							<div className={`${StyleSheet.PaymentRow} mx-auto my-2`}>
								<div className={`${StyleSheet.Label} py-1 px-2`}>
									<p className={`mb-3`}>تخفیف</p>
									<p className={`my-0`}>تخفیف ستاره ها</p>
								</div>
								<div className={`${StyleSheet.Amount} text-center py-1 px-2`}>
									<p className={`mb-3`}>
										{editPaymentNumbers(payementInfo.discount)}
									</p>
									<p className={`my-0`}>
										{editPaymentNumbers(payementInfo.stars_discount)}
									</p>
								</div>
							</div>
							<div className={`${StyleSheet.PaymentRow} mx-auto my-2`}>
								<div className={`${StyleSheet.Label} py-1 px-2`}>
									موجودی کیف پول
								</div>
								<div className={`${StyleSheet.Amount} text-center py-1 px-2`}>
									{editPaymentNumbers(payementInfo.user_wallet_amount)}
								</div>
							</div>
							<div className={StyleSheet.Wallet}>
								<span onClick={handleUseWallet}>
									{useWallet && <img src={greenTick} alt="tick" />}
								</span>
								<p className={`mb-1`}>از کیف پول کسر شود.</p>
							</div>
							<div className={`${StyleSheet.PaymentRow} mx-auto my-2`}>
								<input
									type="text"
									onChange={(e) => setDiscountCode(e.target.value)}
									value={discountCode}
									placeholder="کد تخفیف"
									className={`${StyleSheet.Discount} py-2 px-2`}
								/>
								<button
									disabled={!BTNAble}
									onClick={handleDiscountCodeEffect}
									className={`${StyleSheet.EffectDiscount} text-center py-2 px-2`}
								>
									اعمال
								</button>
							</div>
							<div className={`${StyleSheet.PaymentRow} mx-auto my-2`}>
								<div className={`${StyleSheet.Label} py-1 px-2`}>
									مبلغ قابل پرداخت
								</div>
								<div className={`${StyleSheet.Amount} text-center py-1 px-2`}>
									{walletLoading
										? "..."
										: editPaymentNumbers(payementInfo.final_payment_amount)}
								</div>
							</div>
						</div>
					</div>
					{/* payment info */}
					<div className={`col-sm-12 col-md-6 text-center mx-auto`}>
						<button
							disabled={!BTNAble}
							onClick={handleOrderLink}
							className={`${StyleSheet.PayBTN}`}
						>
							{sendOrderLoading ? "..." : "پرداخت"}
						</button>
						<button
							disabled={!BTNAble}
							onClick={handleCancelOrder}
							className={`${StyleSheet.CancelBTN}`}
						>
							{cancelOrderLoading ? "..." : "لغو"}
						</button>
					</div>
					<br />
					<br />
					{/* actions */}
				</div>
			) : (
				<div className={`container-fluid`} style={{ position: "relative" }}>
					<img src={phoneMoonLeft} className={StyleSheet.MoonLeft} alt="" />
					<img
						src={phoneMoonUnCompRight}
						className={StyleSheet.MoonRight}
						alt=""
					/>
					<div className={`col-sm-12 col-md-5 col-lg-4 mx-auto`}>
						<p className={`${StyleSheet.Title} text-center`}>
							<strong>آکادمی ثروت آفرینان</strong>
						</p>
						<div className={`${StyleSheet.CourseCard_Loading} mx-auto`}></div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PaymentPage;
