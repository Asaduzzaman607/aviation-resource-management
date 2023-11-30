import React from 'react';
import CommonLayout from "../../layout/CommonLayout";
import { Breadcrumb, Checkbox, Col, Form, Input, InputNumber, Row, Select, Space } from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import ARMCard from "../../common/ARMCard";
import { Link } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import { useEngineModelAdd, useEngineModelTypes } from "../../../lib/hooks/planning/engine-models";


const {Option} = Select;

const layout = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
};

const initialValues = {
	aircraftId: '',
	engineModelTypeId: '',
	tsn: '',
	csn: '',
	etRating: '',
	serialNo: '',
	position: '',
	tsr: '',
	csr: '',
	tso: '',
	cso: '',
	isActive: true
};

export default function EngineModelsAdd() {
	const {types} = useEngineModelTypes();
	const { id, form, airCrafts, handleFormReset, handleFormSubmit,  } = useEngineModelAdd();
	const TITLE = id ? 'Engine Model Edit' : 'Engine Model Add';
	let formItemStyle = {marginBottom: 10};
	
	return (
		<CommonLayout>
			<ARMBreadCrumbs>
				<Breadcrumb separator="/">
					<Breadcrumb.Item> <Link to='/planning'> <i className="fas fa-chart-line"/>&nbsp; Planning
					</Link></Breadcrumb.Item>
					
					<Breadcrumb.Item><Link to='/planning/engine-models'>
						Engine Models
					</Link>
					</Breadcrumb.Item>
					
					<Breadcrumb.Item>
						{TITLE}
					</Breadcrumb.Item>
				</Breadcrumb>
			</ARMBreadCrumbs>
			
			<ARMCard
				title={
					getLinkAndTitle(TITLE, '/planning/engine-models')
				}
			
			>
				
				<Form
					{...layout}
					form={form}
					name="airports"
					onFinish={handleFormSubmit}
					onReset={handleFormReset}
					initialValues={initialValues}
					scrollToFirstError
				>
					
					<Row>
						<Col sm={24} md={12}>
							<Form.Item
								name="aircraftId"
								label="Aircraft"
								rules={[
									{
										required: true,
										message: "Aircraft is required!"
									},
								]}
								style={formItemStyle}
							>
								<Select>
									<Select.Option value="">---Select---</Select.Option>
									{
										airCrafts.map(({ id, name}) => <Select.Option value={id} key={id}>{name}</Select.Option>)
									}
								</Select>
							</Form.Item>
							
							<Form.Item
								name="engineModelTypeId"
								label="Engine Model Type"
								rules={[
									{
										required: true,
										message: "Engine Model Type is required!"
									},
								]}
								style={formItemStyle}
							>
								<Select>
									<Select.Option value="">---Select---</Select.Option>
									{
										types.map(({ id, name}) => <Select.Option value={id} key={id}>{name}</Select.Option>)
									}
								</Select>
							</Form.Item>
							
							<Form.Item
								name="tsn"
								label="Time Since New (TSN)"
								style={formItemStyle}
							>
								<InputNumber style={{ width: '100%' }} controls={false} />
							</Form.Item>
							
							<Form.Item
								name="csn"
								label="Cycle Since New (CSN)"
								style={formItemStyle}
							>
								<InputNumber style={{ width: '100%' }} controls={false} />
							</Form.Item>
							
							<Form.Item
								name="etRating"
								label="Engine throst rating"
								style={formItemStyle}
							>
								<Input/>
							</Form.Item>
						</Col>
						
						<Col sm={24} md={12}>
							<Form.Item
								name="serialNo"
								label="Serial No"
								style={formItemStyle}
							>
								<Input/>
							</Form.Item>
							
							<Form.Item
								name="tsr"
								label="Time Since Repair (TSR)"
								style={formItemStyle}
							>
								<Input/>
							</Form.Item>
							
							<Form.Item
								name="csr"
								label="Cycle Since Repair (CSR)"
								style={formItemStyle}
							>
								<InputNumber style={{ width: '100%' }} controls={false} />
							</Form.Item>
							
							<Form.Item
								name="position"
								label="Position"
								style={formItemStyle}
							>
								<InputNumber style={{ width: '100%' }} controls={false} />
							</Form.Item>
							
							<Form.Item
								name="tso"
								label="Time Since Overall (TSO)"
								style={formItemStyle}
							>
								<InputNumber style={{ width: '100%' }} controls={false} />
							</Form.Item>
							
							<Form.Item
								name="cso"
								label="Cycle Since Overall (CSO)"
								style={formItemStyle}
							>
								<InputNumber style={{ width: '100%' }} controls={false} />
							</Form.Item>
						</Col>
						
						<Col sm={24} md={12}>
							<Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
								<Space>
									<ARMButton type="primary" htmlType="submit">
										{id ? 'Update' : 'Submit'}
									</ARMButton>
									<ARMButton onClick={handleFormReset} type="primary" danger>
										Reset
									</ARMButton>
								</Space>
							</Form.Item>
						</Col>
					</Row>
				
				</Form>
			
			
			</ARMCard>
		</CommonLayout>
	)
		;
};
