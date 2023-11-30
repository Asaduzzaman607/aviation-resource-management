import {
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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../../lib/common/helpers";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { usePaginate } from "../../../lib/hooks/paginations";
import WorkflowActionService from "../../../service/WorkflowActionService";
import Permission from "../../auth/Permission";
import subModules from "../../auth/sub_module";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import ResponsiveTable from "../../common/ResposnsiveTable";
import CommonLayout from "../../layout/CommonLayout";
import Loading from "../common/Loading";
import React from "react";

const ApprovedScrapParts = () => {
  const [workFlowActions, setWorkFlowActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { Option } = Select;

  const { form, collection, page, totalElements, paginate, fetchData, size } =
    usePaginate("approvedScrapParts", "/store/scraps/search", {
      type: "APPROVED",
    });

  useEffect(() => {
    getAllWorkFlow(true).catch(console.error);
  }, []);

  const getAllWorkFlow = async (status) => {
    try {
      setLoading(true);
      let { data } = await WorkflowActionService.getAllWorkflows(
        status,
        subModules.SCRAP_PART
      );
      setWorkFlowActions(data.model);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    fetchData({
      ...values,
      type: "APPROVED",
    });
  };

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-archive" />
            <Link to="/store">&nbsp; Store</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Approved Scrap Parts</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission permission="STORE_SCRAP_PARTS_SCRAP_PART_SEARCH" showFallback>
        <ARMCard
          title={getLinkAndTitle("Approved Scrap Parts List", "/store", false)}
        >
          <Form form={form} onFinish={onFinish}>
            <Row gutter={20}>
              <Col xs={24} md={12} lg={6}>
                <Form.Item name="query">
                  <Input placeholder="Enter Voucher No. " />
                </Form.Item>
                {/* hidden field for paginating approve scrap parts */}
                <Form.Item name="type" hidden initialValue="APPROVED">
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={12} lg={6}>
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

              <Col xs={24} md={12} lg={6}>
                <Form.Item>
                  <Space>
                    <ARMButton size="middle" type="primary" htmlType="submit">
                      <FilterOutlined /> Filter
                    </ARMButton>
                    <ARMButton
                      size="middle"
                      type="primary"
                      htmlType="button"
                      onClick={() => {
                        form.resetFields();
                        fetchData({ type: "APPROVED" });
                      }}
                    >
                      <RollbackOutlined /> Reset
                    </ARMButton>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {!loading ? (
            <>
              <ResponsiveTable>
                <ARMTable>
                  <thead>
                    <tr>
                      <th rowSpan={2}>Voucher No</th>
                      <th colSpan={workFlowActions.length}>Approvals</th>
                      <th rowSpan={2}>Status</th>
                      <th rowSpan={2}>Actions</th>
                    </tr>

                    <tr>
                      {workFlowActions?.map((action) => (
                        <td key={action.id}>{action.label.toUpperCase()}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {collection?.map((data, index) => (
                      <tr key={data.id}>
                        <td>{data.voucherNo}</td>

                        {workFlowActions?.map((action) => (
                          <td key={action.id}>
                            {data.approvalStatuses[action.id]?.updatedByName ||
                              ""}
                          </td>
                        ))}

                        <td>{data.workflowName}</td>

                        <td>
                          <Space size="small">
                            <Permission permission="STORE_SCRAP_PARTS_SCRAP_PART_SEARCH">
                              <Link
                                to={`/store/approved-scrap-parts/view/${data.id}`}
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
                            </Permission>
                          </Space>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ARMTable>
              </ResponsiveTable>
              <Row>
                {collection.length === 0 ? (
                  <Col style={{ margin: "30px auto" }}>
                    <Empty />
                  </Col>
                ) : null}
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
            </>
          ) : (
            <Loading />
          )}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default ApprovedScrapParts;
