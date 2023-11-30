import { Badge, Breadcrumb, Card, Col, DatePicker, Divider, Form, Input, Row, Select } from "antd";
import { Link } from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMForm from "../../../lib/common/ARMForm";
import { useDefect } from "../../../lib/hooks/planning/useDefect";
import RibbonCard from "../../common/forms/RibbonCard";

const { Option } = Select;
const { TextArea } = Input;

export default function AddDefectRectifications() {
  const { onFinish, form, id, handleReset, signatures, airports, amls } = useDefect();

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
            <Link to="/planning/defect-rectifications">Defect &amp; Rectifications</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Defect &amp; Rectification</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard title={getLinkAndTitle("ADD DEFECT & RECTIFICATIONS", "/planning/defect-rectifications", false)}>
        <ARMForm
          form={form}
          name="basic"
          labelCol={{
            span: 12,
          }}
          wrapperCol={{
            span: 12,
          }}
          initialValues={[
            { amlId: "", seqNo: "A", defectDmiNo: "", defectDescription: "", defectSignId: "", defectStaId: "", defectSignTime: "", rectDmiNo: "", rectMelRef: "", rectCategory: "", rectAta: "", rectPos: "", rectPnOff: "", rectSnOff: "", rectPnOn: "", rectSnOn: "", rectGrn: "", rectDescription: "", rectSignId: "", rectStaId: "", rectSignTime: "" },
            { amlId: "", seqNo: "B", defectDmiNo: "", defectDescription: "", defectSignId: "", defectStaId: "", defectSignTime: "", rectDmiNo: "", rectMelRef: "", rectCategory: "", rectAta: "", rectPos: "", rectPnOff: "", rectSnOff: "", rectPnOn: "", rectSnOn: "", rectGrn: "", rectDescription: "", rectSignId: "", rectStaId: "", rectSignTime: "" },
          ]}
          autoComplete="off"
          style={{
            backgroundColor: "#ffffff",
          }}
          onFinish={onFinish}
          scrollToFirstError
        >
          <Row gutter={12}>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input ATL page no",
                  },
                ]}
                name="amlId"
                label="ATL Page No"
              >
                <Select>
                  {amls?.map((aml) => (
                    <Option key={aml.aircraftMaintenanceLogId} value={aml.aircraftMaintenanceLogId}>
                      {aml.pageNo}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <RibbonCard ribbonText="Defect">
                <Form.Item
                  label="Sequence A"
                  name={[0, "seqNo"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input squence no",
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item label="From DMI no" name={[0, "defectDmiNo"]}>
                  <Input size="small" />
                </Form.Item>

                <Form.Item label="Description" name={[0, "defectDescription"]}>
                  <TextArea size="small" rows={3} />
                </Form.Item>
                <Form.Item name={[0, "defectSignId"]} label="Name">
                  <Select size="small">
                    {signatures.map((signature) => (
                      <Option key={signature.id} value={signature.id}>
                        {signature.employeeName} - {signature.authNo}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name={[0, "defectStaId"]} label="Station">
                  <Select size="small">
                    {airports.map((airport) => (
                      <Option key={airport.id} value={airport.id}>
                        {airport.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name={[0, "defectSignTime"]} label="Signature Time">
                  <DatePicker size="small" style={{ width: "100%" }} placeholder="" showTime />
                </Form.Item>
              </RibbonCard>
            </Col>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <Form.Item></Form.Item>

              <RibbonCard ribbonText="Rectifications">
                <Row>
                  <Col md={12} sm={12}>
                    <Form.Item label="To DMI no" name={[0, "rectDmiNo"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="MEL Ref" name={[0, "rectMelRef"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="Category" name={[0, "rectCategory"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="ATA" name={[0, "rectAta"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="POS" name={[0, "rectPos"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="P/N off" name={[0, "rectPnOff"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="S/N off" name={[0, "rectSnOff"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="P/N on" name={[0, "rectPnOn"]}>
                      <Input size="small" />
                    </Form.Item>
                  </Col>
                  <Col md={12} sm={12}>
                    <Form.Item label="S/N on" name={[0, "rectSnOn"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="GRN" name={[0, "rectGrn"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="Description" name={[0, "rectDescription"]}>
                      <TextArea size="small" rows={5} />
                    </Form.Item>
                    <Form.Item name={[0, "rectSignId"]} label="Name">
                      <Select size="small">
                        {signatures.map((signature) => (
                          <Option key={signature.id} value={signature.id}>
                            {signature.employeeName} - {signature.authNo}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name={[0, "rectStaId"]} label="Station">
                      <Select size="small">
                        {airports.map((airport) => (
                          <Option key={airport.id} value={airport.id}>
                            {airport.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name={[0, "rectSignTime"]} label="Signature Time">
                      <DatePicker size="small" style={{ width: "100%" }} placeholder="" showTime />
                    </Form.Item>
                  </Col>
                </Row>
              </RibbonCard>
            </Col>
            <Divider />
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <RibbonCard ribbonText="Defect">
                <Form.Item
                  label="Sequence B"
                  name={[1, "seqNo"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input squence no",
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item label="From DMI no" name={[1, "defectDmiNo"]}>
                  <Input size="small" />
                </Form.Item>

                <Form.Item label="Description" name={[1, "defectDescription"]}>
                  <TextArea size="small" rows={3} />
                </Form.Item>
                <Form.Item name={[1, "defectSignId"]} label="Name">
                  <Select size="small">
                    {signatures.map((signature) => (
                      <Option key={signature.id} value={signature.id}>
                        {signature.employeeName} - {signature.authNo}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name={[1, "defectStaId"]} label="Station">
                  <Select size="small">
                    {airports.map((airport) => (
                      <Option key={airport.id} value={airport.id}>
                        {airport.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name={[1, "defectSignTime"]} label="Signature Time">
                  <DatePicker size="small" style={{ width: "100%" }} placeholder="" showTime />
                </Form.Item>
              </RibbonCard>
            </Col>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>

              <RibbonCard ribbonText="Rectifications">
                <Row>
                  <Col md={12} sm={12}>
                    <Form.Item label="To DMI no" name={[1, "rectDmiNo"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="MEL Ref" name={[1, "rectMelRef"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="Category" name={[1, "rectCategory"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="ATA" name={[1, "rectAta"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="POS" name={[1, "rectPos"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="P/N off" name={[1, "rectPnOff"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="S/N off" name={[1, "rectSnOff"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="P/N on" name={[1, "rectPnOn"]}>
                      <Input size="small" />
                    </Form.Item>
                  </Col>
                  <Col md={12} sm={12}>
                    <Form.Item label="S/N on" name={[1, "rectSnOn"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="GRN" name={[1, "rectGrn"]}>
                      <Input size="small" />
                    </Form.Item>
                    <Form.Item label="Description" name={[1, "rectDescription"]}>
                      <TextArea size="small" rows={5} />
                    </Form.Item>
                    <Form.Item name={[1, "rectSignId"]} label="Name">
                      <Select size="small">
                        {signatures.map((signature) => (
                          <Option key={signature.id} value={signature.id}>
                            {signature.employeeName} - {signature.authNo}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name={[1, "rectStaId"]} label="Station">
                      <Select size="small">
                        {airports.map((airport) => (
                          <Option key={airport.id} value={airport.id}>
                            {airport.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name={[1, "rectSignTime"]} label="Signature Time">
                      <DatePicker size="small" style={{ width: "100%" }} placeholder="" showTime />
                    </Form.Item>
                  </Col>
                </Row>
              </RibbonCard>
            </Col>
            <Col lg={12} xl={12} md={12} sm={24} xs={12}>
              <Form.Item
                wrapperCol={{
                  offset: 12,
                  span: 12,
                }}
              >
                <ARMButton type="primary" htmlType="submit">
                  {id ? "Update" : "Submit"}
                </ARMButton>{" "}
                <ARMButton onClick={handleReset} type="primary" danger>
                  Reset
                </ARMButton>
              </Form.Item>
            </Col>
          </Row>
        </ARMForm>
      </ARMCard>
    </CommonLayout>
  );
}
