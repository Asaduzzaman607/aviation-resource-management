import { Form, InputNumber } from "antd";
import RibbonCard from "../../common/forms/RibbonCard";
import React from "react";
import { useTranslation } from "react-i18next";

export default function AmlFuelUpliftCrossCheck() {
	const { t } = useTranslation();
	return (
		<RibbonCard ribbonText={t("planning.ATL.Fuel uplift Cross check")}>
			<Form.Item
				name="refuelDelivery"
				label={t("planning.ATL.Refueling Vehicle Delivery")}
			>
				<InputNumber size="small" style={{width: '75%'}} controls={false} addonAfter="in ltr"/>
			</Form.Item>
			
			<Form.Item
				name="specificGravity"
				label={t("planning.ATL.Specific Gravity")}
			>
				<InputNumber size="small" style={{width: '75%'}} controls={false}/>
			</Form.Item>
			
			<Form.Item
				name="convertedIn"
				label={t("planning.ATL.Converted In")}
			>
				<InputNumber size="small" style={{width: '75%'}} controls={false} addonAfter="Kg/lb"/>
			</Form.Item>
		</RibbonCard>
	)
}