import {
  FilterOutlined,
  MacCommandOutlined,
  PrinterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Col,
  Form,
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
import { useBoolean } from "react-use";
import API from "../../../../service/Api";
import moment from "moment";
import {
  formatCycle,
  formatHour,
  getFolderPathByMatchedString,
  pageSerialNo,
} from "../Common";
import { sleep } from "../../../../lib/common/helpers";
import ResponsiveTable from "../../../common/ResposnsiveTable";
import Permission from "../../../auth/Permission";
import TaskDebounceSelect from "./TaskDebounceSelect";

const TITLE = "TASK STATUS";
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
    /* margin-left: 22%; */
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

export default function TaskStatusReport() {
  const [form] = Form.useForm();
  const { allAircrafts, getAllAircrafts } = useAircraftsList();
  const [data, setData] = useState([]);
  const [printData, setPrintData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [submitting, toggleSubmitting] = useBoolean(false);
  const aircraftId = Form.useWatch("aircraftId", form);
  const tskIds = Form.useWatch("taskIds", form);
  const [selectedTaskNo, setSelectedTaskNo] = useState([]);
  const type = Form.useWatch("taskSource", form);

  const reportRef = createRef();

  const fetchPrintData = async () => {
    let ids = tskIds?.map((part) => {
      return part.value;
    });
    let dataWithoutPagination = {
      taskId: ids,
      isPageable: false,
    };
    if (aircraftId) {
      dataWithoutPagination = {
        ...dataWithoutPagination,
        aircraftId: aircraftId,
      };
    }
    try {
      toggleSubmitting();
      const { data } = await API.post(
        `task-report/task-status-report`,
        dataWithoutPagination
      );
      setPrintData(data);
      return sleep(1000);
    } catch (er) {
    } finally {
      toggleSubmitting();
    }
  };

  const resetFilter = () => {
    form.resetFields();
    setData([]);
    setSelectedTaskNo([]);
  };

  useEffect(() => {
    (async () => {
      await getAllAircrafts();
    })();
  }, []);

  const taskType = [
    { id: 0, name: "AD" },
    { id: 1, name: "SB" },
    { id: 2, name: "AMP" },
    { id: 3, name: "OTHER" },
  ];

  const handleSubmit = useCallback(
    async (values) => {
      if (values.taskIds === undefined) {
        return;
      }
      let ids = values?.taskIds?.map((part) => {
        return part.value;
      });
      let searchValues = {
        taskId: ids,
        isPageable: true,
      };
      if (values?.aircraftId) {
        searchValues = {
          ...searchValues,
          aircraftId: values.aircraftId,
        };
      }
      try {
        toggleSubmitting();
        const { data } = await API.post(
          `task-report/task-status-report?page=${currentPage}&size=${values.size}`,
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

  useEffect(() => {
    (async () => {
      await handleSubmit(form.getFieldsValue(true));
    })();
  }, [handleSubmit, form]);

  const onChange = () => {
    setSelectedTaskNo([]);
    setData([]);
  };

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/technical-service">
              <MacCommandOutlined /> &nbsp;Technical Service
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Task Status</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="" showFallback>
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
          <Form
            form={form}
            name="filter-form"
            initialValues={{ size: 10 }}
            onFinish={handleSubmit}
          >
            <Row gutter={20}>
              <Col xs={24} md={4}>
                <Form.Item
                  name="taskSource"
                  rules={[
                    {
                      required: true,
                      message: "Task type is required ",
                    },
                  ]}
                >
                  <Select placeholder="Select Task Type" onChange={onChange}>
                    {taskType?.map((item, index) => {
                      return (
                        <Select.Option key={index} value={item.name}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="taskIds"
                  rules={[
                    {
                      required: true,
                      message: "Task no is required ",
                    },
                  ]}
                >
                  <TaskDebounceSelect
                    debounceTimeout={1000}
                    mapper={(v) => ({
                      label: v.taskNo,
                      value: v.taskId,
                    })}
                    showArrow
                    searchParam="taskNo"
                    showSearch
                    allowClear
                    mode="multiple"
                    placeholder="Search Task No."
                    url={`task-report/search-task-list-by-source?page=1&size=20`}
                    params={{ type }}
                    selectedValue={selectedTaskNo}
                    onChange={(newValue) => {
                      setSelectedTaskNo(newValue);
                    }}
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  name="aircraftId"
                  rules={[
                    {
                      required: false,
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
                      marginRight: "20px",
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
            <Row>
              <Col span={24}>
                <Typography.Title
                  className="report-title first"
                  level={5}
                  style={{ marginBottom: "20px", textAlign: "center" }}
                >
                  TASK STATUS REPORT
                </Typography.Title>
              </Col>
            </Row>
            <ResponsiveTable className="first">
              <ARMReportTable>
                <table className="table" style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <th rowSpan={2}>
                        SL <br /> NO
                      </th>
                      <th>MSN</th>
                      {type === "AD" ? <th rowSpan={2}>AD No.</th> : null}
                      {type === "SB" ? <th rowSpan={2}>SB No.</th> : null}
                      {type === "OTHER" ? <th rowSpan={2}>Task No.</th> : null}
                      {type === "AMP" ? <th rowSpan={2}>AMP No.</th> : null}

                      <th rowSpan={2}>DESCRIPTION</th>
                      <th rowSpan={2}>
                        APPLICAB
                        <br />
                        ILITY
                      </th>
                      <th rowSpan={2}>STATUS</th>
                      {type === "AD" ? (
                        <>
                          <th rowSpan={2}>EFFECTIVE DATE</th>
                          <th rowSpan={2}>ISSUE DATE</th>
                        </>
                      ) : null}
                      {type === "SB" ? (
                        <>
                          <th rowSpan={2}>EFFECTIVE DATE</th>
                          <th rowSpan={2}>ISSUE DATE</th>
                          <th rowSpan={2}>REVISION NO</th>
                        </>
                      ) : null}

                      <th rowSpan={2}>THRESHOLD</th>

                      <th rowSpan={2}>INTERVAL</th>
                      <th rowSpan={2}>LAST DONE</th>
                      <th rowSpan={2}>NEXT DUE</th>
                      <th rowSpan={2}>REMAINING</th>
                      <th rowSpan={2}>REMARKS</th>
                    </tr>

                    <tr></tr>
                    {data?.map((item, index) => (
                      <tr key={index}>
                        <td>{pageSerialNo(currentPage, index + 1)}</td>
                        <td width="5%">{item?.msnNo}</td>
                        {type === "OTHER" ? (
                          <td
                            width="15%"
                            onClick={() => {
                              getFolderPathByMatchedString(item?.taskNo);
                            }}
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            {item?.taskNo}
                          </td>
                        ) : null}
                        {type === "AD" ? (
                          <td
                            width="15%"
                            onClick={() => {
                              getFolderPathByMatchedString(item?.taskNo);
                            }}
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            {item?.taskNo}
                          </td>
                        ) : null}
                        {type === "SB" ? (
                          <td
                            width="15%"
                            className="newLineInRow"
                            onClick={() => {
                              getFolderPathByMatchedString(item?.taskNo);
                            }}
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            {item?.taskNo}
                          </td>
                        ) : null}
                        {type === "AMP" ? (
                          <td
                            width="15%"
                            className="newLineInRow"
                            onClick={() => {
                              getFolderPathByMatchedString(item?.taskNo);
                            }}
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            {item?.taskNo}
                          </td>
                        ) : null}

                        <td width="20%" className="newLineInRow">
                          {item?.description ? item?.description.trim() : "N/A"}
                        </td>
                        <td>{item?.applicability == 0 ? "NO" : "YES"}</td>
                        <td>{item?.status}</td>
                        {type === "AD" ? (
                          <>
                            <td width="8%">
                              {dateFormat(item?.effectiveDate)}
                            </td>
                            <td width="8%">{dateFormat(item?.issueDate)}</td>
                          </>
                        ) : null}
                        {type === "SB" ? (
                          <>
                            <td width="8%">
                              {dateFormat(item?.effectiveDate)}
                            </td>
                            <td width="8%">{dateFormat(item?.issueDate)}</td>
                            <td width="8%">{item?.revisionNo}</td>
                          </>
                        ) : null}

                        <td width="6%">
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

                        <td width="6%">
                          {formatHour(item?.intervalHour, item?.isApuControl)}{" "}
                          <br />
                          {formatCycle(
                            item?.intervalCycle,
                            item?.isApuControl
                          )}{" "}
                          <br />
                          {item?.intervalDay
                            ? item?.intervalDay + " DY"
                            : "N/A"}
                        </td>
                        <td width="6%">
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
                        <td width="6%">
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
                          {dateFormat2(item?.nextDueDate)}
                        </td>
                        <td width="6%">
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
                        <td width="12%">{item?.remarks}</td>
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
                      <td
                        className="report-header-cell"
                        colSpan={24}
                        style={{ border: "none" }}
                      >
                        <div className="header-info">
                          <Col span={24}>
                            <Row>
                              <Col span={24}>
                                <Row justify="space-between">
                                  <Col>
                                    <img src={logo} alt="" width={110} />
                                  </Col>
                                  <Col style={{ fontSize: "10px" }}>
                                    <Typography.Text>
                                      Form: CAME-027
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
                      <th rowSpan={2}>
                        SL <br /> NO
                      </th>
                      <th>MSN</th>
                      {type === "AD" ? <th rowSpan={2}>AD No.</th> : null}
                      {type === "SB" ? <th rowSpan={2}>SB No.</th> : null}
                      {type === "OTHER" ? <th rowSpan={2}>Task No.</th> : null}
                      {type === "AMP" ? <th rowSpan={2}>AMP No.</th> : null}

                      <th rowSpan={2}>DESCRIPTION</th>
                      <th rowSpan={2}>
                        APPLICAB
                        <br />
                        ILITY
                      </th>
                      <th rowSpan={2}>STATUS</th>
                      {type === "AD" ? (
                        <>
                          <th rowSpan={2}>EFFECTIVE DATE</th>
                          <th rowSpan={2}>ISSUE DATE</th>
                        </>
                      ) : null}
                      {type === "SB" ? (
                        <>
                          <th rowSpan={2}>EFFECTIVE DATE</th>
                          <th rowSpan={2}>ISSUE DATE</th>
                          <th rowSpan={2}>REVISION NO</th>
                        </>
                      ) : null}

                      <th rowSpan={2}>THRESHOLD</th>

                      <th rowSpan={2}>INTERVAL</th>
                      <th rowSpan={2}>LAST DONE</th>
                      <th rowSpan={2}>NEXT DUE</th>
                      <th rowSpan={2}>REMAINING</th>
                      <th rowSpan={2}>REMARKS</th>
                    </tr>
                  </thead>
                  {printData?.model?.map((item, index) => (
                    <tr key={index}>
                      <td>{pageSerialNo(currentPage, index + 1)}</td>
                      <td width="5%">{item?.msnNo}</td>
                      {type === "OTHER" ? (
                        <td width="15%">{item?.taskNo}</td>
                      ) : null}
                      {type === "AD" ? (
                        <td
                          width="15%"
                          onClick={() => {
                            getFolderPathByMatchedString(item?.taskNo);
                          }}
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          {item?.taskNo}
                        </td>
                      ) : null}
                      {type === "SB" ? (
                        <td width="15%" className="newLineInRow">
                          {item?.taskNo}
                        </td>
                      ) : null}
                      {type === "AMP" ? (
                        <td width="15%" className="newLineInRow">
                          {item?.taskNo}
                        </td>
                      ) : null}

                      <td width="20%" className="newLineInRow">
                        {item?.description ? item?.description.trim() : "N/A"}
                      </td>
                      <td>{item?.applicability == 0 ? "NO" : "YES"}</td>
                      <td>{item?.status}</td>
                      {type === "AD" ? (
                        <>
                          <td width="8%">{dateFormat(item?.effectiveDate)}</td>
                          <td width="8%">{dateFormat(item?.issueDate)}</td>
                        </>
                      ) : null}
                      {type === "SB" ? (
                        <>
                          <td width="8%">{dateFormat(item?.effectiveDate)}</td>
                          <td width="8%">{dateFormat(item?.issueDate)}</td>
                          <td width="8%">{item?.revisionNo}</td>
                        </>
                      ) : null}

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
                      <td width="6%">
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
                        {dateFormat2(item?.nextDueDate)}
                      </td>
                      <td width="6%">
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
                      <td width="12%">{item?.remarks}</td>
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
