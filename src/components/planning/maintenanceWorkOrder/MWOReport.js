import { Breadcrumb, Col, Row, Typography } from "antd";
import React, { createRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";

import ReactToPrint from "react-to-print";
import { PrinterOutlined } from "@ant-design/icons";
import styled from "styled-components";
import ARMTable from "../../common/ARMTable";
import SuccessButton from "../../common/buttons/SuccessButton";
import logo from "../../../components/images/us-bangla-logo.png";
import ResponsiveTable from "../../common/ResposnsiveTable";
import MWOService from "../../../service/planning/MWOService";
import { notifyResponseError } from "../../../lib/common/notifications";
import moment from "moment";
import Permission from "../../auth/Permission";
import { DateFormat, HourFormat, ViewDateFormat } from "../report/Common";

const CustomTable = styled(ARMTable)`
  thead tr th {
    border-width: 1px !important;
    border-style: solid !important;
    border-color: #000 !important;
  }

  thead tr th,
  tbody tr td {
    border-width: 1px !important;
    border-style: solid !important;
    border-color: #000 !important;
    padding:2px 0px !important
  }
`;

const CustomSpan = styled.span`
  border-bottom: 1px solid #000000;
  font-weight: bold;
  margin-left: 5px;
  font-size: 10px;
`;

const CustomLi = styled.li`
  margin: 2px 0px;
  font-size: 10px;
`;

const CustomUl = styled.ul`
  list-style-type: none;
  margin: 0px;
  padding: 5px;
  font-size: 12px;
`;

const CustomIssued = styled.span`
  display: block;
  margin-left: 115px;
`;

const CustomH3 = styled.h3`
  text-align: center;
  text-transform: uppercase;
`;

const CustomDiv = styled.div`
  background: #ffffff;
  padding: 30px;
`;

const CustomNoteDiv = styled.div`
  border-top: 1px solid #000000;
  margin-top: 1px;
  font-size: 10px;
`;

const CustomCheckedDiv = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 8px;
`;

const CustomCheckedUl = styled.ul`
  list-style-type: none;
  margin: 0px;
  padding: 0px;
`;

const CustomCheckedLi = styled.li`
  margin: 10px 0px;
`;

const CustomHeadingSpan = styled.span`
  font-size: 20px;
  border-bottom: 2px solid #000000;
`;

const MWOReport = () => {
  const reportRef = createRef();
  let { id } = useParams();
  const [singleData, setSingleData] = useState();
  const getSingleData = async (id) => {
    try {
      const { data } = await MWOService.getSingleData(id);
      setSingleData(data);
    } catch (er) {
      notifyResponseError(er);
    }
  };
  useEffect(() => {
    if (!id) {
      return;
    }
    (async () => {
      await getSingleData(id);
    })();
  }, [id]);
  return (
    <div>
      <CommonLayout>
        <Permission
          permission="PLANNING_SCHEDULE_TASKS_MAINTENANCE_WORK_ORDERS_SEARCH"
          showFallback
        >
          <ARMBreadCrumbs>
            <Breadcrumb separator="/">
              <Breadcrumb.Item>
                <i className="fas fa-chart-line" />
                <Link to="/planning">&nbsp; Planning</Link>
              </Breadcrumb.Item>

              <Breadcrumb.Item>
                <Link to="/planning/mwos">MWOs </Link>
              </Breadcrumb.Item>

              <Breadcrumb.Item> MWO Report</Breadcrumb.Item>
            </Breadcrumb>
          </ARMBreadCrumbs>
          <ARMCard
            title={
              <Row justify="space-between">
                <Col>MWO Report</Col>
                <Col>
                  <ReactToPrint
                    content={() => reportRef.current}
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
            <div ref={reportRef} style={{ padding: "30px" }}>
              <Row justify="space-between">
                <Col>
                  <img src={logo} width={130} alt="" />
                </Col>
                <Col style={{ fontSize: "10px" }}>
                  <Typography.Text>FORM: CAME-022</Typography.Text>
                  <br />
                  <Typography.Text>ISSUE: 01</Typography.Text>
                  <br />
                  <Typography.Text>DATE: 19-02-2023</Typography.Text>
                </Col>
              </Row>

              <div style={{ margin: "0px" }}>
                <CustomH3>
                  <CustomHeadingSpan>Maintenance work order</CustomHeadingSpan>
                </CustomH3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: "20px",
                }}
              >
                <div style={{ border: "1px solid #000000" }}>
                  <CustomUl>
                    <CustomLi>
                      AIRCRAFT REGEN:
                      <CustomSpan>
                        {singleData?.aircraftName?.toUpperCase()}{" "}
                      </CustomSpan>
                    </CustomLi>
                    <CustomLi>
                      AIRCRAFT SL. NO:
                      <CustomSpan>{singleData?.airframeSerial}</CustomSpan>
                    </CustomLi>
                    <CustomLi>
                      WORK SHOP/MAINT:
                      <CustomSpan>
                        {singleData?.workShopMaint
                          ? singleData?.workShopMaint?.toUpperCase()
                          : "N/A"}
                      </CustomSpan>
                    </CustomLi>
                  </CustomUl>
                </div>

                <div style={{ border: "1px solid #000000" }}>
                  <CustomUl>
                    <CustomLi>
                      W/O NO:
                      <CustomSpan>{singleData?.woNo.toUpperCase()}</CustomSpan>
                    </CustomLi>
                    <CustomLi>
                      DATE:
                      <CustomSpan>
                        {" "}
                        {DateFormat(singleData?.date)}
                      </CustomSpan>
                    </CustomLi>
                  </CustomUl>
                </div>

                <div style={{ border: "1px solid #000000" }}>
                  <CustomUl>
                    <CustomLi>
                      TOTAL A/C HRS:
                      <CustomSpan>{HourFormat(singleData?.totalAcHours)}</CustomSpan>
                    </CustomLi>
                    <CustomLi>
                      TOTAL A/C LANDING:
                      <CustomSpan>{singleData?.totalAcLanding}</CustomSpan>
                    </CustomLi>
                    <CustomLi>
                      TSN/CSN OF THE COMP:
                      <CustomSpan>
                        {singleData?.tsnComp
                          ? singleData?.tsnComp?.toUpperCase()
                          : "N/A"}
                      </CustomSpan>
                    </CustomLi>
                    <CustomLi>
                      TSO/CSO OF THE COMP:
                      <CustomSpan>
                        {singleData?.tsoComp
                          ? singleData?.tsoComp?.toUpperCase()
                          : "N/A"}
                      </CustomSpan>
                    </CustomLi>
                    <CustomLi>
                      AS OF (DATE):
                      <CustomSpan>
                        {DateFormat(singleData?.asOfDate)}
                      </CustomSpan>
                    </CustomLi>
                  </CustomUl>
                </div>
              </div>

              <Row className="table-responsive" style={{ marginTop: "10px" }}>
                <ResponsiveTable>
                  <CustomTable className="table">
                    <thead>
                      <tr style={{ fontSize: "10px" }}>
                        <th width="4%" style={{ fontSize: "10px" }}>
                          SL
                          <br />
                          NO
                        </th>
                        <th width="44%" style={{ fontSize: "10px" }}>
                          BERIEF DESCRIPTION (D.I/ PDC /ANY OTHER CHECK/
                          <br /> INSPECTION / MO / IO NO / COMPONENT CHANGE
                          <br /> ETC,)
                        </th>
                        <th width="12%" style={{ fontSize: "10px" }}>
                          WORK CARD NO <br />/ M.O. / TO NO. P/N &amp; S/N
                          <br /> ETC.
                        </th>
                        <th width="10%" style={{ fontSize: "10px" }}>
                          COMPLIANCE
                          <br /> REQUIRED BY DT,
                          <br /> TAT. TAC ETC.
                        </th>
                        <th width="10%" style={{ fontSize: "10px" }}>
                          ACCOMPLISH-MENT
                          <br /> DATE
                        </th>
                        <th width="10%" style={{ fontSize: "10px" }}>
                          SIG &amp; AUTH.NO,
                          <br />
                          OF SHIFT I/C OR
                          <br /> SHOP I/C /AME
                        </th>
                        <th width="10%" style={{ fontSize: "10px" }}>
                          REMARKS (IF ANY)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {singleData?.woTaskViewModelList?.map((item) => (
                        <tr key={item.id}>
                          <td>{item.slNo}</td>
                          <td
                            style={{ fontSize: "14px" }}
                            className={"newLineInRow"}
                          >
                            <p
                              style={{
                                marginLeft: "15px",
                                textAlign: "left",
                                fontSize: "10px",
                              }}
                            >
                              {item.description}
                            </p>
                          </td>
                          <td style={{ fontSize: "10px" }}>
                            {item.workCardNo}
                          </td>

                          <td style={{ fontSize: "10px" }}>
                            {item?.complianceDate
                              ? moment(item.complianceDate).format(
                                  "DD-MMM-YYYY"
                                )
                              : ""}
                          </td>
                          <td style={{ fontSize: "10px" }}>
                            {item?.accomplishDate
                              ? moment(item.accomplishDate).format(
                                  "DD-MMM-YYYY"
                                )
                              : ""}
                          </td>
                          <td style={{ fontSize: "10px" }}>{item.authNo}</td>
                          <td
                            style={{ fontSize: "10px" }}
                            className={"newLineInRow"}
                          >
                            {item.remarks}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </CustomTable>
                </ResponsiveTable>
              </Row>

              <CustomCheckedDiv>
                <div>
                  <CustomCheckedUl>
                    <CustomCheckedLi>
                      PREPARED BY :{" "}
                      <span>
                        ..............................................................................
                      </span>
                      <span
                        style={{
                          display: "block",
                          textAlign: "center",
                          marginLeft: "16%",
                        }}
                      >
                        (ENGG. PLANNING)
                      </span>
                    </CustomCheckedLi>

                    <CustomCheckedLi>
                      APPROVED BY :{" "}
                      <span>
                        .................................................................................
                      </span>
                      <span
                        style={{
                          display: "block",
                          textAlign: "center",
                          marginLeft: "22%",
                        }}
                      >
                        (MANAGER PLANNING )
                      </span>
                    </CustomCheckedLi>

                    <CustomCheckedLi>
                      RECEIVED BY :{" "}
                      <span>
                        .................................................................................
                      </span>
                      <span
                        style={{
                          width: "80%",
                          display: "block",
                          textAlign: "center",
                          marginLeft: "24%",
                        }}
                      >
                        (MCC/PPC/DUTY ENGR/SHOP IN-CHARGE)
                      </span>
                    </CustomCheckedLi>
                  </CustomCheckedUl>
                </div>
                <div>
                  <ul
                    style={{
                      listStyleType: "none",
                      margin: "0px",
                      padding: "0px",
                    }}
                  >
                    <CustomCheckedLi>
                      <span
                        style={{
                          minWidth: "150px",
                          textAlign: "right",
                          display: "inline-block",
                        }}
                      >
                        {" "}
                        CHECKED BY :
                      </span>{" "}
                      <span>
                        ..................................................................
                      </span>
                      <span
                        style={{
                          display: "block",
                          textAlign: "center",
                          marginLeft: "35%",
                        }}
                      >
                        (ENGG. PLANNING)
                      </span>
                    </CustomCheckedLi>

                    <CustomCheckedLi>
                      <span
                        style={{
                          minWidth: "150px",
                          textAlign: "right",
                          display: "inline-block",
                        }}
                      >
                        RECEIVED AND UPDATED BY :
                      </span>
                      <span>
                        ..................................................................
                      </span>
                      <span
                        style={{
                          display: "block",
                          textAlign: "center",
                          marginLeft: "35%",
                        }}
                      >
                        (TECH. RECORD)
                      </span>
                    </CustomCheckedLi>
                  </ul>
                </div>
              </CustomCheckedDiv>

              <CustomNoteDiv>
                <span style={{ fontWeight: "bold" }}>Note: </span>
                To be raised in duplicate: One copy will remain with originator.
                Other copy is to be given to the concerned shop / section and
                after accomplishment of job same is to be returned to originator
              </CustomNoteDiv>
            </div>
          </ARMCard>
        </Permission>
      </CommonLayout>
    </div>
  );
};

export default MWOReport;
