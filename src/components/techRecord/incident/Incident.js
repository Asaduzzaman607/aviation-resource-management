import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  ProfileOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Col,
  DatePicker,
  Empty,
  Form,
  notification,
  Pagination,
  Row,
  Select,
  Space,
} from "antd";
import { Option } from "antd/lib/mentions";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../../lib/common/helpers";
import { notifyResponseError } from "../../../lib/common/notifications";
import { LinkAndTitle } from "../../../lib/common/TitleOrLink";
import { usePaginate } from "../../../lib/hooks/paginations";
import {
  paginationObjectTemplate,
  setPagination,
} from "../../../reducers/paginate.reducers";
import AircraftService from "../../../service/AircraftService";
import API from "../../../service/Api";
import Permission from "../../auth/Permission";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import ARMButton from "../../common/buttons/ARMButton";
import ResponsiveTable from "../../common/ResposnsiveTable";
import CommonLayout from "../../layout/CommonLayout";
import { DateFormat } from "../../planning/report/Common";

const dateFormat = "YYYY-MM-DD";

const Incident = () => {
  const {
    form,
    collection,
    page,
    totalElements,
    paginate,
    isActive,
    setIsActive,
    fetchData,
    refreshPagination,
    size,
  } = usePaginate("aircraftIncident", "/aircraft-incidents/search");

  const [aircrafts, setAircrafts] = useState([]);
  const dispatch = useDispatch();

  const onFinish = (values) => {
    const [startDate, endDate] = values.dateRange || "";
    const data = {
      ...values,
      aircraftId: values.aircraftId,
      startDate: startDate && startDate.format(dateFormat),
      endDate: endDate && endDate.format(dateFormat),
    };
    fetchData(data);
  };

  const getAllAircraft = async () => {
    try {
      const { data } = await AircraftService.getAllAircraftList();
      setAircrafts(data);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const reset = () => {
    form.resetFields();
    dispatch(
      setPagination({ key: "aircraftIncident", data: paginationObjectTemplate })
    );
  };

  useEffect(() => {
    getAllAircraft();
  }, []);

  const selectClassification = (id) => {
    switch (id) {
      case 0:
        return "TAKE OFF ABANDONED";
      case 1:
        return "RETURNS BEFORE TAKE OFF";
      case 2:
        return "RETURNS AFTER TAKE OFF";
      case 3:
        return "ENGINE SHUT DOWN IN FLIGHT";
      case 4:
        return "FIRE WARNING LIGHT";
      case 5:
        return "FUEL DUMPING";
      case 6:
        return "OTHER REPORTABLE DEFECT";
      case 7:
        return "TURBULENCE";
      case 8:
        return "LIGHTNING STRIKE";
      case 9:
        return "BIRD STRIKE JACKAL HIT";
      case 10:
        return "FOREIGN OBJECT DAMAGE";
      case 11:
        return "AC DAMAGED BY GROUND EQPT";
      case 12:
        return "OTHER";
      default:
        return null;
    }
  };

  const selectIncidentType = (id) => {
    switch (id) {
      case 0:
        return "TECHNICAL INCIDENTS";
      case 1:
        return "NON TECHNICAL INCIDENTS";
      default:
        return null;
    }
  };

  const { t } = useTranslation();
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/reliability">
              <ProfileOutlined />
              &nbsp; Reliability
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Incidents</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="" showFallback>
        <ARMCard
          title={
            <LinkAndTitle
              title="Incidents"
              link="/reliability/incident/add"
              addBtn
              permission=""
            />
          }
        >
          <Form
            form={form}
            onFinish={onFinish}
            initialValues={{
              aircraftId: null,
              size: 10,
            }}
          >
            <Row gutter={20}>
              <Col xs={24} md={6}>
                <Form.Item
                  name="aircraftId"
                  rules={[
                    {
                      required: false,
                      message: "Aircraft is required",
                    },
                  ]}
                >
                  <Select placeholder="Please Select Aircraft">
                    {aircrafts?.map((item,index) => {
                      return (
                        <Select.Option key={index} value={item.aircraftId}>
                          {item?.aircraftName}{" "}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
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

              <Col xs={24} md={4}>
                <Form.Item name="size" label={t("common.Page Size")}>
                  <Select id="antSelect">
                    <Select.Option value="10">10</Select.Option>
                    <Select.Option value="20">20</Select.Option>
                    <Select.Option value="30">30</Select.Option>
                    <Select.Option value="40">40</Select.Option>
                    <Select.Option value="50">50</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item>
                  <Space>
                    <ARMButton size="middle" type="primary" htmlType="submit">
                      <FilterOutlined /> {t("common.Filter")}
                    </ARMButton>
                    <ARMButton
                      size="middle"
                      type="primary"
                      htmlType="reset"
                      onClick={reset}
                    >
                      <RollbackOutlined /> {t("common.Reset")}
                    </ARMButton>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <ActiveInactive isActive={isActive} setIsActive={setIsActive} />

          <Row className="table-responsive">
            <ResponsiveTable>
              <ARMTable>
                <thead>
                  <tr>
                    <th>Aircraft</th>
                    <th>Incident Type</th>
                    <th>Classification</th>
                    <th>Date</th>
                    <th>{t("common.Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {collection?.map((incident, index) => (
                    <tr key={index}>
                      <td>{incident.aircraftName}</td>
                      <td>{selectIncidentType(incident.incidentTypeEnum)}</td>
                      <td>
                        {selectClassification(incident.classificationTypeEnum)}
                      </td>
                      <td>{DateFormat(incident.date)}</td>
                      <td>
                        <Space size="small">
                          <Link
                            to={`/reliability/incident/view/${incident.id}`}
                          >
                            <ARMButton
                              type="primary"
                              size="small"
                              style={{
                                backgroundColor: "#4aa0b5",
                                borderColor: "#4aa0b5",
                              }}
                            >
                              <EyeOutlined />
                            </ARMButton>
                          </Link>

                          <Link
                            to={`/reliability/incident/edit/${incident.id}`}
                          >
                            <Permission permission="">
                              <ARMButton
                                type="primary"
                                size="small"
                                style={{
                                  backgroundColor: "#6e757c",
                                  borderColor: "#6e757c",
                                }}
                              >
                                <EditOutlined />
                              </ARMButton>
                            </Permission>
                          </Link>

                          <Permission permission="">
                            <ActiveInactiveButton
                              isActive={isActive}
                              handleOk={async () => {
                                try {
                                  await API.patch(
                                    `aircraft-incidents/${
                                      incident.id
                                    }?active=${!isActive}`
                                  );
                                  notification["success"]({
                                    message: t(
                                      "common.Status Changed Successfully"
                                    ),
                                  });
                                  refreshPagination();
                                } catch (e) {
                                  notification["error"]({
                                    message: getErrorMessage(e),
                                  });
                                }
                              }}
                            />
                          </Permission>
                        </Space>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ARMTable>
            </ResponsiveTable>
          </Row>

          {collection?.length === 0 ? (
            <Row>
              <Col style={{ margin: "30px auto" }}>
                <Empty />
              </Col>
            </Row>
          ) : (
            <Row justify="center">
              <Col style={{ marginTop: 10 }}>
                <Pagination
                  showSizeChanger={false}
                  onShowSizeChange={console.log}
                  pageSize={size}
                  current={page}
                  onChange={paginate}
                  total={totalElements}
                />
              </Col>
            </Row>
          )}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default Incident;
