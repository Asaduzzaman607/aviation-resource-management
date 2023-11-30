import { Form, Input, Select } from "antd";
import React from "react";
import RibbonCard from "../../common/forms/RibbonCard";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function AmlEtopsFltCertification({ signatures }) {
	const { t } = useTranslation()
	return (
		<RibbonCard ribbonText={t("planning.ATL.Certification for ETOPS FLT")}>
			
			<Form.Item
				name={['maintenanceLogSignatureDtoList', 2, 'amlSignatureId']}
				label=""
				hidden={true}
			>
				<Input />
			</Form.Item>
			
			<Form.Item
				name={['maintenanceLogSignatureDtoList', 2, 'signatureType']}
				label=""
				hidden={true}
			>
				<Input />
			</Form.Item>
			
			<Form.Item
				name={['maintenanceLogSignatureDtoList', 2, 'signatureId']}
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

AmlEtopsFltCertification.propTypes = {
	signatures: PropTypes.array.isRequired
}