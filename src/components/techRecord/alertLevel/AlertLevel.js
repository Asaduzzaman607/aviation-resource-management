import {
  FilterOutlined,
  ProfileOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Col,
  DatePicker,
  Form,
  Pagination,
  Row,
  Select,
  Space,
} from "antd";
import React, { createRef, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { useBoolean } from "react-use";
import { notifyResponseError } from "../../../lib/common/notifications";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import Permission from "../../auth/Permission";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import SuccessButton from "../../common/buttons/SuccessButton";
import DebounceSelect from "../../common/DebounceSelect";
import CommonLayout from "../../layout/CommonLayout";
import logo from "../../../components/images/us-bangla-logo.png";
import ResponsiveTable from "../../common/ResposnsiveTable";
import { ARMReportTable } from "../../planning/report/ARMReportTable";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import API from "../../../service/Api";
import moment from "moment";

const AlertLevel = () => {
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

  const alertLevelSubmit = useCallback(
    async (values) => {
      setata(values.ataNoId.label);
      const [fromDate, toDate] = values.dateRange || "";
      const lastDate = moment(toDate).endOf("month");
      const searchValues = {
        aircraftModelId: values?.aircraftModelId,
        locationId: values?.ataNoId.value,
        fromDate: DateTimeConverter.momentDateToString(fromDate) || null,
        toDate: DateTimeConverter.momentDateToString(lastDate) || null,
      };

      try {
        const { data } = await API.post(
          `systems/alert-level-list`,
          searchValues
        );
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

  const reset = () =>{
      form.resetFields();
      setAlertData([]);
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
          <Breadcrumb.Item>Alert Level</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="">
        <ARMCard
          title={
            <Row justify="space-between">
              <Col>Alert Level</Col>
              <Col>
                <Space></Space>
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
                  name="ataNoId"
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
                    <ARMButton onClick={reset} size="middle" type="primary">
                      <RollbackOutlined name="reset" /> Reset
                    </ARMButton>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Row>
            <Col span={24} className="first">
              <Row justify="space-between">
                <Col>
                  <h2>ALERT LEVEL-{alertData[0]?.aircraftModelName}</h2>
                </Col>
                <Col style={{ fontSize: "8px", fontWeight: "bold" }}></Col>
              </Row>
            </Col>
          </Row>
          <ResponsiveTable className="first">
            <ARMReportTable className="service-bulletin-table">
              <tbody>
                <tr>
                  <th>ATA</th>
                  <th>MONTH</th>
                  <th>Year</th>
                  <th>Aircraft Model Name</th>
                  <th>Alert Level</th>
                </tr>
              </tbody>
              <tbody>
                {alertData?.map((data, index) => (
                  <tr key={index}>
                    <td>{data?.aircraftLocationName}</td>
                    <td>{data?.month}</td>
                    <td>{data?.year}</td>
                    <td>{data?.aircraftModelName}</td>
                    <td>{data?.alertLevel}</td>
                  </tr>
                ))}
              </tbody>
            </ARMReportTable>
          </ResponsiveTable>

          {/* {alertData?.length > 0 && (
              <Row justify="center" className="pagination">
                <Col style={{ marginTop: 10 }}>
                  <Pagination
                  current={currentPage}
                  onChange={handlePageChange}
                  pageSize={10}
                  total={totalPages * 10}
                  />
                </Col>
              </Row>
            )} */}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default AlertLevel;
