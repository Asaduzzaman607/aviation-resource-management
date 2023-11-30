import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Col,
  Empty,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Space,
} from "antd";
import { Option } from "antd/lib/mentions";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { usePaginate } from "../../../lib/hooks/paginations";
import AircraftBuildsService from "../../../service/AircraftBuildsService";
import AircraftService from "../../../service/AircraftService";
import Permission from "../../auth/Permission";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import ARMButton from "../../common/buttons/ARMButton";
import ResponsiveTable from "../../common/ResposnsiveTable";
import CommonLayout from "../../layout/CommonLayout";

const EngineTimesList = () => {
  const {
    form : formData,
    collection,
    page,
    totalElements,
    paginate,
    isActive,
    setIsActive,
    fetchData,
    refreshPagination,
    resetFilter,
    size,
  } = usePaginate("engineTimes", "/engine/search");



  const [aircraft,setAircraft]=useState([]);
  const [aircraftId,setAircraftId]=useState();

  const getAllAircraft = async () => {
    try {
      const { data } = await AircraftService.getAllAircraftList();
      setAircraft(data);
    } catch (er) {}
  };

  useEffect(() => {
    (async () => {
      await getAllAircraft();
    })();
  }, []);

  const { t } = useTranslation();

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" />
              &nbsp; {t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Engine Information</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_ENGINE_PROPELLER_LANDING_GEAR_ENGINE_INFORMATION_SEARCH" showFallback>
      <ARMCard
        title={getLinkAndTitle(
          "Engine Information List",
          "/planning/engine/times/add",
          "add",
          "PLANNING_ENGINE_PROPELLER_LANDING_GEAR_ENGINE_INFORMATION_SAVE"
        )}
        
      >
        <Form form={formData} onFinish={fetchData}>
          <Row gutter={20}>
            <Col xs={24} md={6}>
            <Form.Item
                name="aircraftId"
                rules={[
                  {
                    required: true,
                    message: t("planning.Aircrafts.Select Aircraft"),
                  },
                ]}
              >
                <Select
                  placeholder={t("planning.Aircrafts.Select Aircraft")}
                  onChange={setAircraftId}
                >
                  {aircraft?.map((item, index) => {
                    return (
                      <Select.Option key={item.aircraftId} value={item.aircraftId}>
                        {item.aircraftName}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item
                name="size"
                label={t("common.Page Size")}
                initialValue="10"
              >
                <Select id="antSelect">
                  <Option value="10">10</Option>
                  <Option value="20">20</Option>
                  <Option value="30">30</Option>
                  <Option value="40">40</Option>
                  <Option value="50">50</Option>
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
                    onClick={resetFilter}
                  >
                    <RollbackOutlined /> {t("common.Reset")}
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Row className="table-responsive">
          <ResponsiveTable>
            <ARMTable>
              <thead>
                <tr>
                  <th>Aircraft Name</th>
                  <th>Model Name</th>
                  <th>Position Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collection?.map((engine) => (
                  <tr key={engine.aircraftBuildId}>
                    <td>{engine.aircraftName}</td>
                    <td>{engine.partDescription}</td>
                    <td>{engine.positionName}</td>
                    <td>
                      <Space size="small">
                        <Link to={`/planning/engine/times/view/${engine.aircraftBuildId}`}>
                        <Permission permission="PLANNING_ENGINE_PROPELLER_LANDING_GEAR_ENGINE_INFORMATION_SEARCH">
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
                          </Permission>
                        </Link>
                        <Link
                          to={`/planning/engine/times/edit/${engine.aircraftBuildId}`}
                        >
                          <Permission permission="PLANNING_ENGINE_PROPELLER_LANDING_GEAR_ENGINE_INFORMATION_EDIT">
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
export default EngineTimesList;
