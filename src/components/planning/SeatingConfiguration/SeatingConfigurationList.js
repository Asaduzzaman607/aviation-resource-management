import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  LockOutlined,
  RollbackOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  notification,
  Pagination,
  Empty,
} from "antd";
import { Option } from "antd/lib/mentions";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import SeatingConfigurationService from "../../../service/SeatingConfigurationService";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import { useDispatch } from "react-redux";
import { paginationObjectTemplate, setPagination } from "../../../reducers/paginate.reducers";
import { fetchPagination, usePaginate } from "../../../lib/hooks/paginations";
import { getErrorMessage } from "../../../lib/common/helpers";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import { useTranslation } from "react-i18next";
import Permission from "../../auth/Permission";
import AircraftService from "../../../service/AircraftService";

const SeatingConfigurationList = () => {
  const dispatch = useDispatch();
  //const [form] = Form.useForm();
  // const [isActive, setIsActive] = useState(true);
  const [seatingConfiguration, setSeatingConfiguration] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [cabin, setCabin] = useState([]);

  const { t } = useTranslation()

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
  } = usePaginate("aircraftCabin", "aircraft/cabin/search");

  const getAllCabin = async () => {
    try {
      const { data } = await SeatingConfigurationService.getAllCAbin();
      setCabin(data);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };
  const getAllAircraft = async () => {
    try {
      const { data } = await AircraftService.getAllAircraftList();
      setAircraft(data);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const onFinish = async (values) => {
    // const d = {
    //   activeStatus: isActive,
    //   cabinId: values ? values.cabinId : "",
    //   aircraftId: values ? values.aircraftId : "",
    // };
    // const { data } =
    //   await SeatingConfigurationService.searchSeatingConfiguration(d);
    // setSeatingConfiguration(data.model);
    // dispatch(setPagination(data));
  };

  useEffect(() => {
    getAllCabin();
    getAllAircraft();
  }, []);
  useEffect(() => {
    onFinish();
  }, []);
  useEffect(() => {
    onFinish();
  }, [isActive]);
  const handleStatus = async (id, value) => {
    const { data } = await SeatingConfigurationService.changeStatus(id, value);
    refreshPagination();
    notification["success"]({
      message: t("common.Status Changed Successfully"),
    });
  };
  
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-chart-line" />
            <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t("planning.Seating Configurations.Seating Configurations")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_AIRCRAFT_SEATING_CONFIGURATION_SEARCH" showFallback>
      <ARMCard title={getLinkAndTitle(t("planning.Seating Configurations.Seating Configuration List"), "/planning/seating-configurations/add", true,"PLANNING_AIRCRAFT_SEATING_CONFIGURATION_SAVE")}>
        <Form form={form} onFinish={fetchData}>
          <Row gutter={20}>
            <Col xs={24} md={6}>
              <Form.Item name="aircraftId">
                <Select placeholder={t("planning.Aircrafts.Select Aircraft")}>
                  {aircraft?.map((item, index) => {
                    return (
                      <Option key={index} value={item.aircraftId}>
                        {item.aircraftName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="cabinId">
                <Select placeholder={t("planning.Cabins.Select Cabin")}>
                  {cabin?.map((item, index) => {
                    return (
                      <Option key={item.cabinId} value={item.cabinId}>
                        {item.codeTitle}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={5} lg={4}>
              <Form.Item name="size" label={t("common.Page Size")} initialValue="10">
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
                    <FilterOutlined name="filter" /> {t("common.Filter")}
                  </ARMButton>
                  <ARMButton size="middle" type="primary" htmlType="reset" onClick={resetFilter}>
                    <RollbackOutlined  /> {t("common.Reset")}
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <ActiveInactive isActive={isActive} setIsActive={setIsActive} />

        <Row className="table-responsive">
          <ARMTable>
            <thead>
              <tr>
                <th>{t("planning.Aircrafts.Aircraft")}</th>
                <th>{t("planning.Seating Configurations.Cabin")}</th>
                <th>{t("planning.Seating Configurations.Number of Seat")}</th>
                <th>{t("common.Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {collection?.map((item, index) => (
                <tr key={index}>
                  <td>{item.aircraftName}</td>
                  <td>{item.cabinInfo}</td>
                  <td>{item.numOfSeats}</td>
                  <td>
                    <Space size="small">
                      <Link to={`/planning/seating-configurations/view/${item.aircraftCabinId}`}>
                        <Permission permission="PLANNING_AIRCRAFT_SEATING_CONFIGURATION_SEARCH">
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
                      {
                        isActive?
                        <Permission permission="PLANNING_AIRCRAFT_SEATING_CONFIGURATION_EDIT">
                        <Link
                          to={`/planning/seating-configurations/edit/${item.aircraftCabinId}`}
                        >
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
                        </Link>
                      </Permission>
                      :null
                      }
                      <Permission permission="PLANNING_AIRCRAFT_SEATING_CONFIGURATION_DELETE">
                        <ActiveInactiveButton
                          isActive={isActive}
                          handleOk={() =>
                            handleStatus(item.aircraftCabinId, !item.activeStatus)
                          }
                        />
                      </Permission>
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </ARMTable>
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

export default SeatingConfigurationList;
