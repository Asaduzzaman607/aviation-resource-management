import { FilterOutlined, PrinterOutlined, ProfileOutlined, RollbackOutlined } from "@ant-design/icons";
import { Breadcrumb, Col, DatePicker, Form, Row, Select, Space, Typography } from "antd";
import React, { createRef, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactToPrint from "react-to-print";
import styled from "styled-components";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import SuccessButton from "../../common/buttons/SuccessButton";
import CommonLayout from "../../layout/CommonLayout";
import logo from "../../../components/images/us-bangla-logo.png";
import ARMButton from "../../common/buttons/ARMButton";
import ResponsiveTable from "../../common/ResposnsiveTable";
import { ARMReportTable } from "../../planning/report/ARMReportTable";
import moment from "moment";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import { notifyResponseError } from "../../../lib/common/notifications";
import API from "../../../service/Api";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import { useBoolean } from "react-use";
import { Column } from "@ant-design/plots";

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

const EngineIncidentReport = () => {
  const [form] = Form.useForm();
  const reportRef = createRef();
  const [submitting, toggleSubmitting] = useBoolean(false);
  const [engineIncident,setEngineIncident] = useState([]);
  const [aircraftModel, setAircraftModel] = useState([]);
  const [shutDownData, setShutDownData] = useState([]);
  const [engineRemovalData, setSEngineRemovalData] = useState([]);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        const [fromDate, toDate] = values.dateRange || "";

        const lastDate = moment(toDate).endOf("month");
        const customValues = {
          aircraftModelId: values.aircraftModelId,
          fromDate: DateTimeConverter.momentDateToString(fromDate) || null,
          toDate: DateTimeConverter.momentDateToString(lastDate) || null,
        };
        const { data } = await API.post(`engine-incidents/report`,customValues);
        setEngineIncident(data);

        let shutDownArray = [];

        data.engineInFlightShutDownsViewModelList.forEach((a)=>{
            shutDownArray.push({
              type:"NO. OF IFSD",
              month:moment().month(a?.month - 1).format("MMM") + "-" + a?.year,
              value:a?.noOfIfsd
            });
          })
        setShutDownData(shutDownArray)
        let removalArray = [];
        data.engineUnscheduledRemovalsViewModelList.forEach((a)=>{
            removalArray.push({
              type:"NO. OF REMV",
              month:moment().month(a?.month - 1).format("MMM") + "-" + a?.year,
              value:a?.noOfRemv
            });
          })

        setSEngineRemovalData(removalArray);
        toggleSubmitting();
      } catch (error) {
        notifyResponseError(error);
      } finally {
        toggleSubmitting(false);
      }
    },
    [toggleSubmitting]
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
  
  const configg = {
    data:shutDownData,
    isGroup: true,
    xField: "month",
    yField: "value",
    seriesField: "type",
    columnWidthRatio: 0.6,
    color: "#b85a5a",
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
    data:engineRemovalData,
    isGroup: true,
    xField: "month",
    yField: "value",
    seriesField: "type",
    columnWidthRatio: 0.6,
    color: "#b85a5a",
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

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/reliability">
              <ProfileOutlined /> &nbsp;Reliability
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Engine Incidents</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={
          <Row justify="space-between">
            <Col>
              Engine Incidents
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
            // dateRange: [
            //   moment(firstDay, "DD-MM-YYYY"),
            //   moment(lastDay, "DD-MM-YYYY"),
            // ],
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
                  format="DD-MM-YYYY"
                  style={{ width: "100%" }}
                 // picker="month"
                //   disabledDate={(current) => {
                //     return current && current.valueOf() > lastDay;
                //   }}
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
                  <ARMButton size="middle" type="primary" >
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
              <p>ENGINE IN-FLIGHT SHUT DOWNS</p>
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
                  {/* <b> {aircraftModelName}</b> */}
                </span>{" "}
                <br />
                <span style={{ textAlign: "center" }}>
                  {" "}
                  <b>
                    {/* {startDate?.toUpperCase()} {startDate ? "to" : null}{" "}
                    {endDate?.toUpperCase()} */}
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
                    <th>NO. OF IFSD</th>
                    <th>RATE/1000 HRS</th>
                  </tr>
                </thead>
                <tbody>
                  {engineIncident?.engineInFlightShutDownsViewModelList?.map(
                    (item, index) => (
                      <tr key={index}>
                        <td>
                          {moment()
                            .month(item?.month - 1)
                            .format("MMM")}
                          -{item?.year}
                        </td>
                        <td>{item?.noOfIfsd}</td>
                        <td>{item?.rateByHours}</td>
                      </tr>
                    )
                  )}
                </tbody>
                <td className="none" colSpan={10}>
                  empty
                </td>
                <tr>
                  <td style={{ border: "none" }} colSpan={10}>
                    <p style={{ marginBottom: "5px", textAlign: "left" }}>
                    ENGINES UNSCHEDULED REMOVALS
                    </p>
                  </td>
                </tr>
                <thead>
                  <tr className="bulletin-row">
                    <th>MONTH</th>
                    <th>NO. OF REMV.</th>
                    <th>RATE/1000 HRS</th>
                  </tr>
                </thead>
                <tbody>
                  {engineIncident?.engineUnscheduledRemovalsViewModelList?.map(
                    (item, index) => (
                      <tr key={index}>
                        <td>
                          {moment()
                            .month(item?.month - 1)
                            .format("MMM")}
                          -{item?.year}
                        </td>
                        <td>{item?.noOfRemv}</td>
                        <td>{item?.rateByHours}</td>
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
                    ENGINE IN-FLIGHT SHUT DOWNS
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
                    ENGINES UNSCHEDULED REMOVALS
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

export default EngineIncidentReport;
