import { DatePicker, Form, Input, Select, TimePicker } from "antd";
import RibbonCard from "../../common/forms/RibbonCard";
import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function AmlAcceptanceForTheFLTCertification({ signatures }) {
	const { t } = useTranslation();
	return (
		<RibbonCard ribbonText={t("planning.ATL.Certification of Acceptance for the FLT")}>
			
			<Form.Item
				name={['maintenanceLogSignatureDtoList', 4, 'amlSignatureId']}
				label=""
				hidden={true}
			>
				<Input />
			</Form.Item>
			
			<Form.Item
				name={['maintenanceLogSignatureDtoList', 4, 'signatureType']}
				label=""
				hidden={true}
			>
				<Input />
			</Form.Item>
			
			<Form.Item
				name={['maintenanceLogSignatureDtoList', 4, 'signatureId']}
				label={t("planning.ATL.Certification")}
			>
				<Select size="small">
					<Select.Option value="">---{t("common.Select")}---</Select.Option>
					{
						signatures.map(({id, name}) => <Select.Option value={id} key={id}>{name}</Select.Option>)
					}
				</Select>
			</Form.Item>
			
			{/* <Form.Item
				name="ocaTime"
				label={t("planning.ATL.Time")}
			>
				<DatePicker size="small" style={{width: '100%'}} placeholder="" showTime/>
			</Form.Item> */}
			<Form.Item name="ocaDateTime" label={t("planning.ATL.Time")} style={{ marginBottom: 0 }}>
                <Form.Item
                  name="ocaDate"
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                >
                  <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }}  />
                </Form.Item>
                <Form.Item
                  name="ocaTime"
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                >
                  <TimePicker style={{ width: "100%" }} format="HH:mm"  />
                </Form.Item>
              </Form.Item>
		</RibbonCard>
	)
}

AmlAcceptanceForTheFLTCertification.propTypes = {
	signatures: PropTypes.array.isRequired
}