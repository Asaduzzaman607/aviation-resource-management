import { Breadcrumb, Col, DatePicker, Form, Input, Row, Select, TimePicker} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import CommonLayout from "../../layout/CommonLayout";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMForm from "../../../lib/common/ARMForm";
import RibbonCard from "../../common/forms/RibbonCard";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useNonRoutineCards} from "../../../lib/hooks/planning/useNonRoutineCards";
import useEmployees from "../../../lib/hooks/users/useEmployees";
const {Option} = Select;
const {TextArea} = Input;

export default function AddNonRoutineCard() {
  const {t} = useTranslation();
  const {onFinish, form, nonRoutineId, handleReset, airports,allAircrafts, acCheckIndexs} = useNonRoutineCards();

  const {initEmployees, employees} = useEmployees();

  useEffect(() => {
    (async () => {
      await initEmployees();
    })();
  }, [])




  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line"/> &nbsp;Planning
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/non-routine-card">Non Routine Card</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{nonRoutineId ? "Edit" : "Add"}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard title={getLinkAndTitle(nonRoutineId ? "NON ROUTINE CARD EDIT" : "NON ROUTINE CARD ADD", "/planning/non-routine-card", false,"PLANNING_AIRCRAFT_TECHNICAL_LOG_NON_ROUTINE_CARD_SAVE")}>
        <ARMForm
          form={form}
          name="nonRoutineWorkHard"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={
            {
              aircraftId: null,
              nrcNo: "",
              acCheckIndexId : null,
              issueDate: '',
              amlDefectRectificationDto: {
                seqNo: "A",
                defectSignId: null,
                defectStaId: null,
                defectDmiNo: "",
                defectDescription: "",
                defectSignTime: "",
                rectSignId: null,
                rectStaId: null,
                rectDmiNo: "",
                rectMelRef: "",
                rectCategory: "",
                rectAta: "",
                rectPos: "",
                rectPnOff: "",
                rectSnOff: "",
                rectPnOn: "",
                rectSnOn: "",
                rectGrn: "",
                rectDescription: ""
              }
            }
          }
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

                name="aircraftId"
                label="Aircraft"
                rules={[
                  {
                    required: true,
                    message: "Aircraft is required",
                  }
                ]}

              >
                <Select placeholder={t("planning.Task Done.Select Aircraft")} onChange={(e) => {
                  form.setFieldsValue({acCheckIndexId: ""})
                }}

                >
                  {allAircrafts?.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.aircraftId}>
                        {item.aircraftName}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item label="NRC no" name='nrcNo' rules={[
                {
                  required: true,
                  message: "NRC no is required ",
                },
              ]}>
                <Input size="small"/>
              </Form.Item>
              <Form.Item
                name="acCheckIndexId"
                label='A/C Check Index'
                rules={[
                  {
                    required: false,
                    message: "AC Check Index is required ",
                  },
                ]}
              >

                <Select
                  placeholder="Select AC Check Index"
                >
                  {
                    acCheckIndexs?.map((acCheckIndex) =>
                      <Select.Option value={acCheckIndex.acCheckIndexId} key={acCheckIndex.acCheckIndexId}>
                        {acCheckIndex?.aircraftChecksName}</Select.Option>)
                  }
                </Select>
              </Form.Item>
              <Form.Item hidden label="Sequence" name='seqNo'
                         rules={[
                           {
                             required: false,
                             message: "Reference is required ",
                           },
                         ]}>
                <Input defaultValue={'A'} size="small"/>
              </Form.Item>
              <Form.Item label="Reference" name='reference'
                         rules={[
                           {
                             required: false,
                             message: "Reference is required ",
                           },
                         ]}>
                <Input size="small"/>
              </Form.Item>
              <Form.Item label="Issue Date" name='issueDate'
                    rules={[
                      {
                        required: true,
                        message: "Issue Date is required ",
                      },
                    ]}>
                <DatePicker
                  style={{
                    width: "100%",
                  }}
                  format="DD-MM-YYYY"
                />
              </Form.Item>

              <RibbonCard ribbonText="Defect">

                <Form.Item label="From DMI no" name={"defectDmiNo"}>
                  <Input size="small"/>
                </Form.Item>

                <Form.Item label="Description" name={ "defectDescription"}>
                  <TextArea size="small" rows={3}/>
                </Form.Item>
                <Form.Item
                    name="defectSignId"
                    label="Name"
                >
                  <Select size="small">
                    <Select.Option value="">---Select---</Select.Option>
                    {
                      employees?.map(({id, name}) => <Select.Option value={id}
                                                                    key={id}>{name}</Select.Option>)
                    }
                  </Select>
                </Form.Item>
                <Form.Item name={"defectStaId"} label="Station">
                  <Select size="small">
                    {airports.map((airport) => (
                      <Option key={airport.id} value={airport.id}>
                        {airport.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name={ "defectSignTime"} label={t("planning.ATL.Signature Time")}
                           style={{marginBottom: 0}}>
                  <Form.Item
                    name="defectDate1"
                    style={{display: 'inline-block', width: 'calc(50% - 8px)'}}
                  >
                    <DatePicker format="DD-MM-YYYY" style={{width: "100%"}}/>
                  </Form.Item>
                  <Form.Item
                    name="defectTime1"
                    style={{display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px'}}
                  >
                    <TimePicker style={{width: "100%"}}/>
                  </Form.Item>
                </Form.Item>
                <Form.Item label={t("planning.ATL.Remark")} name={ "remark"}>
                  <Input size="small" />
                </Form.Item>
              </RibbonCard>
            </Col>
            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
              <Form.Item></Form.Item>
              <Form.Item></Form.Item>
              <Form.Item></Form.Item>
              <Form.Item></Form.Item>
              <RibbonCard ribbonText="Rectifications">
                <Row>
                  <Col md={12} sm={12}>
                    <Form.Item label="S/N on" name={ "rectSnOn"}>
                      <Input size="small"/>
                    </Form.Item>
                    <Form.Item label="GRN" name={ "rectGrn"}>
                      <Input size="small"/>
                    </Form.Item>
                    <Form.Item label="Description" name={ "rectDescription"}>
                      <TextArea size="small" rows={5}/>
                    </Form.Item>
                    <Form.Item
                        name="rectSignId"
                        label="Name"
                    >
                      <Select size="small">
                        <Select.Option value="">---Select---</Select.Option>
                        {
                          employees?.map(({id, name}) => <Select.Option value={id}
                                                                        key={id}>{name}</Select.Option>)
                        }
                      </Select>
                    </Form.Item>
                    <Form.Item name={ "rectStaId"} label="Station">
                      <Select size="small">
                        {airports.map((airport) => (
                          <Option key={airport.id} value={airport.id}>
                            {airport.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name={ "rectSignTime"} label={t("planning.ATL.Signature Time")}
                               style={{marginBottom: 0}}>
                      <Form.Item
                        name="defectDate2"
                        style={{display: 'inline-block', width: 'calc(50% - 8px)'}}
                      >
                        <DatePicker format="DD-MM-YYYY" style={{width: "100%"}}/>
                      </Form.Item>
                      <Form.Item
                        name="defectTime2"
                        style={{display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px'}}
                      >
                        <TimePicker style={{width: "100%"}}/>
                      </Form.Item>
                    </Form.Item>
                  </Col>
                  <Col md={12} sm={12}>
                    <Form.Item label="To DMI no" name={ "rectDmiNo"}>
                      <Input size="small"/>
                    </Form.Item>
                    <Form.Item label="MEL Ref" name={ "rectMelRef"}>
                      <Input size="small"/>
                    </Form.Item>
                    <Form.Item label="ATA" name={ "rectAta"}>
                      <Input size="small"/>
                    </Form.Item>
                    <Form.Item label="POS" name={ "rectPos"}>
                      <Input size="small"/>
                    </Form.Item>
                    <Form.Item label="P/N off" name={ "rectPnOff"}>
                      <Input size="small"/>
                    </Form.Item>
                    <Form.Item label="S/N off" name={"rectSnOff"}>
                      <Input size="small"/>
                    </Form.Item>
                    <Form.Item label="P/N on" name={ "rectPnOn"}>
                      <Input size="small"/>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col md={16}>
                    <Form.Item label={t("planning.ATL.Reason for Removal")} name={ "reasonForRemoval"}>
                      <Input size="small" />
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
                  {nonRoutineId ? "Update" : "Submit"}
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
