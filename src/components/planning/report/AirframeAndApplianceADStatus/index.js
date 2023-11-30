import {
  FilterOutlined,
  PrinterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Col,
  DatePicker,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import React, { createRef, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactToPrint from "react-to-print";
import styled from "styled-components";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import SuccessButton from "../../../common/buttons/SuccessButton";
import CommonLayout from "../../../layout/CommonLayout";
import logo from "../../../../components/images/us-bangla-logo.png";
import { ARMReportTable } from "../ARMReportTable";
import { useAircraftsList } from "../../../../lib/hooks/planning/aircrafts";
import ARMButton from "../../../common/buttons/ARMButton";
import DateTimeConverter from "../../../../converters/DateTimeConverter";
import { useBoolean } from "react-use";
import API from "../../../../service/Api";
import moment from "moment";
import {CalculateTsnTsoTat, formatCycle, formatHour, getFolderPathByMatchedString, pageSerialNo} from "../Common";
import { sleep } from "../../../../lib/common/helpers";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import Permission from "../../../auth/Permission";
import {refreshTaskData} from "../../../../lib/common/refreshTaskData";

const TITLE = "AIRFRAME & APPLIANCE AD STATUS";
const printStyle = `
*{
  font-size: 10px !important;
  overflow: visible !important;
  margin: 0 !important;
  padding: 0 !important;
}
  .table tr th,
  .table tr td{
    border-width: 1px !important;
    border-style: solid !important;
    border-color: #000 !important;
    font-size: 8px !important;
  }
    .first{
      display: none !important;
    }
    .second{
      display: block !important;
      margin: 10px 0 !important;
    }
    table.report-container {
      page-break-after:always!important;
  }
  thead.report-header {
      display:table-header-group!important;
  }
`;
const AirframeAndAppliance = styled.div`
  .border-none {
    border: none;
    visibility: hidden;
  }
  .report-title {
    margin-left: 22%;
    margin-top: -30px;
    margin-bottom: 0px;
  }
  .text-right {
    text-align: right;
  }
  .second {
    display: none;
  }

  @page {
    size: landscape;
  }
`;

const CustomInput = styled(Form.Item)`
  .ant-input-number-input-wrap {
    margin-right: 10px !important;
  }
`;


export const dateFormat = (date) => {
  if (date) {
    return moment(date).format("DD-MMM-YYYY");
  }
  return "N/A";
};

export const dateFormat2 = (date) => {
  if (date) {
    return moment(date).format("DD/MMM/YYYY");
  }
  return "N/A";
};

export default function AirframeAndApplianceADStatus() {
  const [form] = Form.useForm();
  const { allAircrafts, getAllAircrafts } = useAircraftsList();
  const [data, setData] = useState([]);
  const [printData, setPrintData] = useState([]);
  const [aircraftDetails, setAircraftDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [submitting, toggleSubmitting] = useBoolean(false);

  const reportRef = createRef();

  let fixedTableRow = 20;
  let dataTableRow = data?.model?.length;
  let remainingTableRow = fixedTableRow - dataTableRow;
  if (data?.model?.length > 0) {
    for (let i = 0; i < remainingTableRow; i++) {
      data?.model?.push("");
    }
  }

  const handleSubmit = useCallback(
    async (values) => {
      const [fromDate, toDate] = values.dateRange || "";
      const searchValues = {
        aircraftId: values ? values.aircraftId : "",
        isPageable: true,
        fromDate: DateTimeConverter.momentDateToString(fromDate) || "",
        toDate: DateTimeConverter.momentDateToString(toDate) || "",
        thDay: values ? values.thDay : "",
        thHour: values ? values.thHour : "",
        thCycle: values ? values.thCycle : "",
        intervalDay: values ? values.intervalDay : "",
        intervalHour: values ? values.intervalHour : "",
        intervalCycle: values ? values.intervalCycle : "",
      };
      try {
        toggleSubmitting();
        const { data } = await API.post(
          `task-report/ad-report?page=${currentPage}&size=${values.size}`,
          searchValues
        );

        setData(data?.model);
        setCurrentPage(data?.currentPage);
        setTotalPages(data?.totalPages);
      } catch (er) {
      } finally {
        toggleSubmitting();
      }
    },
    [currentPage, toggleSubmitting]
  );



  const fetchPrintData = async () => {
    const dataWithoutPagination = {
      aircraftId: aircraftId,
      isPageable: false,
    };
    try {
      toggleSubmitting();
      const { data } = await API.post(
        `task-report/ad-report`,
        dataWithoutPagination
      );
      setPrintData(data);
      return sleep(1000)
    } catch (er) {
    } finally {
      toggleSubmitting();
    }
  }

  useEffect(() => {
    (async () => {
      await handleSubmit(form.getFieldsValue(true));
    })();
  }, [handleSubmit, form]);

  const aircraftId = Form.useWatch("aircraftId", form);

  const aircraftDetailsByAircraftId = async (aircraftId) => {
    try {
      const { data } = await API.get(
        `task-report/ad-report-title/${aircraftId}`
      );
      setAircraftDetails(data);
    } catch (er) { }
  };
  useEffect(() => {
    if (!aircraftId) {
      return;
    }
    (async () => {
      await aircraftDetailsByAircraftId(aircraftId);
    })();
  }, [aircraftId]);

  const resetFilter = () => {
    form.resetFields();
    setData([])
  };

  useEffect(() => {
    (async () => {
      await getAllAircrafts();
    })();
  }, []);
  const d = new Date();

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
      <Permission permission="PLANNING_SCHEDULE_TASKS_AIRFRAME_AND_APPLIANCE_AD_STATUS_SEARCH" showFallback>
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
                onBeforeGetContent={fetchPrintData}
              />
            </Col>
          </Row>
        }
      >
        <Form form={form} name="filter-form" initialValues={{size:10 }} onFinish={handleSubmit}>
          <Row gutter={20}>
            <Col xs={24} md={4}>
              <Form.Item
                name="aircraftId"
                rules={[
                  {
                    required: true,
                    message: "Aircraft is required ",
                  },
                ]}
              >
                <Select placeholder="Select Aircraft">
                  {allAircrafts?.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.aircraftId}>
                        {item.aircraftName}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item
                rules={[
                  {
                    required: false,
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

            <Col xs={24} md={3}>
              <CustomInput>
                <Form.Item
                  label="Threshold"
                  rules={[
                    {
                      required: false,
                      message: "Threshold hour is required",
                    },
                  ]}
                  name="thHour"
                >
                  <Input type="number" placeholder="Hour" />
                </Form.Item>
              </CustomInput>
            </Col>
            <Col xs={24} md={2}>
              <CustomInput>
                <Form.Item
                  label=""
                  rules={[
                    {
                      required: false,
                      message: "Threshold hour is required",
                    },
                  ]}
                  name="thCycle"
                >
                  <Input type="number" placeholder="Cycle" />
                </Form.Item>
              </CustomInput>
            </Col>

            <Col xs={24} md={2}>
              <CustomInput>
                <Form.Item
                  rules={[
                    {
                      required: false,
                      message: "Threshold hour is required",
                    },
                  ]}
                  name="thDay"
                >
                  <Input type="number" placeholder="Day" />
                </Form.Item>
              </CustomInput>
            </Col>
            <Col xs={24} md={3}>
              <Form.Item
                label="Interval"
                rules={[
                  {
                    required: false,
                    message: "Interval hour is required",
                  },
                ]}
                name="intervalHour"
              >
                <Input type="number" placeholder="Hour" />
              </Form.Item>
            </Col>
            <Col xs={24} md={2}>
              <CustomInput>
                <Form.Item
                  label=""
                  rules={[
                    {
                      required: false,
                      message: "Interval cycle is required",
                    },
                  ]}
                  name="intervalCycle"
                >
                  <Input type="number" placeholder="Cycle" />
                </Form.Item>
              </CustomInput>
            </Col>

            <Col xs={24} md={2}>
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Interval day is required",
                  },
                ]}
                name="intervalDay"
              >
                <Input type="number" placeholder="Day" />
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item name="size" label="Page Size">
                <Select id="antSelect" defaultValue={10}>
                  <Select.Option value="10">10</Select.Option>
                  <Select.Option value="20">20</Select.Option>
                  <Select.Option value="30">30</Select.Option>
                  <Select.Option value="40">40</Select.Option>
                  <Select.Option value="50">50</Select.Option>
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
        <Row>
          <Col xs={24} md={24}>
            <ARMButton
                onClick={refreshTaskData}
                style={{
                  marginTop: "6px",
                  float: "right",
                }}
                size="medium"
                type="primary"
                htmlType="submit"
            >
              {"Refresh"}
            </ARMButton>
          </Col>
        </Row>
        <AirframeAndAppliance ref={reportRef}>
          <Row>
            <Col span={24} className="first">
              <Row justify="space-between">
                <Col>
                  <img src={logo} alt="" width={110} />
                </Col>
                <Col
                  style={{
                    fontSize: "8px",
                    fontWeight: "bold",
                    marginRight: "80px",
                    marginBottom: "10px",
                  }}
                >
                  <Typography.Text>Form: CAME-011</Typography.Text> <br />
                  <Typography.Text>ISSUE: INITIAL</Typography.Text> <br />
                  <Typography.Text>DATE: 19-01-2022</Typography.Text>
                </Col>
              </Row>
            </Col>
          </Row>
          <Typography.Title className="report-title first" level={5}>
            ATR72-212A AIRFRAME &amp; APPLIANCE AD STATUS
          </Typography.Title>
          <ResponsiveTable className="first">
            <ARMReportTable>
              <table className="table" style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <th colSpan={4} className="border-none"></th>
                    <th colSpan={3} className="text-right">
                      AIRCRAFT REGN.
                    </th>
                    <th colSpan={2}>{aircraftDetails?.aircraftRegn}</th>
                    <th className="border-none"></th>
                    <th>DATE</th>
                    <th>TAT</th>
                    <th>TAC</th>
                  </tr>
                  <tr>
                    <th colSpan={4} className="border-none"></th>
                    <th colSpan={3} className="text-right">
                      MANUFACTURER S/N
                    </th>
                    <th colSpan={2}>{aircraftDetails?.manufacturerSerialNo}</th>
                    <th className="border-none"></th>
                    <th>{dateFormat(aircraftDetails?.updatedTime)}</th>
                    <th>
                      {CalculateTsnTsoTat(aircraftDetails?.totalAirframeTime)}{" "}
                    </th>
                    <th> {aircraftDetails?.totalAirframeCycle}</th>
                  </tr>
                  <tr>
                    <th colSpan={4} className="border-none"></th>
                    <th colSpan={3} className="text-right">
                      LINE NO.
                    </th>
                    <th colSpan={2}>N/A</th>
                    <th className="border-none"></th>
                  </tr>
                  <tr>
                    <th colSpan={4} className="border-none"></th>
                    <th colSpan={3} className="text-right">
                      EFF. CODE
                    </th>
                    <th colSpan={2}>N/A</th>
                    <th className="border-none"></th>
                  </tr>

                  <tr>
                    <th rowSpan={2}>
                      SL <br /> NO
                    </th>
                    <th rowSpan={2}>AD No.</th>
                    <th rowSpan={2}>SB No.</th>
                    <th rowSpan={2}>DESCRIPTION</th>
                    <th rowSpan={2}>
                      EFFECTIVE <br /> DATE
                    </th>
                    <th rowSpan={2}>THRESHOLD</th>
                    <th rowSpan={2}>
                      APPLICAB <br /> ILITY
                    </th>
                    <th rowSpan={2}>STATUS</th>
                    <th rowSpan={2}>INTERVAL</th>
                    <th rowSpan={2}>LAST DONE</th>
                    <th rowSpan={2}>NEXT DUE</th>
                    <th rowSpan={2}>REMAINING</th>
                    <th rowSpan={2}>REMARKS</th>
                  </tr>

                  <tr>
                  </tr>
                  {data?.map((item, index) => (
                    <tr key={index}>
                      <td>{pageSerialNo(currentPage, index + 1)}</td>
                        <td width="20%" onClick={() => {
                            getFolderPathByMatchedString(item?.adNo)
                        }}   style={{cursor: 'pointer', textDecoration: "underline"}}>
                            {item?.adNo}
                        </td>
                      <td width="5%"  className='newLineInRow'>{item?.sbNo}</td>
                      <td width="20%" className='newLineInRow'>
                        {item?.description ? item?.description.trim() : "N/A"}
                      </td>
                      <td width="8%">{dateFormat(item?.effectiveDate)}</td>
                      <td>
                        {formatHour(item?.thresholdHour, item?.isApuControl)}{" "}
                        <br />
                        {formatCycle(
                          item?.thresholdCycle,
                          item?.isApuControl
                        )}{" "}
                        <br />
                        {item?.thresholdDay
                          ? item?.thresholdDay + " DY"
                          : "N/A"}
                      </td>
                      <td>{item?.applicability == 0 ? "NO" : "YES"}</td>
                      <td>{item?.status}</td>
                      <td>
                        {formatHour(item?.intervalHour, item?.isApuControl)}{" "}
                        <br />
                        {formatCycle(
                          item?.intervalCycle,
                          item?.isApuControl
                        )}{" "}
                        <br />
                        {item?.intervalDay ? item?.intervalDay + " DY" : "N/A"}
                      </td>
                      <td width="8%">
                        {formatHour(
                          item?.lastDoneFlyingHour,
                          item?.isApuControl
                        )}{" "}
                        <br />
                        {formatCycle(
                          item?.lastDoneFlyingCycle,
                          item?.isApuControl
                        )}{" "}
                        <br />
                        {dateFormat(item?.lastDoneDate)}
                      </td>
                      <td width="8%">
                        {formatHour(
                          item?.nextDueFlyingHour,
                          item?.isApuControl
                        )}{" "}
                        <br />
                        {formatCycle(
                          item?.nextDueFlyingCycle,
                          item?.isApuControl
                        )}{" "}
                        <br />
                        {dateFormat(item?.nextDueDate)}
                      </td>
                      <td width="8%">
                        {formatHour(
                          item?.remainingFlyingHour,
                          item?.isApuControl
                        )}{" "}
                        <br />
                        {formatCycle(
                          item?.remainingFlyingCycle,
                          item?.isApuControl
                        )}{" "}
                        <br />
                        {item?.remainingDay
                          ? item?.remainingDay + " DY"
                          : "N/A"}
                      </td>
                      <td width="20%">{item?.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ARMReportTable>
          </ResponsiveTable>

          <ResponsiveTable className="second">
            <ARMReportTable>
              <table className="report-container" style={{ width: "100%" }}>
                <thead className="report-header">
                  <tr>
                    <td className="report-header-cell" colSpan={13} style={{ border: "none" }}>
                      <div className="header-info">
                        <Col span={24}>
                          <Row>
                            <Col span={24}>
                              <Row justify="space-between">
                                <Col>
                                  <img src={logo} alt="" width={110} />
                                </Col>
                                <Col style={{ fontSize: "10px" }}>
                                  <Typography.Text>Form: CAME-027</Typography.Text>
                                  <br />
                                  <Typography.Text>ISSUE INITIAL</Typography.Text>
                                  <br />
                                  <Typography.Text>DATE 19 JAN 2022</Typography.Text>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row justify="center">
                            <Col span={24} style={{ textAlign: "center" }}>
                              <Typography.Title
                                level={3}
                                style={{ padding: 0, margin: 0 }}
                              >
                                {" "}
                                ATR72-212A AIRFRAME &amp; APPLIANCE AD STATUS
                              </Typography.Title>
                            </Col>
                          </Row>
                        </Col>
                      </div>
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <th colSpan={4} className="border-none"></th>
                    <th colSpan={3} className="text-right">
                      AIRCRAFT REGN.
                    </th>
                    <th colSpan={2}>{aircraftDetails?.aircraftRegn}</th>
                    <th className="border-none"></th>
                    <th>DATE</th>
                    <th>TAT</th>
                    <th>TAC</th>
                  </tr>
                  <tr>
                    <th colSpan={4} className="border-none"></th>
                    <th colSpan={3} className="text-right">
                      MANUFACTURER S/N
                    </th>
                    <th colSpan={2}>{aircraftDetails?.manufacturerSerialNo}</th>
                    <th className="border-none"></th>
                    <th>{dateFormat(aircraftDetails?.updatedTime)}</th>
                    <th>
                      {CalculateTsnTsoTat(aircraftDetails?.totalAirframeTime)}{" "}
                    </th>
                    <th> {aircraftDetails?.totalAirframeCycle}</th>
                  </tr>
                  <tr>
                    <th colSpan={4} className="border-none"></th>
                    <th colSpan={3} className="text-right">
                      LINE NO.
                    </th>
                    <th colSpan={2}>N/A</th>
                    <th className="border-none"></th>
                  </tr>
                  <tr>
                    <th colSpan={4} className="border-none"></th>
                    <th colSpan={3} className="text-right">
                      EFF. CODE
                    </th>
                    <th colSpan={2}>N/A</th>
                    <th className="border-none"></th>
                  </tr>
                  <tr>
                    <th rowSpan={2}>
                      SL <br /> NO
                    </th>
                    <th rowSpan={2}>AD No.</th>
                    <th rowSpan={2}>SB No.</th>
                    <th rowSpan={2}>DESCRIPTION</th>
                    <th rowSpan={2}>
                      EFFECTIVE <br /> DATE
                    </th>
                    <th rowSpan={2}>THRESHOLD</th>
                    <th rowSpan={2}>
                      APPLICAB <br /> ILITY
                    </th>
                    <th rowSpan={2}>STATUS</th>
                    <th rowSpan={2}>INTERVAL</th>
                    <th rowSpan={2}>LAST DONE</th>
                    <th rowSpan={2}>NEXT DUE</th>
                    <th rowSpan={2}>REMAINING</th>
                    <th rowSpan={2}>REMARKS</th>
                  </tr>
                </thead>
                {printData?.model?.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      breakInside: "avoid",
                      position: "relative",
                    }}
                  >
                    <td>{index + 1}</td>
                    <td width="20%">{item?.adNo}</td>
                    <td width="5%">{item?.sbNo}</td>
                    <td width="20%">
                      {item?.description ? item?.description.trim() : "N/A"}
                    </td>
                    <td width="8%">{dateFormat(item?.effectiveDate)}</td>
                    <td>
                      {formatHour(item?.thresholdHour, item?.isApuControl)}{" "}
                      <br />
                      {formatCycle(
                        item?.thresholdCycle,
                        item?.isApuControl
                      )}{" "}
                      <br />
                      {item?.thresholdDay ? item?.thresholdDay + " DY" : "N/A"}
                    </td>
                    <td>{item?.applicability == 0 ? "NO" : "YES"}</td>
                    <td>{item?.status}</td>
                    <td>
                      {formatHour(item?.intervalHour, item?.isApuControl)}{" "}
                      <br />
                      {formatCycle(
                        item?.intervalCycle,
                        item?.isApuControl
                      )}{" "}
                      <br />
                      {item?.intervalDay ? item?.intervalDay + " DY" : "N/A"}
                    </td>
                    <td width="8%">
                      {formatHour(item?.lastDoneFlyingHour, item?.isApuControl)}{" "}
                      <br />
                      {formatCycle(
                        item?.lastDoneFlyingCycle,
                        item?.isApuControl
                      )}{" "}
                      <br />
                      {dateFormat(item?.lastDoneDate)}
                    </td>
                    <td width="8%">
                      {formatHour(item?.nextDueFlyingHour, item?.isApuControl)}{" "}
                      <br />
                      {formatCycle(
                        item?.nextDueFlyingCycle,
                        item?.isApuControl
                      )}{" "}
                      <br />
                      {dateFormat(item?.nextDueDate)}
                    </td>
                    <td width="8%">
                      {formatHour(
                        item?.remainingFlyingHour,
                        item?.isApuControl
                      )}{" "}
                      <br />
                      {formatCycle(
                        item?.remainingFlyingCycle,
                        item?.isApuControl
                      )}{" "}
                      <br />
                      {item?.remainingDay ? item?.remainingDay + " DY" : "N/A"}
                    </td>
                    <td width="20%">{item?.remarks}</td>
                  </tr>
                ))}
              </table>
            </ARMReportTable>
          </ResponsiveTable>
        </AirframeAndAppliance>

        {data?.length > 0 && (
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
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
