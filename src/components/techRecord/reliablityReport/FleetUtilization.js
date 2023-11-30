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
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import React, { createRef, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactToPrint from "react-to-print";
import styled from "styled-components";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import SuccessButton from "../../common/buttons/SuccessButton";
import CommonLayout from "../../layout/CommonLayout";
import { Column } from "@ant-design/plots";
import logo from "../../../components/images/us-bangla-logo.png";
import ResponsiveTable from "../../common/ResposnsiveTable";
import { ARMReportTable } from "../../planning/report/ARMReportTable";
import moment from "moment";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import { useBoolean } from "react-use";
import API from "../../../service/Api";
import { notifyResponseError } from "../../../lib/common/notifications";

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

.aircraftHeader{
    margin-left: 30px !important
}

  @page {
    size: landscape;
  }
`;

const FleetUtilizationList = styled.div`
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

const FleetUtilization = () => {
  const [submitting, toggleSubmitting] = useBoolean(false);
  const [form] = Form.useForm();
  const reportRef = createRef();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const aircraftModelId = Form.useWatch("aircraftModelId", form);
  const [aircraftModelName, setAircraftModelName] = useState();
  const [fleetUtilization, setFleetUtilization] = useState([]);
  const [aircraftModel, setAircraftModel] = useState([]);
  const [monthlyAvgHourCycle, setMonthlyAvgHourCycle] = useState([]);
  const [dailyAvgHourCycle, setDailyAvgHourCycle] = useState([]);

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
          `operation-report/fleet-util-report`,
          customValues
        );
        setFleetUtilization(data);

        let monthlyArry = [];
        data?.forEach((a) => {
            monthlyArry.push({
              time:moment().month(a.month - 1).format("MMM") + "-" + a.year,
              type: "HOURS",
              value: a.monthlyAvgFltUtilHours,
            });
            monthlyArry.push({
              time:moment().month(a.month - 1).format("MMM") + "-" + a.year,
              type: "CYCLE",
              value: a.monthlyAvgFltUtilCycles,
            });
        });

        setMonthlyAvgHourCycle(monthlyArry);

        let newArry = [];

        data?.forEach((a) => {
          newArry.push({
            time:moment().month(a.month - 1).format("MMM") + "-" + a.year,
            type: "HOURS",
            value: a.dailyAvgFltUtilHours,
          });
          newArry.push({
            time:moment().month(a.month - 1).format("MMM") + "-" + a.year,
            type: "CYCLE",
            value: a.dailyAvgFltUtilCycles,
          });
        });

        setDailyAvgHourCycle(newArry);

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
    setFleetUtilization([]);
    setMonthlyAvgHourCycle([]);
    setDailyAvgHourCycle([]);
  };

  const configg = {
    data:monthlyAvgHourCycle,
    isGroup: true,
    xField: 'time',
    yField: 'value',
    seriesField: 'type',
    color: ['#4f81bd', '#c0504d'],
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

  const config = {
    data:dailyAvgHourCycle,
    isGroup: true,
    xField: 'time',
    yField: 'value',
    seriesField: 'type',
    color: ['#4f81bd', '#c0504d'],
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
          <Breadcrumb.Item>Fleet Utilization</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={
          <Row justify="space-between">
            <Col>
              Fleet Utilization
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
          initialValues={{ aircraftModelId: null ,dateRange: [moment(firstDay, 'DD-MM-YYYY'), moment(lastDay, 'DD-MM-YYYY')] }}
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
                    loading={submitting}
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

        <FleetUtilizationList ref={reportRef}>
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
              <h2>FLEET UTILIZATION</h2>
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
            <ARMReportTable className="service-bulletin-table">
              <table className="report-container" style={{width: "100%"}}>
              <thead>
                <tr className="bulletin-row">
                  <th>MONTH</th>
                  <th>NO. OF A/C IN FLEET</th>
                  <th>MONTHLY HOURS</th>
                  <th>MONTHLY CYCLES</th>
                  <th>
                    MONTHLY AVG <br /> FLEET UTILIZATION (HOURS)
                  </th>
                  <th>
                    MONTHLY AVG FLEET <br /> UTILIZATION (CYCLES)
                  </th>
                  <th>
                    DAILY AVG FLEET <br /> UTILIZATION (HOURS)
                  </th>
                  <th>
                    DAILY AVG FLEET <br /> UTILIZATION (CYCLES)
                  </th>
                </tr>
              </thead>
              <tbody>
                {fleetUtilization?.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {moment().month(item?.month - 1).format("MMM")}-{item?.year}
                    </td>
                    <td>{item?.numOfAcFleet}</td>
                    <td>{item?.monthlyHours}</td>
                    <td>{item?.monthlyCycles}</td>
                    <td>{item?.monthlyAvgFltUtilHours}</td>
                    <td>{item?.monthlyAvgFltUtilCycles}</td>
                    <td>{item?.dailyAvgFltUtilHours}</td>
                    <td>{item?.dailyAvgFltUtilCycles}</td>
                  </tr>
                ))}
              </tbody>
              </table>
            </ARMReportTable>
          </ResponsiveTable>
          <table style={{width: "100%",  pageBreakBefore: 'always'}}>
          <Row style={{ marginTop: "50px" }}>
            <Col span={20} offset={3}>
              <h3 className="none">empty</h3>
              <h3 style={{ textAlign: "center" }} className="secondGraph">
                MONTHLY AVG FLEET UTILIZATION
              </h3>
              <h3 className="none">empty</h3>
              <Column style={{ height: "300px" }} {...configg} />
            </Col>
          </Row>
          <Row style={{ marginTop: "50px" }}>
            <Col span={20} offset={3}>
              <h3 className="none">empty</h3>
              <h3 style={{ textAlign: "center" }} className="secondGraph">
                DAILY AVG FLEET UTILIZATION
              </h3>
              <h3 className="none">empty</h3>
              <Column style={{ height: "300px" }} {...config} />
            </Col>
          </Row>
          </table>
        </FleetUtilizationList>
      </ARMCard>
    </CommonLayout>
  );
};

export default FleetUtilization;
