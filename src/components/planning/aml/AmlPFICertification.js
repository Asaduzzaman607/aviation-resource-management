import { DatePicker, Form, Input, Select, TimePicker } from "antd";
import RibbonCard from "../../common/forms/RibbonCard";
import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function AmlPFICertification({ signatures, airports }) {
	const { t } = useTranslation();
	return (
		<RibbonCard ribbonText={t("planning.ATL.Certification of PRE-FLIGHT INSPECTION")}>

			<Form.Item
				name={['maintenanceLogSignatureDtoList', 3, 'amlSignatureId']}
				label=""
				hidden={true}
			>
				<Input />
			</Form.Item>

			<Form.Item
				name={['maintenanceLogSignatureDtoList', 3, 'signatureType']}
				label=""
				hidden={true}
			>
				<Input />
			</Form.Item>

			<Form.Item
				name={['maintenanceLogSignatureDtoList', 3, 'signatureId']}
				label={t("planning.ATL.Certification")}
			>
				<Select size="small">
					<Select.Option value="">---{t("common.Select")}---</Select.Option>
					{
						signatures?.map(({ id, name }) => <Select.Option value={id} key={id}>{name}</Select.Option>)
					}
				</Select>
			</Form.Item>

			<Form.Item
				name="preFlightInspectionAirportId"
				label={t("planning.ATL.Station")}
			>
				<Select size="small">
					<Select.Option value="">---{t("common.Select")}---</Select.Option>
					{
						airports?.map(({ id, name }) => <Select.Option value={id} key={id}>{name}</Select.Option>)
					}
				</Select>
			</Form.Item>

			{/* <Form.Item
				name="pfiTime"
				label={t("planning.ATL.Time")}
			>
				<DatePicker size="small" style={{ width: '100%' }} placeholder="" showTime />
			</Form.Item> */}
			<Form.Item name="pfiDateTime" label={t("planning.ATL.Time")} style={{ marginBottom: 0 }}>
                <Form.Item
                  name="pfiDate"
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                >
                  <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} placeholder="Input Date" />
                </Form.Item>
                <Form.Item
                  name="pfiTime"
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                >
                  <TimePicker style={{ width: "100%" }} placeholder="Input Time" format="HH:ss" />
                </Form.Item>
              </Form.Item>
		</RibbonCard>
	)
}


AmlPFICertification.propTypes = {
	signatures: PropTypes.array.isRequired,
	airports: PropTypes.array.isRequired
}