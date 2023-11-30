import { EditOutlined } from "@ant-design/icons";
import ARMButton from "./ARMButton";
import React from "react";

export default function EditButton({ children, ...rest }) {
	return (
		<ARMButton
			style={{
				backgroundColor: '#6e757c',
				borderColor: '#6e757c',
			}}
			{...rest}
		>
			{children}
		</ARMButton>
	)
}

EditButton.defaultProps = {
	type: "primary",
	size: "small",
	children: <EditOutlined/>
};