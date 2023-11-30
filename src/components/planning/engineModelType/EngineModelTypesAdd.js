import React, { useEffect, useState } from 'react';
import CommonLayout from "../../layout/CommonLayout";
import { Breadcrumb, Checkbox, Col, Form, Input, notification, Row, Select, Space } from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import ARMCard from "../../common/ARMCard";
import AirportService from "../../../service/AirportService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import { getErrorMessage } from "../../../lib/common/helpers";
import ModuleService from "../../../service/ModuleService";
import { useEngineModelTypes } from "../../../lib/hooks/planning/engine-models";
import EngineModelTypeService from "../../../service/EngineModelTypeService";
import ARMForm from "../../../lib/common/ARMForm";


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
	id: null,
	name: '',
	description: '',
	isActive: true
};

export default function EngineModelTypesAdd() {
	const [form] = Form.useForm();
	const {id} = useParams()
	const navigate = useNavigate()
	
	console.log({ id })
	
	const [type, setType] = useState(initialValues);
	
	const onReset = () => {
		form.resetFields();
	};
	
	useEffect(() => {
		if (isNaN(Number(id))) {
			return;
		}
		
		(async () => {
			const { data } = await EngineModelTypeService.fetchById(id);
			// form.
			form.setFieldsValue({
				id: data.id,
				name: data.name,
				description: data.description || '',
				isActive: data.isActive
			})

		})();
		
	}, [id])
	
	
	// post api call using async await
	const onFinish = async (values) => {
		console.log("values", values)
		try {
			if(id) {
				await EngineModelTypeService.update({...values, id})
			} else {
				let {data} = await EngineModelTypeService.save(values)
			}
			
			form.resetFields()
			navigate('/planning/engine-model-types')
			
			notification["success"]({
				message: id ? "Successfully updated!" : "Successfully added!",
			});
			
		} catch (er) {
			notification["error"]({message: getErrorMessage(er)});
		}
		
	};
	
	const TITLE = id ? 'Engine Model Types Edit' : 'Engine Model Types Add';
	
	
	return (
		<CommonLayout>
			<ARMBreadCrumbs>
				<Breadcrumb separator="/">
					<Breadcrumb.Item> <Link to='/planning'> <i className="fas fa-chart-line"/>&nbsp; Planning
					</Link></Breadcrumb.Item>
					
					<Breadcrumb.Item><Link to='/planning/engine-model-types'>
						Engine Model Types
					</Link>
					</Breadcrumb.Item>
					
					<Breadcrumb.Item>
						{TITLE}
					</Breadcrumb.Item>
				</Breadcrumb>
			</ARMBreadCrumbs>
			<ARMCard
				title={
					getLinkAndTitle(TITLE, '/planning/engine-model-types/')
				}
			
			>
				
				<ARMForm
					{...layout}
					form={form}
					name="airports"
					onFinish={onFinish}
					initialValues={initialValues}
					scrollToFirstError
				>
					
					<Row>
						<Col sm={24} md={12}>
							<Form.Item
								name="name"
								label="Name"
								rules={[
									{
										required: true,
										message: "Name is required!"
									},
								]}
							>
								<Input/>
							</Form.Item>
							
							<Form.Item
								required={false}
								name="description"
								label="Description"
							>
								<Input/>
							</Form.Item>
							
							<Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
								<Space size="small">
									<ARMButton type="primary" htmlType="submit">
										{id ? 'Update' : 'Submit'}
									</ARMButton>
									<ARMButton onClick={onReset} type="primary" danger>
										Reset
									</ARMButton>
								</Space>
							</Form.Item>
						</Col>
					</Row>
				
				</ARMForm>
			</ARMCard>
		</CommonLayout>
	)
		;
};
