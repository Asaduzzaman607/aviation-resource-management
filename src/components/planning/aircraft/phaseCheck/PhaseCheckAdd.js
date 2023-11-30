import { Breadcrumb, Col, Form, Row, Input, Select, DatePicker, Space, InputNumber } from "antd";
import { Link } from "react-router-dom";
import ARMForm from "../../../../lib/common/ARMForm";
import { getLinkAndTitle } from "../../../../lib/common/TitleOrLink";
import { usePhaseCheck } from "../../../../lib/hooks/planning/usePhaseCheck";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import ARMButton from "../../../common/buttons/ARMButton";
import CommonLayout from "../../../layout/CommonLayout";
import { formLayout } from "../../../../lib/constants/layout.js";
const { Option } = Select;

export default function PhaseCheckAdd() {
  const { form, onFinish, aircrafts, onReset, id } = usePhaseCheck();

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" /> &nbsp;Planning
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/phase-check">A Phase Check</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>A Phase Check Add</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard title={getLinkAndTitle("A Phase Check", "/planning/phase-check", false)}>
        <ARMForm
          form={form}
          name="basic"
          {...formLayout}
          onFinish={onFinish}
          scrollToFirstError
          initialValues={{
            aircraftId: "",
            doneDate: "",
            doneFlightHour: "",
            doneFlightCycle: "",
          }}
        >
          <Row>
            <Col sm={24} md={12} xs={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input aircraft",
                  },
                ]}
                name="aircraftId"
                label="Aircraft Name"
              >
                <Select>
                  {aircrafts.map((aircraft, index) => (
                    <Option key={index} value={aircraft.id}>
                      {aircraft.aircraftName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Date" name="doneDate">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item label="Flight Hour" name="doneFlightHour">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item label="Flight Cycle" name="doneFlightCycle">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
                <Space size="small">
                  <ARMButton size="medium" type="primary" htmlType="submit">
                    {id ? "Update" : "Submit"}
                  </ARMButton>
                  <ARMButton onClick={onReset} size="medium" type="primary" danger>
                    Reset
                  </ARMButton>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </ARMForm>
      </ARMCard>
    </CommonLayout>
  );
}
