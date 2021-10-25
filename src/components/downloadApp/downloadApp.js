import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import axios from "../../utils/Network";
import StyleSheet from "./downloadApp.module.css";

import mobile_phone from "../../assets/images/phone-mobile.png";
import tablet_phone from "../../assets/images/tablet-mobile.png";
import mobile_banner from "../../assets/images/phone-banner.png";
import tablet_banner from "../../assets/images/tablet-banner.png";
import moon_comp from "../../assets/images/moon-comp.png";
import phone_moon_left from "../../assets/images/phone-moon-left.png";
import phone_moon_right from "../../assets/images/phone-moon-right.png";
import desktop_banner from "../../assets/images/desktop-banner.png";
import moon_bottom from "../../assets/images/moon-bottom.png";

const DownloadApp = (props) => {
	const [username] = useState(
		new URLSearchParams(useLocation().search).get("u")
	);
	const [pageInfo, setPageInfo] = useState({});

	/* get download app information */
	useEffect(() => {
		axios
			.get(`/users/download-page?u=${username}`)
			.then((res) => res.data)
			.then((data) => {
				// console.log(data);
				setPageInfo(data.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [username]);

	return (
		<div className={StyleSheet.Main}>
			<div className={`${StyleSheet.Info}`}>
				<img
					className={StyleSheet.MoonRight_Phone}
					src={phone_moon_right}
					alt="moon"
				/>
				<img
					className={StyleSheet.MoonLeft_Phone}
					src={phone_moon_left}
					alt="moon"
				/>
				<img className={StyleSheet.MoonBottom} src={moon_bottom} alt="moon" />
				<div className={StyleSheet.Main_Info}>
					<div
						className={`col-sm-12 col-md-6 col-lg-12 mx-auto text-right pt-3 pb-5 px-5`}
					>
						<img className={StyleSheet.MoonComp} src={moon_comp} alt="moon" />
						<h5 className={StyleSheet.MainTitle}>
							<strong>آکادمی ثروت آفرینان</strong>
						</h5>
						<br />
						<p className={StyleSheet.ShortDescription}>
							<strong>تخصصی ترین مرکز پرورش مدیران و کارآفرینان ایرانی</strong>
						</p>
						<p className={StyleSheet.ShortDescription}>
							<strong>
								ارائه محصولات و خدمات تخصصی کارآفرینی و مدیریت کسب و کار
							</strong>
						</p>
						<br />
						{pageInfo.invite_code && (
							<p className={`text-center ${StyleSheet.InviteCode}`}>
								<strong>کد معرف شما: {pageInfo.invite_code}</strong>
							</p>
						)}
						<br />
						<a
							href={pageInfo.app_download_link}
							target="_blank"
							rel="noreferrer"
							className={StyleSheet.DownloadAppBTN}
						>
							<div>دانلود اپلیکیشن</div>
						</a>
					</div>
				</div>
				<div className={StyleSheet.PhoneTabletBanner}>
					<div>
						<img
							className={StyleSheet.Mobile_Banner}
							src={mobile_banner}
							alt="banner"
						/>
						<img
							className={StyleSheet.Tablet_Banner}
							src={tablet_banner}
							alt="banner"
						/>
						<img
							className={StyleSheet.Desktop_Banner}
							src={desktop_banner}
							alt="banner"
						/>
						<img
							className={StyleSheet.Mobile_Phone}
							src={mobile_phone}
							alt="mobile"
						/>
						<img
							className={StyleSheet.Tablet_Phone}
							src={tablet_phone}
							alt="mobile"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DownloadApp;
