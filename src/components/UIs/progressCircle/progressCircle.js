import React, { useRef, useEffect, useState } from "react";
import StyleSheet from "./progressCircle.module.css";

const ProgressCircle = ({
	size,
	progress,
	strokeWidth,
	circleOneStroke,
	circleTwoStroke,
}) => {
	const [offset, setOffset] = useState(0);

	const circleRef = useRef(null);

	const center = size / 2;
	const radius = size / 2 - strokeWidth / 2;
	const circumference = 2 * Math.PI * radius;

	useEffect(() => {
		const progressOffset = ((100 - progress) / 100) * circumference;
		setOffset(progressOffset);
	}, [setOffset, circumference, progress, offset]);

	return (
		<div style={{ position: "relative" }}>
			<svg className={StyleSheet.Svg} width={size} height={size}>
				<linearGradient id="linearColorsProgress" x1="0" y1="0" x2="1" y2="1">
					{/* <stop offset="40%" stopColor="#2045C8"></stop> */}
					{/* <stop offset="65%" stopColor="#2045C8"></stop> */}
					{/* <stop offset="85%" stopColor="#00B1FD"></stop> */}
					<stop offset="40%" stopColor="#232A48"></stop>
					<stop offset="65%" stopColor="#00B1FD"></stop>
					<stop offset="85%" stopColor="#2045C8"></stop>
					<stop offset="100%" stopColor="#2045C8"></stop>
				</linearGradient>
				<circle
					className={StyleSheet.CircleBG}
					stroke={circleOneStroke ? circleOneStroke : "transparent"}
					cx={center}
					cy={center}
					r={radius - 3}
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
				/>
				<circle
					className={StyleSheet.Circle}
					cx={center}
					cy={center}
					r={radius}
					strokeWidth={strokeWidth}
					// strokeDasharray={`0 ${circumference}`}
					strokeDasharray={circumference}
					ref={circleRef}
					strokeDashoffset={offset}
					// transform="rotate(-90)"
					stroke="url(#linearColorsProgress)"
				/>
				{/* <text
					className={StyleSheet.SvgText}
					x={center}
					y={center + 4}
					transform=""
				>
					{progress}%
				</text> */}
			</svg>
			<p className={StyleSheet.Percentage}>{progress}%</p>
		</div>
	);
};

export default ProgressCircle;
