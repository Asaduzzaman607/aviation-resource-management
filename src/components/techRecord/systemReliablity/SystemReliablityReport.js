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
import { Column } from "@ant-design/plots";
import ReactToPrint from "react-to-print";
import styled from "styled-components";
import Permission from "../../auth/Permission";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import SuccessButton from "../../common/buttons/SuccessButton";
import CommonLayout from "../../layout/CommonLayout";
import logo from "../../../components/images/us-bangla-logo.png";
import ResponsiveTable from "../../common/ResposnsiveTable";
import { ARMReportTable } from "../../planning/report/ARMReportTable";
import CompanyLogo from "../../planning/report/CompanyLogo";
import { notifyResponseError } from "../../../lib/common/notifications";
import API from "../../../service/Api";
import { useBoolean } from "react-use";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import { uniqBy } from "lodash";
import moment from "moment";

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
  .secondGraph{
    text-align:center !important
  }

  .border-none{
    border: none!important;
}
.logo{
  margin-bottom: 10px !important
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

const SystemReliablityReport = () => {
  const reportRef = createRef();
  const [form] = Form.useForm();
  const [systemData, setSystemData] = useState([]);
  const [submitting, toggleSubmitting] = useBoolean(false);
  const [aircraftModel, setAircraftModel] = useState([]);
  const [size, setSize] = useState();
  const [date, setDate] = useState();
  const [aircraftModelName, setAircraftModelName] = useState();
  const aircraftModelId = Form.useWatch("aircraftModelId", form);
  const [systemGraph, setSystemGraph] = useState([]);

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


  const systemSubmit = useCallback(
    async (values) => {
      const [fromDate, toDate] = values.dateRange || "";
      setDate(moment(fromDate).format("MMMM ' YYYY").toUpperCase());
      const searchValues = {
        aircraftModelId: values?.aircraftModelId,
        fromDate: DateTimeConverter.momentDateToString(fromDate) || null,
        toDate: DateTimeConverter.momentDateToString(toDate) || null,
      };

      try {
        const { data } = await API.post(`systems/reliability`, searchValues);

        setSystemData(data);
        const res = {
          locationViewModelListData: [],
        };
        data.forEach((d) => {
          res.locationViewModelListData.push(
            ...d.aircraftDefectListViewModelList
          );
        });
        const result = res.locationViewModelListData.flat();

        const dup = uniqBy(result, (obj) => obj.aircraftId);

        setSize(dup);

        let system = [];
        data.forEach((d) => {
          let sum = 0;
          d.aircraftDefectListViewModelList.forEach((modleList) => {
            sum += modleList.defectCount;
          });
          let tempObj = {
            systemName: d.systemName,
            defectCount: sum,
          };
          system.push(tempObj);
        });
        setSystemGraph(system);

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

  function findDefectByAircraftId(list, airId) {
    const data = list.find((l) => l.aircraftId === airId);
    if (data) {
      return <td>{data.defectCount}</td>;
    } else {
      return <td>0</td>;
    }
  }

  useEffect(() => {
    getAllAircraftModel();
  }, []);

  const resetFilter = () => {
    form.resetFields();
    setSystemData([]);
    setSystemGraph([]);
    setSize([]);
    setAircraftModelName();
    setDate();
  };

  const config = {
    data: systemGraph,
    isGroup: true,
    xField: "systemName",
    yField: "defectCount",
    seriesField: "systemName",
    columnWidthRatio: 0.6,
    color: ["#4f81bd"],
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
          <Breadcrumb.Item>System Reliability</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="" showFallback>
        <ARMCard
          title={
            <Row justify="space-between">
              <Col>System Reliability</Col>
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
            onFinish={systemSubmit}
          >
            <Row gutter={20}>
              <Col xs={24} md={4}>
                <Form.Item
                  name="aircraftModelId"
                  rules={[
                    {
                      required: true,
                      message: "Aircraft Model is required ",
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
              <Col span={24} className="first">
                <Row justify="space-between" className="logo">
                  <Col>
                    <img src={logo} alt="" width={110} />
                  </Col>
                  <Col style={{ fontSize: "8px", fontWeight: "bold" }}>
                    <h2>AIRCRAFT SYSTEM RELIABILITY- {aircraftModelName}</h2>
                  </Col>
                </Row>
              </Col>
            </Row>
            <ResponsiveTable className="first">
              <ARMReportTable className="service-bulletin-table">
                <tbody>
                  <tr>
                    <th rowSpan={2}>MONTH</th>
                    <th rowSpan={2}>ATA</th>
                    <th rowSpan={2}>SYSTEM</th>
                    <th colSpan={size?.length}>AIRCRAFT REGISTRATION</th>
                    <th rowSpan={2}>TOTAL</th>
                    <th rowSpan={2}>RATE/1000FH</th>
                    <th rowSpan={2}>ALERT LEVEL</th>
                  </tr>
                  <tr>
                    {size?.map((m) => (
                      <th>{m?.aircraftName}</th>
                    ))}
                  </tr>
                </tbody>
                <tbody>
                  {systemData?.map((data, index) => (
                    <tr key={index}>
                      {index===0 && <td rowSpan={systemData?.length} >{index=== 0 ? date : null}</td>}
                      <td>{data.locationName}</td>
                      <td>{data.systemName}</td>
                      {size?.map((a) => {
                        return findDefectByAircraftId(
                          data.aircraftDefectListViewModelList,
                          a.aircraftId
                        );
                      })}
                      <td>{data.total}</td>
                      <td>{data.rate}</td>
                      <td>{data.alertLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </ARMReportTable>
            </ResponsiveTable>
            <table style={{ width: "100%", pageBreakBefore: "always" }}>
              <Row style={{ marginTop: "50px" }}>
                <Col span={24}>
                  <p
                    style={{ textAlign: "center", fontWeight: "bold" }}
                    className="secondGraph"
                  >
                    {date}
                  </p>
                  <Column style={{ height: "300px" }} {...config} />
                </Col>
              </Row>
            </table>
          </ServiceBulletin>
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default SystemReliablityReport;
