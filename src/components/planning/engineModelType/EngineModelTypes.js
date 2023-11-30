import React, { useCallback, useEffect, useState } from "react";
import { Breadcrumb, notification, Row, Space, } from "antd";
import ARMTable from "../../common/ARMTable";
import CommonLayout from "../../layout/CommonLayout";
import ARMCard from "../../common/ARMCard";
import { Link } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import { getErrorMessage } from "../../../lib/common/helpers";
import ResponsiveTable from "../../common/ResposnsiveTable";
import EngineModelTypeService from "../../../service/EngineModelTypeService";
import ViewButton from "../../common/buttons/ViewButton";
import EditButton from "../../common/buttons/EditButton";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";

export default function EngineModelTypes() {
	const [isActive, setIsActive] = useState(true);
	const [engineModelTypes, setEngineModelTypes] = useState([]);
	
	const fetchEngineModelTypes = useCallback(async (params = {}) => {
		try {
			const { data } = await EngineModelTypeService.fetchAll(params);
			setEngineModelTypes(data);
		} catch (er) {
			notification['error']({ message: getErrorMessage(er) });
		}
	}, []);
	
	
	useEffect(() => {
		(async () => {
			await fetchEngineModelTypes();
		})();
	}, [])
	
	
	return (
		<CommonLayout>
			<ARMBreadCrumbs>
				<Breadcrumb separator="/">
					<Breadcrumb.Item>
						{' '}
						<Link to="/planning">
							{' '}
							<i className="fas fa-chart-line" /> &nbsp;Planning
						</Link>
					</Breadcrumb.Item>
					
					<Breadcrumb.Item>Engine Model Types</Breadcrumb.Item>
				</Breadcrumb>
			</ARMBreadCrumbs>
			
			<ARMCard
				title={getLinkAndTitle("Engine Model Types", "add", true)}
			>
				<ActiveInactive isActive={isActive} setIsActive={setIsActive} />
				
				<Row className="table-responsive">
					<ResponsiveTable>
						<ARMTable>
							<thead>
							<tr>
								<th>Name</th>
								<th>Description</th>
								<th width="200">Action</th>
							</tr>
							</thead>
							<tbody>
							{engineModelTypes?.filter(v => v.isActive === isActive).map((modelType, index) => (
								<tr key={modelType.id}>
									<td>{modelType.name}</td>
									<td>{modelType.description}</td>
									<td>
										<Space size="small">
											
											<Link to={`view/${modelType.id}`}>
												<ViewButton />
											</Link>
											
											<Link to={`edit/${modelType.id}`}>
												<EditButton />
											</Link>
											
											<ActiveInactiveButton
												isActive={isActive}
												handleOk={async () => {
													try {
														await EngineModelTypeService.toggleStatus(modelType.id);
														notification['success']({ message: "Status Changed Successfully!" });
														await fetchEngineModelTypes();
													} catch (e) {
														notification['error']({ message: getErrorMessage(e) });
													}
												}}
											/>
											
										</Space>
									</td>
								</tr>
							))}
							</tbody>
						</ARMTable>
					</ResponsiveTable>
				</Row>
			</ARMCard>
		</CommonLayout>
	);
};
