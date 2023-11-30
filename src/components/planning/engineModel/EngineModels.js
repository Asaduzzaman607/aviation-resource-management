import React from "react";
import { Breadcrumb, Col, Form, Input, notification, Pagination, Row, Select, Space, } from "antd";
import ARMTable from "../../common/ARMTable";
import CommonLayout from "../../layout/CommonLayout";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import { Link } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { FilterOutlined, RollbackOutlined, } from "@ant-design/icons";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ResponsiveTable from "../../common/ResposnsiveTable";
import { useEngineModelTypes } from "../../../lib/hooks/planning/engine-models";
import PageSizesFormItem from "../../common/pagination/PageSizesFormItem";
import EngineModelService from "../../../service/EngineModelService";
import EditButton from "../../common/buttons/EditButton";
import ViewButton from "../../common/buttons/ViewButton";
import { getErrorMessage } from "../../../lib/common/helpers";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import { usePaginate } from "../../../lib/hooks/paginations";

export default function EngineModels() {
	const {types} = useEngineModelTypes();
	const {
		form,
		collection,
		page,
		totalPages,
		totalElements,
		paginate,
		isActive,
		setIsActive,
		fetchData,
		refreshPagination,
		resetFilter,
		size
	} = usePaginate('engineModels', 'engine/model/search')
	
	console.log({ size })
	
	return (
		<CommonLayout>
			<ARMBreadCrumbs>
				<Breadcrumb separator="/">
					<Breadcrumb.Item>
						{' '}
						<Link to="/planning">
							{' '}
							<i className="fas fa-chart-line"/> &nbsp;Planning
						</Link>
					</Breadcrumb.Item>
					
					<Breadcrumb.Item>Engine Models</Breadcrumb.Item>
				</Breadcrumb>
			</ARMBreadCrumbs>
			<ARMCard
				title={getLinkAndTitle("Engine Models", "add", true)}
			>
				
				<Form
					form={form}
					name="filter-form"
					initialValues={{engineModelTypeId: '', position: '', size: 10}}
					onFinish={fetchData}
				>
					<Row gutter={20}>
						<Col xs={24} md={6}>
							<Form.Item name="engineModelTypeId">
								<Select
									placeholder="Select Model Type"
								>
									<Select.Option value="">---Select---</Select.Option>
									{
										types.map(type => <Select.Option value={type.id} key={type.id}>{type.name}</Select.Option>)
									}
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} md={6}>
							<Form.Item name="position">
								<Input placeholder="Position"/>
							</Form.Item>
						</Col>
						
						<Col xs={24} md={5} lg={4}>
							<PageSizesFormItem/>
						</Col>
						
						<Col xs={24} md={8}>
							<Form.Item>
								<Space>
									<ARMButton size="middle" type="primary" htmlType="submit">
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
				
				
				<ActiveInactive isActive={isActive} setIsActive={setIsActive}/>
				
				<Row className="table-responsive">
					<ResponsiveTable>
						<ARMTable>
							<thead>
							<tr>
								<th>Aircraft</th>
								<th>Engine Model Type</th>
								<th>TSN</th>
								<th>CSN</th>
								<th>ET Rating</th>
								<th>Serial No</th>
								<th>Position</th>
								<th>TSR</th>
								<th>CSR</th>
								<th>TSO</th>
								<th>CSO</th>
								<th width="200">Action</th>
							</tr>
							</thead>
							<tbody>
							
							{
								collection.map(model => <tr key={model.engineModelId}>
									<td>{model.aircraftName}</td>
									<td>{model.engineModelTypeName}</td>
									<td>{model.tsn}</td>
									<td>{model.csn}</td>
									<td>{model.etRating}</td>
									<td>{model.serialNo}</td>
									<td>{model.position}</td>
									<td>{model.tsr}</td>
									<td>{model.csr}</td>
									<td>{model.tso}</td>
									<td>{model.cso}</td>
									<td>
										<Space size="small">
											<Link to={`view/${model.engineModelId}`}>
												<ViewButton/>
											</Link>
											
											<Link to={`edit/${model.engineModelId}`}>
												<EditButton/>
											</Link>
											
											
											<ActiveInactiveButton
												isActive={isActive}
												handleOk={async () => {
													try {
														await EngineModelService.toggleStatus(model.aircraftId, model.isActive);
														notification['success']({message: "Status Changed Successfully!"});
														refreshPagination();
													} catch (e) {
														notification['error']({message: getErrorMessage(e)});
													}
												}}
											/>
										
										</Space>
									</td>
								</tr>)
							}
							
							</tbody>
						</ARMTable>
					</ResponsiveTable>
				</Row>
				
				<Row justify="center">
					<Col style={{marginTop: 10}}>
						<Pagination showSizeChanger={false} onShowSizeChange={console.log} pageSize={size} current={page} onChange={paginate}
						            total={totalElements}/>
					</Col>
				</Row>
			</ARMCard>
		</CommonLayout>
	);
};
