import { EditOutlined, FilterOutlined, RollbackOutlined,  } from "@ant-design/icons";
import { Breadcrumb, Col, Form, Input, notification, Pagination,  Row, Select, Space, } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ARMForm from "../../../lib/common/ARMForm";
import { getErrorMessage } from "../../../lib/common/helpers";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { usePaginate } from "../../../lib/hooks/paginations";
import SignaturesService from "../../../service/planning/configurations/SignaturesService";
import Permission from "../../auth/Permission";
import ActiveInactive from "../../common/ActiveInactive";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMTable from "../../common/ARMTable";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";

const { Option } = Select;




export default function Signatures() {
  const { form, collection, page, isActive, setIsActive, totalElements, paginate, fetchData, refreshPagination, resetFilter, size } = usePaginate("signatures", "signature/search");
  const { t } = useTranslation()
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" /> &nbsp;{t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("planning.Signatures.Signatures")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_SIGNATURES_SEARCH" showFallback>
      <ARMCard title={getLinkAndTitle(t("planning.Signatures.Signature List"), "/planning/signatures/add", true,"PLANNING_AIRCRAFT_TECHNICAL_LOG_SIGNATURES_SAVE")}>
        <ARMForm onFinish={fetchData} form={form}>
          {" "}
          <Row gutter={20}>
            <Col xs={24} md={12} lg={6}>
              <Form.Item label="" name="employeeName">
                <Input placeholder={t("planning.Signatures.Enter Employee Name")} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={6}>
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

            <Col xs={24} md={12} lg={6}>
              <Form.Item>
                <Space>
                  <ARMButton size="middle" type="primary" htmlType="submit">
                    <FilterOutlined /> {t("common.Filter")}
                  </ARMButton>
                  <ARMButton size="middle" type="primary" htmlType="submit" onClick={resetFilter}>
                    <RollbackOutlined /> {t("common.Reset")}
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </ARMForm>

        <ActiveInactive isActive={isActive} setIsActive={setIsActive} />

        <Row className="table-responsive">
          <ARMTable>
            <thead>
              <tr>
                <th>{t("planning.Signatures.Employee Name")}</th>
                <th>{t("planning.Signatures.Auth No")}</th>
                <th>{t("common.Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {collection?.map((data, index) => (
                <tr key={index}>
                  <td>{data.employeeName}</td>
                  <td> {data.authNo}</td>
                  <td>
                    <Space size="small">
                      <Link to={`view/${data.id}`}></Link>
                      {isActive? <Link to={`edit/${data.id}`}>
                        <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_SIGNATURES_EDIT">
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
                      <Permission permission="PLANNING_AIRCRAFT_TECHNICAL_LOG_SIGNATURES_DELETE">
                      <ActiveInactiveButton
                        isActive={isActive}
                        handleOk={async () => {
                          try {
                            await SignaturesService.toggleStatus(data.id, !data.isActive);
                            notification["success"]({ message: "Status Changed Successfully!" });
                            refreshPagination();
                          } catch (e) {
                            notification["error"]({ message: getErrorMessage(e) });
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
        </Row>
          <Row justify="center">
            <Col style={{ marginTop: 10 }}>
              <Pagination showSizeChanger={false} onShowSizeChange={console.log} pageSize={size} current={page} onChange={paginate} total={totalElements} />
            </Col>
          </Row>
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
