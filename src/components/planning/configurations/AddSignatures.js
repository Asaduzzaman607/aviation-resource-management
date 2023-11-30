import { Breadcrumb, Col, Form, Input, Row, Select, Space } from "antd";
import { Link } from "react-router-dom";
import ARMForm from "../../../lib/common/ARMForm";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { useSignatures } from "../../../lib/hooks/planning/useSignatures";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import { formLayout } from "../../../lib/constants/layout.js";
import { useTranslation } from "react-i18next";
import Permission from "../../auth/Permission";
const { Option } = Select;

export default function AddSignatures() {
  const { employees, onFinish, form, id, handleReset } = useSignatures();
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

          <Breadcrumb.Item>
            <Link to="/planning/signatures">{t("planning.Signatures.Signatures")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{!id ? t("common.Add") : t("common.Edit")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission permission={["PLANNING_AIRCRAFT_TECHNICAL_LOG_SIGNATURES_SAVE","PLANNING_AIRCRAFT_TECHNICAL_LOG_SIGNATURES_EDIT"]} showFallback>
      <ARMCard title={getLinkAndTitle(id ? `${t("planning.Signatures.Signature")} ${t("common.Edit")}` : `${t("planning.Signatures.Signature")} ${t("common.Add")}`, "/planning/signatures", false,"PLANNING_AIRCRAFT_TECHNICAL_LOG_SIGNATURES_SAVE")}>
            <ARMForm
              form={form}
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Row justify="start">
              <Col lg={12} md={16} sm={20} xs={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: t("planning.Signatures.Please input employee name"),
                  },
                ]}
                name="employeeId"
                label={t("planning.Signatures.Employee Name")}
              >
                <Select>
                  {employees.map((employee) => (
                    <Option key={employee.id} value={employee.id}>
                      {employee.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={t("planning.Signatures.Auth No")}
                name="authNo"
                rules={[
                  {
                    required: true,
                    message: t("planning.Signatures.Please input auth no"),
                  },
                  {
                    whitespace: true,
                    message: t("common.Only space is not allowed")
                  }
                ]}
              >
                <Input />
              </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={12}>
            <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
              <Space size="small">
                <ARMButton size="medium" type="primary" htmlType="submit">
                  {id ? t("common.Update") : t("common.Submit")}
                </ARMButton>
                <ARMButton onClick={handleReset} size="medium" type="primary" danger>
                  {t("common.Reset")}
                </ARMButton>
              </Space>
            </Form.Item>
          </Col>
        </Row>
                </ARMForm>
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
}
