import { useEffect, useState } from 'react'
import { Col, DatePicker, Form, InputNumber, Row, TimePicker, Input } from "antd";
import React from "react";
import { FLIGHT_DATA_OBJ } from "./aml.constants";
import RibbonCard from "../../../common/forms/RibbonCard";
import { integerOnly } from "../../../../lib/common/validators";
import { useTranslation } from "react-i18next";
import moment from 'moment';
import AMLService from '../../../../service/planning/AMLService';
import DateTimeConverter from '../../../../converters/DateTimeConverter';
import {useBoolean} from "react-use";

const dateData = {
	0: -1
}
export default function FlightDataForm({ form, amlType, id, isNotVoidOrNil, hasNotFlightDataDate, totalAirTimeAlphabet, totalLandingAlphabet }) {
	const { t } = useTranslation();
	const date = Form.useWatch('date', form)
	const amlDate = date?.format('DD-MM-YYYY')
	const amlFormattedDate = moment(amlDate, 'DD-MM-YYYY')
	const dateForCheck = moment.utc()?.subtract(1, 'days')?.format('DD-MM-YYYY') // date which initially set to flight data
	const aircraftId = Form.useWatch('aircraftId', form);
	const [totalAirTime, setTotalAirTime] = useState()
	const [totalLanding, setTotalLanding] = useState()
	const [isApu, setIsApu] = useBoolean(false);

	const blockOnDate = Form.useWatch('blockOnDate', form)
	const blockOnTime = Form.useWatch('blockOnTime', form)
	const blockOffDate = Form.useWatch('blockOffDate', form)
	const blockOffTime = Form.useWatch('blockOffTime', form)
	const landingDate = Form.useWatch('landingDate', form)
	const landingTime = Form.useWatch('landingTime', form)
	const takeOffDate = Form.useWatch('takeOffDate', form)
	const takeOffTime = Form.useWatch('takeOffTime', form)

	const blockOnDateTime = DateTimeConverter.momentDateToString(blockOnDate) + ' ' + DateTimeConverter.momentDateTimeToString(blockOnTime)?.slice(11, 16)
	const blockOffDateTime = DateTimeConverter.momentDateToString(blockOffDate) + ' ' + DateTimeConverter.momentDateTimeToString(blockOffTime)?.slice(11, 16)
	const landingDateTime = DateTimeConverter.momentDateToString(landingDate) + ' ' + DateTimeConverter.momentDateTimeToString(landingTime)?.slice(11, 16)
	const takeOffDateTime = DateTimeConverter.momentDateToString(takeOffDate) + ' ' + DateTimeConverter.momentDateTimeToString(takeOffTime)?.slice(11, 16)

	const blockTimeDiff = Math.abs(new Date(blockOnDateTime) - new Date(blockOffDateTime));
	const blockMinutes = Math.floor((blockTimeDiff / 1000) / 60);

	const airTimeDiff = Math.abs(new Date(landingDateTime) - new Date(takeOffDateTime));
	const airMinutes = Math.floor((airTimeDiff / 1000) / 60);

	const timeConvert = totalMinutes => {
		const minutes = totalMinutes % 60;
		const hours = Math.floor(totalMinutes / 60);
		return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
	}

	const padTo2Digits = num => {
		return num.toString().padStart(2, '0');
	}

	const blockTime = blockMinutes ? timeConvert(blockMinutes) : "00:00"
	const airTime = airMinutes ? timeConvert(airMinutes) : "00:00"

	useEffect(() => {
		if (blockOnTime === null || blockOffTime === null) {
			form.setFieldsValue({
				blockTime: ""
			})
			return
		} if (blockOnTime === undefined || blockOffTime === undefined) {
			form.setFieldsValue({
				blockTime: ""
			})
			return
		}
		form.setFieldsValue({
			blockTime
		})
	}, [blockOnTime, blockOffTime, blockOffDate, blockOnDate])

	useEffect(() => {

		if (landingTime === undefined || takeOffTime === undefined) {
			form.setFieldsValue({
				airTime: ""
			})
			return
		}
		if (landingTime === null || takeOffTime === null) {
			form.setFieldsValue({
				airTime: ""
			})
			return
		}
		form.setFieldsValue({
			airTime
		})


	}, [landingTime, takeOffTime, takeOffDate, landingDate])



	useEffect(() => {
		if (!aircraftId) {
			return
		}
		(async () => {
			const { data } = await AMLService.getAMLPrevPage(aircraftId)
			setTotalAirTime(data.totalAirTime.toFixed(2).toString().replace('.', ':'))
			setTotalLanding(data.totalLanding)
			setIsApu(data.isApuControl)
		})()
	}, [aircraftId])



	useEffect(()=> {

		// if(id) return
		if (!hasNotFlightDataDate) {
			return;
		}

		if (amlType === 0 ) {
			const date = moment().add(dateData[amlType], 'days')
			form.setFieldsValue({
				blockOnDate: date,
				blockOffDate: date,
				landingDate: date,
				takeOffDate: date,
				amlFlightData: {
					noOfLanding: 1,
				}})
			}

		if (amlType === 0 && (amlDate === dateForCheck)) {
			const date = moment().add(dateData[amlType], 'days')
			form.setFieldsValue({
				blockOnDate: date,
				blockOffDate: date,
				landingDate: date,
				takeOffDate: date,
				amlFlightData: {
					noOfLanding: 1,
				}

			})
		}
		if (amlType === 0 && (amlDate !== dateForCheck)) {
			form.setFieldsValue({
				blockOnDate: amlFormattedDate,
				blockOffDate: amlFormattedDate,
				landingDate: amlFormattedDate,
				takeOffDate: amlFormattedDate,
				amlFlightData: {
					noOfLanding: 1,
				}
			})
		}
		if (amlType === 3) {
			form.setFieldsValue({
				blockOnDate: "",
				blockOffDate: "",
				landingDate: "",
				takeOffDate: "",
				blockTime: "",
				airTime: "",
				amlFlightData: {
					noOfLanding: '',
				}
			})
		}
		if (amlType === 1 || amlType === 2 || !date) {
			form.setFieldsValue({
				blockOnDate: "",
				blockOffDate: "",
				landingDate: "",
				takeOffDate: "",
				blockOffTime: "",
				blockOnTime: "",
				takeOffTime: "",
				landingTime: "",
				blockTime: "",
				airTime: "",
				amlFlightData: {
					noOfLanding: '',
				}

			})
		}
	},[amlType, date])


	useEffect(() => {
		if (!!id) {

			return;
		}

		if (!!hasNotFlightDataDate) {
			return;
		}
		if (amlType === 0 && (amlDate === dateForCheck)) {
			const date = moment().add(dateData[amlType], 'days')
			form.setFieldsValue({
				blockOnDate: date,
				blockOffDate: date,
				landingDate: date,
				takeOffDate: date,
				amlFlightData: {
					noOfLanding: 1,
					totalAirTime: totalAirTimeAlphabet ? totalAirTimeAlphabet : totalAirTimeAlphabet === undefined ? totalAirTime : totalAirTime,
					totalLanding: totalLandingAlphabet ? totalLandingAlphabet : totalLandingAlphabet === undefined ? totalLanding : totalLanding
				}
			})
		}
		if (amlType === 0 && (amlDate !== dateForCheck)) {
			form.setFieldsValue({
				blockOnDate: amlFormattedDate,
				blockOffDate: amlFormattedDate,
				landingDate: amlFormattedDate,
				takeOffDate: amlFormattedDate,
				amlFlightData: {
					noOfLanding: 1,
					totalAirTime: totalAirTimeAlphabet ? totalAirTimeAlphabet : totalAirTimeAlphabet === undefined ? totalAirTime : totalAirTime,
					totalLanding: totalLandingAlphabet ? totalLandingAlphabet : totalLandingAlphabet === undefined ? totalLanding : totalLanding
				}
			})
		}
		if (amlType === 3) {
			form.setFieldsValue({
				blockOnDate: "",
				blockOffDate: "",
				landingDate: "",
				takeOffDate: "",
				blockTime: "",
				airTime: "",
				amlFlightData: {
					noOfLanding: "",
					totalAirTime: totalAirTimeAlphabet ? totalAirTimeAlphabet : totalAirTimeAlphabet === undefined ? totalAirTime : totalAirTime,
					totalLanding: totalLandingAlphabet ? totalLandingAlphabet : totalLandingAlphabet === undefined ? totalLanding : totalLanding
				}
			})
		}
		if (amlType === 1 || amlType === 2 || !date) {
			form.setFieldsValue({
				blockOnDate: "",
				blockOffDate: "",
				landingDate: "",
				takeOffDate: "",
				blockOffTime: "",
				blockOnTime: "",
				takeOffTime: "",
				landingTime: "",
				blockTime: "",
				airTime: "",
				amlFlightData: {
					noOfLanding: "",
					totalAirTime: "",
					totalLanding: ""
				}
			})
		}
		if (!aircraftId) {
			form.setFieldsValue({
				amlFlightData: {
					totalAirTime: "",
					totalLanding: ""
				}
			})
		}
	}, [date, amlType, totalAirTime, totalLanding, hasNotFlightDataDate, totalAirTimeAlphabet, totalLandingAlphabet, aircraftId])

	useEffect(() => {
		if (!blockOffDate) {
			form.setFieldsValue({
				blockOffTime: ""
			})
		}
		if (!blockOnDate) {
			form.setFieldsValue({
				blockOnTime: ""
			})
		}
		if (!takeOffDate) {
			form.setFieldsValue({
				takeOffTime: ""
			})
		}
		if (!landingDate) {
			form.setFieldsValue({
				landingTime: ""
			})
		}
	}, [blockOffDate, blockOnDate, takeOffDate, landingDate, amlType])

	return (<>
		{isNotVoidOrNil ? <RibbonCard ribbonText={t("planning.ATL.Flight Data")}>
			<Row gutter={[12, 12]}>
				<Col sm={24} md={12}>

					<Form.Item  name={[FLIGHT_DATA_OBJ, 'blockOffTime']} label={t("planning.ATL.Block Off")}
								style={{ marginBottom: 0 }}>
						<Form.Item
							name="blockOffDate"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
							rules={[{
								required: amlType === 0 ,
								message: 'Block off Date is required',
							}]}
						>
							<DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} 	  />
						</Form.Item>
						<Form.Item
							name="blockOffTime"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
							rules={[{
								required: amlType === 0,
								message: 'Block off Time is required',
							}]}
						>
							<TimePicker format="HH:mm" style={{ width: "100%" }}  />
						</Form.Item>
					</Form.Item>

					<Form.Item name={[FLIGHT_DATA_OBJ, 'blockOnTime']} label={t("planning.ATL.Block On")} style={{ marginBottom: 0 }}>
						<Form.Item
							name="blockOnDate"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
							rules={[{
								required: amlType === 0,
								message: 'Block on date is required',
							}]}
						>
							<DatePicker format="DD-MM-YYYY" style={{ width: "100%" }}   />
						</Form.Item>
						<Form.Item
							name="blockOnTime"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
							rules={[{
								required: amlType === 0,
								message: 'Block on time is required',
							}]}
						>
							<TimePicker format="HH:mm" style={{ width: "100%" }}   />
						</Form.Item>
					</Form.Item>

					<Form.Item label="Block Time" name="blockTime"
							   rules={[{
						required: amlType === 0,
						message: 'Block Time is required',
					}]}>
						<Input disabled />
					</Form.Item>

					<Form.Item name={[FLIGHT_DATA_OBJ, 'takeOffTime']} label={t("planning.ATL.Take Off")} style={{ marginBottom: 0 }}>
						<Form.Item
							name="takeOffDate"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
							rules={[{
								required: amlType === 0,
								message: 'Take off date is required',
							}]}
						>
							<DatePicker format="DD-MM-YYYY" style={{ width: "100%" }}  />
						</Form.Item>
						<Form.Item
							name="takeOffTime"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
							rules={[{
								required: amlType === 0,
								message: 'Take off  time is required',
							}]}
						>
							<TimePicker format="HH:mm" style={{ width: "100%" }}     />
						</Form.Item>
					</Form.Item>
					<Form.Item name={[FLIGHT_DATA_OBJ, 'landingTime']} label={t("planning.ATL.Landing")} style={{ marginBottom: 0 }}>
						<Form.Item
							name="landingDate"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
							rules={[{
								required: amlType === 0,
								message: 'landing date  is required',
							}]}
						>
							<DatePicker format="DD-MM-YYYY" style={{ width: "100%" }}  />
						</Form.Item>
						<Form.Item
							name="landingTime"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
							rules={[{
								required: amlType === 0,
								message: 'landing time is required',
							}]}
						>
							<TimePicker format="HH:mm" style={{ width: "100%" }}   />
						</Form.Item>
					</Form.Item>
					<Form.Item label="Air Time" name="airTime" rules={[{
						required: amlType === 0,
						message: 'Air time is required',
					}]}>
						<Input disabled />
					</Form.Item>
				</Col>

				<Col sm={24} md={12}>

					<Form.Item
						name={[FLIGHT_DATA_OBJ, 'noOfLanding']}
						label={t("planning.ATL.No Of Landing")}
						rules={[{
							required: amlType === 0,
							message: 'No of Landing is required',
						}]}
					>
						<InputNumber maxLength={8} size="small" style={{ width: '100%' }} controls={false}

									 step={1}
									 onKeyDown={(e) => {
										 (e.key === "-") && e.preventDefault();
									 }}/>
					</Form.Item>
					<Form.Item
						name={[FLIGHT_DATA_OBJ, 'totalAirTime']}
						label={t("planning.ATL.Total Air Time")}
						rules={[
							{
								required: true,
								message: "Total Air Time is required"
							},
						]}
					>
						<Input maxLength={8} size="small" style={{ width: '100%' }} controls={false}
							   disabled
						/>
					</Form.Item>

					<Form.Item
						name={[FLIGHT_DATA_OBJ, 'totalLanding']}
						label={t("planning.ATL.Total Landing")}
						rules={[
							{
								required: true,
								message: "Total Landing is required"
							},
							() => ({ validator: integerOnly })
						]}
					>
						<InputNumber maxLength={8} size="small" step={1} style={{ width: '100%' }} controls={false}
									 disabled
						/>
					</Form.Item>

					{
						isApu && amlType!==0 &&
					<>
						<Form.Item
							name={[FLIGHT_DATA_OBJ, 'totalApuHours']}
							label={t("planning.ATL.APU Hours")}
						>
							<InputNumber maxLength={8} size="small" style={{ width: '100%' }} controls={false}  />
						</Form.Item>

						<Form.Item
							name={[FLIGHT_DATA_OBJ, 'totalApuCycles']}
							label={t("planning.ATL.APU Cycles")}
						>
							<InputNumber maxLength={8} size="small" style={{ width: '100%' }} controls={false}  />
						</Form.Item>
					</>
					}

					<Form.Item name={[FLIGHT_DATA_OBJ, 'commencedTime']} label={t("planning.ATL.Commenced")} style={{ marginBottom: 0 }}>
						<Form.Item
							name="commencedDate"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
						>
							<DatePicker format="DD-MM-YYYY" style={{ width: "100%" }}   />
						</Form.Item>
						<Form.Item
							name="commencedTime"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
						>
							<TimePicker style={{ width: "100%" }} format="HH:mm"   />
						</Form.Item>
					</Form.Item>

					<Form.Item name={[FLIGHT_DATA_OBJ, 'completedTime']} label={t("planning.ATL.Completed")} style={{ marginBottom: 0 }}>
						<Form.Item
							name="completedDate"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
						>
							<DatePicker format="DD-MM-YYYY" style={{ width: "100%" }}  />
						</Form.Item>
						<Form.Item
							name="completedTime"
							style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
						>
							<TimePicker format="HH:mm" style={{ width: "100%" }}  />
						</Form.Item>
					</Form.Item>
				</Col>
			</Row>
		</RibbonCard> : null}
	</>
	)
}