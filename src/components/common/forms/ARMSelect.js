import { Select } from "antd";
import React from "react";
import PropTypes from "prop-types";

export default function ARMSelect({title, options}) {
	return (
		<Select
			placeholder={title}
		>
			{
				options.map(({id, name}) => <Select.Option value={id} key={id}>{name}</Select.Option>)
			}
		</Select>
	)
}

ARMSelect.propTypes = {
	title: PropTypes.string.isRequired,
	options: PropTypes.array.isRequired
};