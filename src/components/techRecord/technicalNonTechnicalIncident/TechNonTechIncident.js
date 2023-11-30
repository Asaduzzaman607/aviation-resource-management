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
    font-size: 8px !important;
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
    font-size: 9px !important;
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
    margin-left: 30px !important
}
table.firstGraph{
  text-align: left !important
}
table.secondGraph{
  align-items:center !important;
  justify-content: center !important
}

.desc{
    padding-left:5px !important;
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

const TechNonTechIncident = () => {
  const [form] = Form.useForm();
  const reportRef = createRef();
  const [submitting, toggleSubmitting] = useBoolean(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [aircraftModel, setAircraftModel] = useState([]);
  const [aircraftModelName, setAircraftModelName] = useState();
  const [data, setData] = useState([]);
  const aircraftModelId = Form.useWatch("aircraftModelId", form);

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
          `aircraft-incidents/tech-inc`,
          customValues
        );
        setData(data);

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

  const resetFilter = () =>{
    form.resetFields();
  }

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/reliability">
              <ProfileOutlined /> &nbsp;Reliability
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Technical-Non-Technical Incident</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={
          <Row justify="space-between">
            <Col>
              Technical-Non-Technical Incident
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
              //moment(firstDay, "DD-MM-YYYY"),
              // moment(lastDay, "DD-MM-YYYY"),
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
                  format="DD-MM-YYYY"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item>
                <Space>
                  <ARMButton
                    // loading={submitting}
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
              <p>TECHNICAL INCIDENTS</p>
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
                    <th style={{ width: "20%" }}>DATE/REFERENCE</th>
                    <th style={{ width: "20%" }}>AIRCRAFT</th>
                    <th style={{ width: "60%" }}>DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.technicalIncidentsViewModelList?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {item.date} <br /> ATL: {item.reference}
                      </td>
                      <td>{item.aircraftName}</td>
                      <td
                        className="desc"
                        style={{ textAlign: "left", paddingLeft: "5px" }}
                      >
                        INCIDENT: {item.incidentDes} <br />
                        ACTION: {item.actionDes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ARMReportTable>
            <br />
            <tr>
              <td style={{ border: "none" }} colSpan={10}>
                <p style={{ marginBottom: "5px", textAlign: "left" }}>
                  INCIDENTS-NON-TECHNICAL
                </p>
              </td>
            </tr>
          </ResponsiveTable>
          <ResponsiveTable>
            <ARMReportTable className="service-bulletin-table">
              <table style={{ width: "100%" }}>
                <thead>
                  <tr className="bulletin-row">
                    <th style={{ width: "20%" }}>DATE/REFERENCE</th>
                    <th style={{ width: "20%" }}>AIRCRAFT</th>
                    <th style={{ width: "60%" }}>DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.nonTechnicalIncidentsViewModelList?.map(
                    (item, index) => (
                      <tr key={index}>
                        <td>
                          {item.date} <br /> ATL: {item.reference}
                        </td>
                        <td>{item.aircraftName}</td>
                        <td
                          className="desc"
                          style={{ textAlign: "left", paddingLeft: "5px" }}
                        >
                          INCIDENT: {item.incidentDes} <br />
                          ACTION: {item.actionDes}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </ARMReportTable>
          </ResponsiveTable>
        </IncidentStatisticsList>
      </ARMCard>
    </CommonLayout>
  );
};

export default TechNonTechIncident;
