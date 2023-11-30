import { Form, Select } from "antd";
import { PAGE_SIZES } from "../../../lib/constants/paginations";
import React from "react";
import { useTranslation } from "react-i18next";

export default function PageSizesFormItem() {
	const { t } = useTranslation();
	return (
		<Form.Item name="size" label={t("common.Page Size")}>
			<Select id="pageSizeSelect">
				{PAGE_SIZES.map(v => <Select.Option key={v} value={v}>{v}</Select.Option>)}
			</Select>
		</Form.Item>
	)
}