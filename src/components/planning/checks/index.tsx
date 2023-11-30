import React from "react";
import { Breadcrumb, Col, Form, Input, notification, Pagination, Row, Space } from "antd";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import { Link } from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import { LinkAndTitle } from "../../../lib/common/TitleOrLink";
import ActiveInactive from "../../common/ActiveInactive";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import { EditOutlined, FilterOutlined, RollbackOutlined } from "@ant-design/icons";
import { refreshPagination, usePaginate } from "../../../lib/hooks/paginations";
import PageSizesFormItem from "../../common/pagination/PageSizesFormItem";
import { getErrorMessage } from "../../../lib/common/helpers";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import { useDispatch } from "react-redux";
import API from "../../../service/Api";
import { DEFAULT_PAGE_SIZE } from "../../../lib/constants/paginations";
import { useTranslation } from "react-i18next";
import Permission from "../../auth/Permission";


const REDUX_KEY = "checks";
const SEARCH_URL = "check/search";

export default function Checks() {
  const dispatch = useDispatch();
  const { collection, page, size, totalElements, paginate, isActive, setIsActive, fetchData, form } = usePaginate("checks", "check/search")
  console.log({ collection })

  const { t } = useTranslation()

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-chart-line" />
            <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t("planning.Checks.Checks")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission permission="PLANNING_CHECK_CHECK_SEARCH" showFallback>
      <ARMCard title={<LinkAndTitle title={t("planning.Checks.Check List")} link="add" addBtn permission="PLANNING_CHECK_CHECK_SAVE" />}>

        <Form
          form={form}
          name="filter-form"
          initialValues={{ title: "", size: DEFAULT_PAGE_SIZE }}
          onFinish={fetchData}
        >
          <Row gutter={20}>
            <Col xs={24} md={4}>
              <Form.Item
                name="title"
                rules={[
                  {
                    max: 50,
                    message: t("planning.Checks.Exceeds 50 characters")
                  }
                ]}
              >
                <Input placeholder={t("planning.Checks.Title")} />
              </Form.Item>
            </Col>

            <Col xs={24} md={5} lg={4}>
              <PageSizesFormItem />
            </Col>

            <Col xs={24} md={8}>
              <Form.Item>
                <Space>
                  <ARMButton size="middle" type="primary" htmlType="submit">
                    <FilterOutlined name="filter" /> {t("common.Filter")}
                  </ARMButton>
                  <ARMButton
                    size="middle"
                    type="primary"
                    onClick={() => {
                      form.resetFields();
                      fetchData();
                    }}
                  >
                    <RollbackOutlined name="reset" /> {t("common.Reset")}
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
                <th>{t("planning.Checks.Title")}</th>
                <th>{t("planning.Checks.Description")}</th>
                <th>{t("common.Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {collection.map((check: any, index: number) => (
                <tr key={index}>
                  <td>{check.title}</td>
                  <td style={{ width: "50%", padding: "5px 10px" }} className='newLineInRow'>{check.description}</td>

                  <td>
                    <Space size="small">
                      <Link to={`/planning/checks/edit/${check.id}`}>
                        <Permission permission="PLANNING_CHECK_CHECK_EDIT">
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

                      <Permission permission="PLANNING_CHECK_CHECK_DELETE">
                      <ActiveInactiveButton
                        confirmText="Are you sure to change the status?"
                        isActive={isActive}
                        handleOk={async () => {
                          try {
                            await API.patch(`check/${check.id}`, {}, {
                              params: {
                                active: !check.isActive
                              }
                            });
                            // @ts-ignore
                            dispatch(refreshPagination(REDUX_KEY, SEARCH_URL))
                            notification['success']({ message: t("common.Status Changed Successfully") });
                          } catch (e) {
                            notification['error']({ message: getErrorMessage(e) });
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

        {
          collection.length > 0 && (
            <Row justify="center">
              <Col style={{ marginTop: 10 }}>
                <Pagination showSizeChanger={false} onShowSizeChange={console.log} pageSize={size} current={page} onChange={paginate} total={totalElements} />
              </Col>
            </Row>
          )
        }

      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}