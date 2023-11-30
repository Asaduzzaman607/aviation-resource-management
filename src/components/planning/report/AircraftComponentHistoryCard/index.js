import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {
  AutoComplete,
  Breadcrumb,
  Col,
  Form,
  Row, Select,
  Space,
  Typography,
} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import ReactToPrint from "react-to-print";
import { createRef, useState } from "react";
import SuccessButton from "../../../common/buttons/SuccessButton";
import ARMButton from "../../../common/buttons/ARMButton";
import {
  FilterOutlined,
  PrinterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import { ARMReportTable } from "../ARMReportTable";
import CompanyLogo from "../CompanyLogo";
import API from "../../../../service/Api";
import moment from "moment";
import { notifyResponseError } from "../../../../lib/common/notifications";
import { formatCycleWithoutNotApplicable, formatHourWithoutNotApplicable, HourFormat, HourFormatWithName } from "../Common";
import Permission from "../../../auth/Permission";
import SerialNoServices from "../../../../service/SerialNoServices";
import debounce from "lodash/debounce";
import React from "react";
import {useEffect} from "react";
import {t} from "i18next";
const {Option} = AutoComplete;

export const dateFormat = (date) => {
  if (date) {
    return moment(date).format("DD-MMM-YYYY");
  }
  return "";
};



export const convertCycle = (data) => {
  if (data) {
    return data + "FC";
  } else if (data == 0.0) {
    return "0" + "FC";
  }
  return "N/A";
};

const printStyle = `
*{
  font-size:.8rem !important;
  overflow:hidden !important;
}
`;
const ReportContainer = styled.div`
  @media print {
    padding: 20px !important;
  }
  .text {
    margin-top: -20px !important;
  }

  width: 100% !important;
`;


const TITLE = "AIRCRAFT COMPONENT HISTORY CARD";

export default function AircraftComponentHistoryCard() {

  const reportRef = createRef();
  const [form] = Form.useForm();
  const [reportData, setReportData] = useState([]);
  const [parts, setParts] = useState([]);
  const [serialData, setSerialData] = useState([]);
  const [searchPartId, setSearchPartId] = useState(null);
  const partId = Form.useWatch('partId', form);
  const alternate = reportData?.alternatePartNo?.join(" ,");
  const arr = reportData?.taskCardRef;



  const onSearchParts = async (value) => {
    try {
      const {data} = await SerialNoServices.searchParts(value);
      setParts(data)
    } catch (er) {
      notifyResponseError(er)
    }
  }

  const getSerialNoByPartId = async () => {

    const { data } = await API.get(`serials/serial-by-part?partId=${searchPartId.partId}`);
    setSerialData(data);
  };

  useEffect(() => {
    if (!searchPartId) {
      return;
    }
    (async () => {
      await getSerialNoByPartId();
    })();
  }, [searchPartId]);

  useEffect(() => {
    if (!partId) {
      return;
    }
    (async () => {
      const getPartId = parts?.find(v => v.partNo === partId)
      setSearchPartId(getPartId)
    })();
  }, [partId]);


  const handleSubmit = async (values) => {

    const partIdKey = searchPartId?.partId;
    const serialIdKey = values.serialId;
    try {
      const { data } = await API.post(
        `aircraft-build/ac-component/history?partId=${partIdKey}&serialId=${serialIdKey}`
      );
      setReportData(data); 
    } catch (er) {
      setReportData(null);
      notifyResponseError(er);
    }
  };

  const resetFilter = () => {
    form.resetFields();
  }; 


  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" /> &nbsp;Planning
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{TITLE}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission permission="PLANNING_OTHERS_AIRCRAFT_COMPONENT_HISTORY_CARD_SEARCH" showFallback>
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
        <Form form={form} name="filter-form" onFinish={handleSubmit}>
          <Row gutter={20}>
            <Col xs={24} md={6}>
              <Form.Item
                label='Part'
                name="partId"
                rules={[
                  {
                    required: true,
                    message: 'Part is required',
                  }
                ]}
              >
                <AutoComplete showSearch onSearch={debounce(onSearchParts, 1000)} placeholder='Input Part No'  onChange={() => {
                  form.setFieldsValue({serialId: ""})
                }}>
                  {parts.map((part) => (
                    <Option key={part.partNo} value={part.partNo}>
                      {part.partNo}
                    </Option>
                  ))}
                </AutoComplete>

              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                name="serialId"
                label={t("planning.Aircraft Builds.Serial No")}
                style={{
                  marginBottom: "16px",
                  marginLeft: "4%",
                }}

                rules={[
                  {
                    required: true,
                    message: t(
                      "planning.Aircraft Builds.Serial No is required"
                    ),
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Serial No"
                >
                  {serialData?.map((item) => {
                    return (
                      <Select.Option
                        key={item.serialId}
                        value={item.serialId}
                      >
                        {item.serialNo}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item>
                <Space>
                  <ARMButton size="middle" type="primary" htmlType="submit">
                    <FilterOutlined name="filter" /> Filter
                  </ARMButton>
                  <ARMButton size="middle" type="primary" onClick={resetFilter}>
                    <RollbackOutlined name="reset" /> Reset
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Row ref={reportRef}>
          <ReportContainer>
            <Col span={24}>
              <Row justify="space-between">
                <Col>
                  <CompanyLogo />
                </Col>
                <Col style={{ fontSize: "10px" }}>
                  <Typography.Text>Form: CAME-015</Typography.Text>
                  <br />
                  <Typography.Text>ISSUE INITIAL</Typography.Text>
                  <br />
                  <Typography.Text>DATE 19 JAN 2022</Typography.Text>
                </Col>
              </Row>
            </Col>

            <Col span={24}>
              <Row justify="center">
                <Col span={24} style={{ textAlign: "center" }}>
                  <Typography.Title level={2} style={{ padding: 0, margin: 0 }}>
                    {TITLE}
                  </Typography.Title>
                </Col>
              </Row>

              <Row className="table-responsive">
                <ResponsiveTable>
                  <ARMReportTable className="table" style={{ width: "100%" }}>
                    <tbody style={{ whiteSpace: "nowrap" }}>
                      <p style={{ margin: "0px", paddin: "0px" }}>
                        <b>
                          ATA CHAPTER:{" "}
                          <span style={{ marginLeft: "20px" }}>
                            {reportData?.ataChapter}
                          </span>
                        </b>
                      </p>
                      <tr>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "4px",
                            width: "10px",
                            wordWrap: "break-word",
                            whiteSpace: "break-spaces",
                          }}
                          colSpan={4}
                          rowSpan={2}
                        >
                          <b>PART NAME:</b> {reportData?.partName}
                        </td>
                        <td
                          style={{ textAlign: "left", padding: "4px" }}
                          colSpan={5}
                        >
                          <b>PART NO:</b> {reportData?.partNo}
                        </td>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "4px",
                            width: "500px",
                            wordWrap: "break-word",
                            whiteSpace: "break-spaces",
                          }}
                          colSpan={6}
                          rowSpan={2}
                        >
                          <b>INTERCHANGEABLE PART NO:</b> {alternate}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style={{ textAlign: "left", padding: "4px" }}
                          colSpan={3}
                        >
                          <b>HIGHER ASSY P/N:</b> {reportData?.higherPartNo}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={4} style={{ textAlign: "left"}}>
                         <b>Interval/Threshold:</b>
                          {
                            reportData?.tboData?.map((m,index) => {
                              return <>
                                  {formatHourWithoutNotApplicable(m?.tboIntervalHour,m?.tboIsApuControl)} {m.tboIntervalCycle ? ",":""}
                                  {formatCycleWithoutNotApplicable(m?.tboIntervalCycle,m?.tboIsApuControl)}
                                  <br/>
                               </> 
                            })
                          }
                        </td>
                        <td>
                          <b>DUE FOR:</b>
                        </td>
                        <td style={{ textAlign: "left" }} colSpan={3}>
                          {reportData?.dueFor?.join(",")}
                        </td>
                        <td colSpan={3}>
                          <b>DOM: {reportData?.comManufactureDate}</b>
                        </td>
                        <td colSpan={4}>
                          <b>
                            SCRAP/DISCARD LIFE: {reportData?.lifeLimit}{" "}
                            {reportData?.lifeLimitUnit}
                          </b>
                        </td>
                      </tr>

                      <tr>
                        <td width="2%" rowSpan={3}>
                          <b>
                            A/C <br /> REGN <br /> NO.
                          </b>
                        </td>
                        <td width="3%" rowSpan={3}>
                          <b>POSN</b>
                        </td>
                        <td colSpan={2}>
                          <b>DOC REF</b>
                        </td>
                        <td colSpan={2}>
                          <b>DATE</b>
                        </td>
                        <td colSpan={2}>
                          <b>TIME/CYC SINCE</b>
                        </td>
                        <td colSpan={3}>
                          <b>A/C HRS/LDGS/MONTH</b>
                        </td>
                        <td rowSpan={3}>
                          <b>
                            USED <br /> TIME/ <br /> CYCS
                          </b>
                        </td>
                        <td colSpan={2}>
                          <b>
                            TIME/ CYCS SINCE <br /> FITTED
                          </b>
                        </td>
                        <td rowSpan={3}>
                          <b>
                            REASON FOR <br /> REMOVAL
                          </b>
                        </td>
                      </tr>

                      <tr>
                        <td rowSpan={2}>
                          <b>IN</b>
                        </td>
                        <td rowSpan={2}>
                          <b>OUT</b>
                        </td>

                        <td rowSpan={2}>
                          <b>IN</b>
                        </td>
                        <td rowSpan={2}>
                          <b>OUT</b>
                        </td>

                        <td rowSpan={2}>
                          <b>NEW</b>
                        </td>
                        <td rowSpan={2}>
                          <b>O/H</b>
                        </td>

                        <td rowSpan={2}>
                          <b>IN</b>
                        </td>
                        <td rowSpan={2}>
                          <b>DUE AT</b>
                        </td>
                        <td rowSpan={2}>
                          <b>OUT</b>
                        </td>
                        <td><b>TSN</b></td>
                        <td><b>TSO</b></td>
                      </tr>
                      <tr>
                        <td><b>CSN</b></td>
                        <td><b>CSO</b></td>
                      </tr>
                      {reportData?.acComponentHistories?.map((a, index) => (
                        <tr key={index}>
                          <td>{a?.acRegNo}</td>
                          <td>{a?.position}</td>
                          <td
                            style={{
                              width: "20px",
                              wordWrap: "break-word",
                              whiteSpace: "pre",
                            }}
                          >
                            {a?.inRefMessage}
                          </td>
                          <td
                            style={{
                              width: "20px",
                              wordWrap: "break-word",
                              whiteSpace: "pre",
                            }}
                          >
                            {a?.outRefMessage}
                          </td>
                          <td>{dateFormat(a?.inDate)}</td>
                          <td>{dateFormat(a?.outDate)}</td>
                          <td>
                            {HourFormatWithName(a?.timeNewHour)}
                            <br />
                            {convertCycle(a?.timeNewCycle)}
                          </td>
                          <td>
                            {HourFormatWithName(a?.timeOverHaulHour)}
                            <br />
                            {convertCycle(a?.timeOverHaulCycle)}
                          </td>
                          <td>
                            {HourFormatWithName(a?.aircraftInHour)}
                            <br />
                            {convertCycle(a?.aircraftInCycle)}
                          </td>
                          <td>
                            {HourFormatWithName(a?.aircraftDueHour)}
                            <br />
                            {convertCycle(a?.aircraftDueCycle)}
                          </td>
                          <td>
                            {HourFormatWithName(a?.aircraftOutHour)}
                            <br />
                            {convertCycle(a?.aircraftOutCycle)}
                          </td>
                          <td>
                            {HourFormatWithName(a?.usedHour)}
                            <br />
                            {convertCycle(a?.usedCycle)}
                          </td>
                          <td>
                            {HourFormatWithName(a?.fittedTsn)}
                            <br />
                            {convertCycle(a?.fittedCsn)}
                          </td>
                          <td>
                            {HourFormatWithName(a?.fittedTso)}
                            <br />
                            {convertCycle(a?.fittedCso)}
                          </td>
                          <td
                            style={{
                              padding: "4px",
                              margin: "4px",
                              width: "300px",
                              wordBreak: "break-word",
                              whiteSpace: "break-spaces",
                            }}
                          >
                            {a?.reasonForRemoval}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={2}>
                          <b>AMP REF.</b>
                        </td>
                        <td colSpan={4}>
                          <b>SERIAL NO.:</b>
                        </td>
                        <td colSpan={3}>
                          <b>HIGHER ASSY S/N:</b>
                        </td>
                        <td colSpan={4}>
                          <b>TASK CARD REF.</b>
                        </td>
                        <td colSpan={2}>
                          <b>DISCARD DUE AT:</b>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} rowSpan={3}>
                          <b style={{ whiteSpace: "pre" }}>
                            {reportData?.ampRef?.join("\r\n")}
                          </b>
                        </td>
                        <td colSpan={4} rowSpan={3}>
                          <b>{reportData?.serialNo}</b>
                        </td>
                        <td colSpan={3} rowSpan={3}>
                          <b className='newLineInRow'>{reportData?.higherSerialNo?.map(item=> item).join('\n')}</b>
                        </td>
                        <td colSpan={4} rowSpan={3}>
                          <b style={{ whiteSpace: "pre" }}>
                            {arr?.join("\r\n")}
                          </b>
                        </td>
                        <td style={{ textAlign: "left" }} colSpan={2}>
                          <b>HRS:{HourFormat(reportData?.discardDueHour)} </b>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "left" }} colSpan={2}>
                          <b>CYC: {reportData?.discardDueCycle}</b>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "left" }} colSpan={2}>
                          <b>DATE: {reportData?.discardDueDate}</b>
                        </td>
                      </tr>
                    </tbody>
                  </ARMReportTable>
                </ResponsiveTable>
              </Row>
            </Col>
          </ReportContainer>
        </Row>
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
