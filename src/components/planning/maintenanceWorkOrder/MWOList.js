import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  PrinterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Form,
  Pagination,
  Row,
  Select,
  Space,
  Modal,
} from "antd";
import { Option } from "antd/lib/mentions";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  notifyResponseError,
  notifySuccess,
  notifyWarning,
} from "../../../lib/common/notifications";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { usePaginate } from "../../../lib/hooks/paginations";
import AircraftService from "../../../service/AircraftService";
import MWOService from "../../../service/planning/MWOService";
import Permission from "../../auth/Permission";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import ARMButton from "../../common/buttons/ARMButton";
import ResponsiveTable from "../../common/ResposnsiveTable";
import CommonLayout from "../../layout/CommonLayout";
import { DateFormat } from "../report/Common";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import { pdf } from "@react-pdf/renderer";
import MultipleWorkOrder from "./MultipleWorkOrder";
import API from "../../../service/Api";
import { sleep } from "../../../lib/common/helpers";

const MWOList = () => {
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
  } = usePaginate("mwos", "work-order/search");

  const { t } = useTranslation();
  const [aircraftSearch, setAircraftSearch] = useState();
  const [check, setCheck] = useState(true);

  const [aircrafts, setAircrafts] = useState([]);
  const [date, setDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const dateRange = Form.useWatch("dateRange", form);
  const aircrafId = Form.useWatch("aircrafId", form);

  const onFinish = (values) => {
    if (!values.aircraftId) return;

    const data = {
      ...values,
      aircraftId: values?.aircraftId,
      date: date || "",
    };
    fetchData(data);
  };

  const getALlAircraft = async () => {
    try {
      const { data } = await AircraftService.getAllAircraftList();
      setAircrafts(data);
      setAircraftSearch(data[0].id);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    (async () => {
      //form.resetFields();
      await getALlAircraft();
    })();
  }, []);

  const handleDownloadPdf = async () => {
    const [startDate, endDate] = dateRange || "";

    const dataWithoutPagination = {
      aircraftId: aircrafId,
      fromDate: DateTimeConverter.momentDateToString(startDate) || "",
      toDate: DateTimeConverter.momentDateToString(endDate) || "",
      isActive: true,
    };
    try {
      const { data } = await API.post(
        `work-order/multiple-report`,
        dataWithoutPagination
      );
      if (Object.keys(data).length === 0) {
        notifyWarning("No data available in this date range!");
        return;
      } else {
        const doc = <MultipleWorkOrder data={data} />;
        const blob = await pdf(doc).toBlob();
        const blobURL = URL.createObjectURL(blob);

        const iframe = document.createElement("iframe");
        document.body.appendChild(iframe);

        iframe.style.display = "none";
        iframe.src = blobURL;
        iframe.onload = () => {
          iframe.focus();
          if (iframe.contentWindow) {
            iframe.contentWindow.print();
          }
        };
        setShowModal(false);
        form.resetFields();
      }
    } catch (er) {
      notifyResponseError(er);
    }
  };

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

          <Breadcrumb.Item>
            {t("planning.MWO.Maintenance Work Order List")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission="PLANNING_SCHEDULE_TASKS_MAINTENANCE_WORK_ORDERS_SEARCH"
        showFallback
      >
        <ARMCard
          //     title={getLinkAndTitle(
          //         t("planning.MWO.Maintenance Work Orders"),
          //         "/planning/mwo/add",
          //         t("common.Add"),
          //         "PLANNING_SCHEDULE_TASKS_MAINTENANCE_WORK_ORDERS_SAVE"
          //     )

          // }

          title={
            <Row justify="space-between">
              <Col>Maintenance Work Orders</Col>
              <Col>
                <Space>
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#04aa6d",
                      borderColor: "transparent",
                      borderRadius: "5px",
                    }}
                  >
                    {" "}
                    <Link
                      title="add"
                      to="/planning/mwo/add"
                      style={{ color: "white" }}
                    >
                      {" "}
                      <PlusOutlined /> Add
                    </Link>
                  </Button>
                  <Button
                    style={{backgroundColor:"#04aa6d",color:"white"}}
                    icon={<PrinterOutlined />}
                    onClick={() => {
                      setShowModal(true);
                    }}
                  >
                    Print
                  </Button>
                  <ARMButton>
                    <Modal
                      className="modal"
                      title="Are you sure want to print?"
                      style={{
                        top: 20,
                        height: "60px",
                      }}
                      mask={false}
                      onOk={() => setShowModal(false)}
                      onCancel={() => setShowModal(false)}
                      centered
                      visible={showModal}
                      width={770}
                      footer={null}
                    >
                      <Col span={24}>
                        <Form form={form} name="filter-form">
                          <Row gutter={20}>
                            <Col xs={24} md={8}>
                              <Form.Item
                                rules={[
                                  {
                                    required: true,
                                    message: "Required",
                                  },
                                ]}
                                name="aircrafId"
                              >
                                <Select placeholder="Select Model Type">
                                  <Select.Option value="">
                                    ---Select---
                                  </Select.Option>
                                  {aircrafts.map((type) => (
                                    <Select.Option
                                      value={type.aircraftId}
                                      key={type.aircraftId}
                                    >
                                      {type.aircraftName}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
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

                            <Col xs={24} md={8}>
                              <Form.Item>
                                <Button
                                  style={{ borderRadius: "5px" }}
                                  type="primary"
                                  onClick={handleDownloadPdf}
                                >
                                  Print
                                </Button>
                              </Form.Item>
                            </Col>
                          </Row>
                        </Form>
                      </Col>
                    </Modal>
                  </ARMButton>
                </Space>
              </Col>
            </Row>
          }
        >
          <Form
            form={form}
            onFinish={onFinish}
            initialValues={{ aircraftId: aircraftSearch, date: "" }}
          >
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
                  <Select placeholder={t("planning.Aircrafts.Select Aircraft")}>
                    {aircrafts?.map((item) => {
                      return (
                        <Select.Option
                          key={item.aircraftId}
                          value={item.aircraftId}
                        >
                          {item.aircraftName}{" "}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  onChange={(e) =>
                    setDate(DateTimeConverter.momentDateToString(e))
                  }
                />
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
                      htmlType="submit"
                      onClick={() => {
                        resetFilter();
                        form.setFieldValue("date", "");
                      }}
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
                    <th>{t("planning.MWO.Work Order No")}</th>
                    <th>{t("planning.MWO.Date")}</th>
                    <th>{t("planning.MWO.Task Description")}</th>
                    <th>{t("planning.MWO.C/Out Date")}</th>
                    <th>{t("planning.MWO.Receive Date")}</th>
                    <th>{t("common.Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {collection?.map((mwo) => (
                    <tr key={mwo.id}>
                      <td>{mwo.woNo}</td>
                      <td>{mwo.date && DateFormat(mwo.date)}</td>
                      <td
                        className={"limitedText"}
                        style={{ width: "700px!important" }}
                      >
                        {mwo?.woTaskViewModelList?.map((t) => (
                          <p
                            style={
                              t.workOrderId === mwo.id
                                ? { border: " 1px solid lightgrey" }
                                : { border: "none" }
                            }
                          >
                            {t?.description.substring(0, 100)}
                          </p>
                        ))}
                      </td>
                      <td>
                        {mwo?.woTaskViewModelList?.map((t) => (
                          <p style={{ border: " 1px solid lightgrey" }}>
                            {DateFormat(t?.complianceDate)}
                          </p>
                        ))}
                      </td>
                      <td>
                        {mwo?.woTaskViewModelList?.map((t) => (
                          <p style={{ border: " 1px solid lightgrey" }}>
                            {DateFormat(t?.accomplishDate)}
                          </p>
                        ))}
                      </td>

                      <td>
                        <Space size="small">
                          <Link to={`/planning/mwo/report/${mwo?.id}`}>
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

                          {isActive ? (
                            <Link to={`/planning/mwo/edit/${mwo.id}`}>
                              <Permission permission="PLANNING_SCHEDULE_TASKS_MAINTENANCE_WORK_ORDERS_EDIT">
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
                          ) : null}
                          <Permission permission="PLANNING_SCHEDULE_TASKS_MAINTENANCE_WORK_ORDERS_DELETE">
                            <ActiveInactiveButton
                              isActive={isActive}
                              handleOk={async () => {
                                try {
                                  await MWOService.toggleStatus(
                                    mwo.id,
                                    !isActive
                                  );
                                  notifySuccess(
                                    t("common.Status Changed Successfully")
                                  );
                                  refreshPagination();
                                } catch (er) {
                                  notifyResponseError(er);
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
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default MWOList;
