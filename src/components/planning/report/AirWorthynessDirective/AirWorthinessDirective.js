import React, { createRef, useState } from "react";
import { Breadcrumb, Col, DatePicker, Form, Row, Space, Spin, Typography } from "antd";
import CommonLayout from "../../../layout/CommonLayout";
import ARMCard from "../../../common/ARMCard";
import ARMButton from "../../../common/buttons/ARMButton";
import { Link } from "react-router-dom";
import { FilterOutlined, PrinterOutlined, RollbackOutlined, } from "@ant-design/icons";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import { useAircrafts } from "../../../../lib/hooks/planning/aircrafts";
import API from "../../../../service/Api";
import { useBoolean } from "react-use";
import { DATE_FORMATTER } from "../../../../lib/constants/date";
import SuccessButton from "../../../common/buttons/SuccessButton";
import ReactToPrint from "react-to-print";
import styled from "styled-components";
import { REQUIRED } from "../../../../lib/constants/validation-rules";
import ARMSelect from "../../../common/forms/ARMSelect";

const REPORT_URL = 'aircraft-maintenance-log/daily-flying-hrs'
const TITLE = 'Air Worthiness Directive';
const TIME_START_INDEX = 11;
const TIME_LENGTH = 5;

const initialState = {
	dailyHrsReportAircraftModel: {
		airFrameTotalTime: '',
		airframeTotalCycle: '',
		bdTotalCycle: '',
		bdTotalTime: '',
	},
	
	dataModelList: [],
	
	total: {
		apuOil: 0,
		engineOil1: 0,
		engineOil2: 0,
		grandTotalAirTime: 0,
		grandTotalLanding: 0,
		noOfLanding: 0,
		totalAirTime: 0
	}
};

const lastDoneNextDueStatus = [
	{id: 1, name: 'Open'},
	{id: 2, name: 'Close'},
	{id: 3, name: 'Not Applicable'},
	{id: 4, name: 'Repetitive'},
]

const ARMReportTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #ffffff;
  }

  th {
    text-transform: uppercase;
    border: 1px solid lightgrey;
    text-align: center;
  }

  td {
    border: 1px solid lightgrey;
    text-align: center;
    text-transform: capitalize;
  }

  thead tr th,
  tbody tr td {
    //padding: 7px 0;
    font-size: 12px;
  }

  tbody tr:nth-child(odd) {
    background: #ffffff;
  }

  tbody tr:nth-child(even) {
    background: #ffffff;
  }

  tbody tr:hover {
    background: #fafafa;
    cursor: pointer; 
    background-color: #b71c1c !important;
    color: white;
  }
`
const CustomSpin = styled(Spin)`
  .ant-spin-text {
    font-size: 35px;
    color: red;
  }
