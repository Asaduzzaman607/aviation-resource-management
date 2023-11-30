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
import { Column } from "@ant-design/plots";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import { Link } from "react-router-dom";
import {
  FilterOutlined,
  PrinterOutlined,
  ProfileOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import ARMCard from "../../common/ARMCard";
import ReactToPrint from "react-to-print";
import styled from "styled-components";
import SuccessButton from "../../common/buttons/SuccessButton";
import ARMButton from "../../common/buttons/ARMButton";
import logo from "../../../components/images/us-bangla-logo.png";
import ResponsiveTable from "../../common/ResposnsiveTable";
import { ARMReportTable } from "../../planning/report/ARMReportTable";
import moment from "moment";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import { useBoolean } from "react-use";
import DateTimeConverter from "../../../converters/DateTimeConverter";
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
.service-bulletin-table{
  min-height:380px !important;
}
.aircraftHeader{
    margin-left: 23px !important
}
table.firstGraph{
  text-align: left !important
}
table.secondGraph{
  align-items:center !important;
  justify-content: center !important
}

  @page {
    size: landscape;
  }
`;

const IncidentStatisticsList = styled.div`
  .service-bulletin-table {
    font-weight: normal;
  }

  .bulletin-row td {
    font-size: 7px;
    padding: 0 !important;
  }

  .service-table th {
    background-color: #d9d9d9 !important;
  }

  .border-none {
    border: none;
  }

  .service-table thead tr th {
    height: 8px !important;
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

const IncidentStatistics = () => {
  const [form] = Form.useForm();
  const reportRef = createRef();
  const [submitting, toggleSubmitting] = useBoolean(false);
  const [aircraftModel, setAircraftModel] = useState([]);
  const [incidentStatistics, setIncidentStatistics] = useState([]);
  const [technicalIncident, setTechnicalIncident] = useState([]);
  const [nonTechnicalIncident, setNonTechnicalIncident] = useState([]);
  const [aircraftModelName, setAircraftModelName] = useState();
  const aircraftModelId = Form.useWatch("aircraftModelId", form);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  // const [firstData,setFirstData] = useState([]);
  //const [secondData,setSecondData] = useState([]);
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
          `aircraft-incidents/statistics`,
          customValues
        );
        setIncidentStatistics(data);

        let technicalArray = [];

        data.technicalViewModel.forEach((a)=>{
          technicalArray.push({
            type:"TAKE-OFF ABANDONED",
            month:moment().month(a?.month - 1).format("MMM") + "-" + a?.year,
            value:a?.takeOffAbandoned
          });
          technicalArray.push({
            type:"RETURNS BEFORE TAKE-OFF",
            month:moment().month(a?.month - 1).format("MMM") + "-" + a?.year,
            value:a?.returnBeforeTakeOff
          });
          technicalArray.push({
            type:"RETURNS AFTER TAKE-OFF",
            month:moment().month(a?.month - 1).format("MMM") + "-" + a?.year,
            value:a?.returnAfterTakeOff
          });
          technicalArray.push({
            type:"ENGINE SHUT DOWN IN FLIGHT",
            month:moment().month(a?.month - 1).format("MMM") + "-" + a?.year,
            value:a?.engineShutDownInFlight
          });
          technicalArray.push({
            type:"FIRE WARNING LIGHT",
            month:moment().month(a?.month - 1).format("MMM") + "-" + a?.year,
            value:a?.fireWarningLight
          });
          technicalArray.push({
            type:"FUEL DUMPING",
            month:moment().month(a?.month - 1).format("MMM") + "-" + a?.year,
            value:a?.fuelDumping
          });
          technicalArray.push({
            type:"OTHER REPORTABLE DEFECT",
            month:moment().month(a?.month - 1).format("MMM") + "-" + a?.year,
            value:a?.otherReportableDefect
          });
        })

        setTechnicalIncident(technicalArray);


        let nonTechnicalArray = [];

        data?.nonTechnicalViewModel.forEach((a)=>{
          nonTechnicalArray.push({
            type:"TURBULENCE",
            month:moment().month(a?.month - 1).format("MMM") + "-" + a?.year,
            value:a?.turbulence
          });
          nonTechnicalArray.push({
            type:"LIGHTNING STRIKE",
            month:moment().month(a?.month - 1).format("MMM") + "-" + a?.year,
            value:a?.lightningStrike
          });
          nonTechnicalArray.push({
            type:"BIRD STRIKE/JACKAL HIT",
            month:moment().month(a?.month - 1).format("MMM") + "-" + a?.year,
            value:a?.birdStrike
          });
          nonTechnicalArray.push({
            type:"FOREIGN OBJECT DAMAGE",
            month:moment().month(a?.month - 1).format("MMM") + "-" + a?.year,
            value:a?.foreignObjectDamage
          });
          nonTechnicalArray.push({
            type:"A/C DAMAGED BY GROUND EQPT",
            month:moment().month(a?.month - 1).format("MMM") + "-" + a?.year,
            value:a?.acDamagedByGroundEqpt
          });
          nonTechnicalArray.push({
            type:"OTHER",
            month:moment().month(a?.month - 1).format("MMM") + "-" + a?.year,
            value:a?.other
          });
        })
        setNonTechnicalIncident(nonTechnicalArray);
        toggleSubmitting();
      } catch (error) {
        notifyResponseError(error);
      } finally {
        toggleSubmitting(false);
      }
    },
    [toggleSubmitting]
  );


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

  const resetFilter = () => {
    form.resetFields();
    setIncidentStatistics([]);
  };

  const configg = {
    data: technicalIncident,
    isGroup: true,
    xField: "month",
    yField: "value",
    seriesField: "type",
    columnWidthRatio: 0.6,
    color: [
      "#4f81bd",
      "#4bacc6",
      "#c0504d",
      "#f79646",
      "#9bbb59",
      "#2c4d75",
      "#8064a2",
    ],
    label: {
      position: "middle",
      offsetY: -10,
      layout: [
        {
          type: "interval-adjust-position",
        },
        {
          type: "interval-hide-overlap",
        },
        {
          type: "adjust-color",
        },
      ],
    },
  };

  const config = {
    data:nonTechnicalIncident,
    isGroup: true,
    xField: "month",
    yField: "value",
    seriesField: "type",
    columnWidthRatio: 0.6,
    color: ["#4f81bd", "#c0504d", "#9ebd5e", "#4242c4", "#f7994c", "#2c4d75"],
    label: {
      position: "middle",
      offsetY: -10,
      layout: [
        {
          type: "interval-adjust-position",
        },
        {
          type: "interval-hide-overlap",
        },
        {
          type: "adjust-color",
        },
      ],
    },
  };

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
          <Breadcrumb.Item>Incidents Statistics</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={
          <Row justify="space-between">
            <Col>
              Incidents Statistics
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
          initialValues={{
            aircraftModelId: null,
            dateRange: [
              moment(firstDay, "DD-MM-YYYY"),
              moment(lastDay, "DD-MM-YYYY"),
            ],
          }}
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

        <IncidentStatisticsList ref={reportRef}>
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
              <p>INCIDENTS ISTATISTICS</p>
            </Col>
            <Col span={12}>
              <Typography.Title level={4}>
                <span
                  className="aircraftHeader"
                  style={{
                    textDecoration: "underline",
                    textAlign: "center",
                    marginLeft: "33px",
                  }}
                >
                  <b> {aircraftModelName}</b>
                </span>{" "}
                <br />
                <span style={{ textAlign: "center" }}>
                  {" "}
                  <b>
                    {startDate?.toUpperCase()} {startDate ? "to" : null}{" "}
                    {endDate?.toUpperCase()}
                  </b>
                </span>
              </Typography.Title>
            </Col>
          </Row>
          <ResponsiveTable>
            <ARMReportTable className="service-bulletin-table">
              <table className="report-container" style={{ width: "100%" }}>
                <thead>
                  <tr className="bulletin-row">
                    <th>MONTH</th>
                    <th>TAKE-OFF ABANDONED</th>
                    <th>RETURNS BEFORE TAKE-OFF</th>
                    <th>RETURNS AFTER TAKE-OFF</th>
                    <th>ENGINE SHUT DOWN IN FLIGHT</th>
                    <th>FIRE WARNING LIGHT</th>
                    <th>FUEL DUMPING</th>
                    <th>OTHER REPORTABLE DEFECT</th>
                    <th>TOTAL</th>
                    <th>RATE/1000 FLYING HOURS</th>
                  </tr>
                </thead>
                <tbody>
                  {incidentStatistics?.technicalViewModel?.map(
                    (item, index) => (
                      <tr key={index}>
                        <td>{moment().month(item?.month - 1).format("MMM")}-{item?.year}</td>
                        <td>{item?.takeOffAbandoned}</td>
                        <td>{item?.returnBeforeTakeOff}</td>
                        <td>{item?.returnAfterTakeOff}</td>
                        <td>{item?.engineShutDownInFlight}</td>
                        <td>{item?.fireWarningLight}</td>
                        <td>{item?.fuelDumping}</td>
                        <td>{item?.otherReportableDefect}</td>
                        <td>{item?.technicalTotal}</td>
                        <td>{item?.technicalRate}</td>
                      </tr>
                    )
                  )}
                </tbody>
                <td className="none" colSpan={10}>empty</td>
                <tr>
                  <td style={{ border: "none" }} colSpan={10}>
                    <p style={{ marginBottom: "5px", textAlign: "left" }}>
                      INCIDENTS-NON-TECHNICAL
                    </p>
                  </td>
                </tr>
                <thead>
                  <tr className="bulletin-row">
                    <th>MONTH</th>
                    <th>TURBULENCE</th>
                    <th>LIGHTNING STRIKE</th>
                    <th>BIRD STRIKE/JACKAL HIT</th>
                    <th>FOREIGN OBJECT DAMAGE</th>
                    <th colSpan={2}>A/C DAMAGED BY GROUND EQPT</th>
                    <th>OTHER</th>
                    <th>TOTAL</th>
                    <th>RATE/1000 FLYING HOURS</th>
                  </tr>
                </thead>
                <tbody>
                  {incidentStatistics?.nonTechnicalViewModel?.map(
                    (item, index) => (
                      <tr key={index}>
                        <td>{moment().month(item?.month - 1).format("MMM")}-{item?.year}</td>
                        <td>{item?.turbulence}</td>
                        <td>{item?.lightningStrike}</td>
                        <td>{item?.birdStrike}</td>
                        <td>{item?.foreignObjectDamage}</td>
                        <td colSpan={2}>{item?.acDamagedByGroundEqpt}</td>
                        <td>{item?.other}</td>
                        <td>{item?.nonTechnicalTotal}</td>
                        <td>{item?.nonTechnicalRate}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </ARMReportTable>
          </ResponsiveTable>

          <table style={{ width: "100%", pageBreakBefore: "always" }}>
            <Row style={{ marginTop: "50px" }}>
              <Col span={24}>
                <p
                  style={{ textAlign: "center", width: "100%",fontWeight:"bold" }}
                  className="secondGraph"
                >
                  INCIDENTS-TECHNICAL
                </p>
                <Column style={{ height: "300px" }} {...configg} />
              </Col>
            </Row>

            <Row style={{ marginTop: "50px" }}>
              <Col span={24}>
                <p
                  style={{ textAlign: "center", width: "100%",fontWeight:"bold" }}
                  className="firstGraph"
                >
                  INCIDENTS-NON-TECHNICAL
                </p>
                <Column style={{ height: "300px" }} {...config} />
              </Col>
            </Row>
          </table>
        </IncidentStatisticsList>
      </ARMCard>
    </CommonLayout>
  );
};

export default IncidentStatistics;
