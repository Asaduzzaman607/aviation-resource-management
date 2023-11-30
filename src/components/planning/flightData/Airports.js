import React, { useEffect } from "react";
import {
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Breadcrumb,
  notification,
  Empty,
  Pagination,
} from "antd";
import ARMTable from "../../common/ARMTable";
import CommonLayout from "../../layout/CommonLayout";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import { Link } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";

import { FilterOutlined, RollbackOutlined } from "@ant-design/icons";

import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import AirportService from "../../../service/AirportService";
import { getErrorMessage } from "../../../lib/common/helpers";
import ResponsiveTable from "../../common/ResposnsiveTable";
import ViewButton from "../../common/buttons/ViewButton";
import EditButton from "../../common/buttons/EditButton";
import ARMForm from "../../../lib/common/ARMForm";
import { usePaginate } from "../../../lib/hooks/paginations";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import { useTranslation } from "react-i18next";
import Permission from "../../auth/Permission";

const Airports = () => {
  const {
    form,
    collection,
    page,
    totalPages,
    totalElements,
    paginate,
    isActive,
    setIsActive,
    fetchData,
    refreshPagination,
    resetFilter,
    size,
  } = usePaginate("airports", "airport/search/");

  useEffect(() => {
    fetchData();
  }, []);

  const { t } = useTranslation();

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {" "}
            <Link to="/planning">
              {" "}
              <i className="fas fa-chart-line" /> &nbsp;{t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("planning.Airports.Airports")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission="PLANNING_CONFIGURATIONS_AIRPORT_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            t("planning.Airports.Airport List"),
            "/planning/airports/add",
            true,
            "PLANNING_CONFIGURATIONS_AIRPORT_SAVE"
          )}
        >
          <ARMForm
            initialValues={{ pageSize: 10 }}
            onFinish={fetchData}
            form={form}
          >
            <Row gutter={20}>
              <Col xs={24} md={12} lg={6}>
                <Form.Item label="" name="name">
                  <Input
                    placeholder={t("planning.Airports.Enter Airport Name")}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={6}>
                <Form.Item label="" name="iataCode">
                  <Input placeholder={t("planning.Airports.Enter IATA Code")} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12} lg={6}>
                <Form.Item
                  name="size"
                  label={t("common.Page Size")}
                  initialValue="10"
                >
                  <Select id="antSelect">
                    <Select.Option value="10">10</Select.Option>
                    <Select.Option value="20">20</Select.Option>
                    <Select.Option value="30">30</Select.Option>
                    <Select.Option value="40">40</Select.Option>
                    <Select.Option value="50">50</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12} lg={6}>
                <Form.Item>
                  <Space>
                    <ARMButton size="middle" type="primary" htmlType="submit">
                      <FilterOutlined /> {t("common.Filter")}
                    </ARMButton>
                    <ARMButton
                      size="middle"
                      type="primary"
                      htmlType="submit"
                      onClick={resetFilter}
                    >
                      <RollbackOutlined /> {t("common.Reset")}
                    </ARMButton>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </ARMForm>
          <ActiveInactive isActive={isActive} setIsActive={setIsActive} />

          <Row className="table-responsive">
            <ResponsiveTable>
              <ARMTable>
                <thead>
                  <tr>
                    <th>{t("planning.Airports.Name")}</th>
                    <th>{t("planning.Airports.IATA Code")}</th>
                    <th>{t("planning.Airports.Country Code")}</th>
                    <th>{t("common.Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {collection?.map((airport, index) => (
                    <tr key={index}>
                      <td>{airport.name}</td>
                      <td> {airport.iataCode}</td>
                      <td> {airport.countryCode}</td>
                      <td>
                        <Space size="small">
                          <Link to={`view/${airport.id}`}>
                            <ViewButton />
                          </Link>
                          {isActive ? (
                            <Link to={`edit/${airport.id}`}>
                              <Permission permission="PLANNING_CONFIGURATIONS_AIRPORT_EDIT">
                                <EditButton />
                              </Permission>
                            </Link>
                          ) : null}
                          <Permission permission="PLANNING_CONFIGURATIONS_AIRPORT_DELETE">
                            <ActiveInactiveButton
                              isActive={isActive}
                              handleOk={async () => {
                                try {
                                  await AirportService.toggleStatus(airport.id);
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

          {collection.length === 0 ? (
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

export default Airports;
