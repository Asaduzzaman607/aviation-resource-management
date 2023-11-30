import { Breadcrumb, Col, Row, Spin, Typography } from "antd";
import { Link } from "react-router-dom";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import CommonLayout from "../../../layout/CommonLayout";
import logo from "../../../images/us-bangla-logo.png";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import { PrinterOutlined } from "@ant-design/icons";
import ReactToPrint from "react-to-print";
import { createRef } from "react";
import SuccessButton from "../../../common/buttons/SuccessButton";
import styled from "styled-components";
import { ARMReportTable } from "../ARMReportTable";
import useNrcControlList from "../../../../lib/hooks/planning/useNrcControlList";
import moment from "moment";
import Permission from "../../../auth/Permission";

const TITLE = "NRC Control List Report";

const printStyle = `
table th,
table thead tr td,
table tbody tr td{
  border-width: 1px !important;
  border-style: solid !important;
  border-color: #000 !important;
}
.table-data{
  text-align: left!important;
  border: none!important;
  font-weight: bold!important;
  font-size: 1rem!important;
}
@page {
  margin: 0!important;
  size: portrait!important;
}`

const ReportContainer = styled.div`
  @media print {
    padding: 30px !important;
  }
  tbody tr td{
    height: 35px;
  }
  .top-table tr td{
    height: 0px
  }
  .title {
    margin-bottom: 0px !important;
  }

  .table-data{
    text-align: left;
    border: none;
    font-weight: bold;
    font-size: 1.1rem;
  }

`;

export default function NRCControlListView() {
  const reportRef = createRef<any>();
  const { singleNrc } = useNrcControlList()
  let empty: any[] = []
  for (let i = 1; i <= 19; i++) {
    empty.push("")
  }

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
            <Link to="/planning/nrc-control-list">{TITLE}</Link></Breadcrumb.Item>
          <Breadcrumb.Item>View</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_REPORTS_NRC_CONTROL_LIST_SEARCH" showFallback>
      <ARMCard
        title={
          <Row justify="space-between">
            <Col>{TITLE}</Col>
            <Col>
              <ReactToPrint
                content={() => reportRef.current}
                copyStyles={true}
                pageStyle={printStyle}
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
                <Col style={{ fontSize: "10px" }}>
                  <Typography.Text>FORM CAME-021</Typography.Text>
                  <br />
                  <Typography.Text>ISSUE INITIAL</Typography.Text>
                  <br />
                  <Typography.Text>DATE 19 JAN 2022</Typography.Text>
                </Col>
              </Row>
              <Typography.Title
                className="title"
                level={2}
                style={{ textAlign: "center" }}
              >
                {singleNrc?.aircraftModelName}
                <br />
                <span style={{ textDecoration: "underline" }}>
                  NRC CONTROL LIST
                </span>
              </Typography.Title>
              <ARMReportTable>
                <tbody className="top-table">
                  <tr>
                    <td className="table-data" style={{ width: "60%" }}>W.O. NO.: {singleNrc?.woNo}</td>
                    <td className="table-data">DT. {singleNrc?.date && moment(singleNrc?.date, "YYYY-MM-DD").format("DD-MMM-YYYY")}</td>
                  </tr>
                  <tr>
                    <td className="table-data">A/C REGN. NO.: {singleNrc?.aircraftName} (MSN {singleNrc?.airframeSerial})</td>
                    <td className="table-data">TYPE OF CHECK: '{singleNrc?.typeOfCheckList?.map((check: any) => check).join(' + ')}' CHECK</td>
                  </tr>
                </tbody>
              </ARMReportTable>
              <br /> <br />
              <Row className="table-responsive">
                <ResponsiveTable>
                  <ARMReportTable>
                    <thead>
                      <tr>
                        <th>
                          SL.
                          <br />
                          NO.
                        </th>
                        <th>DATE</th>
                        <th>NRC NO.</th>
                        <th>ORIGINATOR</th>
                        <th>
                          COMPLETION <br /> DATE
                        </th>
                        <th>
                          CLOSED BY <br /> (AUTH. NO)
                        </th>
                        <th>REMARKS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        empty.map((e) => (
                          <tr>
                            <td>{e}</td>
                            <td>{e}</td>
                            <td>{e}</td>
                            <td>{e}</td>
                            <td>{e}</td>
                            <td>{e}</td>
                            <td>{e}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </ARMReportTable>
                </ResponsiveTable>
              </Row>
            </ReportContainer>
          </Col>
        </Row>
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
