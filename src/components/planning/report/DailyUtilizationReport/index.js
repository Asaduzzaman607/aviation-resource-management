import {
  DownloadOutlined,
  FilterOutlined,
  PrinterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import moment from "moment";
import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { useBoolean } from "react-use";
import styled from "styled-components";
import DateTimeConverter from "../../../../converters/DateTimeConverter";
import { sleep } from "../../../../lib/common/helpers";
import {
  notifyResponseError,
  notifyWarning,
} from "../../../../lib/common/notifications";
import { REQUIRED } from "../../../../lib/constants/validation-rules";
import { useAircraftsList } from "../../../../lib/hooks/planning/aircrafts";
import API from "../../../../service/Api";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import ARMButton from "../../../common/buttons/ARMButton";
import SuccessButton from "../../../common/buttons/SuccessButton";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import CommonLayout from "../../../layout/CommonLayout";
import { ARMReportTable } from "../ARMReportTable";
import { CycleFormat, DateFormat, HourFormat } from "../Common";
import CompanyLogo from "../CompanyLogo";
import { useDownloadExcel } from "react-export-table-to-excel";
import Permission from "../../../auth/Permission";

const printStyle = `
*{
    margin: 0!important;
    padding: 0!important;
    overflow: visible !important;
  }
  .border-bold,
  .border-bold th,
.border-bold td{
  border-width: 1px !important;
  border-style: solid !important;
  border-color: #000 !important;
}
    .service-table thead tr th{
    font-size: 9px !important;
  }
  .service-table tbody tr td{
    font-size: 8px !important;
  }
  .page-of-report{
   display: block!important;
   }
   .pagination{
   display: none!important;
  }
  .table thead tr th,
  .data tr td{
  border-width: 1px !important;
  border-style: solid !important;
  border-color: #000 !important;
}
.none{
    border: none;
    visibility: hidden;
  }
.first{
    display: none !important;
  }
  .second{
    display: block !important;
  }
  
  table.report-container {
      page-break-after:always!important;
  }
  thead.report-header {
      display:table-header-group!important;
  }
  @page {
    size: landscape;
  }
`;

const ReportContainer = styled.div`
  .hard-table-header td {
    font-weight: normal;
  }

  .tb-header {
    font-weight: bold !important;
  }

  @media print {
    padding: 30px !important;
  }

  .title {
    text-transform: uppercase;
    //background-color: #EBF1DE;
    border-left: none;
    border-right: none;
    border-top: none;
    //border-bottom: 2px solid;
    padding: 0;
  }

  .text {
    margin-top: -20px !important;
  }

  .page-of-report {
    visibility: hidden;
  }

  .second {
    display: none;
  }

  .none {
    border: none;
    visibility: hidden;
  }

  .border-none {
    border: none;
  }

  width: 100% !important;
`;

export default function DailyUtilizationRecord() {
  const reportRef = createRef();
  const [submitting, toggleSubmitting] = useBoolean(false);
  const [printState, setPrintState] = useBoolean(false);
  const { allAircrafts, getAllAircrafts } = useAircraftsList();
  const [data, setData] = useState([]);
  const [printData, setPrintData] = useState([]);
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [printStartDate, setPrintStartDate] = useState();
  const [printEndDate, setPrintEndDate] = useState();
  const aircraftId = Form.useWatch("aircraftId", form);
  const dateRange = Form.useWatch("dateRange", form);
  const [fromDate, toDate] = dateRange || "";

  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  const handleDailyUtilizationSearch = useCallback(
    async (values) => {
      const [fromDate, toDate] = values.dateRange || "";

      let timeDiff = toDate - fromDate;
      let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      if (daysDiff > 365) {
        notifyWarning("Please select start date and end date within 1 year !");
        return;
      }

      setStartDate(DateTimeConverter.momentDateToString(fromDate));
      setEndDate(DateTimeConverter.momentDateToString(toDate));
      const searchValues = {
        aircraftId: values.aircraftId,
        fromDate: DateTimeConverter.momentDateToString(fromDate),
        toDate: DateTimeConverter.momentDateToString(toDate),
        isPageable: true,
      };
      try {
        console.log("calling......");
        const { data } = await API.post(
          `utilization/daily_report`,
          searchValues
        );
        setData(data);
      } catch (error) {
        notifyResponseError(error);
      } finally {
        toggleSubmitting(false);
      }
    },
    [toggleSubmitting]
  );

  const fetchPrintData = async () => {
    setPrintState(true);
    const searchValues = {
      aircraftId: aircraftId,
      fromDate: DateTimeConverter.momentDateToString(fromDate),
      toDate: DateTimeConverter.momentDateToString(toDate),
      isPageable: false,
    };
    setPrintStartDate(DateTimeConverter.momentDateToString(fromDate));
    setPrintEndDate(DateTimeConverter.momentDateToString(toDate));
    try {
      const { data } = await API.post(`utilization/daily_report`, searchValues);

      setPrintData(data);
      return sleep(1000);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    (async () => {
      await getAllAircrafts();
    })();
  }, [getAllAircrafts]);

  const resetFilter = () => {
    form.resetFields();
    setData([]);
  };

  const dailyUtilizationRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: dailyUtilizationRef.current,
    filename: "Daily Utilization Report",
    sheet: "dailyUtilizationReport",
  });

  const downloadDailyUtilizationExcel = async () => {
    if (!aircraftId) return;
    await fetchPrintData();
    setPrintState(false);
    await sleep(1000);
    if (printData?.dailyUtilizationReport?.length < 1) {
      notifyWarning("Report data is empty! Please generate the data first.");
      return;
    }
    onDownload();
  };

  const apuHour=(value)=>{
    if(value===0){
      return 0;
    }
    if(value){
      return parseInt(value);
    }
    return 'N/A'
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
          <Breadcrumb.Item>Daily utilization record</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_DAILY_UTILIZATION_RECORD_SEARCH"
        showFallback
      >
        <ARMCard
          title={
            <Row justify="space-between">
              <Col>DAILY UTILIZATION RECORD</Col>
              <Col>
                <Space>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={downloadDailyUtilizationExcel}
                  >
                    {" "}
                    Export excel{" "}
                  </Button>
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
                    onBeforeGetContent={fetchPrintData}
                  />
                </Space>
              </Col>
            </Row>
          }
        >
          <Form
            loading={submitting}
            form={form}
            name="filter-form"
            initialValues={{
              aircraftId: null,
              dateRange: [
                moment(firstDay, "DD-MM-YYYY"),
                moment(lastDay, "DD-MM-YYYY"),
              ],
              size: 10,
            }}
            onFinish={handleDailyUtilizationSearch}
          >
            <Row gutter={20}>
              <Col xs={24} md={6}>
                <Form.Item rules={[REQUIRED]} name="aircraftId">
                  <Select placeholder="Select Aircraft">
                    {allAircrafts?.map(({ aircraftId, aircraftName }) => (
                      <Select.Option value={aircraftId} key={aircraftId}>
                        {aircraftName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={6}>
                <Form.Item rules={[REQUIRED]} name="dateRange">
                  <DatePicker.RangePicker
                    format="DD-MM-YYYY"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={6}>
                <Form.Item>
                  <Space>
                    <ARMButton size="middle" type="primary" htmlType="submit">
                      <FilterOutlined name="filter" /> Filter
                    </ARMButton>
                    <ARMButton
                      size="middle"
                      type="primary"
                      onClick={resetFilter}
                    >
                      <RollbackOutlined name="reset" /> Reset
                    </ARMButton>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Row ref={reportRef}>
            <ReportContainer>
              <Col span={24} className="first">
                <Row justify="space-between">
                  <Col>
                    <CompanyLogo />
                  </Col>
                  <Col style={{ fontSize: "10px" }}>
                    <Typography.Text>Form: CAME-033</Typography.Text>
                    <br />
                    <Typography.Text>ISSUE INITIAL</Typography.Text>
                    <br />
                    <Typography.Text>DATE 19 JAN 2022</Typography.Text>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Row justify="center" className="first">
                  <Col span={24}>
                    <Typography.Title className="title" level={4}>
                      DAILY UTILIZATION RECORD
                    </Typography.Title>
                  </Col>
                </Row>

                <Row className="table-responsive">
                  <ResponsiveTable className="first">
                    <ARMReportTable className="table" style={{width:"120%",marginBottom:"8px"}}>
                      <thead>
                        <tr>
                          <th className="none" colSpan={13}></th>
                          <th>A/C Reg : {data?.aircraftName} </th>
                          <th>AS OF DATE</th>
                          <th>TAT</th>
                          <th>TAC</th>
                        </tr>

                        <tr>
                          <th className="none" colSpan={13}></th>
                          <th>MSN : {data?.aircraftSerial}</th>
                          <th>{DateFormat(data?.asOfDate)}</th>
                          <th>{HourFormat(data?.totalTat)}</th>
                          <th>{CycleFormat(data?.totalTac)}</th>
                        </tr>
                        <tr>
                          <th className="none" colSpan={13}></th>
                          <th>From</th>
                          <th>TO</th>
                          <th>TOTAL FH</th>
                          <th>TOTAL FC</th>
                        </tr>

                        <tr>
                          <td className="none" colSpan={13}></td>
                          <th>{DateFormat(startDate)}</th>
                          <th>{DateFormat(endDate)}</th>
                          <th>{HourFormat(data?.totalFH)}</th>
                          <th>{CycleFormat(data?.totalFC)}</th>
                        </tr>
                      </thead>
                      <br />
                      <thead>
                        <tr>
                          <th>DATE</th>
                          <th>USED CYC</th>
                          <th>USED HRS</th>
                          <th>APU USED HRS</th>
                          <th>APU USED CYC</th>
                          <th>ENG#1 OIL UPLIFT</th>
                          <th>ENG#2 OIL UPLIFT</th>
                          <th>TAT</th>
                          <th>TAC</th>
                          <th>ENG #1 TSN</th>
                          <th>ENG #1 CSN</th>
                          <th>ENG #2 TSN</th>
                          <th>ENG #2 CSN</th>
                          <th>NLG TSN</th>
                          <th>NLG CSN</th>
                          <th>LHMLG CSN</th>
                          <th>RHMLG CSN</th>
                          <th>LHMLG TSN</th>
                          <th>RHMLG TSN</th>
                          <th>APU TSN</th>
                          <th>APU CSN</th>
                        </tr>
                      </thead>

                      <tbody style={{ whiteSpace: "nowrap" }} className="data">
                        {/*<tr>*/}
                        {/*    <td colSpan={3}>*/}
                        {/*        <b>BF</b>*/}
                        {/*        <br/>*/}
                        {/*        <b>({DateFormat(data?.bfDate)})</b>*/}
                        {/*    </td>*/}
                        {/*    <td colSpan={3}></td>*/}
                        {/*    <td colSpan={3}></td>*/}
                        {/*    <td colSpan={3}></td>*/}
                        {/*    <td colSpan={3}></td>*/}
                        {/*    <td >{HourFormat(data?.bftat)}</td>*/}
                        {/*    <td>{CycleFormat(data?.bftac)}</td>*/}
                        {/*</tr>*/}
                        {data?.dailyUtilizationReport?.map((item, index) => (
                          <tr key={index}>
                            <td width="4%">{DateFormat(item?.date)}</td>
                            <td width="4%">{CycleFormat(item?.usedCyc)}</td>
                            <td width="4%">{HourFormat(item?.usedHrs)}</td>
                            <td width="4%">{apuHour(item?.apuUsedHrs)}</td>
                            <td width="4%">{CycleFormat(item?.apuUsedCycle)}</td>
                            <td width="4%">{item?.eng1OilUplift ? item?.eng1OilUplift : "0"}</td>
                            <td width="4%">{item?.eng2OilUplift ? item?.eng2OilUplift : "0"}</td>
                            <td width="4%">{HourFormat(item?.tat)}</td>
                            <td width="4%">{CycleFormat(item?.tac)}</td>
                            <td width="4%">{HourFormat(item?.eng1Tsn)}</td>
                            <td width="4%">{CycleFormat(item?.eng1Csn)}</td>
                            <td width="4%">{HourFormat(item?.eng2Tsn)}</td>
                            <td width="4%">{CycleFormat(item?.eng2Csn)}</td>
                            <td width="4%">{HourFormat(item?.nlgTsn)}</td>
                            <td width="4%">{CycleFormat(item?.nlgCsn)}</td>
                            <td width="4%">{HourFormat(item?.lhMlgCsn)}</td>
                            <td width="4%">{CycleFormat(item?.rhMlgCsn)}</td>
                            <td width="4%">{HourFormat(item?.lhMlgTsn)}</td>
                            <td width="4%">{HourFormat(item?.rhMlgTsn)}</td>
                            <td width="4%">{apuHour(item?.apuTsn)}</td>
                            <td width="4%">{CycleFormat(item?.apuCsn)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </ARMReportTable>
                  </ResponsiveTable>

                  <ResponsiveTable className="second">
                    <ARMReportTable className="table" ref={dailyUtilizationRef}>
                      <table
                        className="report-container"
                        style={{ width: "100%" }}
                      >
                        <thead className="report-header">
                          <tr>
                            <td
                              className="report-header-cell border-none"
                              colSpan={13}
                            >
                              <div className="header-info">
                                <Col span={24}>
                                  <Row justify="space-between">
                                    {printState ? (
                                      <Col>
                                        <CompanyLogo />
                                      </Col>
                                    ) : (
                                      <Col></Col>
                                    )}
                                    <Col
                                      style={{
                                        fontSize: "10px",
                                        textAlign: "left",
                                      }}
                                    >
                                      <Typography.Text>
                                        Form: CAME-033
                                      </Typography.Text>
                                      <br />
                                      <Typography.Text>
                                        ISSUE INITIAL
                                      </Typography.Text>
                                      <br />
                                      <Typography.Text>
                                        DATE 19 JAN 2022
                                      </Typography.Text>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col span={12}>
                                      <Typography.Title
                                        level={3}
                                        style={{ fontSize: "1rem" }}
                                      >
                                        DAILY UTILIZATION RECORD
                                      </Typography.Title>
                                    </Col>
                                  </Row>
                                </Col>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={13} className="none">
                              empty
                            </td>
                          </tr>
                          <tr>
                            {printState ? (
                              <td className="none" colSpan={3}>
                                empty
                              </td>
                            ) : (
                              <td className="none" colSpan={3}>
                                empty
                              </td>
                            )}
                            <th>A/C Reg: {printData?.aircraftName} </th>
                            <th>AS OF DATE</th>
                            <th>TAT</th>
                            <th>TAC</th>
                          </tr>
                          <tr>
                            <td className="none" colSpan={3}>
                              empty
                            </td>
                            <th>MSN : {printData?.aircraftSerial}</th>
                            <th>{DateFormat(printData?.asOfDate)}</th>
                            <th>{HourFormat(printData?.totalTat)}</th>
                            <th>{CycleFormat(printData?.totalTac)}</th>
                          </tr>

                          <tr>
                            <td className="none" colSpan={3}>
                              empty
                            </td>
                            <th>From</th>
                            <th>TO</th>
                            <th>TOTAL FH</th>
                            <th>TOTAL FC</th>
                          </tr>

                          <tr>
                            <th className="none" colSpan={3}></th>
                            <th>{DateFormat(printStartDate)}</th>
                            <th>{DateFormat(printEndDate)}</th>
                            <th>{HourFormat(printData?.totalFH)}</th>
                            <th>{CycleFormat(printData?.totalFC)}</th>
                          </tr>

                          {/* <tr>
                            <td colSpan={13} className="none"></td>
                        </tr> */}

                          <tr>
                            <th>DATE</th>
                            <th>USED CYC</th>
                            <th>USED HRS</th>
                            <th>APU USED HRS</th>
                            <th>APU USED CYC</th>
                            <th>TAT</th>
                            <th>TAC</th>
                          </tr>
                        </thead>
                        <tbody
                          style={{ whiteSpace: "nowrap" }}
                          className="data"
                        >
                          {/*<tr>*/}
                          {/*    <td colSpan={3}>*/}
                          {/*        <b>BF</b>*/}
                          {/*        <br/>*/}
                          {/*        <b>({DateFormat(printData?.bfDate)})</b>*/}
                          {/*    </td>*/}
                          {/*    <td colSpan={3}></td>*/}
                          {/*    <td colSpan={3}></td>*/}
                          {/*    <td colSpan={3}></td>*/}
                          {/*    <td colSpan={3}></td>*/}
                          {/*    <td>{HourFormat(printData?.bftat)}</td>*/}
                          {/*    <td>{CycleFormat(printData?.bftac)}</td>*/}
                          {/*</tr>*/}
                          {printData?.dailyUtilizationReport?.map(
                            (item, index) => (
                              <tr key={index}>
                                <td>{DateFormat(item?.date)}</td>
                                <td>{CycleFormat(item?.usedCyc)}</td>
                                <td>{HourFormat(item?.usedHrs)}</td>
                                <td>{parseInt(item?.apuUsedHrs) || "N/A"}</td>
                                <td>{CycleFormat(item?.apuUsedCycle)}</td>
                                <td>{HourFormat(item?.tat)}</td>
                                <td>{CycleFormat(item?.tac)}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
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
