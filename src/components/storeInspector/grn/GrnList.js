import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  RollbackOutlined,
  SolutionOutlined,
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
import API from "../../../service/Api";
import StoreInspectionService from "../../../service/storeInspector/StoreInspectionService";
import Permission from "../../auth/Permission";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import ARMButton from "../../common/buttons/ARMButton";
import ResponsiveTable from "../../common/ResposnsiveTable";
import CommonLayout from "../../layout/CommonLayout";
import useViewDetails from "../../store/hooks/ViewDetails";
import GrnDetails from "./GrnDetails";
const { Option } = Select;
const GrnList = () => {
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
  } = usePaginate("grn", "/store-inspector/grn/search",{isUsed:false});

  const { isModalOpen, setIsModalOpen, data, handleViewDetails } =
    useViewDetails();

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/storeInspector">
              <SolutionOutlined />
              &nbsp;Store Inspector
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Grn</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission
        permission="STORE_INSPECTOR_STORE_INSPECTOR_STORE_INSPECTION_GRN_SEARCH"
        showFallback
      >
        <ARMCard
          title={getLinkAndTitle(
            "Grn List",
            "/storeInspector/grn",
            true,
            "STORE_INSPECTOR_STORE_INSPECTOR_STORE_INSPECTION_GRN_SAVE"
          )}
        >
          <Form form={form} onFinish={fetchData}>
            <Row gutter={20}>
              <Col xs={24} md={6}>
                <Form.Item name="query">
                  <Input placeholder="Search Grn No" />
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
                  <th>Grn No</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collection?.map((data) => (
                  <tr key={data.id}>
                    <td>{data.grnNo}</td>
                    <td>{data.createdDate}</td>
                    <td>
                      <Space size="small">
                        <ARMButton
                          type="primary"
                          size="small"
                          style={{
                            backgroundColor: "#4aa0b5",
                            borderColor: "#4aa0b5",
                          }}
                          onClick={() => handleViewDetails(data)}
                        >
                          <EyeOutlined />
                        </ARMButton>
                        <Permission permission="STORE_INSPECTOR_STORE_INSPECTOR_STORE_INSPECTION_GRN_EDIT">
                          <Link to={`/storeInspector/edit-grn/${data.id}`}>
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
                        <Permission permission="STORE_INSPECTOR_STORE_INSPECTOR_STORE_INSPECTION_GRN_DELETE">
                          <ActiveInactiveButton
                            isActive={isActive}
                            handleOk={async () => {
                              try {
                                await API.patch(
                                  `store-inspector/grn/${data.id}`,
                                  {},
                                  {
                                    params: {
                                      id: data.id,
                                      active: !isActive,
                                    },
                                  }
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
                <GrnDetails
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  data={data}
                />
              </Col>
            </Row>
          )}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default GrnList;
