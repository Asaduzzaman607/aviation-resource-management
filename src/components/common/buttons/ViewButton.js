import { EyeOutlined } from "@ant-design/icons";
import ARMButton from "./ARMButton";
import React from "react";
import PropTypes from "prop-types";

export default function ViewButton({ type, size, children, ...rest }) {
	return (
		<ARMButton
			type={type}
			size={size}
			style={{
				backgroundColor: '#4aa0b5',
				borderColor: '#4aa0b5',
			}}
			{...rest}
		>
			{children}
		</ARMButton>
	)
}

ViewButton.defaultProps = {
	type: "primary",
	size: "small",
	children: <EyeOutlined/>
};