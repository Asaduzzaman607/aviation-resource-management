import React from 'react';
import { useTranslation } from 'react-i18next';
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import ARMCard from "../../../common/ARMCard";
import ARMForm from "../../../../lib/common/ARMForm";
import {formLayout} from "../../../../lib/constants/form";
import ARMButton from "../../../common/buttons/ARMButton";
import {useWorkPackageSummary} from "../../../../lib/hooks/planning/useWorkPackageSummary";
import Permission from '../../../auth/Permission';


const AddWorkPackageSummary = () => {


  const {acCheckIndexs,aircrafts,form, id, onReset, onFinish, packageTypes}=useWorkPackageSummary()

  const PAGE_TITLE = id ? "WORK PACKAGE SUMMARY UPDATE" : "WORK PACKAGE SUMMARY ADD";
  const { t } = useTranslation();
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {" "}
            <Link to="/planning">
              {" "}
              <i className="fas fa-chart-line" />
              &nbsp; {t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/work-package-summary">Work Package Summary</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{!id ? t("common.Add") : t("common.Edit")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission={["PLANNING_CHECK_WORK_PACKAGE_SUMMARY_SAVE","PLANNING_CHECK_WORK_PACKAGE_SUMMARY_EDIT"]} showFallback>
      <ARMCard title={getLinkAndTitle(PAGE_TITLE, "/planning/work-package-summary",false,"PLANNING_CHECK_WORK_PACKAGE_SUMMARY_SAVE")}>
        <Row>
          <Col sm={20} md={10}>
            <ARMForm
              {...formLayout}
              form={form}
              name="workPackageSummary"
              onFinish={onFinish}
              initialValues={{
                acCheckIndexId: null,
                aircraftId : null,
                packageType: 0,
                inputDate : "",
                releaseDate : "",
                acHours: "",
                acCycle: "",
                asOfDate: "",
              }}
              scrollToFirstError
            >
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
                <Select  placeholder={t("planning.Task Done.Select Aircraft")} onChange={(e) => {
                  form.setFieldsValue({acCheckIndexId: ""})
                }}

                >
                  {aircrafts?.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.id}>
                        {item.name}
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
                    acCheckIndexs?.map((acCheckIndex) =>
                      <Select.Option value={acCheckIndex.acCheckIndexId} key={acCheckIndex.acCheckIndexId}>
                        {acCheckIndex?.aircraftChecksName}</Select.Option>)
                  }
                </Select>
              </Form.Item>

              <Form.Item
                hidden
                name="packageType"
                label='Package Type'
                rules={[
                  {
                    required: false,
                    message: "Package Type is required ",
                  },
                ]}
              >

                <Select
                  disabled
                  placeholder="Select Package Type"
                >
                  {
                    packageTypes?.map((packageType) =>
                      <Select.Option value={packageType?.type} key={packageType?.type}>
                        {packageType?.name}</Select.Option>)
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
              <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
                <Space>
                  <ARMButton size="medium" type="primary" htmlType="submit">
                    {id ? t("common.Update") : t("common.Submit")}
                  </ARMButton>
                  <ARMButton onClick={onReset} size="medium" type="primary" danger>
                    Reset
                  </ARMButton>
                </Space>
              </Form.Item>
            </ARMForm>
          </Col>
        </Row>
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default AddWorkPackageSummary;