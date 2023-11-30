import React, { useEffect, useState } from "react";
import { Card, Col, Empty, Pagination, Row, Typography } from "antd";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import CommonLayout from "../../layout/CommonLayout";
import Planning from "../Planning";
import ResponsiveTable from "../../common/ResposnsiveTable";
import API from "../../../service/Api";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import { notifyResponseError } from "../../../lib/common/notifications";
import {
  DailyFlyingCycleFormat,
  DailyFlyingHourFormat,
  DashboardDateFormat,
} from "../report/Common";
import Permission from "../../auth/Permission";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import ARMCustomTab from "../../../lib/common/ARMCustomTab";
import StoreDashBoardTab from "../../store/dashboard/StoreDashBoardTab";

const PlanningDashboard = ({ toggleState, setToggleState, toggleTab }) => {
  let { id } = useParams();

  const [aircraftModel, setAircraftModel] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [data, setData] = useState([]);
  const [active, setActive] = useState();
  const [initialId, setInitialId] = useState(null);

  const getALlAircraftModel = async () => {
    const { data } =
      await AircraftModelFamilyService.getAllAircraftModelFamily();
    setAircraftModel(data?.model);
    if (!id && toggleState === 2) {
      setInitialId(data?.model[0]?.id);
    }
  };

  useEffect(() => {
    (async () => {
      await getALlAircraftModel();
    })();
  }, [toggleState === 2]);

  const getAircraftModelSingleData = async (id) => {
    const { data } = await AircraftModelFamilyService.getAircraftModelById(id);
    setActive(data?.id);
  };

  const getAllAircraftDashboardDataByAircraftModelId = async () => {
    const { data } = await API.get(
      `dashboard/ac-dashboard/${id ? id : initialId}?page=${currentPage}`
    );
    setData(data?.model);
    setCurrentPage(data?.currentPage);
    setTotalPages(data?.totalPages);
  };

  useEffect(() => {
    if (!id) {
      setActive("");
      return;
    }
    (async () => {
      await getAircraftModelSingleData(id);
    })();
  }, [id]);

  const saveDashboardData = async () => {
    try {
      await API.get(`dashboard/upsert-due`);
      window.location.reload(false);
      await getAllAircraftDashboardDataByAircraftModelId();
    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    if (id) {
      setInitialId(null);
    }
  }, [id]);

  useEffect(() => {
    if (!id && !initialId) {
      setData("");
      return;
    }
    (async () => {
      await getAllAircraftDashboardDataByAircraftModelId();
      setToggleState(2);
    })();
  }, [id, currentPage, initialId]);

  const [order, setOrder] = useState("ASC");

  const sorting = (colName) => {
    if (order === "ASC") {
      const sorted = [...data].sort((a, b) =>
        a?.aircraftData[colName].toLowerCase() >
        b?.aircraftData[colName].toLowerCase()
          ? 1
          : -1
      );
      setData(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...data].sort((a, b) =>
        a?.aircraftData[colName].toLowerCase() <
        b?.aircraftData[colName].toLowerCase()
          ? 1
          : -1
      );
      setData(sorted);
      setOrder("ASC");
    }
  };

  return (
    <CommonLayout>
      <StoreDashBoardTab>
        <div
          style={{
            marginTop: '10px',
          }}
          className="button-background">
          <button
            className={toggleState === 2 ? 'button button-active' : 'button'}
            onClick={() => toggleTab(2)}
          >
            <i className="fal fa-chart-line"></i>
            <span style={{ marginLeft: '5px' }}>Dashboard</span>
          </button>
          <button
            className={toggleState === 1 ? 'button button-active' : 'button'}
            onClick={() => toggleTab(1)}
          >
            <i className="fal fa-bars"></i>
            <span style={{ marginLeft: '5px' }}>Menus</span>
          </button>
        </div>
        <div className="content-tabs">
          <div
            className={
              toggleState === 2 ? "content  active-content" : "content"
            }
          >
            <Row gutter={[10, 10]}>
              {aircraftModel?.map((item, index) => (
                <Col key={index} className="gutter-row" span={24} md={4} lg={3}>
                  <Link to={`/planning/${item.id}`}>
                    <Card
                      onClick={() => setActive(item?.id)}
                      style={{
                        boxShadow:
                          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                        background:
                          active === item?.id
                            ? "#14b8a6"
                            : initialId === item?.id
                            ? "#14b8a6"
                            : "#ffffff",
                        borderRadius: "15px",
                        height: "100px",
                        color: active == item?.id ? "#ffffff" : "#000000",
                        border: 'none'
                      }}
                    >
                      <i style={{ fontSize: '24px' }} className="fal fa-plane"></i>
                      <p style={{ fontSize: '16px' }}>{item?.aircraftModelName}</p>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>

          <div
            className={
              toggleState === 1 ? "content  active-content" : "content"
            }
          >
            <Planning />
          </div>
        </div>
      </StoreDashBoardTab>
      {toggleState === 2 ? (
        <Permission
          permission="PLANNING_DASHBOARD_DASHBOARD_ITEM_SEARCH"
          showFallback
        >
          {data?.length != 0 && toggleState === 2 ? (
            <>
              <Row justify="space-between">
                <Col
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                    marginTop: "7px",
                  }}
                  md={12}
                  sm={24}
                  lg={12}
                >
                  <Typography.Text>
                    <div
                      style={{
                        width: "12px",
                        background: "#86CB51",
                        height: "13px",
                        display: "inline-block",
                        marginTop: "8px",
                      }}
                    ></div>{" "}
                    <div
                      style={{
                        display: "inline-block",
                        height: "20px",
                      }}
                    >
                      : MEL Due Date 7 days away and all Estimated Due Date 30
                      days away
                    </div>
                  </Typography.Text>{" "}
                  <br />
                  <Typography.Text>
                    <div
                      style={{
                        width: "12px",
                        background: "#FFBF00",
                        height: "13px",
                        display: "inline-block",
                        marginTop: "8px",
                      }}
                    ></div>{" "}
                    <div
                      style={{
                        display: "inline-block",
                        height: "20px",
                      }}
                    >
                      : MEL Due Date within 7 days or any Estimated Due Date
                      within 30 days
                    </div>
                  </Typography.Text>{" "}
                  <br />
                  <Typography.Text>
                    <div
                      style={{
                        width: "12px",
                        background: "#FF585C",
                        height: "13px",
                        display: "inline-block",
                        marginTop: "8px",
                      }}
                    ></div>{" "}
                    <div
                      style={{
                        display: "inline-block",
                        height: "20px",
                      }}
                    >
                      : MEL Due Date or any Estimated Due Date already passed
                    </div>
                  </Typography.Text>{" "}
                  <br />
                </Col>
                <Col md={12} sm={24} lg={12}>
                  <div style={{ height: "25px" }}></div>
                  <div style={{ height: "25px" }}></div>
                  <ARMButton
                    onClick={saveDashboardData}
                    style={{
                      marginTop: "6px",
                      float: "right",
                    }}
                    size="medium"
                    type="primary"
                    htmlType="submit"
                  >
                    {"Refresh"}
                  </ARMButton>
                </Col>
              </Row>
            </>
          ) : null}

          {data && toggleState == 2 ? (
            <>
              <ResponsiveTable className="dashboard">
                <ARMTable className="dashboard-table">
                  <tbody>
                    <tr>
                      <td
                        title="Sort By Aircraft Name"
                        onClick={() => sorting("aircraftName")}
                        style={{ fontWeight: "bold", fontSize: "12px" }}
                        rowSpan={3}
                      >
                        <Tooltip title="Sort By Aircraft Name">
                          {" "}
                          AIRCRAFT NAME{" "}
                          <span>
                            {order == "ASC" ? <UpOutlined /> : <DownOutlined />}
                          </span>
                        </Tooltip>
                      </td>
                      <td
                        style={{ fontWeight: "bold", fontSize: "11px" }}
                        colSpan={3}
                      >
                        TOTAL
                      </td>
                      <td style={{ fontWeight: "bold", fontSize: "11px" }}>
                        MEL DUE DATE
                      </td>
                      <td
                        style={{ fontWeight: "bold", fontSize: "11px" }}
                        colSpan={4}
                      >
                        A CHECK
                      </td>
                      <td
                        style={{ fontWeight: "bold", fontSize: "11px" }}
                        colSpan={4}
                      >
                        C CHECK
                      </td>
                      <td
                        style={{ fontWeight: "bold", fontSize: "11px" }}
                        colSpan={6}
                      >
                        CALENDER CHECK
                      </td>
                    </tr>
                    <tr>
                      <td rowSpan={2} style={{ fontSize: "11px" }}>
                        AS OF DATE
                      </td>
                      <td rowSpan={2} style={{ fontSize: "11px" }}>
                        HOUR
                      </td>
                      <td rowSpan={2} style={{ fontSize: "11px" }}>
                        CYCLE
                      </td>
                      <td rowSpan={2} style={{ fontSize: "11px" }}>
                        ESTIMATED <br /> DUE DATE
                      </td>
                      <td rowSpan={2} style={{ fontSize: "11px" }}>
                        CALENDER <br /> DUE DATE
                      </td>
                      <td rowSpan={2} style={{ fontSize: "11px" }}>
                        REMAINING <br /> HOURS
                      </td>
                      <td rowSpan={2} style={{ fontSize: "11px" }}>
                        REMAINING <br /> CALENDER DAY
                      </td>
                      <td rowSpan={2} style={{ fontSize: "11px" }}>
                        ESTIMATED <br /> DUE DATE
                      </td>

                      <td rowSpan={2} style={{ fontSize: "11px" }}>
                        CALENDER <br /> DUE DATE
                      </td>
                      <td rowSpan={2} style={{ fontSize: "11px" }}>
                        REMAINING <br /> HOURS
                      </td>
                      <td rowSpan={2} style={{ fontSize: "11px" }}>
                        REMAINING <br /> CALENDER DAY
                      </td>

                      <td rowSpan={2} style={{ fontSize: "12px" }}>
                        {" "}
                        ESTIMATED <br /> DUE DATE
                      </td>
                      <td
                        style={{ fontWeight: "bold", fontSize: "11px" }}
                        colSpan={2}
                      >
                        2Y CHECK
                      </td>
                      <td
                        style={{ fontWeight: "bold", fontSize: "11px" }}
                        colSpan={2}
                      >
                        4Y CHECK
                      </td>
                      <td
                        style={{ fontWeight: "bold", fontSize: "11px" }}
                        colSpan={2}
                      >
                        8Y CHECK
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontSize: "11px" }}>DUE DATE </td>
                      <td style={{ fontSize: "11px" }}>REMAINING DAYS</td>
                      <td style={{ fontSize: "11px" }}>DUE DATE </td>
                      <td style={{ fontSize: "11px" }}>REMAINING DAYS</td>
                      <td style={{ fontSize: "11px" }}>DUE DATE </td>
                      <td style={{ fontSize: "11px" }}>REMAINING DAYS</td>
                    </tr>
                    {data?.map((item, index) => (
                      <tr key={index} style={{ height: "130px" }}>
                        <td
                          style={{
                            backgroundColor:
                              item?.aircraftData?.acColorCode === 0
                                ? "#86CB51"
                                : item?.aircraftData?.acColorCode === 1
                                ? "#FEBE00"
                                : "#FF585C",
                            width: "280px",
                          }}
                        >
                          <Link
                            to={`/planning/aircraft/edit/${item?.aircraftData?.aircraftId}`}
                          >
                            <h4
                              style={{ fontWeight: "bold", fontSize: "12px" }}
                            >
                              {item?.aircraftData?.aircraftName}
                            </h4>
                            <h4>MSN-{item?.aircraftData?.aircraftSerial}</h4>
                          </Link>
                        </td>
                        <td style={{ width: "200px", fontSize: "12px" }}>
                          <h3>
                            {DashboardDateFormat(item?.aircraftData?.asOfDate)}
                          </h3>
                        </td>

                        <td style={{ width: "200px", fontSize: "12px" }}>
                          <h3>
                            {DailyFlyingHourFormat(
                              item?.aircraftData?.aircraftTotalHour
                            )}
                          </h3>
                        </td>
                        <td
                          style={{
                            width: "200px",
                            fontSize: "12px",
                          }}
                        >
                          <h3>
                            {DailyFlyingCycleFormat(
                              item?.aircraftData?.aircraftTotalCycle
                            )}
                          </h3>
                        </td>

                        <td style={{ width: "200px" }}>
                          {item?.melDueList?.map((mel, index) => (
                            <Link to={`/planning/atl/edit/${mel.id}`}>
                              <h4
                                style={{
                                  color:
                                    mel?.itemColorCode === 0
                                      ? "#86CB51"
                                      : mel?.itemColorCode === 1
                                      ? "#FFBF00"
                                      : "#FF585C",
                                }}
                                key={index}
                              >
                                {DashboardDateFormat(mel?.estimatedDueDate)}
                              </h4>
                            </Link>
                          ))}
                        </td>

                        
                        <td style={{ width: "200px" }}>{DashboardDateFormat(item?.checkA?.calenderDueDate)}</td>
                        <td style={{ width: "200px" }}>{DailyFlyingHourFormat(item?.checkA?.remainingHour)}</td>
                        <td style={{ width: "200px" }}>{item?.checkA?.remainingDay}</td>
                        <td style={{ width: "200px" }}>{DashboardDateFormat(item?.checkA?.estimatedDueDate)}</td>
                        <td style={{ width: "200px" }}>{DashboardDateFormat(item?.checkC?.calenderDueDate)}</td>
                        <td style={{ width: "200px" }}>{DailyFlyingHourFormat(item?.checkC?.remainingHour)}</td>
                        <td style={{ width: "200px" }}>{item?.checkC?.remainingDay}</td>
                        <td style={{ width: "200px" }}>{DashboardDateFormat(item?.checkC?.estimatedDueDate)}</td>
                        <td style={{ width: "200px" }}>{DashboardDateFormat(item?.check2Y?.estimatedDueDate)}</td>
                        <td style={{ width: "200px" }}>{item?.check2Y?.remainingDay}</td>
                        <td style={{ width: "200px" }}>{DashboardDateFormat(item?.check4Y?.estimatedDueDate)}</td>
                        <td style={{ width: "200px" }}>{item?.check4Y?.remainingDay}</td>
                        <td style={{ width: "200px" }}>{DashboardDateFormat(item?.check8Y?.estimatedDueDate)}</td>
                        <td style={{ width: "200px" }}>{item?.check8Y?.remainingDay}</td>
                      </tr>
                    ))}
                  </tbody>
                </ARMTable>
              </ResponsiveTable>
              {data?.length === 0 ? (
                <Row>
                  <Col style={{ margin: "30px auto" }}>
                    <Empty />
                  </Col>
                </Row>
              ) : (
                <Row justify="center" className="pagination first">
                  <Col style={{ marginTop: 10 }}>
                    <Pagination
                      currentPage={currentPage}
                      onChange={setCurrentPage}
                      total={totalPages * 10}
                    />
                  </Col>
                </Row>
              )}
            </>
          ) : null}
        </Permission>
      ) : null}
    </CommonLayout>
  );
};

export default PlanningDashboard;
