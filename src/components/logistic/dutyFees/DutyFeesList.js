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
  notification,
  Pagination,
  Row,
  Select,
  Space,
} from "antd";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../../lib/common/helpers";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { usePaginate } from "../../../lib/hooks/paginations";
import DutyFeesService from "../../../service/logistic/DutyFeesService";
import Permission from "../../auth/Permission";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import ARMButton from "../../common/buttons/ARMButton";
import ResponsiveTable from "../../common/ResposnsiveTable";
import CommonLayout from "../../layout/CommonLayout";

const { Option } = Select;

const DutyFeesList = () => {
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
    resetFilter,
    size,
  } = usePaginate("dutyfees", "duty-fees/search");

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-hand-holding-box" />
            <Link to="/logistic">&nbsp; Logistic</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Duty Fees List</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="LOGISTIC_DUTY_FEES_DUTY_FEES_SEARCH" showFallback>
        <ARMCard
          title={getLinkAndTitle(
            "Duty Fees",
            "/logistic/duty-fees/add",
            true,
            "LOGISTIC_DUTY_FEES_DUTY_FEES_SAVE"
          )}
        >
          <Form form={form} onFinish={fetchData}>
            <Row gutter={20}>
              <Col xs={24} md={6}>
                <Form.Item name="query">
                  <Input placeholder="Search Invoice No." />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item name="size" label="Page Size" initialValue="10">
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
                      <FilterOutlined /> Filter
                    </ARMButton>
                    <ARMButton
                      size="middle"
                      type="primary"
                      htmlType="submit"
                      onClick={resetFilter}
                    >
                      <RollbackOutlined /> Reset
                    </ARMButton>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <ActiveInactive isActive={isActive} setIsActive={setIsActive} />

          <ResponsiveTable>
            <ARMTable>
              <thead>
                <tr>
                  <th>Part No</th>
                  <th>Invoice No.</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collection?.map((data) => (
                  <tr key={data?.id}>
                    <td>{data?.partNo}</td>
                    <td>{data?.invoiceNo}</td>
                    <td>
                      <Space size="small">
                        <Permission permission="LOGISTIC_DUTY_FEES_DUTY_FEES_SEARCH">
                          <Link to={`/logistic/duty-fees/list/${data?.id}`}>
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
                        </Permission>
                        <Permission permission="LOGISTIC_DUTY_FEES_DUTY_FEES_EDIT">
                          <Link to={`/logistic/duty-fees/edit/${data?.id}`}>
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
                        <Permission permission="LOGISTIC_DUTY_FEES_DUTY_FEES_DELETE">
                          <ActiveInactiveButton
                            isActive={isActive}
                            handleOk={async () => {
                              try {
                                await DutyFeesService.toggleStatus(
                                  data.id,
                                  !isActive
                                );
                                notification["success"]({
                                  message: "Status Changed Successfully!",
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

export default DutyFeesList;