`;

export default function AirWorthinessDirective() {
	
	const [form] = Form.useForm();
	const {aircrafts} = useAircrafts();
	const [submitting, toggleSubmitting] = useBoolean(false);
	const [data, setData] = useState(initialState);
	const reportRef = createRef();
	
	const resetFilter = () => {
		form.resetFields();
		setData({...initialState});
	}
	
	
	const handleSubmit = async (values) => {
		try {
			toggleSubmitting();
			const {data} = await API.post(REPORT_URL, {
				...values,
				date: values.date.format(DATE_FORMATTER)
			})
			
			setData({...data})
		} catch (e) {
		} finally {
			toggleSubmitting();
		}
	}
	
	const displayDate = dateTime => {
		if(!dateTime) return '';
		return dateTime.substr(TIME_START_INDEX, TIME_LENGTH)
	}
	
	return (
		<CommonLayout>
			<ARMBreadCrumbs>
				<Breadcrumb separator="/">
					<Breadcrumb.Item>
						<Link to="/planning">
							<i className="fas fa-chart-line"/> &nbsp;Planning
						</Link>
					</Breadcrumb.Item>
					<Breadcrumb.Item>{TITLE}</Breadcrumb.Item>
				</Breadcrumb>
			</ARMBreadCrumbs>
			<ARMCard
				title={
					<Row justify="space-between">
						<Col>{TITLE}</Col>
						<Col>
							<ReactToPrint
								content={() => reportRef.current}
								copyStyles={true}
								// pageStyle={printStyle}
								trigger={() => (
									<SuccessButton type="primary" icon={<PrinterOutlined/>} htmlType="button">
										Print
									</SuccessButton>
								)}
							/>
						</Col>
					</Row>
				}
			>
				
				<Form
					form={form}
					name="filter-form"
					initialValues={{aircraftId: null, date: '', status: null}}
					onFinish={handleSubmit}
				>
					<Row gutter={20}>
						
						<Col xs={24} md={4}>
							<Form.Item
								rules={[REQUIRED]}
								name="aircraftId"
							>
								<ARMSelect title="Select Aircraft" options={aircrafts}/>
							</Form.Item>
						</Col>
						
						<Col xs={24} md={6}>
							<Form.Item
								rules={[REQUIRED]}
								name="date"
							>
								<DatePicker.RangePicker style={{width: '100%'}}/>
							</Form.Item>
						</Col>
						
						<Col xs={24} md={4}>
							<Form.Item
								rules={[REQUIRED]}
								name="statusId"
							>
								<ARMSelect title="Select Status" options={lastDoneNextDueStatus}/>
							</Form.Item>
						</Col>
						
						<Col xs={24} md={6}>
							<Form.Item>
								<Space>
									<ARMButton loading={submitting} size="middle" type="primary" htmlType="submit">
										<FilterOutlined name="filter"/> Filter
									</ARMButton>
									<ARMButton
										size="middle"
										type="primary"
										onClick={resetFilter}
									>
										<RollbackOutlined name="reset"/> Reset
									</ARMButton>
								</Space>
							</Form.Item>
						</Col>
					</Row>
				
				</Form>

				<h1 style={{ textAlign: "center" }}>
					<CustomSpin size="large" tip=" Work in Progress....."></CustomSpin>
				</h1>
				
				<Row ref={reportRef}>
					<Col span={24}>
						<Row justify="center">
							<Col span={12} offset={6}>
								<Typography.Title level={3} style={{textTransform: 'uppercase'}}>{TITLE}</Typography.Title>
							</Col>
						</Row>
						
						<Row className="table-responsive">
							<ResponsiveTable>
								<ARMReportTable className="table">
									<thead>
									
									<tr>
										<th colSpan={8} rowSpan={2}></th>
										<th>TAT</th>
										<th>TAC</th>
										<th>Date</th>
										<th colSpan={7} rowSpan={2}></th>
									</tr>
									
									<tr>
										<th>2441:25</th>
										<th>3834</th>
										<th>26/Oct/2021</th>
									</tr>
									
									<tr>
										<th rowSpan={2}>S/L</th>
										<th rowSpan={2}>TASK NUMBER</th>
										<th rowSpan={2}>DESCRIPTION</th>
										<th rowSpan={2}>EFFECTIVE DATE</th>
										<th rowSpan={2}>THRESHOLD</th>
										<th rowSpan={2}>APPLICABILITY</th>
										<th rowSpan={2}>STATUS</th>
										<th rowSpan={2}>INTERVAL</th>
										<th colSpan={3}>LAST DONE</th>
										<th colSpan={3}>NEXT DUE</th>
										<th colSpan={3}>REMAINING</th>
										<th rowSpan={3}>REMARKS</th>
									</tr>
									
									<tr>
										{/*Last Done*/}
										<th>FH</th>
										<th>FC</th>
										<th>DAY</th>
										
										{/* Next Due*/}
										<th>FH</th>
										<th>FC</th>
										<th>DAY</th>
										
										{/* Remaining */}
										<th>FH</th>
										<th>FC</th>
										<th>DAY</th>
									
									</tr>
									
									</thead>
									<tbody>
									
									</tbody>
								</ARMReportTable>
							</ResponsiveTable>
						</Row>
					</Col>
				</Row>
			
			</ARMCard>
		</CommonLayout>
	);
};
