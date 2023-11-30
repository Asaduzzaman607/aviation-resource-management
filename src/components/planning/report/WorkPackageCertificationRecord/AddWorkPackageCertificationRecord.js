import React from 'react';
import {useTranslation} from 'react-i18next';
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import ARMCard from "../../../common/ARMCard";
import ARMForm from "../../../../lib/common/ARMForm";
import {formLayout} from "../../../../lib/constants/form";
import ARMButton from "../../../common/buttons/ARMButton";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useWorkPackageCertificate} from "../../../../lib/hooks/planning/useWorkPackageCertificate";
import Permission from '../../../auth/Permission';


const AddWorkPackageCertificationRecord = () => {


  const {acCheckIndexs, allAircrafts, form, id, onReset, onFinish} = useWorkPackageCertificate()

  const PAGE_TITLE = id ? "WORK PACKAGE CERTIFICATION RECORD UPDATE" : "WORK PACKAGE CERTIFICATION RECORD ADD";
  const {t} = useTranslation();
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {" "}
            <Link to="/planning">
              {" "}
              <i className="fas fa-chart-line"/>
              &nbsp; {t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/work-package-certification-record">Work Package Certification Record</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{!id ? t("common.Add") : t("common.Edit")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission={["PLANNING_CHECK_WORK_PACKAGE_CERTIFICATION_RECORD_SAVE","PLANNING_CHECK_WORK_PACKAGE_CERTIFICATION_RECORD_EDIT"]}>
      <ARMCard title={getLinkAndTitle(PAGE_TITLE, "/planning/work-package-certification-record",false,"PLANNING_CHECK_WORK_PACKAGE_CERTIFICATION_RECORD_SAVE")}>
        <ARMForm
          {...formLayout}
          form={form}
          name="workPackageCertification"
          onFinish={onFinish}
          initialValues={{
            acCheckIndexId: null,
            aircraftId: null,
            inputDate: "",
            releaseDate: "",
            acHours: "",
            acCycle: "",
            asOfDate: "",
          }}
          scrollToFirstError
        >
          <Row>
            <Col sm={20} md={10}>

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
                <Select placeholder={t("planning.Task Done.Select Aircraft")} allowClear

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
              <Form.Item
                name="acCheckIndexId"
                label='Ac Check Index'
                rules={[
                  {
                    required: true,
                    message: "AC Check Index is required ",
                  },
                ]}
              >

                <Select
                  placeholder="Select AC Check Index"
                >
                  {
                    acCheckIndexs.map((acCheckIndex) =>
                      <Select.Option value={acCheckIndex?.acCheckIndexId} key={acCheckIndex?.acCheckIndexId}>
                        {acCheckIndex?.aircraftChecksName}</Select.Option>)
                  }
                </Select>
              </Form.Item>
              <Form.Item
                label='Input Date'
                name="inputDate"
                rules={[
                  {
                    required: false,
                    message: "Please input a Date",
                  },
                ]}
              >
                <DatePicker format="DD-MM-YYYY" style={{width: "100%"}}/>
              </Form.Item>


            </Col>
            <Col sm={20} md={10}>
              <Form.Item
                label='Release Date'
                name="releaseDate"
                rules={[
                  {
                    required: false,
                    message: "Please input a Date",
                  },
                ]}
              >
                <DatePicker format="DD-MM-YYYY" style={{width: "100%"}}/>
              </Form.Item>

                <Form.Item
                label='As on Date'
                name="asOfDate"
                rules={[
                  {
                    required: false,
                    message: "Please input a Date",
                  },
                ]}
              >
                <DatePicker format="DD-MM-YYYY" style={{width: "100%"}}/>
              </Form.Item>
              <Form.Item
                name="acHours"
                label="AC Hours"
                rules={[
                  {
                    required: true,
                    message: 'AC Hours is required',
                  },
                ]}
              >
                  <Input maxLength={9} />
              </Form.Item>
              <Form.Item
                name="acCycle"
                label="AC Cycle"
                rules={[
                  {
                    required: true,
                    message: 'AC Cycle is required',
                  },
                ]}
              >
                <InputNumber/>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="jobCardsDtoList" label='Job Category Card' labelCol={{span: 3}}
                     wrapperCol={{span: 21}}>
            <Form.List
              name="jobCardsDtoList"
              label='Job Category Card'
              style={{marginLeft: "25px"}}>
              {(fields, {add, remove}) => (<>
                {fields.map((field, index) => (
                  <Row key={`${index}-jobCardsDtoList`} gutter={8}>
                    <Col span={6}>
                      <Form.Item
                        style={{marginBottom: "12px"}}
                        {...field}
                        label=""
                        name={[field.name, 'jobCategory']}
                        rules={[{
                          required: false,
                          message: 'Job category is missing'
                        }]}
                      >
                        <Input.TextArea placeholder='Job category' maxLength={255} autoSize/>
                      </Form.Item>

                    </Col>
                    <Col>
                      <Form.Item
                        style={{marginBottom: "12px"}}
                        {...field}
                        label=""
                        name={[field.name, 'total']}
                        rules={[{
                          required: false,
                          message: 'Total is missing'
                        }]}
                      >
                        <InputNumber placeholder='Total'/>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        style={{marginBottom: "12px"}}
                        {...field}
                        label=""
                        name={[field.name, 'completed']}
                        rules={[{
                          required: false,
                          message: 'Completed is missing'
                        }]}
                      >
                        <InputNumber placeholder='Completed'/>
                      </Form.Item>

                    </Col>
                    <Col>

                      <Form.Item
                        style={{marginBottom: "12px"}}
                        {...field}
                        label=""
                        name={[field.name, 'deferred']}
                        rules={[{
                          required: false,
                          message: 'Deffered is missing'
                        }]}
                      >
                        <InputNumber placeholder='Deferred'/>
                      </Form.Item>

                    </Col>
                    <Col>

                      <Form.Item
                        style={{marginBottom: "12px"}}
                        {...field}
                        label=""
                        name={[field.name, 'withDrawn']}
                        rules={[{
                          required: false,
                          message: 'Withdrawn is missing'
                        }]}
                      >
                        <InputNumber placeholder='Withdrawn'/>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        style={{width: '100%'}}
                        {...field}
                        label=""
                        name={[field.name, 'remark']}
                        rules={[{
                          message: 'Remark is missing',
                        },]}
                      >
                        <Input.TextArea maxLength={255} placeholder=' Remark' autoSize/>
                      </Form.Item>
                    </Col>
                    <Col style={{marginTop: '4px'}}>
                      <MinusCircleOutlined onClick={() => remove(field.name)}/>
                    </Col>
                  </Row>
                ))}

               <Form.Item style={{width: '100%'}}>
                  <Button
                    style={{width: '80%'}}
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    block
                    icon={<PlusOutlined/>}
                  >
                    Add Job Card
                  </Button>
                </Form.Item>
              </>)}
            </Form.List>
          </Form.Item>

          <Row>
            <Col sm={20} md={10}>
              <Form.Item wrapperCol={{...formLayout.wrapperCol, offset: 8}}>
                <Space>
                  <ARMButton size="medium" type="primary" htmlType="submit">
                    {id ? t("common.Update") : t("common.Submit")}
                  </ARMButton>
                  <ARMButton onClick={onReset} size="medium" type="primary" danger>
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
  )
    ;
};

export default AddWorkPackageCertificationRecord;