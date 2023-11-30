import { Breadcrumb, Col, DatePicker, Empty, Form, Pagination, Popconfirm, Space } from "antd";
import { Link } from "react-router-dom";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import { Row } from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { EditOutlined, FilterOutlined, LockOutlined, RollbackOutlined, UnlockOutlined } from "@ant-design/icons";
import ARMTable from "../../common/ARMTable";
import ActiveInactive from "../../common/ActiveInactive";
import { useMel } from "../../../lib/hooks/planning/useMel";
import ActiveInactiveButton from "../../common/buttons/ActiveInactiveButton";
import { useTranslation } from "react-i18next";

export default function MEL() {
  const { isActive, setIsActive, handleStatus, currentPage, setCurrentPage, totalPages, allMel, onReset, form, onMelSearch } = useMel();
  const { t } = useTranslation();
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" /> &nbsp;{t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("planning.MEL.MEL")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard title={getLinkAndTitle(t("planning.MEL.MEL"), "/planning/mel/add", true)}>
        <Form form={form} name="filter-form" initialValues={{ fromDate: "", toDate: "" }} onFinish={onMelSearch}>
          <Row gutter={20}>
            <Col xs={24} md={4}>
              <Form.Item name="fromDate">
                <DatePicker format="DD-MM-YYYY" placeholder={t("planning.ATL.From Date")} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item name="toDate">
                <DatePicker format="DD-MM-YYYY" placeholder={t("planning.ATL.To Date")} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item>
                <Space>
                  <ARMButton size="middle" type="primary" htmlType="submit">
                    <FilterOutlined name="filter" /> {t("common.Filter")}
                  </ARMButton>
                  <ARMButton size="middle" type="primary" onClick={onReset}>
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
                <th>{t("planning.MEL.Intermediate ATL")}</th>
                <th>{t("planning.MEL.Corrective ATL")}</th>
                <th>{t("planning.MEL.Due Date")}</th>
                <th>{t("planning.MEL.Cleared Date")}</th>
                <th>{t("planning.MEL.Status")}</th>
                <th>{t("common.Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {allMel?.map((data, index) => (
                <tr key={index}>
                  <td>{data?.amlPage?.itDefectAmlPage}</td>
                  <td>{data?.amlPage?.ctRectificationAmlPage}</td>
                  <td> {data?.dueDate}</td>
                  <td> {data?.clearedDate}</td>
                  {data?.clearedDate === null ? <td style={{ color: "red" }}>Open</td> : <td style={{ color: "#04aa6d" }}>Close</td>}
                  <td>
                    <Space size="small">
                      <Link to={`edit/${data.id}`}>
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
                      <ActiveInactiveButton isActive={isActive} handleOk={() => handleStatus(data.id, !isActive)} />
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </ARMTable>
        </Row>
        {allMel?.length === 0 ? (
          <Row>
            <Col style={{ margin: "30px auto" }}>
              <Empty />
            </Col>
          </Row>
        ) : (
        <Row justify="center">
          <Col style={{ marginTop: 10 }}>
            <Pagination defaultCurrent={currentPage} onChange={setCurrentPage} total={totalPages * 10} />
          </Col>
        </Row>
        )}
      </ARMCard>
    </CommonLayout>
  );
}
