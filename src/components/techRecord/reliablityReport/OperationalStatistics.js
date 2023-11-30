import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Column, DualAxes } from "@ant-design/plots";

import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import {
  FilterOutlined,
  PrinterOutlined,
  ProfileOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import ReactToPrint from "react-to-print";

import styled from "styled-components";
import logo from "../../../components/images/us-bangla-logo.png";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import SuccessButton from "../../common/buttons/SuccessButton";
import ARMButton from "../../common/buttons/ARMButton";
import ResponsiveTable from "../../common/ResposnsiveTable";
import { ARMReportTable } from "../../planning/report/ARMReportTable";
import { useBoolean } from "react-use";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import API from "../../../service/Api";
import moment from "moment";
import { dateFormat2 } from "../../planning/report/AirframeAndApplianceADStatus";
import { notifyResponseError } from "../../../lib/common/notifications";
import { DateFormat, HourFormat } from "../../planning/report/Common";

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
    font-size: 8px !important;
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

const OperationalStatistic = styled.div`
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

const OperationalStatistics = () => {
  const [form] = Form.useForm();
  const reportRef = createRef();
  const [aircraftModel, setAircraftModel] = useState([]);
  const [submitting, toggleSubmitting] = useBoolean(false);
  const [opData, setOpData] = useState([]);
  const [data, setData] = useState([]);
  const [hourCycleData, setHourCycleData] = useState([]);
  const aircraftModelId = Form.useWatch("aircraftModelId", form);
  const [aircraftModelName, setAircraftModelName] = useState();
  const dateRange = Form.useWatch("dateRange", form);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

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

  const getAllAircraftModel = async () => {
    const { data } =
      await AircraftModelFamilyService.getAllAircraftModelFamily();
    setAircraftModel(data.model);
  };

  useEffect(() => {
    (async () => {
      await getAllAircraftModel();
    })();
  }, []);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        const [fromDate, toDate] = values.dateRange || "";

        setStartDate(moment(fromDate).format("MMM-YYYY"));
        setEndDate(moment(toDate).format("MMM-YYYY"));
        const lastDate = moment(toDate).endOf("month");
        const customValues = {
          aircraftModelId: values.aircraftModelId,
          fromDate: DateTimeConverter.momentDateToString(fromDate) || null,
          toDate: DateTimeConverter.momentDateToString(lastDate) || null,
        };
        const { data } = await API.post(
          `operation-report/op-stat-report`,
          customValues
        );

        let arr = [];

        data?.forEach((a) => {
          arr.push({
            month:
              moment()
                .month(a.month - 1)
                .format("MMM") +
              "-" +
              a.year,
            availability: a.availability,
          });
        });
        setData(arr);

        let newArry = [];

        data?.forEach((a) => {
          newArry.push({
            time:
              moment()
                .month(a.month - 1)
                .format("MMM") +
              "-" +
              a.year,
            type: "HOURS",
            value: a.totalFlightHour,
          });
          newArry.push({
            time:
              moment()
                .month(a.month - 1)
                .format("MMM") +
              "-" +
              a.year,
            type: "CYCLE",
            value: a.totalFlightCycle,
          });
        });

        setHourCycleData(newArry);
        setOpData(data);
        toggleSubmitting();
      } catch (error) {
        notifyResponseError(error);
      } finally {
        toggleSubmitting(false);
      }
    },
    [toggleSubmitting]
  );

  const resetFilter = () => {
    form.resetFields();
    setOpData([]);
    startDate("");
    endDate("");
    setAircraftModel("");
  };

  const config = {
    data,
    xField: "month",
    yField: "availability",
    color: "#4f81bd",
    label: {
      position: "bottom",
      content: function content(item) {
        return "".concat(item.availability?.toFixed(2), "%");
      },
      style: {
        fill: "#FFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  const hoursCycleData = [
    {
      time: "Feb",
      value: 1600,
      type: "HOURS",
    },
    {
      time: "Feb",
      value: 420,
      type: "CYCLE",
    },
    {
      time: "2019-04",
      value: 1667,
      type: "HOURS",
    },
    {
      time: "2019-04",
      value: 300,
      type: "CYCLE",
    },

    {
      time: "Jul",
      value: 450,
      type: "HOURS",
    },
    {
      time: "Jul",
      value: 320,
      type: "CYCLE",
    },
    {
      time: "Jun",
      value: 0,
      type: "HOURS",
    },
    {
      time: "Jun",
      value: 362,
      type: "CYCLE",
    },
  ];

  const configg = {
    data:hourCycleData,
    isGroup: true,
    xField: 'time',
    yField: 'value',
    seriesField: 'type',
    color: ['#4f81bd', '#4bacc6'],
    label: {
      position: 'top',
      offsetY: -10,
      layout: [
        {
          type: 'interval-adjust-position',
        }, 
        {
          type: 'interval-hide-overlap',
        },
        {
          type: 'adjust-color',
        },
      ],
    },
  }



  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
  const firstDay = new Date(now.getFullYear()-1, now.getMonth() + 9, 1);
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/reliability">
              <ProfileOutlined /> &nbsp;Reliability
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Operational Statistics</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={
          <Row justify="space-between">
            <Col>
              Operational Statistics
            </Col>
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
          onFinish={handleSubmit}
          name="filter-form"
          initialValues={{ aircraftModelId: null,dateRange: [moment(firstDay, 'DD-MM-YYYY'), moment(lastDay, 'DD-MM-YYYY')] }}
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
                  {aircraftModel?.map((aircraftModel) => (
                    <Select.Option
                      value={aircraftModel.id}
                      key={aircraftModel.id}
                    >
                      {aircraftModel.aircraftModelName}
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
                    message: "Date range is required",
                  },
                ]}
                name="dateRange"
              >
                <DatePicker.RangePicker
                  format="MM-YYYY"
                  style={{ width: "100%" }}
                  picker="month"
                  disabledDate={(current) => {
                    return current && current.valueOf() > lastDay;
                  }} 
                />
              </Form.Item>
            </Col>
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
                  <ARMButton size="middle" type="primary" onClick={resetFilter}>
                    <RollbackOutlined name="reset" /> Reset
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <OperationalStatistic ref={reportRef}>
          <Row>
            <Col span={24}>
              <Row justify="space-between">
                <Col>
                  <img src={logo} alt="" width={110} />
                </Col>
                <Col style={{ fontSize: "12px", fontWeight: "bold" }}>
                  TECHNICAL SERVICES SECTION
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <h2>OPERATIONAL STATISTICS</h2>
            </Col>
            <Col span={12}>
              <Typography.Title level={4}>
              <span
                  className="aircraftHeader"
                  style={{
                    textDecoration: "underline",
                    textAlign: "center",
                    marginLeft: "35px",
                  }}
                >
                 <b> {aircraftModelName}</b>
                </span>{" "}
                <br />
                <span style={{ textAlign: "center" }}>
                  {" "}
                 <b>{startDate?.toUpperCase()} {startDate ? "to" : null} {endDate?.toUpperCase()}</b>
                </span>
              </Typography.Title>
            </Col>
          </Row>
          <ResponsiveTable>
            <ARMReportTable className="service-bulletin-table" >
              <table className="report-container" style={{width: "100%"}}>
              <thead>
                <tr className="bulletin-row">
                  <th>MONTH</th>
                  <th>NO. OF A/C IN FLEET</th>
                  <th>NO. OF A/C IN SERVICE</th>
                  <th>AIRCRAFT AVAILABILITY (%)</th>
                  <th>TOTAL FLIGHT HOURS</th>
                  <th>TOTAL FLIGHT CYCLES</th>
                </tr>
              </thead>
              <tbody>
                {opData?.map((item,index) => (
                  <tr key={index}>
                    <td>
                      {moment()
                        .month(item.month - 1)
                        .format("MMM")}
                      -{item.year}
                    </td>
                    <td>{item.numOfAcFleet}</td>
                    <td>{item.numOfAcInService}</td>
                    <td>{item.availability} %</td>
                    <td>{item.totalFlightHour}</td>
                    <td>{item.totalFlightCycle}</td>
                  </tr>
                ))}
              </tbody>

              {/* <tbody>
                <tr>
                  <td colSpan={6} className="none">
                    empty
                  </td>
                </tr>

                <tr>
                  <h2 style={{ textDecoration: "underline" }}>
                    <b>Summary</b>
                  </h2>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>TOTAL FLIGHT HOURS:</td>
                  <td>44</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>TOTAL FLIGHT CYCLES:</td>
                  <td>22</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    AVG FLIGHT DURATION (MIN):
                  </td>
                  <td>22</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    TOTAL TECHNICAL DELAYS (MORE THAN 15 MIN):
                  </td>
                  <td>22</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>TOTAL CANCELLATION:</td>
                  <td>22</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    DISPATCH RELIABILITY (%):
                  </td>
                  <td>22</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    TOTAL INCIDENTS (TECH./NON-TECH.):
                  </td>
                  <td>22</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    TOTAL PILOT REPORTED DEFETCS:
                  </td>
                  <td>22</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    TOTAL MAINTENANCE DEFETCS:
                  </td>
                  <td>22</td>
                </tr>
              </tbody> */}
              </table>
            </ARMReportTable>
          </ResponsiveTable>
          <table style={{width: "100%",  pageBreakBefore: 'always'}}>
          <Row style={{ marginTop: "50px" }}>
            <Col span={18} offset={3}>
              <p className="firstGraph" style={{ textAlign: "center" }}>
                AIRCRAFT AVAILABILITY (%)
              </p>
              <h3 className="none">empty</h3>
              <Column style={{ height: "250px" }} {...config} />
            </Col>
          </Row>

          <Row style={{ marginTop: "50px" }}>
            <Col span={18} offset={3}>
              <h3 className="none">empty</h3>
              <p style={{ textAlign: "center" }} className="secondGraph">
                TOTAL FLEET HOURS &amp; CYCLES
              </p>
              <h3 className="none">empty</h3>
              <Column style={{ height: "325px" }} {...configg} />
            </Col>
          </Row>
          </table>
        </OperationalStatistic>
      </ARMCard>
    </CommonLayout>
  );
};

export default OperationalStatistics;
