import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "../../utils/Network";

import StyleSheet from "./publicProfile.module.css";
import fillStar from "../../assets/images/fill-star.png";
import unFillStar from "../../assets/images/unfill-star.png";
import ProgressCircle from "../UIs/progressCircle/progressCircle";

const PublicProfile = (props) => {
	const [userInfo, setUserInfo] = useState(null);
	const [userStars] = useState(["", "", "", "", ""]);
	const [userCourses, setUserCourses] = useState([]);
	const [coursePage, setCoursePage] = useState(1);
	const [courseLastPage, setCourseLastPage] = useState(1);
	const [coursePageLimit] = useState(10);
	const courseList = useRef(null);

	const { username } = useParams();
	/* for get user inforamtion */
	useEffect(() => {
		return axios
			.get(`/users/${username}/public-profile`)
			.then((res) => res.data)
			.then((response) => {
				setUserInfo(response.data);
			})
			.catch((err) => {
				if (err.response) console.log(err.response.data);
				else console.log(err);
			});
	}, [username]);
	/* for get user course information */
	useEffect(() => {
		return axios
			.get(
				`/users/${username}/public-profile/courses?page=1&limit=${coursePageLimit}`
			)
			.then((res) => res.data)
			.then((response) => {
				setUserCourses(response.data.courses);
				setCourseLastPage(response.data.last_page);
			})
			.catch((err) => {
				if (err.response) console.log(err.response.data);
				else console.log(err);
			});
	}, [username, coursePageLimit]);
	/* for set title to user's name */

	const handleCourseListScroll = async (e) => {
		// console.log(e.target.clientWidth);
		// console.log(Math.abs(e.target.scrollLeft));
		// console.log(e.target.scrollWidth);
		// // console.log(
		// // 	e.target.clientWidth + Math.abs(e.target.scrollLeft) >=
		// // 		e.target.scrollWidth
		// // );
		// // console.log(coursePage < courseLastPage);
		// console.log(
		// 	e.target.clientWidth + Math.abs(e.target.scrollLeft) >=
		// 		e.target.scrollWidth
		// );
		if (
			coursePage < courseLastPage &&
			e.target.clientWidth + Math.abs(e.target.scrollLeft) >=
				e.target.scrollWidth - 15
		) {
			const thisCoursePage = coursePage + 1;
			setCoursePage(thisCoursePage);
			console.log(thisCoursePage);
			try {
				const axiosRes = await axios.get(
					`/users/${username}/public-profile/courses?page=${thisCoursePage}&limit=${coursePageLimit}`
				);
				const response = axiosRes.data.data;
				const oldCourses = userCourses;
				setUserCourses(oldCourses.concat(response.courses));
			} catch (err) {
				console.log(err);
			}
		}
	};

	return userInfo ? (
		<div className={StyleSheet.Main}>
			<Helmet>
				<title>
					{"پروفایل " + userInfo.username + " - آکادمی ثروت آفرینان"}
				</title>
			</Helmet>
			<div className="container">
				<div className={`${StyleSheet.Card} col-md-12 mx-auto`}>
					<p className={StyleSheet.Title}>
						<strong>آکادمی ثروت آفرینان</strong>
					</p>
					<div
						className={StyleSheet.Image}
						style={{ backgroundColor: "white" }}
					>
						<img src={userInfo.image} alt={userInfo.username} />
					</div>
					<p className={`text-center ${StyleSheet.Text}`}>
						<strong>{userInfo.username}</strong>
					</p>
					<p className={`text-center ${StyleSheet.RegisterDate}`}>
						تاریخ عضویت : {userInfo.register_date}
					</p>
					<p className={`text-center ${StyleSheet.TotalScore}`}>
						<strong>
							{userInfo.network_score + userInfo.scientific_score}
						</strong>
					</p>
					<div>
						{userStars
							.map((el, index) => {
								return (
									<span className={StyleSheet.Star} key={index}>
										<img
											src={index + 1 <= userInfo.stars ? fillStar : unFillStar}
											alt="ستاره"
										/>
									</span>
								);
							})
							.reverse()}
					</div>
					<div className={StyleSheet.Skill}>
						<div
							className={StyleSheet.SkillHolder}
							style={{ borderLeft: "1.95px solid white" }}
						>
							<strong>
								<span>{userInfo.network_score}</span>
							</strong>
							<span className={StyleSheet.SkillTitle}>شبکه سازی</span>
						</div>
						<div
							className={StyleSheet.SkillHolder}
							style={{ borderLeft: "1.95px solid white" }}
						>
							<strong>
								<span>{userInfo.monthly_rank}</span>
							</strong>
							<span className={StyleSheet.SkillTitle}>رتبه ماهانه</span>
						</div>
						<div
							className={StyleSheet.SkillHolder}
							style={{ borderLeft: "1.95px solid white" }}
						>
							<strong>
								<span>{userInfo.yearly_rank}</span>
							</strong>
							<span className={StyleSheet.SkillTitle}>رتبه سالانه</span>
						</div>
						<div className={StyleSheet.SkillHolder}>
							<strong>
								<span>{userInfo.scientific_score}</span>
							</strong>
							<span className={StyleSheet.SkillTitle}>علمی</span>
						</div>
					</div>
					<div className={StyleSheet.Courses}>
						<p>دوره های آموزشی</p>
						<div
							className={StyleSheet.CoursesList}
							ref={courseList}
							onScroll={handleCourseListScroll}
						>
							{userCourses.map((el, index) => {
								const titleLength = 16;
								const courseTitle =
									el.title.length > titleLength
										? el.title.slice(0, titleLength - 1) + ".."
										: el.title;

								return (
									<div className={StyleSheet.CourseItem} key={index}>
										<p className={StyleSheet.CourseLevel}>
											<strong>دوره {el.level}</strong>
										</p>
										<span
											style={{
												fontSize:
													courseTitle.length > titleLength ? ".7em" : ".85em",
												wordBreak: "break-all",
											}}
											title={el.title}
										>
											<strong>{courseTitle}</strong>
										</span>
										<ProgressCircle
											size={55}
											progress={el.progress_percentage}
											strokeWidth={3}
											circleTwoStroke="#232A48"
										/>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div className={StyleSheet.Main}>
			<div className="container">
				<div className={`${StyleSheet.Card_Loading} col-md-12 mx-auto`}></div>
			</div>
		</div>
	);
};

export default PublicProfile;
