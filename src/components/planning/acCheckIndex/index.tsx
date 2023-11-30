import React from "react";
import { Breadcrumb, Col, Form, Input, Pagination, Row, Select, Space } from "antd";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import { Link } from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import { LinkAndTitle } from "../../../lib/common/TitleOrLink";
import ActiveInactive from "../../common/ActiveInactive";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import { EditOutlined, EyeOutlined, FilterOutlined, RollbackOutlined } from "@ant-design/icons";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import { useTranslation } from "react-i18next";
import useACCheckIndexAdd from "./useACCheckIndexAdd";
import Permission from "../../auth/Permission";



type ACCheck = {
  id: number,
  aircraftModelId: number;
  aircraftName: string;
  checkDescription: string;
  checkId: number;
  woNo: string;
  flyingDay?: number;
  flyingHour?: number;
  isActive: boolean;
  aircraftTypeCheckSet: any;
}

export default function ACCheckIndex() {
  const { isActive, setIsActive, form, allAcCheckIndex, aircrafts, setCurrentPage, totalPages, fetchData, handleStatus } = useACCheckIndexAdd()

  const { t } = useTranslation()

  return (
    <CommonLayout>
      <Permission permission="PLANNING_CHECK_AC_CHECK_INDEX_SEARCH" showFallback>
      <>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-chart-line" />
            <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>A/C Check Index</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard title={<LinkAndTitle title="A/C Check Index List" link="add" addBtn permission="PLANNING_CHECK_AC_CHECK_INDEX_SAVE" />}>

        <Form
          form={form}
          name="filter-form"
          onFinish={fetchData}
        >
          <Row gutter={20}>
            <Col xs={24} md={4}>
              <Form.Item
                name="aircraftId"
              >
                <Select
                  placeholder={t("planning.Aircrafts.Aircraft")}
                  allowClear
                >
                  {
                    aircrafts.map(({ aircraftId, aircraftName }) => <Select.Option value={aircraftId} key={aircraftId}>{aircraftName}</Select.Option>)
                  }
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item
                name="woNo"
              >
                <Input placeholder="Enter work no" />
              </Form.Item>
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
                <th>Aircraft</th>
                <th>Work No</th>
                <th>Checks</th>
                <th>{t("common.Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {allAcCheckIndex?.map((check: ACCheck) => (
                <tr key={check.id}>
                  <td>{check.aircraftName}</td>
                  <td>{check.woNo}</td>
                  <td>{check.aircraftTypeCheckSet?.map((data: { checkTitle: any; }) => data.checkTitle).join(' + ')}</td>
                  <td>
                    <Space size="small">
                        <Link to={`view/${check.id}`}>
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

                      <Link to={`edit/${check.id}`}>
                        <Permission permission="PLANNING_CHECK_AC_CHECK_INDEX_EDIT">
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

                      <Permission permission="PLANNING_CHECK_AC_CHECK_INDEX_DELETE">
                        <ActiveInactiveButton
                          confirmText="Are you sure to change the status?"
                          isActive={isActive}
                          handleOk={() => handleStatus(check.id, !check.isActive)}
                        />
                      </Permission>
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </ARMTable>
        </Row>

        {/* {
          allAcCheckIndex.length > 0 && (
            <Row justify="center">
              <Col style={{ marginTop: 10 }}>
                <Pagination showSizeChanger={false} onShowSizeChange={console.log} pageSize={size} current={page} onChange={paginate} total={totalElements} />
              </Col>
            </Row>
          )
        } */}
        <Row justify="center">
          <Col style={{ marginTop: 10 }}>
            <Pagination onChange={setCurrentPage} total={totalPages * 10} />
          </Col>
        </Row>

      </ARMCard>
      </>
      </Permission>
    </CommonLayout>
  );
}