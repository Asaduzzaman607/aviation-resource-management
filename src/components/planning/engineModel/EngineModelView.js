import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import { Breadcrumb } from "antd";
import { Link, useParams } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import React, { useEffect, useState } from "react";
import ARMCard from "../../common/ARMCard";
import EngineModelService from "../../../service/EngineModelService";
import { Descriptions } from "antd";

const { Item } = Descriptions;

export default function EngineModelView() {
	const { id } = useParams();
	const TITLE = 'Engine Model View';
	
	const [engineModel, setEngineModel] = useState({});
	
	useEffect(() => {
		
		if (!id) return;
		
		(async () => {
			const res = await EngineModelService.fetchById(id);
			setEngineModel({...res.data})
		})();
		
	}, [id])
	
	return <CommonLayout>
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
		
			<Descriptions bordered>
				<Descriptions.Item  label="Aircraft">{engineModel.aircraftName}</Descriptions.Item>
				<Descriptions.Item label="Engine Model Type">{engineModel.engineModelTypeName}</Descriptions.Item>
				<Descriptions.Item label="TSN">{engineModel.tsn}</Descriptions.Item>
				<Descriptions.Item label="CSN">{engineModel.csn}</Descriptions.Item>
				<Descriptions.Item label="ET Rating">{engineModel.etRating}</Descriptions.Item>
				<Descriptions.Item label="Serial No">{engineModel.serialNo}</Descriptions.Item>
				<Descriptions.Item label="Position">{engineModel.position}</Descriptions.Item>
				<Descriptions.Item label="TSR">{engineModel.tsr}</Descriptions.Item>
				<Descriptions.Item label="CSR">{engineModel.csr}</Descriptions.Item>
				<Descriptions.Item label="TSO">{engineModel.tso}</Descriptions.Item>
				<Descriptions.Item label="CSO">{engineModel.cso}</Descriptions.Item>
			
			</Descriptions>
			
		</ARMCard>
	</CommonLayout>
}