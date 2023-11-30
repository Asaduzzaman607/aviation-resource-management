import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import { Breadcrumb, Col, Row } from "antd";
import ARMCard from "../../../common/ARMCard";
import { getLinkAndTitle } from "../../../../lib/common/TitleOrLink";
import AMLService from "../../../../service/planning/AMLService";
import RibbonCard from "../../../common/forms/RibbonCard";
import ViewItem from "../../../common/view/ViewItem";
import { dateFormat, viewDateFormat } from "../../../../lib/hooks/common";
import ARMTable from "../../../common/ARMTable";
import AmlViewService from "./amlViewService";
import { formatTimeValue } from "../../../../lib/common/presentation";
import DateTimeConverter from "../../../../converters/DateTimeConverter";
import { useTranslation } from "react-i18next";
import { DateFormat } from "../../report/Common";
import moment from "moment";

const formatDisplayTime = (timeString) => {
	
	if (!timeString || timeString === '') {
		return "";
	}
	
	return DateTimeConverter
		.stringToMomentDateTime(timeString)
		.format("hh:mm")
}
 const ViewDateFormat = (date) => {
    if (date) {
        return moment(date).format("DD-MMM-YYYY HH:mm:ss");
    }
    return "N/A";
};

export default function AMLView() {
	const {id} = useParams();
	const { formatOilDataValue, formatAuthNo } = AmlViewService;
	const [allDetails, setAllDetails] = useState({})
	
	const aml = allDetails.amlResponseData || {}
	const flightData = allDetails.flightResponseDto
	const defects = allDetails.defectRectificationResponseDto || [];
	const oliRecords = allDetails.oilRecordData || [];
	
	const { t } = useTranslation()
	const TITLE = `${t('planning.ATL.ATL')} ${t('common.Details')}`;
	
	useEffect(() => {
		
		if(!id) return;
		
		(async () => {
			const res = await AMLService.amlAllDetails(id);
			setAllDetails({...res.data})
		})();
		
	}, [id])
	
	const {signatureList} = aml;
	const GUTTERS = [12, 12];

	
	return <CommonLayout>
		<ARMBreadCrumbs>
			<Breadcrumb separator="/">
				<Breadcrumb.Item> <Link to='/planning'> <i className="fas fa-chart-line"/>&nbsp; {t("planning.Planning")}
				</Link></Breadcrumb.Item>
				
				<Breadcrumb.Item><Link to='/planning/atl'>
					{t("planning.ATL.ATL")}
				</Link>
				</Breadcrumb.Item>
				
				<Breadcrumb.Item>
					{t('common.Details')}
				</Breadcrumb.Item>
			</Breadcrumb>
		</ARMBreadCrumbs>
		
		<ARMCard
			title={
				getLinkAndTitle(TITLE, '/planning/atl',false,"PLANNING_AIRCRAFT_TECHNICAL_LOG_ATL_SEARCH")
			}
		>
			<Row gutter={GUTTERS}>
				<Col sm={24} md={12}>
					<RibbonCard ribbonText={t("planning.ATL.Aircraft Technical Log")}>
						<ViewItem label={t("planning.ATL.Page No")}>{aml.pageNo}{aml.alphabet}</ViewItem>
						<ViewItem label={t("planning.Aircrafts.Aircraft")}>{aml.aircraftName}</ViewItem>
						<ViewItem label={t("planning.ATL.ATL Type")}>{aml.amlType === 0 ? 'REGULAR' : aml.amlType === 1 ? 'VOID' : aml.amlType === 2 ? 'NILL' : aml.amlType === 3 ? 'MAINT' : ''}</ViewItem>
						<ViewItem label={t("planning.ATL.From Airport")}>{aml.fromAirportIataCode}</ViewItem>
						<ViewItem label={t("planning.ATL.To Airport")}>{aml.toAirportIataCode}</ViewItem>
						<ViewItem label={t("planning.ATL.Captain")}>{aml.captainName}</ViewItem>
						<ViewItem label={t("planning.ATL.First Officer")}>{aml.firstOfficerName}</ViewItem>
						<ViewItem label={t("planning.ATL.Flight No")}>{aml.flightNo}</ViewItem>
						<ViewItem label={t("planning.ATL.Date")}>{DateFormat(aml.date)}</ViewItem>
					</RibbonCard>
					
					<RibbonCard ribbonText={t("planning.ATL.Fuel uplift Cross check")}>
						<ViewItem label={t("planning.ATL.Refueling Vehicle Delivery")}>{aml.refuelDelivery}</ViewItem>
						<ViewItem label={t("planning.ATL.Specific Gravity")}>{aml.specificGravity}</ViewItem>
						<ViewItem label={t("planning.ATL.Converted In")}>{aml.convertedIn}</ViewItem>
					</RibbonCard>
				</Col>
				
				<Col sm={24} md={12}>
					<RibbonCard ribbonText={t("planning.ATL.Certification of Oil and Fuel")}>
						<ViewItem label={t("planning.ATL.Certification")}>
							{
								signatureList && signatureList.length > 0 && formatAuthNo(signatureList[0])
							}
						</ViewItem>
					</RibbonCard>
					
					<RibbonCard ribbonText={t("planning.ATL.Certification for RVSM FLT Sector")}>
						<ViewItem label={t("planning.ATL.Certification")}>
							{
								signatureList && signatureList.length > 1 && formatAuthNo(signatureList[1])
							}
						</ViewItem>
					</RibbonCard>
					
					<RibbonCard ribbonText={t("planning.ATL.Certification for ETOPS FLT")}>
						<ViewItem label={t("planning.ATL.Certification")}>
							{
								signatureList && signatureList.length > 2 && formatAuthNo(signatureList[2])
							}
						</ViewItem>
					</RibbonCard>
					
					<RibbonCard ribbonText={t("planning.ATL.Certification of PRE-FLIGHT INSPECTION")}>
						<ViewItem label={t("planning.ATL.Certification")}>
							{
								signatureList && signatureList.length > 3 && formatAuthNo(signatureList[3])
							}
						</ViewItem>
						
						<ViewItem label={t("planning.ATL.Station")}>{aml.preFlightInspectionIataCode}</ViewItem>
						
						<ViewItem label={t("planning.ATL.Time")}>{formatDisplayTime(aml.pfiTime)}</ViewItem>
					</RibbonCard>
					
					<RibbonCard ribbonText={t("planning.ATL.Certification of Acceptance for the FLT")}>
						<ViewItem label="Certification">
							{
								signatureList && signatureList.length > 4 && formatAuthNo(signatureList[4])
							}
						</ViewItem>
						
						<ViewItem label={t("planning.ATL.Time")}>{formatDisplayTime(aml.ocaTime)}</ViewItem>
					</RibbonCard>
				</Col>
			</Row>
			
			<Row gutter={GUTTERS}>
				<Col span={24}>
					{
						defects.length > 0 && (
							<RibbonCard ribbonText={t("planning.ATL.Defect And Rectification")}>
								
									{
										defects.map((defect, index) => (
											<Row gutter={GUTTERS} style={{
												marginBottom: '2.5em'
											}}>
											
											<Col md={24} sm={24}>
												<ARMTable>
													<thead>
													<tr>
														<th colSpan={2}>{t("planning.ATL.Defect")}</th>
														<th colSpan={2}>{t("planning.ATL.Rectifications")}</th>
													</tr>
													</thead>
													
													<tbody>
													
													<tr>
														<th>{t("planning.ATL.Seq")}</th>
														<td style={{background: '#c4fae3', minWidth: '100px'}}>{defect.seqNo}</td>
														<th>{t("planning.ATL.To DMI no")}</th>
														<td style={{minWidth: '100px'}}>{defect.rectDmiNo}</td>
													</tr>
													
													<tr>
														<th>{t("planning.ATL.Added to MEL")}</th>
														<td>{defect.melType === 0 ? "No": "Yes"}</td>
														<th>{t("planning.ATL.MEL Ref")}</th>
														<td>{defect.rectMelRef}</td>
													</tr>
													
													<tr>
														<th>{t("planning.ATL.From DMI no")}</th>
														<td>{defect.defectDmiNo}</td>
														<th>{t("planning.ATL.Category")}</th>
														<td>{defect.melCategory === 0 ? 'A' : defect.melCategory === 1 ? 'B': defect.melCategory === 2 ? 'C' : defect.melCategory === 3 ? 'D' : null}</td>
													</tr>
													
													<tr>
														<th>{t("planning.ATL.Description")}</th>
														<td>{defect.defectDescription}</td>
														<th>{t("planning.ATL.Due Date")}</th>
														<td>{DateFormat(defect.dueDate)}</td>
													</tr>
													
													<tr>
														<th>{t("planning.ATL.Name")}</th>
														<td>{defect.defectSignedEmployeeName}</td>
														<th>{t("planning.ATL.ATA")}</th>
														<td>{defect.rectAta}</td>
													</tr>
													
													<tr>
														<th>{t("planning.ATL.Station")}</th>
														<td>{defect.defectStaName}</td>
														<th>{t("planning.ATL.POS")}</th>
														<td>{defect.rectPos}</td>
													</tr>
													
													<tr>
														<th>{t("planning.ATL.Signature Date")} &amp; {t("planning.ATL.Time")}</th>
														<td>{ViewDateFormat(defect.defectSignTime)}</td>
														<th>{t("planning.ATL.P/N off")}</th>
														<td>{defect.rectPnOff}</td>
													</tr>
													
													<tr>
														<th>{t("planning.ATL.P/N on")}</th>
														<td>{defect.rectPnOn}</td>
														<th>{t("planning.ATL.S/N off")}</th>
														<td>{defect.rectSnOff}</td>
													</tr>
													
													
													<tr>
														<td colSpan={2}>
															{
																defect.woNo != null ? "Schedule Task" : "Un-Schedule Task"
															}
														</td>
														<th>{t("planning.ATL.S/N on")}</th>
														<td>{defect.rectSnOn}</td>
													</tr>
													
													
													<tr>
														
														{
															defect.woNo != null && (
																<>
																	<th>{t("planning.ATL.WO")}</th>
																	<td>{defect.woNo}</td>
																</>
															)
														}
														
														<th>{t("planning.ATL.GRN")}</th>
														<td>{defect.rectGrn}</td>
													</tr>
													
													<tr>
														{
															defect.woNo == null ?
																<td style={{ border: 0}} colSpan={2} rowSpan={5}></td> :
																<td style={{ border: 0}} colSpan={2} rowSpan={4}></td>
														}
														<th>{t("planning.ATL.Description")}</th>
														<td>{defect.rectDescription}</td>
													</tr>
													
													<tr>
														<th>{t("planning.ATL.Name")}</th>
														<td>{defect.rectSignedEmployeeName}</td>
													</tr>
													
													<tr>
														<th>{t("planning.ATL.Station")}</th>
														<td>{defect.rectStaName}</td>
													</tr>
													
													<tr>
														<th>{t("planning.ATL.Signature Date")} &amp; {t("planning.ATL.Time")}</th>
														<td>{ViewDateFormat(defect.rectSignTime)}</td>
													</tr>
													</tbody>
												</ARMTable>
											</Col>
											</Row>
										
										))
									}
							</RibbonCard>
						)
					}
				</Col>
			</Row>
			
			{
				!!flightData && aml?.amlType!==3 && (
					<Row gutter={GUTTERS}>
						<Col sm={24} md={12}>
							<RibbonCard ribbonText={t("planning.ATL.Flight Data")}>
								<ARMTable>
									<tbody>
									<tr>
										<th>{t("planning.ATL.Block Off")}</th>
										<td>{ViewDateFormat(flightData.blockOffTime)}</td>
									</tr>
									<tr>
										<th>{t("planning.ATL.Block On")}</th>
										<td>{ViewDateFormat(flightData.blockOnTime)}</td>
									</tr>
									
									
									<tr>
										<th>{t("planning.ATL.Block Time")}</th>
										<td>{formatTimeValue(flightData.blockTime)}</td>
									</tr>
									
									<tr>
										<th>{t("planning.ATL.Take Off")}</th>
										<td>{ViewDateFormat(flightData.takeOffTime)}</td>
									</tr>
									<tr>
										<th>{t("planning.ATL.Landing")}</th>
										<td>{ViewDateFormat(flightData.landingTime)}</td>
									</tr>
									
									<tr>
										<th>{t("planning.ATL.Air Time")}</th>
										<td>{formatTimeValue(flightData.airTime)}</td>
									</tr>
								
									<tr>
										<th>{t("planning.ATL.No Of Landing")}</th>
										<td>{flightData.noOfLanding}</td>
									</tr>
									
									<tr>
										<th>{t("planning.ATL.Total A/C Time")}</th>
										<td>{formatTimeValue(flightData.totalAirTime)}</td>
									</tr>
									
									<tr>
										<th>{t("planning.ATL.Total Landing")}</th>
										<td>{flightData.totalLanding}</td>
									</tr>
									
									<tr>
										<th>{t("planning.ATL.Grand Total A/C Time")}</th>
										<td>{formatTimeValue(flightData.grandTotalAirTime)}</td>
									</tr>

									<tr>
										<th>{t("planning.ATL.Grand Total Landing")}</th>
										<td>{flightData.grandTotalLanding}</td>
									</tr>
									
									<tr>
										<th>{t("planning.ATL.Commenced")}</th>
										<td>{dateFormat(flightData.commencedTime)}</td>
									</tr>
									
									<tr>
										<th>{t("planning.ATL.Completed")}</th>
										<td>{dateFormat(flightData.completedTime)}</td>
									</tr>
									</tbody>
								</ARMTable>
								
								{/*<ViewItem label="Block ON">{dateFormat(flightData.blockOnTime)}</ViewItem>*/}
								{/*<ViewItem label="Block Off">{dateFormat(flightData.blockOffTime)}</ViewItem>*/}
								{/*<ViewItem label="Block Time">{formatTimeValue(flightData.blockTime)}</ViewItem>*/}
								
								{/*<br/>*/}
								{/*<ViewItem label="Take Off">{dateFormat(flightData.takeOffTime)}</ViewItem>*/}
								{/*<ViewItem label="Landing">{dateFormat(flightData.landingTime)}</ViewItem>*/}
								
								{/*<br/>*/}
								{/*<ViewItem label="No Of Landing">{flightData.noOfLanding}</ViewItem>*/}
								{/*<ViewItem label="Total Landing">{flightData.totalLanding}</ViewItem>*/}
								{/*<ViewItem label="Grand Total Landing">{flightData.grandTotalLanding}</ViewItem>*/}
								
								{/*<br/>*/}
								{/*<ViewItem label="Air Time">{formatTimeValue(flightData.airTime)}</ViewItem>*/}
								{/*<ViewItem label="Total Air Time">{formatTimeValue(flightData.totalAirTime)}</ViewItem>*/}
								{/*<ViewItem label="Grand Total Air Time">{formatTimeValue(flightData.grandTotalAirTime)}</ViewItem>*/}
								
								{/*<br/>*/}
								{/*<ViewItem label="Commenced">{dateFormat(flightData.commencedTime)}</ViewItem>*/}
								{/*<ViewItem label="Completed">{dateFormat(flightData.completedTime)}</ViewItem>*/}
							</RibbonCard>
						</Col>
					</Row>
				)
			}
			
			<RibbonCard ribbonText="Oil Records">
				<ARMTable>
					<thead>
					<tr>
						{
							AmlViewService.oilRecordDataColumns.map(column => (
								<th key={column}>
									{column}
								</th>
							))
						}
					</tr>
					</thead>
					
					<tbody>
					{
						oliRecords.map((oilRecord, index )=> (
							<tr key={index}>
								<td style={{backgroundColor: '#f1f8e9', fontWeight: 'bold'}}>
									{AmlViewService.getOilRecordType(oilRecord.type)}
								</td>
								<td>{formatOilDataValue(oilRecord.hydOil1)}</td>
								<td>{formatOilDataValue(oilRecord.hydOil2)}</td>
								<td>{formatOilDataValue(oilRecord.hydOil3)}</td>
								<td>{formatOilDataValue(oilRecord.engineOil1)}</td>
								<td>{formatOilDataValue(oilRecord.engineOil2)}</td>
								<td>{formatOilDataValue(oilRecord.apuOil)}</td>
								<td>{formatOilDataValue(oilRecord.csdOil1)}</td>
								<td>{formatOilDataValue(oilRecord.csdOil2)}</td>
								<td>{formatOilDataValue(oilRecord.oilRecord)}</td>
							</tr>
						))
					}
					</tbody>
				</ARMTable>
			</RibbonCard>
		
		</ARMCard>
	</CommonLayout>
}