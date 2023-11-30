import { Checkbox, Col, Form, InputNumber, Row } from "antd";
import RibbonCard from "../../../common/forms/RibbonCard";
import React from "react";
import { OIL_RECORD_FORM } from "./aml.constants";
import useAMLContext from "../../../../contexts/aml";
import { useTranslation } from "react-i18next";


export default function AmlOilRecord() {
	const { selectedBox, setSelectedBox } = useAMLContext();

	const toggleCheckBox = (id) => setSelectedBox((prev) => {
		return { ...prev, [id]: !prev[id] };
	});
	const { t } = useTranslation();
	return (
		<>
			<RibbonCard ribbonText={t("planning.ATL.On Arrival")}>

				<Row>
					<Col sm={20} md={10}>
						<Form.Item
							name={[OIL_RECORD_FORM, "onArrival", "hydOil1"]}
							label={t("planning.ATL.Hyd Oil1")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}
						>
							<InputNumber
								maxLength={8}
								size="small"
								addonAfter={
									<Checkbox
										id="c1"
										checked={selectedBox.c1}
										onChange={() => toggleCheckBox("c1")}
									>
										{t("planning.ATL.Full")}
									</Checkbox>
								}
								placeholder={selectedBox.c1 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c1}
								type='number'
								style={{ width: '100%' }} />

						</Form.Item>


						<Form.Item
							name={[OIL_RECORD_FORM, "onArrival", "hydOil2"]}
							label={t("planning.ATL.Hyd Oil2")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}

						>
							<InputNumber
								maxLength={8}
								size="small"
								addonAfter={
									<Checkbox
										id="c2"
										checked={selectedBox.c2}
										onChange={() => toggleCheckBox("c2")}
									>
										{t("planning.ATL.Full")}
									</Checkbox>
								}
								placeholder={selectedBox.c2 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c2}
								type='number'
								style={{ width: '100%' }} />
						</Form.Item>

						<Form.Item
							name={[OIL_RECORD_FORM, "onArrival", "hydOil3"]}
							label={t("planning.ATL.Hyd Oil3")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}

						>
							<InputNumber
								size="small"
								addonAfter={
									<Checkbox
										id="c3"
										checked={selectedBox.c3}
										onChange={() => toggleCheckBox("c3")}
									>
										Full
									</Checkbox>
								}
								placeholder={selectedBox.c3 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c3}
								type='number'
								style={{ width: '100%' }}
							/>
						</Form.Item>

						<Form.Item
							name={[OIL_RECORD_FORM, "onArrival", "engineOil1"]}
							label={t("planning.ATL.Engine Oil1")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}
						>
							<InputNumber
								size="small"
								addonAfter={
									<Checkbox
										id="c4"
										checked={selectedBox.c4}
										onChange={() => toggleCheckBox("c4")}
									>
										Full
									</Checkbox>
								}
								placeholder={selectedBox.c4 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c4}
								type='number'
								style={{ width: '100%' }} />
						</Form.Item>
					</Col>

					<Col sm={20} md={10}>
						<Form.Item
							name={[OIL_RECORD_FORM, "onArrival", "engineOil2"]}
							label={t("planning.ATL.Engine Oil2")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}

						>
							<InputNumber
								size="small"
								addonAfter={
									<Checkbox
										id="c5"
										checked={selectedBox.c5}
										onChange={() => toggleCheckBox("c5")}
									>
										Full
									</Checkbox>
								}
								placeholder={selectedBox.c5 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c5}
								type='number'
								style={{ width: '100%' }}
							/>
						</Form.Item>

						<Form.Item
							name={[OIL_RECORD_FORM, "onArrival", "apuOil"]}
							label={t("planning.ATL.APU Oil")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}

						>
							<InputNumber
								size="small"
								addonAfter={
									<Checkbox
										id="c6"
										checked={selectedBox.c6}
										onChange={() => toggleCheckBox("c6")}
									>
										{t("planning.ATL.Full")}
									</Checkbox>
								}
								placeholder={selectedBox.c6 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c6}
								type='number'
								style={{ width: '100%' }} />
						</Form.Item>

						<Form.Item
							name={[OIL_RECORD_FORM, "onArrival", "csdOil1"]}
							label={t("planning.ATL.CSD Oil1")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}

						>
							<InputNumber
								size="small"
								addonAfter={
									<Checkbox
										id="c7"
										checked={selectedBox.c7}
										onChange={() => toggleCheckBox("c7")}
									>
										{t("planning.ATL.Full")}
									</Checkbox>
								}
								placeholder={selectedBox.c7 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c7}
								type='number'
								style={{ width: '100%' }} />
						</Form.Item>


						<Form.Item
							name={[OIL_RECORD_FORM, "onArrival", "csdOil2"]}
							label={t("planning.ATL.CSD Oil2")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}

						>
							<InputNumber
								size="small"
								addonAfter={
									<Checkbox
										id="c8"
										checked={selectedBox.c8}
										onChange={() => toggleCheckBox("c8")}
									>
										{t("planning.ATL.Full")}
									</Checkbox>
								}
								placeholder={selectedBox.c8 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c8}
								type='number'
								style={{ width: '100%' }} />
						</Form.Item>

						<Form.Item
							name={[OIL_RECORD_FORM, "onArrival", "oilRecord"]}
							label={t("planning.ATL.Fuel Record")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}

						>
							<InputNumber
								size="small"
								addonAfter={
									<Checkbox
										id="c9"
										checked={selectedBox.c9}
										onChange={() => toggleCheckBox("c9")}
									>
										{t("planning.ATL.Full")}
									</Checkbox>
								}
								placeholder={selectedBox.c9 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c9}
								type='number'
								style={{ width: '100%' }} />
						</Form.Item>


					</Col>

				</Row>
			</RibbonCard>

			<RibbonCard ribbonText={t("planning.ATL.Uplift")}>

				<Row>
					<Col sm={20} md={10}>
						<Form.Item
							name={[OIL_RECORD_FORM, "upLift", "hydOil1"]}
							label={t("planning.ATL.Hyd Oil1")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}
						>
							<InputNumber
								size="small"
								placeholder={selectedBox.c10 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c10}
								type='number'
								style={{ width: '100%' }} />

						</Form.Item>


						<Form.Item
							name={[OIL_RECORD_FORM, "upLift", "hydOil2"]}
							label={t("planning.ATL.Hyd Oil2")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}
						>
							<InputNumber
								size="small"
								placeholder={selectedBox.c11 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c11}
								type='number'
								style={{ width: '100%' }} />
						</Form.Item>

						<Form.Item
							name={[OIL_RECORD_FORM, "upLift", "hydOil3"]}
							label={t("planning.ATL.Hyd Oil3")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}

						>
							<InputNumber
								size="small"
								placeholder={selectedBox.c12 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c12}
								type='number'
								style={{ width: '100%' }}
							/>
						</Form.Item>

						<Form.Item
							name={[OIL_RECORD_FORM, "upLift", "engineOil1"]}
							label={t("planning.ATL.Engine Oil1")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}
						>
							<InputNumber
								size="small"
								placeholder={selectedBox.c13 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c13}
								type='number'
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</Col>


					<Col sm={20} md={10}>
						<Form.Item
							name={[OIL_RECORD_FORM, "upLift", "engineOil2"]}
							label={t("planning.ATL.Engine Oil2")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}
						>
							<InputNumber
								size="small"
								placeholder={selectedBox.c14 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c14}
								type='number'
								style={{ width: '100%' }} />
						</Form.Item>

						<Form.Item
							name={[OIL_RECORD_FORM, "upLift", "apuOil"]}
							label={t("planning.ATL.APU Oil")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}

						>
							<InputNumber
								size="small"
								placeholder={selectedBox.c15 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c15}
								type='number'
								style={{ width: '100%' }} />
						</Form.Item>

						<Form.Item
							name={[OIL_RECORD_FORM, "upLift", "csdOil1"]}
							label={t("planning.ATL.CSD Oil1")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}

						>
							<InputNumber
								size="small"
								placeholder={selectedBox.c16 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c16}
								type='number'
								style={{ width: '100%' }} />
						</Form.Item>


						<Form.Item
							name={[OIL_RECORD_FORM, "upLift", "csdOil2"]}
							label={t("planning.ATL.CSD Oil2")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}
						>
							<InputNumber
								size="small"
								placeholder={selectedBox.c17 ? t("planning.ATL.Full") : t('planning.ATL.Enter oil quantity')}
								disabled={selectedBox.c17}
								type='number'
								style={{ width: '100%' }} />
						</Form.Item>

						<Form.Item
							name={[OIL_RECORD_FORM, "upLift", "oilRecord"]}
							label={t("planning.ATL.Fuel Record")}
							rules={[
								{
									type: 'number',
									min: 0,
									message: t("planning.ATL.This field can not be less than 0")
								},
							]}

						>
							<InputNumber
								size="small"
								placeholder={selectedBox.c18 ? 'Full' : 'Enter fuel quantity'}
								disabled={selectedBox.c18}
								type='number'
								style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>
			</RibbonCard>
		</>
	)
}