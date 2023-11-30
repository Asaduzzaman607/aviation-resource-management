import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import { Breadcrumb, Col, Form, Row, Space } from "antd";
import { Link } from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import React from "react";
import { formLayout } from "../../../lib/constants/form";
import { useAMLAdd } from "../../../lib/hooks/planning/aml";
import AMLFormBasicInfo from "./AMLFormBasicInfo";
import useSignatures from "../../../lib/hooks/planning/signatures";
import AMLOilAndFuelCertification from "./AMLOilAndFuelCertification";
import AMLRVSMAndFLTCertification from "./AMLRVSMAndFLTCertification";
import AmlPFICertification from "./AmlPFICertification";
import AmlEtopsFltCertification from "./AmlEtopsFltCertification";
import AmlAcceptanceForTheFLTCertification from "./AmlAcceptanceForTheFLTCertification";
import AmlFuelUpliftCrossCheck from "./AmlFuelUpliftCrossCheck";
import Permission from "../../auth/Permission";

export const SIGN_TYPES = {
	CERTIFICATION_FOR_OIL_AND_FUEL: 1,
	CERTIFICATION_FOR_RVSM_FLT: 2,
	CERTIFICATION_FOR_ETOPS_FLT: 3,
	CERTIFICATION_FOR_PFI: 4,
	CERTIFICATION_FOR_FLT: 5
}

export default function AMLAdd() {
	const {id, form, aircrafts, airports, employees, amls, onReset, onFinish, submitting} = useAMLAdd();
	const {signatures} = useSignatures();
	const TITLE = id ? 'ATL Edit' : 'ATL Add';
	
	return (
		<CommonLayout>
			<ARMBreadCrumbs>
				<Breadcrumb separator="/">
					<Breadcrumb.Item> <Link to='/planning'> <i className="fas fa-chart-line"/>&nbsp; Planning
					</Link></Breadcrumb.Item>
					
					<Breadcrumb.Item>
						<Link to='/planning/aml'>
							ATL
						</Link>
					</Breadcrumb.Item>
					
					<Breadcrumb.Item>
						{TITLE}
					</Breadcrumb.Item>
				</Breadcrumb>
			</ARMBreadCrumbs>
			
			<ARMCard
				title={
					getLinkAndTitle(TITLE, '/planning/aml')
				}
			>
				
				<ARMForm
					{...formLayout}
					form={form}
					name="aml"
					onFinish={onFinish}
					initialValues={{
						referenceAmlId: '',
						aircraftId: '',
						fromAirportId: '',
						toAirportId: '',
						preFlightInspectionAirportId: '',
						captainId: '',
						foId: '',
						pfiTime: '',
						ocaTime: '',
						pageNo: '', // mandatory
						flightNo: '',
						date: '', // mandatory
						refuelDelivery: '',
						specificGravity: '',
						convertedIn: '',
						isActive: true,
						maintenanceLogSignatureDtoList: [
							{
								amlSignatureId: '',
								signatureId: '',
								signatureType: SIGN_TYPES.CERTIFICATION_FOR_OIL_AND_FUEL
							},
							{
								amlSignatureId: '',
								signatureId: '',
								signatureType: SIGN_TYPES.CERTIFICATION_FOR_RVSM_FLT
							},
							{
								amlSignatureId: '',
								signatureId: '',
								signatureType: SIGN_TYPES.CERTIFICATION_FOR_ETOPS_FLT
							},
							{
								amlSignatureId: '',
								signatureId: '',
								signatureType: SIGN_TYPES.CERTIFICATION_FOR_PFI
							},
							{
								amlSignatureId: '',
								signatureId: '',
								signatureType: SIGN_TYPES.CERTIFICATION_FOR_FLT
							}
						]
					}}
					scrollToFirstError
				>
					
					<Row gutter={[12, 12]}>
						<Col sm={24} md={12}>
							<AMLFormBasicInfo amlForm={form} amls={amls} employees={employees} aircrafts={aircrafts} airports={airports}/>
							
							<AmlFuelUpliftCrossCheck />
						</Col>
						
						<Col sm={24} md={12}>
							<AMLOilAndFuelCertification signatures={signatures} />
							
							<AMLRVSMAndFLTCertification signatures={signatures} />
							
							<AmlEtopsFltCertification signatures={signatures} />
							
							<AmlPFICertification signatures={signatures} airports={airports} />
							
							<AmlAcceptanceForTheFLTCertification signatures={signatures} />
						</Col>
					</Row>
					
					
					<Row>
						<Col sm={24} md={12}>
							<Form.Item wrapperCol={{...formLayout.wrapperCol, offset: 8}}>
								<Space>
									<ARMButton loading={submitting} size="medium" type="primary" htmlType="submit">
										{id ? 'Update' : 'Submit'}
									</ARMButton>
									<ARMButton onClick={onReset} size="medium" type="primary" danger>
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
}