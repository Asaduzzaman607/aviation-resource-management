import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Badge,
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import ARMTable from "../../common/ARMTable";
import CommonLayout from "../../layout/CommonLayout";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import { Link } from "react-router-dom";
import {
  DownloadOutlined,
  FilterOutlined,
  LockOutlined,
  PrinterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ResponsiveTable from "../../common/ResposnsiveTable";
import API from "../../../service/Api";
import { useBoolean } from "react-use";
import { DATE_FORMATTER } from "../../../lib/constants/date";
import SuccessButton from "../../common/buttons/SuccessButton";
import ReactToPrint from "react-to-print";
import logo from "../../images/us-bangla-logo.png";
import moment from "moment";
import {
  formatSingleTimeValue,
  formatTimeValue,
} from "../../../lib/common/presentation";
import Permission from "../../auth/Permission";
import AircraftService from "../../../service/AircraftService";
import { CycleFormat, DailyFlyingHourFormat, HourFormat } from "./Common";
import { useDownloadExcel } from "react-export-table-to-excel";
import styled from "styled-components";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import { sleep } from "../../../lib/common/helpers";
import {
  notifyError,
  notifyResponseError,
  notifyWarning,
} from "../../../lib/common/notifications";

const empty10Column = ["", "", "", "", "", "", "", "", "", ""];
const empty3Column = ["", "", ""];
const empty8Column = ["", "", "", "", "", "", "", ""];

const initialState = {
  dailyHrsReportAircraftModel: {
    airFrameTotalTime: "",
    airframeTotalCycle: "",
    bdTotalCycle: "",
    bdTotalTime: "",
    acheckTimeRemain: "",
  },

  dataModelList: [],

  total: {
    apuOil: 0,
    engineOil1: 0,
    engineOil2: 0,
    grandTotalAirTime: 0,
    grandTotalLanding: 0,
    noOfLanding: 0,
    totalAirTime: 0,
  },
};

const printStyle = `
	.dfhcd-heading{
		font-size: 13px !important;
		text-align: center !important;
	}
  .table{
    font-size: 8px !important;
  }
  .table thead tr th{
    padding: 0 !important;
    height: 35px !important;
    background-color: #C0C0C0 !important;
    color: #A53C01 !important;
  }
	.table td{
		width: 6.25%!important;
    height: 35px!important;
	}
  .dfhc-titles{
    font-size: 10px !important;
    text-align: center !important;
  }
  .table th,
  .table thead tr td,
  .table tbody tr td{
    border-width: .4px !important;
    border-style: solid !important;
    border-color: #000 !important;
  }
  .aircraft-titles{
    background-color: #FFFF00 !important;
    padding: 0 40px !important;
  }
  .pagination{
    display: none !important;
  }
  .none{
    visibility: hidden!important;
    border: none!important;
}
.border-none{
    border: none!important;
}
  .date-row{
    width: 130px !important;
  }
  
.thead{
  margin-top: 0px !important;
}
  table.report-container {
    page-break-after:always!important;
}
thead.report-header {
    display:table-header-group!important;
    height: 170px!important;
}

div.report-header {
  display:table-header-group!important;
  height: 180px!important;
}

tfoot.report-footer {
    display:table-footer-group!important;
}
.first{
    display: none !important;
  }
.second{
    display: block !important;
    margin: 10px 0 !important;
  }
 th{
   border: 1px solid black !important;
   padding-left:3px !important;
   padding-right:3px !important;
   font-size:10px !important;
   height:60px !important;
   color: #A53C01 !important;
 }
 td{
   border: 1px solid black !important;
   font-size:10px !important;
   padding-left:1px !important;
   padding-right:1px !important;
 }
 .date{
   width:8% !important;
   margin-left:1px !important;
   margin-right:1px !important;
 }

  @page{ size: A4 portrait !important;}
`;

const ServiceBulletin = styled.div`
  .service-bulletin-table {
    font-weight: normal;
  }

  .bulletin-row td {
    font-size: 9px;
    padding: 0 !important;
  }

  .service-table th {
    background-color: #d9d9d9 !important;
  }

  .border-none {
    border: none;
  }

  .service-table thead tr th {
    height: 10px !important;
    padding: 0 !important;
  }

  .service-table th,
  .service-table thead tr td,
  .service-table tbody tr td,
  .page-of-report {
    visibility: hidden;
  }

  .none {
    border: none;
    visibility: hidden;
  }

  .second {
    display: none;
  }
`;

export default function DailyFlyingHoursAndCycles() {
  const [form] = Form.useForm();
  const [formData] = Form.useForm();
  const [aircrafts, setAircrafts] = useState([]);
  const [submitting, toggleSubmitting] = useBoolean(false);
  const [data, setData] = useState(initialState);
  const reportRef = createRef();
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const aircraftId = Form.useWatch("aircraftId", formData);
  const aircrafId = Form.useWatch("aircrafId", form);
  const dateRange = Form.useWatch("dateRange", form);
  const [showModal, setShowModal] = useState(false);
  const [datas, setDatas] = useState([]);

  const fetchPrintData = async () => {
    const [startDate, endDate] = dateRange || "";

    const dataWithoutPagination = {
      aircraftId: aircrafId,
      startDate: DateTimeConverter.momentDateToString(startDate) || "",
      endDate: DateTimeConverter.momentDateToString(endDate) || "",
    };
    try {
      const { data } = await API.post(
        `aircraft-maintenance-log/daily-flying-hrs-multiple-report`,
        dataWithoutPagination
      );
      setDatas(data);
      return sleep(1000);
    } catch (er) {
      notifyResponseError(er)
    } 
  };

  function normalizeTestData(data) {

    let allDailyHrsReportData = [];

    const { dailyHrsReportDataModelList } =
      data.multipleFlyingHoursReportViewModel;

    const listLen = dailyHrsReportDataModelList.length;

    // BF Data
    const { dailyHrsReportBfDto } = data.multipleFlyingHoursReportViewModel;

    const bfData = {
      bfTitle: "BF",
      grandTotalAirTime: dailyHrsReportBfDto.grandTotalAirTime,
      grandTotalLanding: dailyHrsReportBfDto.grandTotalLanding,
    };

    allDailyHrsReportData = [...allDailyHrsReportData, bfData];

    allDailyHrsReportData = [
      ...allDailyHrsReportData,
      ...data.multipleFlyingHoursReportViewModel.dailyHrsReportDataModelList,
    ];

    if (listLen % 20 !== 0) {
      const remaining = 20 - (listLen % 20);
      const emptyObjs = Array.from({ length: remaining }, () => ({}));
      allDailyHrsReportData = [...allDailyHrsReportData, ...emptyObjs];
    }
    // Total Data
    const { total } = data.multipleFlyingHoursReportViewModel;
    const totalData = {
      total: "Total",
      noOfLanding: total.noOfLanding,
      totalAirTime: total.totalAirTime,
      grandTotalAirTime: total.grandTotalAirTime,
      grandTotalLanding: total.grandTotalLanding,
      engineOil1: total.engineOil1,
      engineOil2: total.engineOil2,
      apuOil: total.apuOil,
    };
    allDailyHrsReportData = [...allDailyHrsReportData, totalData];

    return allDailyHrsReportData;
  }

  let fixedTableRow = 20;
  let dataTableRow = data.pageData?.model?.length;
  let remainingTableRow = fixedTableRow - dataTableRow;
  if (data.pageData?.model?.length > 0) {
    for (let i = 0; i < remainingTableRow; i++) {
      data.pageData?.model?.push({});
    }
  }
  const getAllAircraftList = async () => {
    const { data } = await AircraftService.getAllAircraftList();
    setAircrafts(data);
  };

  useEffect(() => {
    (async () => {
      await getAllAircraftList();
    })();
  }, []);

  const resetFilter = () => {
    formData.resetFields();
    setData({ ...initialState });
  };

  const TITLE = "Daily Flying Hours And Cycles";

  const handleSubmit = useCallback(
    async (values) => {
      const convertedDate = {
        ...values,
        date: values?.date.format(DATE_FORMATTER) || null,
      };

      try {
        toggleSubmitting();
        const { data } = await API.post(
          `aircraft-maintenance-log/daily-flying-hrs?page=${currentPage}&size=20`,
          convertedDate
        );
        setData({ ...data });

        if (data?.pageData == null) {
          return;
        }

        setCurrentPage(data?.pageData?.currentPage);
        setTotalPages(data?.pageData?.totalPages);
      } catch (e) {
      } finally {
        toggleSubmitting();
      }
    },
    [currentPage, toggleSubmitting]
  );

  useEffect(() => {
    (async () => {
      await handleSubmit(formData.getFieldsValue(true));
    })();
  }, [handleSubmit, formData]);

  const dailyFlyingHoursCyclesRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: dailyFlyingHoursCyclesRef.current,
    filename: "Daily flying hours and cycle report",
    sheet: "dailyFlyingHoursCyclesReport",
  });

  const downloadDailyFlyingHoursCyclesExcel = async () => {
    if (!aircraftId) return;
    onDownload();
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
      <Permission
        permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_DAILY_FLYING_HOURS_AND_CYCLE_SEARCH"
        showFallback
      >
        <ARMCard
          title={
            <Row justify="space-between">
              <Col>{TITLE}</Col>
              <Col>
                <Space>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={downloadDailyFlyingHoursCyclesExcel}
                  >
                    {" "}
                    Export excel{" "}
                  </Button>
                  <Button
                    style={{backgroundColor:"#04aa6d",color:"white"}}
                    icon={<PrinterOutlined />}
                    onClick={() => {
                      setShowModal(true);
                    }}
                  >
                    Print
                  </Button>
                  <ARMButton>
                    <Modal
                      className="modal"
                      title="Are you sure want to print?"
                      style={{
                        top: 20,
                        height: "60px",
                      }}
                      mask={false}
                      onOk={() => setShowModal(false)}
                      onCancel={() => setShowModal(false)}
                      centered
                      visible={showModal}
                      width={770}
                      footer={null}
                    >
                      <Col span={24}>
                        <Form
                          form={form}
                          name="filter-form"
                        >
                          <Row gutter={20}>
                            <Col xs={24} md={8}>
                              <Form.Item
                                rules={[
                                  {
                                    required: true,
                                    message: "Required",
                                  },
                                ]}
                                name="aircrafId"
                              >
                                <Select placeholder="Select Model Type">
                                  <Select.Option value="">
                                    ---Select---
                                  </Select.Option>
                                  {aircrafts.map((type) => (
                                    <Select.Option
                                      value={type.aircraftId}
                                      key={type.aircraftId}
                                    >
                                      {type.aircraftName}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                              <Form.Item
                                rules={[
                                  {
                                    required: true,
                                    message: "Date range is required",
                                  },
                                ]}
                                name="dateRange"
                              >
                                <DatePicker.RangePicker
                                  format="DD-MM-YYYY"
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                              <Form.Item>
                                <ReactToPrint
                                  content={() => reportRef.current}
                                  copyStyles={true}
                                  pageStyle={printStyle}
                                  trigger={() => {
                                    return (
                                      <SuccessButton
                                        type="primary"
                                        icon={<PrinterOutlined />}
                                        htmlType="submit"
                                      >
                                        Print
                                      </SuccessButton>
                                    );
                                  }}
                                  onBeforeGetContent={fetchPrintData}
                                  onAfterPrint={() => {
                                    setShowModal(false);
                                    setDatas([]);
                                    form.resetFields()
                                  }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Form>
                      </Col>
                    </Modal>
                  </ARMButton>
                </Space>
              </Col>
            </Row>
          }
        >
          <Form
            form={formData}
            name="filter-form"
            initialValues={{ aircraftId: "", date: "" }}
            // onFinish={handleSubmit}
            onFinish={(formValues) => handleSubmit(formValues, formData)}
          >
            <Row gutter={20}>
              <Col xs={24} md={6}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Required",
                    },
                  ]}
                  name="aircraftId"
                >
                  <Select placeholder="Select Model Type">
                    <Select.Option value="">---Select---</Select.Option>
                    {aircrafts.map((type) => (
                      <Select.Option
                        value={type.aircraftId}
                        key={type.aircraftId}
                      >
                        {type.aircraftName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={6}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Required",
                    },
                  ]}
                  name="date"
                >
                  <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col xs={24} md={6}>
                <Form.Item>
                  <Space>
                    <ARMButton
                      loading={submitting}
                      size="middle"
                      type="primary"
                      htmlType="submit"
                    >
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

          <ServiceBulletin ref={reportRef}>
            <Row>
              <Col span={24}>
                <Row justify="space-between" className="first">
                  <Col>
                    <img src={logo} alt="" width={110} />
                  </Col>
                  <Col>
                    <Typography.Title level={4} className="aircraft-titles">
                      <b>
                        {data?.dailyHrsReportAircraftModel?.aircraftName &&
                        data?.dailyHrsReportAircraftModel?.airframeSerial
                          ? `${data.dailyHrsReportAircraftModel?.aircraftName} : MSN-${data?.dailyHrsReportAircraftModel?.airframeSerial}`
                          : "REG : SERIAL"}
                      </b>
                    </Typography.Title>
                  </Col>
                  <Col style={{ fontSize: "10px", marginRight: "20px" }}>
                    <Typography.Text>Form: CAME-012</Typography.Text> <br />
                    <Typography.Text>ISSUE: INITIAL</Typography.Text> <br />
                    <Typography.Text>DATE: 19-01-2022</Typography.Text>
                  </Col>
                </Row>
                <Row justify="center" className="first">
                  <Col span={24}>
                    <Typography.Title
                      className="dfhcd-heading"
                      style={{ textAlign: "center" }}
                      level={4}
                      type="secondary"
                    >
                      D A I L Y &nbsp; F L Y I N G &nbsp; H O U R S &nbsp; &amp;
                      &nbsp; C Y C &nbsp; D E S C R I P T I O N
                    </Typography.Title>
                  </Col>

                  <Col span={24}>
                    <Row justify="space-between">
                      <Col style={{ marginLeft: "90px" }}>
                        <Typography.Title
                          underline
                          level={5}
                          type="secondary"
                          className="dfhc-titles"
                        >
                          AIRCRAFT IN BANGLADESH
                        </Typography.Title>

                        <Row justify="space-between" align="middle">
                          <Typography.Title
                            level={5}
                            type="secondary"
                            className="dfhc-titles"
                          >
                            HOURS <br />
                            <Badge
                              className="badges"
                              overflowCount={Number.MAX_VALUE}
                              count={DailyFlyingHourFormat(
                                data.dailyHrsReportAircraftModel?.bdTotalTime
                              )}
                              showZero
                              style={{
                                backgroundColor: "#C0C0C0",
                                color: "#0000FF",
                                borderRadius: 0,
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            />
                          </Typography.Title>

                          <Typography.Title
                            style={{ marginTop: "0px" }}
                            level={5}
                            type="secondary"
                            className="dfhc-titles"
                          >
                            CYC <br />
                            <Badge
                              className="badges"
                              overflowCount={Number.MAX_VALUE}
                              count={
                                data.dailyHrsReportAircraftModel
                                  ?.bdTotalCycle &&
                                CycleFormat(
                                  data.dailyHrsReportAircraftModel?.bdTotalCycle
                                )
                              }
                              showZero
                              style={{
                                backgroundColor: "#C0C0C0",
                                color: "#0000FF",
                                borderRadius: 0,
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            />
                          </Typography.Title>
                        </Row>
                      </Col>

                      <Col>
                        <Row>
                          <Col style={{ marginRight: "40px" }}>
                            <Typography.Title
                              level={5}
                              type="secondary"
                              underline
                              className="dfhc-titles"
                            >
                              TOTAL AIRCRAFT
                            </Typography.Title>

                            <Row justify="space-between" align="middle">
                              <Typography.Title
                                level={5}
                                type="secondary"
                                className="dfhc-titles"
                              >
                                TAT <br />
                                <Badge
                                  className="badges"
                                  overflowCount={Number.MAX_VALUE}
                                  count={DailyFlyingHourFormat(
                                    data.dailyHrsReportAircraftModel
                                      ?.airFrameTotalTime
                                  )}
                                  showZero
                                  style={{
                                    backgroundColor: "#C0C0C0",
                                    color: "#0000FF",
                                    borderRadius: 0,
                                    textAlign: "center",
                                    fontWeight: "bold",
                                  }}
                                />
                              </Typography.Title>

                              <Typography.Title
                                style={{ marginTop: "0px" }}
                                level={5}
                                type="secondary"
                                className="dfhc-titles"
                              >
                                TCY <br />
                                <Badge
                                  className="badges"
                                  overflowCount={Number.MAX_VALUE}
                                  count={
                                    data.dailyHrsReportAircraftModel
                                      ?.airframeTotalCycle &&
                                    CycleFormat(
                                      data.dailyHrsReportAircraftModel
                                        ?.airframeTotalCycle
                                    )
                                  }
                                  style={{
                                    backgroundColor: "#C0C0C0",
                                    color: "#0000FF",
                                    borderRadius: 0,
                                    textAlign: "center",
                                    fontWeight: "bold",
                                  }}
                                />
                              </Typography.Title>
                            </Row>
                          </Col>
                          <Col>
                            <Typography.Title
                              level={5}
                              type="secondary"
                              underline
                              className="dfhc-titles"
                            >
                              "A CHK" REMN. HRS
                            </Typography.Title>

                            <Row justify="space-between" align="middle">
                              <Typography.Title
                                level={5}
                                type="secondary"
                                className="dfhc-titles"
                              >
                                HRS <br />
                                <Badge
                                  className="badges"
                                  overflowCount={Number.MAX_VALUE}
                                  count={DailyFlyingHourFormat(
                                    data.dailyHrsReportAircraftModel
                                      ?.acheckTimeRemainHours
                                  )}
                                  style={{
                                    backgroundColor: "#C0C0C0",
                                    color: "#0000FF",
                                    borderRadius: 0,
                                    textAlign: "center",
                                    fontWeight: "bold",
                                  }}
                                />
                              </Typography.Title>
                              <Typography.Title
                                style={{ marginTop: "0px" }}
                                level={5}
                                type="secondary"
                                className="dfhc-titles"
                              >
                                DAYS <br />
                                <Badge
                                  className="badges"
                                  overflowCount={Number.MAX_VALUE}
                                  count={
                                    data.dailyHrsReportAircraftModel
                                      ?.acheckTimeRemainDays &&
                                    data.dailyHrsReportAircraftModel
                                      ?.acheckTimeRemainDays
                                  }
                                  style={{
                                    backgroundColor: "#C0C0C0",
                                    color: "#0000FF",
                                    borderRadius: 0,
                                    textAlign: "center",
                                    fontWeight: "bold",
                                  }}
                                />
                              </Typography.Title>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Typography.Text
                      style={{
                        float: "right",
                        marginRight: "40px",
                        fontSize: "10px",
                        color: "#0000FF",
                      }}
                    >
                      <b>OIL UPLIFT</b>
                    </Typography.Text>
                  </Col>
                </Row>
                <Row className="table-responsive">
                  <ResponsiveTable
                    ref={dailyFlyingHoursCyclesRef}
                    className="first"
                  >
                    <ARMTable>
                      <thead>
                        <tr
                          style={{
                            borderTop: "2px solid #808080",
                            borderBottom: "2px solid #808080",
                          }}
                        >
                          <th>DATE</th>
                          <th>ATL NO</th>
                          <th>SECTOR</th>
                          <th>FLT NO.</th>
                          <th>BLOCK OFF</th>
                          <th>BLOCK ON</th>
                          <th>BLOCK TIME</th>
                          <th>T/OFF</th>
                          <th>LDG</th>
                          <th>CYC</th>
                          <th>SECTOR HRS.</th>
                          <th>TAT</th>
                          <th>TCY</th>
                          <th>ENG#1</th>
                          <th>ENG#2</th>
                          <th>APU</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.pageData?.model?.length > 0 && (
                          <tr style={{ color: "#0000FF" }}>
                            <td>
                              <b>BF</b>
                            </td>
                            {empty10Column.map((a) => (
                              <td></td>
                            ))}
                            <td style={{ backgroundColor: "#CCFFCC" }}>
                              <b>
                                {data?.dailyHrsReportBfDto?.grandTotalAirTime &&
                                  (formatTimeValue(
                                    data?.dailyHrsReportBfDto?.grandTotalAirTime
                                  ) ||
                                    0)}
                              </b>
                            </td>
                            <td style={{ backgroundColor: "#CCFFCC" }}>
                              <b>
                                {data?.dailyHrsReportBfDto?.grandTotalLanding ||
                                  0}
                              </b>
                            </td>
                            {empty3Column.map((a) => (
                              <td></td>
                            ))}
                          </tr>
                        )}
                        {data.pageData?.model?.length > 0 &&
                          data.pageData?.model?.map((report, index) => (
                            <tr
                              key={index}
                              style={{ height: "30px", color: "#0000FF" }}
                            >
                              <td className="date-row">
                                {report.date &&
                                  moment(`${report.date}`, "YYYY-MM-DD").format(
                                    "DD-MMM-YY"
                                  )}
                              </td>
                              <td>{report.pageNo}</td>
                              <td>{report.sector ? report.sector : ""}</td>
                              <td>{report.flightNo}</td>
                              <td>{report.blockOffTime?.slice(0, 5)}</td>
                              <td>{report.blockOnTime?.slice(0, 5)}</td>
                              <td>
                                {report.blockTime &&
                                  formatSingleTimeValue(report.blockTime)}
                              </td>
                              <td>{report.takeOffTime?.slice(0, 5)}</td>
                              <td>{report.landingTime?.slice(0, 5)}</td>
                              <td>{report.noOfLanding}</td>
                              <td style={{ color: "red" }}>
                                {report?.airTime &&
                                  formatSingleTimeValue(report.airTime)}
                              </td>
                              <td
                                style={{
                                  backgroundColor: "#CCFFCC",
                                  color: "red",
                                }}
                              >
                                {report.grandTotalAirTime &&
                                  formatSingleTimeValue(
                                    report.grandTotalAirTime
                                  )}
                              </td>
                              <td
                                style={{
                                  backgroundColor: "#CCFFCC",
                                  color: "red",
                                }}
                              >
                                {report.grandTotalLanding}
                              </td>
                              <td>{report.engineOil1}</td>
                              <td>{report.engineOil2}</td>
                              <td>{report.apuOil}</td>
                            </tr>
                          ))}

                        {data.pageData?.model?.length > 0 && (
                          <tr
                            style={{
                              borderTop: "2px solid",
                              borderBottom: "2px solid",
                              fontWeight: "bold",
                            }}
                          >
                            <td style={{ color: "#0000FF" }}>TOTAL</td>
                            {empty8Column.map((c) => (
                              <td></td>
                            ))}
                            <td style={{ color: "#0000FF" }}>
                              {data.total?.noOfLanding}
                            </td>
                            <td style={{ color: "red" }}>
                              {data.total?.totalAirTime &&
                                formatTimeValue(data.total?.totalAirTime)}
                            </td>
                            <td
                              style={{
                                backgroundColor: "#CCFFCC",
                                color: "red",
                              }}
                            >
                              {data.total?.grandTotalAirTime &&
                                formatTimeValue(data.total?.grandTotalAirTime)}
                            </td>
                            <td
                              style={{
                                backgroundColor: "#CCFFCC",
                                color: "red",
                              }}
                            >
                              {data.total?.grandTotalLanding}
                            </td>
                            <td style={{ color: "#0000FF" }}>
                              {data.total?.engineOil1}
                            </td>
                            <td style={{ color: "#0000FF" }}>
                              {data.total?.engineOil2}
                            </td>
                            <td style={{ color: "#0000FF" }}>
                              {data.total?.apuOil}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </ARMTable>
                  </ResponsiveTable>
                </Row>

                <ResponsiveTable className="second">
                  <ARMTable>
                    <table
                      className="report-container"
                      style={{ width: "100%" }}
                    >
                      {
                        datas?.map((firstObject) => {
                          return (
                            <>
                              <div className="report-header">
                                <tr>
                                  <td className="report-header-cell border-none">
                                    <div style={{margin:"0px",padding:"0px"}}>
                                      <Col span={24}>
                                        <Row justify="space-between">
                                          <Col>
                                            <img
                                              src={logo}
                                              alt=""
                                              width={110}
                                            />
                                          </Col>
                                          <Col>
                                            <Typography.Title
                                              level={4}
                                              className="aircraft-titles"
                                            >
                                              <b>
                                                {firstObject
                                                  ?.multipleFlyingHoursReportViewModel
                                                  ?.dailyHrsReportAircraftModel
                                                  ?.aircraftName &&
                                                firstObject
                                                  ?.multipleFlyingHoursReportViewModel
                                                  ?.dailyHrsReportAircraftModel
                                                  ?.airframeSerial
                                                  ? `${firstObject.multipleFlyingHoursReportViewModel?.dailyHrsReportAircraftModel?.aircraftName} : MSN-${firstObject?.multipleFlyingHoursReportViewModel?.dailyHrsReportAircraftModel?.airframeSerial}`
                                                  : "REG : SERIAL"}
                                              </b>
                                            </Typography.Title>
                                          </Col>
                                          <Col
                                            style={{
                                              fontSize: "10px",
                                              marginRight: "20px",
                                              textAlign:"left"
                                            }}
                                          >
                                            <Typography.Text>
                                              Form: CAME-012
                                            </Typography.Text>{" "}
                                            <br />
                                            <Typography.Text>
                                              ISSUE: INITIAL
                                            </Typography.Text>{" "}
                                            <br />
                                            <Typography.Text>
                                              DATE: 19-01-2022
                                            </Typography.Text>
                                          </Col>
                                        </Row>
                                        {/* dynamic header start */}
                                        <Row justify="center">
                                          <Col span={24}>
                                            <Typography.Title
                                              className="dfhcd-heading"
                                              style={{ textAlign: "center" }}
                                              level={4}
                                              type="secondary"
                                            >
                                              D A I L Y &nbsp; F L Y I N G
                                              &nbsp; H O U R S &nbsp; &amp;
                                              &nbsp; C Y C &nbsp; D E S C R I P
                                              T I O N
                                            </Typography.Title>
                                          </Col>

                                          <Col span={24}>
                                            <Row justify="space-between">
                                              <Col
                                                style={{ marginLeft: "90px" }}
                                              >
                                                <Typography.Title
                                                  underline
                                                  level={5}
                                                  type="secondary"
                                                  className="dfhc-titles"
                                                >
                                                  AIRCRAFT IN BANGLADESH
                                                </Typography.Title>

                                                <Row
                                                  justify="space-between"
                                                  align="middle"
                                                >
                                                  <Typography.Title
                                                    level={5}
                                                    type="secondary"
                                                    className="dfhc-titles"
                                                  >
                                                    HOURS <br />
                                                    <Badge
                                                      className="badges"
                                                      overflowCount={
                                                        Number.MAX_VALUE
                                                      }
                                                      count={DailyFlyingHourFormat(
                                                        firstObject
                                                          ?.multipleFlyingHoursReportViewModel
                                                          ?.dailyHrsReportAircraftModel
                                                          ?.bdTotalTime
                                                      )}
                                                      showZero
                                                      style={{
                                                        backgroundColor:
                                                          "#C0C0C0",
                                                        color: "#0000FF",
                                                        borderRadius: 0,
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                      }}
                                                    />
                                                  </Typography.Title>

                                                  <Typography.Title
                                                    style={{ marginTop: "0px" }}
                                                    level={5}
                                                    type="secondary"
                                                    className="dfhc-titles"
                                                  >
                                                    CYC <br />
                                                    <Badge
                                                      className="badges"
                                                      overflowCount={
                                                        Number.MAX_VALUE
                                                      }
                                                      count={
                                                        firstObject
                                                          ?.multipleFlyingHoursReportViewModel
                                                          ?.dailyHrsReportAircraftModel
                                                          ?.bdTotalCycle &&
                                                        CycleFormat(
                                                          firstObject
                                                            ?.multipleFlyingHoursReportViewModel
                                                            ?.dailyHrsReportAircraftModel
                                                            ?.bdTotalCycle
                                                        )
                                                      }
                                                      showZero
                                                      style={{
                                                        backgroundColor:
                                                          "#C0C0C0",
                                                        color: "#0000FF",
                                                        borderRadius: 0,
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                      }}
                                                    />
                                                  </Typography.Title>
                                                </Row>
                                              </Col>

                                              <Col>
                                                <Row>
                                                  <Col
                                                    style={{
                                                      marginRight: "40px",
                                                    }}
                                                  >
                                                    <Typography.Title
                                                      level={5}
                                                      type="secondary"
                                                      underline
                                                      className="dfhc-titles"
                                                    >
                                                      TOTAL AIRCRAFT
                                                    </Typography.Title>

                                                    <Row
                                                      justify="space-between"
                                                      align="middle"
                                                    >
                                                      <Typography.Title
                                                        level={5}
                                                        type="secondary"
                                                        className="dfhc-titles"
                                                      >
                                                        TAT <br />
                                                        <Badge
                                                          className="badges"
                                                          overflowCount={
                                                            Number.MAX_VALUE
                                                          }
                                                          count={DailyFlyingHourFormat(
                                                            firstObject
                                                              ?.multipleFlyingHoursReportViewModel
                                                              ?.dailyHrsReportAircraftModel
                                                              ?.airFrameTotalTime
                                                          )}
                                                          showZero
                                                          style={{
                                                            backgroundColor:
                                                              "#C0C0C0",
                                                            color: "#0000FF",
                                                            borderRadius: 0,
                                                            textAlign: "center",
                                                            fontWeight: "bold",
                                                          }}
                                                        />
                                                      </Typography.Title>

                                                      <Typography.Title
                                                        style={{
                                                          marginTop: "0px",
                                                        }}
                                                        level={5}
                                                        type="secondary"
                                                        className="dfhc-titles"
                                                      >
                                                        TCY <br />
                                                        <Badge
                                                          className="badges"
                                                          overflowCount={
                                                            Number.MAX_VALUE
                                                          }
                                                          count={
                                                            firstObject
                                                              ?.multipleFlyingHoursReportViewModel
                                                              ?.dailyHrsReportAircraftModel
                                                              ?.airframeTotalCycle &&
                                                            CycleFormat(
                                                              firstObject
                                                                ?.multipleFlyingHoursReportViewModel
                                                                ?.dailyHrsReportAircraftModel
                                                                ?.airframeTotalCycle
                                                            )
                                                          }
                                                          style={{
                                                            backgroundColor:
                                                              "#C0C0C0",
                                                            color: "#0000FF",
                                                            borderRadius: 0,
                                                            textAlign: "center",
                                                            fontWeight: "bold",
                                                          }}
                                                        />
                                                      </Typography.Title>
                                                    </Row>
                                                  </Col>
                                                  <Col>
                                                    <Typography.Title
                                                      level={5}
                                                      type="secondary"
                                                      underline
                                                      className="dfhc-titles"
                                                    >
                                                      "A CHK" REMN. HRS
                                                    </Typography.Title>

                                                    <Row
                                                      justify="space-between"
                                                      align="middle"
                                                    >
                                                      <Typography.Title
                                                        level={5}
                                                        type="secondary"
                                                        className="dfhc-titles"
                                                      >
                                                        HRS <br />
                                                        <Badge
                                                          className="badges"
                                                          overflowCount={
                                                            Number.MAX_VALUE
                                                          }
                                                          count={DailyFlyingHourFormat(
                                                            firstObject
                                                              ?.multipleFlyingHoursReportViewModel
                                                              ?.dailyHrsReportAircraftModel
                                                              ?.acheckTimeRemainHours
                                                          )}
                                                          style={{
                                                            backgroundColor:
                                                              "#C0C0C0",
                                                            color: "#0000FF",
                                                            borderRadius: 0,
                                                            textAlign: "center",
                                                            fontWeight: "bold",
                                                          }}
                                                        />
                                                      </Typography.Title>
                                                      <Typography.Title
                                                        style={{
                                                          marginTop: "0px",
                                                        }}
                                                        level={5}
                                                        type="secondary"
                                                        className="dfhc-titles"
                                                      >
                                                        DAYS <br />
                                                        <Badge
                                                          className="badges"
                                                          overflowCount={
                                                            Number.MAX_VALUE
                                                          }
                                                          count={
                                                            firstObject
                                                              ?.multipleFlyingHoursReportViewModel
                                                              ?.dailyHrsReportAircraftModel
                                                              ?.acheckTimeRemainDays &&
                                                            firstObject
                                                              ?.multipleFlyingHoursReportViewModel
                                                              ?.dailyHrsReportAircraftModel
                                                              ?.acheckTimeRemainDays
                                                          }
                                                          style={{
                                                            backgroundColor:
                                                              "#C0C0C0",
                                                            color: "#0000FF",
                                                            borderRadius: 0,
                                                            textAlign: "center",
                                                            fontWeight: "bold",
                                                          }}
                                                        />
                                                      </Typography.Title>
                                                    </Row>
                                                  </Col>
                                                </Row>
                                              </Col>
                                            </Row>
                                            <Typography.Text
                                              style={{
                                                float: "right",
                                                marginRight: "40px",
                                                fontSize: "10px",
                                                color: "#0000FF",
                                                marginTop:"0px",
                                                paddingTop:"0px"
                                              }}
                                            >
                                              <b>OIL UPLIFT</b>
                                            </Typography.Text>
                                          </Col>
                                        </Row>
                                        {/* dynamic header end */}
                                      </Col>
                                    </div>
                                  </td>
                                </tr>
                              </div>

                              <Col span={24}>
                                <thead>
                                  <tr
                                    style={{
                                      borderTop: "2px solid #808080",
                                      borderBottom: "2px solid #808080",
                                      fontSize: "12px",
                                    }}
                                  >
                                    <th className="date">DATE</th>
                                    <th>ATL NO</th>
                                    <th>SECTOR</th>
                                    <th>FLT NO.</th>
                                    <th>BLOCK OFF</th>
                                    <th>BLOCK ON</th>
                                    <th>BLOCK <br/> TIME</th>
                                    <th>T/OFF</th>
                                    <th>LDG</th>
                                    <th>CYC</th>
                                    <th>SECTOR <br/> HRS.</th>
                                    <th>TAT</th>
                                    <th>TCY</th>
                                    <th>ENG#1</th>
                                    <th>ENG#2</th>
                                    <th>APU</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {
                                    normalizeTestData(firstObject)?.map(
                                      (report, index) => {
                                        if (report.hasOwnProperty("bfTitle")) {
                                          return (
                                            <tr style={{ color: "#0000FF" }}>
                                              <td>
                                                <b>BF</b>
                                              </td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td
                                                style={{
                                                  backgroundColor: "#CCFFCC",
                                                }}
                                              >
                                                <b>
                                                  {report.grandTotalAirTime &&
                                                    (formatTimeValue(
                                                      report.grandTotalAirTime
                                                    ) ||
                                                      0)}
                                                </b>
                                              </td>
                                              <td
                                                style={{
                                                  backgroundColor: "#CCFFCC",
                                                }}
                                              >
                                                <b>
                                                  {report.grandTotalLanding ||
                                                    0}
                                                </b>
                                              </td>

                                              <td></td>
                                              <td></td>
                                              <td></td>
                                            </tr>
                                          );
                                        } else if (
                                          report.hasOwnProperty("total")
                                        ) {
                                          return (
                                            <tr
                                              style={{
                                                borderTop: "2px solid",
                                                borderBottom: "2px solid",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              <td
                                                style={{
                                                  color: "#0000FF",
                                                  height: "34px",
                                                }}
                                              >
                                                TOTAL
                                              </td>

                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>
                                              <td></td>

                                              <td style={{ color: "#0000FF" }}>
                                                {report.noOfLanding}
                                              </td>
                                              <td style={{ color: "red" }}>
                                                {report.totalAirTime &&
                                                  formatTimeValue(
                                                    report.totalAirTime
                                                  )}
                                              </td>
                                              <td
                                                style={{
                                                  backgroundColor: "#CCFFCC",
                                                  color: "red",
                                                }}
                                              >
                                                {report.grandTotalAirTime &&
                                                  formatTimeValue(
                                                    report.grandTotalAirTime
                                                  )}
                                              </td>
                                              <td
                                                style={{
                                                  backgroundColor: "#CCFFCC",
                                                  color: "red",
                                                }}
                                              >
                                                {report.grandTotalLanding}
                                              </td>
                                              <td style={{ color: "#0000FF" }}>
                                                {report.engineOil1}
                                              </td>
                                              <td style={{ color: "#0000FF" }}>
                                                {report.engineOil2}
                                              </td>
                                              <td style={{ color: "#0000FF" }}>
                                                {report.apuOil}
                                              </td>
                                            </tr>
                                          );
                                        } else {
                                          return (
                                            <tr
                                              key={index}
                                              style={{ color: "#0000FF"}}
                                            >
                                              <td
                                                className="date-row"
                                                style={{
                                                  fontSize: "12px",
                                                  height: "34px",
                                                  width: "40px",
                                                }}
                                              >
                                                {report.date &&
                                                  moment(
                                                    `${report.date}`,
                                                    "YYYY-MM-DD"
                                                  ).format("DD-MMM-YY")}
                                              </td>
                                              <td style={{ fontSize: "12px" }}>
                                                {report.pageNo}
                                              </td>
                                              <td style={{ fontSize: "12px" }}>
                                                {report.sector
                                                  ? report.sector
                                                  : ""}
                                              </td>
                                              <td style={{ fontSize: "12px" }}>
                                                {report.flightNo}
                                              </td>
                                              <td style={{ fontSize: "12px" }}>
                                                {report.blockOffTime?.slice(
                                                  0,
                                                  5
                                                )}
                                              </td>
                                              <td style={{ fontSize: "12px" }}>
                                                {report.blockOnTime?.slice(
                                                  0,
                                                  5
                                                )}
                                              </td>
                                              <td style={{ fontSize: "12px" }}>
                                                {report.blockTime &&
                                                  formatSingleTimeValue(
                                                    report.blockTime
                                                  )}
                                              </td>
                                              <td style={{ fontSize: "12px" }}>
                                                {report.takeOffTime?.slice(
                                                  0,
                                                  5
                                                )}
                                              </td>
                                              <td style={{ fontSize: "12px" }}>
                                                {report.landingTime?.slice(
                                                  0,
                                                  5
                                                )}
                                              </td>
                                              <td style={{ fontSize: "12px" }}>
                                                {report.noOfLanding}
                                              </td>
                                              <td
                                                style={{
                                                  color: "red",
                                                  fontSize: "12px",
                                                }}
                                              >
                                                {report?.airTime &&
                                                  formatSingleTimeValue(
                                                    report.airTime
                                                  )}
                                              </td>
                                              <td
                                                style={{
                                                  backgroundColor: "#CCFFCC",
                                                  color: "red",
                                                  fontSize: "12px",
                                                }}
                                              >
                                                {report.grandTotalAirTime &&
                                                  formatSingleTimeValue(
                                                    report.grandTotalAirTime
                                                  )}
                                              </td>
                                              <td
                                                style={{
                                                  backgroundColor: "#CCFFCC",
                                                  color: "red",
                                                  fontSize: "12px",
                                                }}
                                              >
                                                {report.grandTotalLanding}
                                              </td>
                                              <td style={{ fontSize: "12px" }}>
                                                {report.engineOil1}
                                              </td>
                                              <td style={{ fontSize: "12px" }}>
                                                {report.engineOil2}
                                              </td>
                                              <td style={{ fontSize: "12px" }}>
                                                {report.apuOil}
                                              </td>
                                            </tr>
                                          );
                                        }
                                      }
                                    )}
                                </tbody>

                                <tfoot className="report-footer">
                                  <tr>
                                    <td className="none" colSpan={16}>
                                      data
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan={16}
                                      className="report-footer-cell border-none"
                                    >
                                      <div className="footer-info">
                                        <Row
                                          justify="space-between"
                                          style={{ fontSize: "10px" }}
                                        >
                                          <Col>
                                            <Typography.Text>
                                              Prepared By:{" "}
                                            </Typography.Text>
                                          </Col>
                                          <Col>
                                            Checked by :____________________
                                          </Col>
                                        </Row>
                                      </div>
                                    </td>
                                  </tr>
                                </tfoot>
                              </Col>
                            </>
                          );
                        })}
                    </table>
                  </ARMTable>
                </ResponsiveTable>
                {data.pageData?.model?.length > 0 && (
                  <Row justify="center" className="pagination">
                    <Col style={{ marginTop: 10 }}>
                      <Pagination
                        currentPage={currentPage}
                        onChange={setCurrentPage}
                        total={totalPages * 10}
                      />
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </ServiceBulletin>
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
