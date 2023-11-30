import { Breadcrumb, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import logo from "../../images/us-bangla-logo.png";
import ReactToPrint from "react-to-print";
import { createRef } from "react";
import styled from "styled-components";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import SuccessButton from "../../common/buttons/SuccessButton";
import { PrinterOutlined } from "@ant-design/icons";
import ResponsiveTable from "../../common/ResposnsiveTable";
import { ARMReportTable } from "../report/ARMReportTable";
import useACCheckIndexAdd from "./useACCheckIndexAdd";
import moment from "moment";

const TITLE = "Work Package Task Index";

const ReportContainer = styled.div`
  @media print {
    padding: 20px !important;
  }
  .text {
    margin-top: -10px !important;
  }
  .imageContent {
    padding: 0 !important;
  }
`;
export default function ACCheckIndexView() {
    const { acCheckIndex } = useACCheckIndexAdd()
    console.log(acCheckIndex)
    const reportRef = createRef<any>();
    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/planning">
                            <i className="fas fa-chart-line" /> &nbsp;Planning
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/planning/ac-check-index">A/C Check Index</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>View</Breadcrumb.Item>
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
                                    <SuccessButton
                                        type="primary"
                                        icon={<PrinterOutlined />}
                                        htmlType="button"
                                    >
                                        Print
                                    </SuccessButton>
                                )}
                            />
                        </Col>
                    </Row>
                }
            >
                <Row ref={reportRef}>
                    <Col span={24}>
                        <ReportContainer>
                            <Row justify="space-between">
                                <Col>
                                    <img src={logo} width={130} alt="" />
                                </Col>
                                <Col style={{ fontSize: "10px" }} className="imageContent">
                                    <Typography.Text>FORM CAME-025</Typography.Text>
                                    <br />
                                    <Typography.Text>ISSUE INITIAL</Typography.Text>
                                    <br />
                                    <Typography.Text>DATE 19 JAN 2022</Typography.Text>
                                </Col>
                            </Row>
                            <Typography.Title
                                level={4}
                                style={{ textAlign: "center", fontWeight: "bold" }}
                            >
                                US BANGLA AIRLINES. <br />
                                <span style={{ fontSize: "16px" }} className="text">
                                    {acCheckIndex?.acCheckIndexNames?.map((check: any) => check).join(' + ')}
                                </span>
                            </Typography.Title>
                            <Typography.Title
                                level={5}
                                style={{ textAlign: "center", fontSize: "10px", marginBottom: "40px" }}
                                className="text"
                            >
                                AIRCRAFT MAINTENANCE PROGRAM (AMP) APPROVED BY CAAB VIDE:
                                30.31.0000.113.39.063.21.136 ISSUE 02 REV 00 DATED 01-06-2022
                            </Typography.Title>
                            <Row justify="space-between" style={{ padding: "2px", width: "70%" }}>
                                <Col>
                                    <Typography.Title level={5} style={{ fontSize: "12px", fontWeight: "bold" }}>
                                        A/C REGN: {acCheckIndex?.acRegn}
                                    </Typography.Title>
                                    <Typography.Title level={5} style={{ fontSize: "12px", fontWeight: "bold" }}>
                                        A/C HOURS: {acCheckIndex?.acHours}
                                    </Typography.Title>
                                </Col>
                                <Col>
                                    <Typography.Title level={5} style={{ fontSize: "12px", fontWeight: "bold" }}>
                                        A/C MSN: {acCheckIndex?.acMsn}
                                    </Typography.Title>
                                </Col>
                                <Col>
                                    <Typography.Title level={5} style={{ fontSize: "12px", fontWeight: "bold" }}>
                                        W.O. NO.: {acCheckIndex?.woNo}
                                    </Typography.Title>
                                    <Typography.Title level={5} style={{ fontSize: "12px", fontWeight: "bold" }}>
                                        A/C CYCLES: {acCheckIndex?.acCycles}
                                    </Typography.Title>
                                </Col>
                                <Col>
                                    <Typography.Title level={5} style={{ fontSize: "12px", fontWeight: "bold" }}>
                                        W/O DATE : {acCheckIndex?.woDate && moment(`${acCheckIndex.woDate}`, "YYYY-MM-DD").format("DD/MMM/YY")}
                                    </Typography.Title>
                                    <Typography.Title level={5} style={{ fontSize: "12px", fontWeight: "bold" }}>
                                        AS OF: {acCheckIndex?.asOfDate && moment(`${acCheckIndex.asOfDate}`, "YYYY-MM-DD").format("DD-MMM-YY")}
                                    </Typography.Title>
                                </Col>
                            </Row>
                            <Row className="table-responsive" style={{ marginTop: "20px" }}>
                                <ResponsiveTable>
                                    <ARMReportTable>
                                        <thead>
                                            <tr style={{ fontSize: "12px" }}>
                                                <th>
                                                    S/N
                                                </th>
                                                <th>AMM/TASK CARD <br /> REFERENCE:</th>
                                                <th>AMP REFERENCE:</th>
                                                <th>TASK DESCRIPTION</th>
                                                <th>
                                                    INSP. <br />TYPE </th>
                                                <th>
                                                    TRADE
                                                </th>
                                                <th>SIGN. OF AME WITH <br />STAMP</th>
                                                <th>COMPLETION <br />DATE</th>
                                                <th>CHECKED BY <br />(ENGG. PLNG.)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {acCheckIndex?.aircraftCheckIndexLdnds?.map((acCheck: any, index: any) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{acCheck?.taskCardReference}</td>
                                                    <td>{acCheck?.ampReference}</td>
                                                    <td>{acCheck?.taskDescription} <br /> {acCheck.partNo ? `Part no: ${acCheck?.partNo}` : null} <br /> {acCheck.serialNo ? `Serial no: ${acCheck?.serialNo}` : null}</td>
                                                    <td>{acCheck?.inspType}</td>
                                                    <td>{acCheck?.trades?.map((t: { trade: any; }) => t).join(', ')}</td>
                                                    <td></td>
                                                    <td>{acCheck?.completionDate && moment(`${acCheck?.completionDate}`, "YYYY-MM-DD").format("DD-MMM-YY")}</td>
                                                    <td></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </ARMReportTable>
                                </ResponsiveTable>
                            </Row>
                        </ReportContainer>
                    </Col>
                </Row>
            </ARMCard>
        </CommonLayout>
    );
}