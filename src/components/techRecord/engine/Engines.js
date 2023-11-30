import {
  EditOutlined,
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
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LinkAndTitle } from "../../../lib/common/TitleOrLink";
import { usePaginate } from "../../../lib/hooks/paginations";
import Permission from "../../auth/Permission";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import ResponsiveTable from "../../common/ResposnsiveTable";
import CommonLayout from "../../layout/CommonLayout";
import { useDispatch } from "react-redux";
import {
  paginationObjectTemplate,
  setPagination,
} from "../../../reducers/paginate.reducers";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import API from "../../../service/Api";
import { getErrorMessage } from "../../../lib/common/helpers";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import { notifyResponseError } from "../../../lib/common/notifications";
import { DateFormat } from "../../planning/report/Common";

const dateFormat = "YYYY-MM-DD";
const Engines = () => {
  const dispatch = useDispatch();
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
  } = usePaginate("engineIncidents", "/engine-incidents/search");

  const onFinish = (values) => {
    const [startDate, endDate] = values?.dateRange || "";
    const data = {
      ...values,
      aircraftModelId: values?.aircraftModelId,
      startDate: startDate && startDate?.format(dateFormat),
      endDate: endDate && endDate?.format(dateFormat),
    };
    fetchData(data);
  };

  const reset = () => {
    form.resetFields();
    dispatch(
      setPagination({ key: "engineIncidents", data: paginationObjectTemplate })
    );
  };
  const [aircraftModel, setAircraftModel] = useState([]);

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
    form.resetFields();
  }, []);

  const selectEngineIncident = (id) => {
    switch (id) {
      case 0:
        return "ENGINE IN FLIGHT SHUT DOWNS INCIDENTS";
      case 1:
        return "ENGINES UNSCHEDULED REMOVALS";
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

          <Breadcrumb.Item>Engines</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="" showFallback>
        <ARMCard
          title={
            <LinkAndTitle
              title="Engine Incidents"
              link="/reliability/engine-incident/add"
              addBtn
              permission=""
            />
          }
        >
          <Form
            form={form}
            onFinish={onFinish}
            initialValues={{
              aircraftModelId: null,
              size: 10,
            }}
          >
            <Row gutter={20}>
              <Col xs={24} md={6}>
                <Form.Item
                  name="aircraftModelId"
                  rules={[
                    {
                      required: true,
                      message: "Aircraft Model is required",
                    },
                  ]}
                >
                  <Select placeholder="Please Select Aircraft Model">
                    {aircraftModel?.map((item, index) => {
                      return (
                        <Select.Option key={index} value={item.id}>
                          {item?.aircraftModelName}{" "}
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
                    <th>Aircraft Model Name</th>
                    <th>date</th>
                    <th>Engine Incident Type</th>
                    <th>{t("common.Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {collection?.map((incident, index) => (
                    <tr key={index}>
                      <td>{incident?.aircraftModelName}</td>
                      <td>{(incident?.date)}</td>
                      <td>
                        {selectEngineIncident(incident?.engineIncidentsEnum)}
                      </td>
                      <td>
                        <Space size="small">
                          {isActive? <Link
                              to={`/reliability/engine-incident/edit/${incident.id}`}
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
                                <EditOutlined/>
                              </ARMButton>
                            </Permission>
                          </Link> : null}

                          <Permission permission="">
                            <ActiveInactiveButton
                              isActive={isActive}
                              handleOk={async () => {
                                try {
                                  await API.patch(
                                    `engine-incidents/${
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

export default Engines;
