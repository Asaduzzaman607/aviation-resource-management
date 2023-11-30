import { Form, Input, Select } from "antd";
import RibbonCard from "../../common/forms/RibbonCard";
import React from "react";
import { useTranslation } from "react-i18next";

export default function AMLOilAndFuelCertification({ signatures }) {
	const { t } = useTranslation();
	return (
		<RibbonCard ribbonText={t("planning.ATL.Certification of Oil and Fuel")}>
			<Form.Item
				name={['maintenanceLogSignatureDtoList', 0, 'amlSignatureId']}
				label={''}
				hidden={true}
			>
				<Input size="small" />
			</Form.Item>
			
			<Form.Item
				name={['maintenanceLogSignatureDtoList', 0, 'signatureType']}
				label={''}
				hidden={true}
			>
				<Input size="small" />
			</Form.Item>
			
			<Form.Item
				name={['maintenanceLogSignatureDtoList', 0, 'signatureId']}
				label={t("planning.ATL.Certification")}
			>
				<Select size="small">
					<Select.Option value="">---{t("common.Select")}---</Select.Option>
					{
						signatures.map(({id, name}) => <Select.Option value={id} key={id}>{name}</Select.Option>)
					}
				</Select>
			</Form.Item>
		</RibbonCard>
	)
}