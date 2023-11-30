import {
  FilterOutlined,
  PrinterOutlined,
  ProfileOutlined,
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
import Permission from "../../auth/Permission";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import SuccessButton from "../../common/buttons/SuccessButton";
import CommonLayout from "../../layout/CommonLayout";
//import logo from "../../../../components/images/us-bangla-logo.png";

import logo from "../../../components/images/us-bangla-logo.png";
import ResponsiveTable from "../../common/ResposnsiveTable";
import { ARMReportTable } from "../../planning/report/ARMReportTable";
import CompanyLogo from "../../planning/report/CompanyLogo";
import DebounceSelect from "../../common/DebounceSelect";
import { notifyResponseError } from "../../../lib/common/notifications";
import { useBoolean } from "react-use";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import moment from "moment";
import API from "../../../service/Api";

const printStyle = `
*{
    font-size: 12px !important;
    overflow: visible !important;
    margin: 0!important;
    padding:0!important;
  }

  .bulletin-row td,
  .bulletin-row th {
    border-width: 0.4px !important;
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
   visibility: visible!important;
   }
   .pagination{
   display: none!important;
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

  .border-none{
    border: none!important;
}

  @page {
    size: landscape;
  }
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

const AlertLevelReport = () => {
  const reportRef = createRef();
  const [form] = Form.useForm();
  const [ata, setata] = useState([]);
  const [alertData, setAlertData] = useState([]);
  const [selectedAlternatePart, setSelectedAlternatePart] = useState([]);
  const [submitting, toggleSubmitting] = useBoolean(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [aircraftModel, setAircraftModel] = useState([]);
  const [aircraftModelName, setAircraftModelName] = useState();
  const aircraftModelId = Form.useWatch("aircraftModelId", form);

  useEffect(() => {
    if (!aircraftModelId) {
      return;
    }
    for (let i = 0; i < aircraftModel?.length; i++) {
      if (aircraftModelId === aircraftModel[i].id) {
        setAircraftModelName(aircraftModel[i].aircraftModelName);
        break;
      }
    }
  }, [aircraftModelId]);

  const alertLevelSubmit = useCallback(
    async (values) => {
      // let ids = values?.ataNoId?.map((ataId) => {
      //     return ataId.value;
      //   });
      setata(values.ataNoId.label);
      const [fromDate, toDate] = values.dateRange || "";
      const lastDate = moment(toDate).endOf("month");
      const searchValues = {
        aircraftModelId: values?.aircraftModelId,
        locationId: values?.ataNoId.value,
        monthRange:values?.monthRange,
        fromDate: DateTimeConverter.momentDateToString(fromDate) || null,
        toDate: DateTimeConverter.momentDateToString(lastDate) || null,
      };

      try {
        const { data } = await API.post(`systems/alert-level`, searchValues);
        setAlertData(data);
      } catch (error) {
        notifyResponseError(error);
      } finally {
        toggleSubmitting(false);
      }
    },
    [currentPage, toggleSubmitting]
  );

  const getAllAircraftModel = async () => {
    try {
      const { data } =
        await AircraftModelFamilyService.getAllAircraftModelFamily();
      setAircraftModel(data.model);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    getAllAircraftModel();
  }, []);

  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
  const firstDay = new Date(now.getFullYear() - 1, now.getMonth() + 9, 1);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/reliability">
              <ProfileOutlined /> &nbsp;Reliability
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Alert Level Calculation</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="">
        <ARMCard
          title={
            <Row justify="space-between">
              <Col>Alert Level Calculation</Col>
              <Col>
                <Space>
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
                    // onBeforeGetContent={fetchPrintData}
                  />
                </Space>
              </Col>
            </Row>
          }
        >
          <Form
            form={form}
            name="filter-form"
            initialValues={{ size: 10 }}
            onFinish={alertLevelSubmit}
          >
            <Row gutter={20}>
              <Col xs={24} md={6}>
                <Form.Item
                  name="aircraftModelId"
                  rules={[
                    {
                      required: true,
                      message: "Aircraft model is required ",
                    },
                  ]}
                >
                  <Select placeholder="Select Aircraft Model">
                    {aircraftModel?.map((aircraftModel, index) => (
                      <Select.Option value={aircraftModel.id} key={index}>
                        {aircraftModel.aircraftModelName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="monthRange"
                  rules={[
                    {
                      required: true,
                      message: "Month range is required ",
                    },
                  ]}
                >
                  <Input placeholder="Please input month range" />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item
                  name="ataNoId"
                  label="ATA NO"
                  rules={[
                    {
                      required: false,
                      message: "Field should not be empty",
                    },
                  ]}
                >
                  <DebounceSelect
                    debounceTimeout={1000}
                    mapper={(v) => ({
                      label: v.name,
                      value: v.id,
                    })}
                    showArrow
                    searchParam="name"
                    showSearch
                    // mode="multiple"
                    placeholder="Search ATA NO."
                    url={`aircraft-location/search?page=1&size=20`}
                    selectedValue={selectedAlternatePart}
                    onChange={(newValue) => {
                      setSelectedAlternatePart(newValue);
                    }}
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
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
                    //picker="month"
                    disabledDate={(current) => {
                      return current && current.valueOf() > lastDay;
                    }}
                  />
                </Form.Item>
              </Col>
              {/* <Col xs={24} md={4}>
                <Form.Item name="size" label="Page Size">
                  <Select id="antSelect" defaultValue={10}>
                    <Select.Option value="10">10</Select.Option>
                    <Select.Option value="20">20</Select.Option>
                    <Select.Option value="30">30</Select.Option>
                    <Select.Option value="40">40</Select.Option>
                    <Select.Option value="50">50</Select.Option>
                  </Select>
                </Form.Item>
              </Col> */}
              <Col xs={24} md={6}>
                <Form.Item>
                  <Space>
                    <ARMButton
                      //loading={submitting}
                      size="middle"
                      type="primary"
                      htmlType="submit"
                    >
                      <FilterOutlined name="filter" /> Filter
                    </ARMButton>
                    <ARMButton size="middle" type="primary">
                      <RollbackOutlined name="reset" /> Reset
                    </ARMButton>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <ServiceBulletin ref={reportRef}>
            <Row>
              <Col span={24} className="first">
                <Row justify="space-between">
                  <Col>
                    <img src={logo} alt="" width={110} />
                  </Col>
                  <Col style={{ fontSize: "8px", fontWeight: "bold" }}>
                    <h2>ALERT LEVEL CALCULATION ATR72-{aircraftModelName}</h2>
                  </Col>
                </Row>
              </Col>
            </Row>
            <ResponsiveTable className="first">
              <ARMReportTable className="service-bulletin-table">
                <tbody>
                  <tr>
                    <th>ATA-{ata}</th>
                    <th>MONTH</th>
                    <th>PIREP/MAREP</th>
                    <th>AIR TIME</th>
                    <th>
                      PIREP <br /> RATE/1000 <br /> FH
                    </th>
                    <th>
                      PIREP RATE/1000 <br /> FH(3 MONTH
                      <br /> MOVING AV)
                    </th>
                    <th>MEAN (X̅)</th>
                    <th>X-X̅</th>
                    <th>(X̅-X)^2</th>
                  </tr>
                </tbody>
                <tbody>
                  {alertData?.alertLevelViewModelList?.map((data, index) => (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{data?.month}</td>
                      <td className="newLineInRow">{data?.pirepOrMarep}</td>
                      <td className="newLineInRow">{data?.airTime}</td>
                      <td>{data?.pirepRate}</td>
                      <td>{data?.pirepRateMonthRange}</td>
                      <td>{data?.mean}</td>
                      <td>{data?.meanBar}</td>
                      <td>{data?.meanSquare}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="none"></td>
                    <td className="none"></td>
                    <td className="none"></td>
                    <td className="none"></td>
                    <td>Total X =</td>
                    <td>{alertData?.totalPirepRateWithThereeMonths}</td>
                    <td></td>
                    <td>Total ∑ (X̅-X)2</td>
                    <td>{alertData?.totalMeanBarSquare}</td>
                  </tr>
                  <tr>
                    <td className="none"></td>
                    <td className="none"></td>
                    <td className="none"></td>
                    <td className="none"></td>
                    <td>Mean, X̅ =</td>
                    <td>{alertData?.meanXBar}</td>
                    <td></td>
                    <td>S.D,σ =</td>
                    <td>{alertData?.sd}</td>
                  </tr>
                  <tr>
                    <td className="none"></td>
                    <td className="none"></td>
                    <td className="none"></td>
                    <td className="none"></td>
                    <td className="none"></td>
                    <td className="none"></td>
                    <td>Alert Level</td>
                    <td>X̅+Kσ</td>
                    <td>{alertData?.alertLevel}</td>
                  </tr>
                </tbody>
              </ARMReportTable>
            </ResponsiveTable>

            <ResponsiveTable className="second">
              <ARMReportTable>
                <table className="report-container" style={{ width: "100%" }}>
                  <thead className="report-header">
                    <tr>
                      <td
                        className="report-header-cell border-none"
                        colSpan={10}
                      >
                        <div className="header-info">
                          <Col span={24}>
                            <Row justify="space-between">
                              <Col>
                                <CompanyLogo />
                              </Col>

                              <Col
                                style={{
                                  fontSize: "8px",
                                  textAlign: "left",
                                  lineHeight: "1",
                                }}
                              >
                                <h2>
                                  ALERT LEVEL CALCULATION ATR72-
                                  {aircraftModelName}
                                </h2>
                              </Col>
                            </Row>
                          </Col>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={10} className="none">
                        empty
                      </td>
                    </tr>

                    <tr>
                      <tr>
                        <td colSpan={9} className="none">
                          ok
                        </td>
                      </tr>
                    </tr>

                    <tr>
                      <th>ATA-{ata}</th>
                      <th>MONTH</th>
                      <th>PIREP/MAREP</th>
                      <th>AIR TIME</th>
                      <th>
                        PIREP <br /> RATE/1000 <br /> FH
                      </th>
                      <th>
                        PIREP RATE/1000 <br /> FH(3 MONTH
                        <br /> MOVING AV)
                      </th>
                      <th>MEAN (X̅)</th>
                      <th>X-X̅</th>
                      <th>(X̅-X)^2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alertData?.alertLevelViewModelList?.map((data, index) => (
                      <tr key={index}>
                        <td>{index}</td>
                        <td>{data?.month}</td>
                        <td className="newLineInRow">{data?.pirepOrMarep}</td>
                        <td className="newLineInRow">{data?.airTime}</td>
                        <td>{data?.pirepRate}</td>
                        <td>{data?.pirepRateMonthRange}</td>
                        <td>{data?.mean}</td>
                        <td>{data?.meanBar}</td>
                        <td>{data?.meanSquare}</td>
                      </tr>
                    ))}

                    <tr>
                      <td className="none"></td>
                      <td className="none"></td>
                      <td className="none"></td>
                      <td className="none"></td>
                      <td>Total X =</td>
                      <td>{alertData?.totalPirepRateWithThereeMonths}</td>
                      <td></td>
                      <td>Total ∑ (X̅-X)2</td>
                      <td>{alertData?.totalMeanBarSquare}</td>
                    </tr>
                    <tr>
                      <td className="none"></td>
                      <td className="none"></td>
                      <td className="none"></td>
                      <td className="none"></td>
                      <td>Mean, X̅ =</td>
                      <td>{alertData?.meanXBar}</td>
                      <td></td>
                      <td>S.D,σ =</td>
                      <td>{alertData?.sd}</td>
                    </tr>
                    <tr>
                      <td className="none"></td>
                      <td className="none"></td>
                      <td className="none"></td>
                      <td className="none"></td>
                      <td className="none"></td>
                      <td className="none"></td>
                      <td>Alert Level</td>
                      <td> X̅+Kσ</td>

                      <td>{alertData?.alertLevel}</td>
                    </tr>
                  </tbody>
                </table>
              </ARMReportTable>
            </ResponsiveTable>

            <Row justify="center" className="first">
              <Typography.Text className="page-of-report">Page</Typography.Text>
            </Row>

            {alertData?.length > 0 && (
              <Row justify="center" className="pagination">
                <Col style={{ marginTop: 10 }}>
                  <Pagination
                  // current={currentPage}
                  // onChange={handlePageChange}
                  // pageSize={10}
                  // total={totalPages * 10}
                  />
                </Col>
              </Row>
            )}
          </ServiceBulletin>
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default AlertLevelReport;
