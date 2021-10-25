import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/Network";

import StyleSheet from "./finalPaymentPage.module.css";
import success from "../../assets/images/success.png";
import fail from "../../assets/images/fail.png";

const FinalPaymentPage = () => {
	const { orderKey, mode } = useParams();

	useEffect(() => {
		if (mode === "success") {
			return axios
				.post("/payment/course/library", {
					order_key: orderKey,
				})
				.then((res) => {
					console.log("success");
				})
				.catch((err) => {
					console.log(err);
					// if (err.response) console.log(err.response.data);
				});
		}
	}, [orderKey, mode]);

	return (
		<div className={StyleSheet.Main}>
			<div className={`container text-center ${StyleSheet.MessageHolder}`}>
				<div className={StyleSheet.Icon}>
					<img
						src={mode === "success" ? success : fail}
						alt={mode === "success" ? "موفق" : "ناموفق"}
					/>
				</div>
				<h4 className={`mb-4`}>
					{mode === "success"
						? "تراکنش با موفقیت انجام شد"
						: "تراکنش ناموفق بود"}
				</h4>
				<a
					href={
						mode === "success"
							? "servatafarinan://payment/course/success"
							: "servatafarinan://payment/course/fail"
					}
				>
					<button className={StyleSheet.BackToApp}>بازگشت به برنامه</button>
				</a>
			</div>
		</div>
	);
};

export default FinalPaymentPage;
