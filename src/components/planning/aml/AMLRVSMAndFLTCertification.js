import { Form, Input, Select } from "antd";
import RibbonCard from "../../common/forms/RibbonCard";
import React from "react";
import { useTranslation } from "react-i18next";

export default function AMLRVSMAndFLTCertification({ signatures }) {
	const { t } = useTranslation()
	return (
		<RibbonCard ribbonText={t("planning.ATL.Certification for RVSM FLT Sector")}>
			
			<Form.Item
				name={['maintenanceLogSignatureDtoList', 1, 'amlSignatureId']}
				label={''}
				hidden={true}
			>
				<Input />
			</Form.Item>
			
			<Form.Item
				name={['maintenanceLogSignatureDtoList', 1, 'signatureType']}
				label={''}
				hidden={true}
			>
				<Input />
			</Form.Item>
			
			<Form.Item
				name={['maintenanceLogSignatureDtoList', 1, 'signatureId']}
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