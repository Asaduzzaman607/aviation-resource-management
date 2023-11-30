import { useAMLAdd } from "../../../../lib/hooks/planning/aml";
import useSignatures from "../../../../lib/hooks/planning/signatures";
import CommonLayout from "../../../layout/CommonLayout";
import { Col, Collapse, Row } from "antd";
import ARMCard from "../../../common/ARMCard";
import { getLinkAndTitle } from "../../../../lib/common/TitleOrLink";
import ARMForm from "../../../../lib/common/ARMForm";
import { formLayout } from "../../../../lib/constants/form";
import AMLFormBasicInfo from "../AMLFormBasicInfo";
import AmlFuelUpliftCrossCheck from "../AmlFuelUpliftCrossCheck";
import AMLOilAndFuelCertification from "../AMLOilAndFuelCertification";
import AMLRVSMAndFLTCertification from "../AMLRVSMAndFLTCertification";
import AmlEtopsFltCertification from "../AmlEtopsFltCertification";
import AmlPFICertification from "../AmlPFICertification";
import AmlAcceptanceForTheFLTCertification from "../AmlAcceptanceForTheFLTCertification";
import React from "react";
import FlightDataForm from "./FlightDataForm";
import AmlOilRecord from "./AmlOilRecord";
import DefectRectificationsForm from "./DefectRectificationsForm";
import AMLAddBreadCrumb from "./AMLAddBreadCrumb";
import AMLFormButtons from "./AMLFormButtons";
import { amlFormInitialValues } from "./aml.constants";

export default function AircraftMaintenanceLogAdd() {
	const {id, form, aircrafts, setAircrafts, airports, employees, amls, onReset, onFinish, submitting} = useAMLAdd();
	const {signatures} = useSignatures();
	const TITLE = id ? 'ATL Edit' : 'ATL Add';
	
	return (
		<CommonLayout>
			<AMLAddBreadCrumb title={TITLE}/>
			
			<ARMCard title={getLinkAndTitle(TITLE, "/planning/aml")}>
				<Collapse>
					<Collapse.Panel key="aml" header="ATL">
						<ARMForm
							{...formLayout}
							form={form}
							name="aml"
							onFinish={onFinish}
							initialValues={amlFormInitialValues}
							scrollToFirstError
						>
							<Row gutter={[12, 12]}>
								<Col sm={24} md={12}>
									<AMLFormBasicInfo
										amlForm={form}
										amls={amls}
										employees={employees}
										aircrafts={aircrafts}
										airports={airports}
										setAircrafts={setAircrafts}
									/>
									
									<AmlFuelUpliftCrossCheck/>
								</Col>
								
								<Col sm={24} md={12}>
									<AMLOilAndFuelCertification signatures={signatures}/>
									
									<AMLRVSMAndFLTCertification signatures={signatures}/>
									
									<AmlEtopsFltCertification signatures={signatures}/>
									
									<AmlPFICertification signatures={signatures} airports={airports}/>
									
									<AmlAcceptanceForTheFLTCertification signatures={signatures}/>
								</Col>
							</Row>
							
							<AMLFormButtons onReset={onReset} submitting={submitting}/>
						</ARMForm>
					</Collapse.Panel>
					
					{
						!!id && (
							<>
								<Collapse.Panel id={id} key="defectAndRectification" header="Defect And Rectification">
									<DefectRectificationsForm/>
								</Collapse.Panel>
								
								<Collapse.Panel id={id} key="flightData" header="Flight Data">
									<FlightDataForm/>
								</Collapse.Panel>
								
								<Collapse.Panel id={id} key="oilRecords" header="Oil Records">
									<AmlOilRecord/>
								</Collapse.Panel>
							</>
						)
					}
				</Collapse>
			</ARMCard>
		</CommonLayout>
	);
}