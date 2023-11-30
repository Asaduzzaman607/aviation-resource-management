import { Breadcrumb, Col, Form, Input, Modal, Row, Select, Transfer, Button, InputNumber } from "antd";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import { LinkAndTitle } from "../../../lib/common/TitleOrLink";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import API from "../../../service/Api";
import { notifyResponseError, notifySuccess } from "../../../lib/common/notifications";
import { isInteger } from "../../../lib/common/validation";
import { useTranslation } from "react-i18next";
import useACCheckAdd from "./useACCheckAdd";
import { append, remove } from "ramda";
import ARMTable from "../../common/ARMTable";
import { MinusCircleOutlined } from "@ant-design/icons";
import { formLayout as layout } from "../../../lib/constants/form";
import AddAircraftModelFamilyForm from "../configurations/aircraftModelFamily/AddAircraftModelFamilyForm";
import { useAircrafts } from "../../../lib/hooks/planning/aircrafts";
import useAircraftFamily from "../../../lib/hooks/planning/useAircraftFamily";
import ChecksAddForm from "../checks/ChecksAddForm";
import { useChecksAdd } from "../checks/useChecksAdd";
import Permission from "../../auth/Permission";


const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

type TITLE = "A/C Check Edit" | "A/C Check Add";

export default function ACCheckAdd() {
  const { handleModelSubmit, id, form, checks,aircraftModelFamilies,setShowModal, showModal, tasks, setTasks, handleSubmit, handleReset, taskRecords, setChecks, fetchChecksAndTasksWithModelId } = useACCheckAdd()
  const { handleModelReset, form: formData} = useAircrafts()
  const title: TITLE = id ? "A/C Check Edit" : "A/C Check Add";
  const { t } = useTranslation();


  const { form: checkForm } = useChecksAdd()
  const [showCheckModal, setShowCheckModal] = useState(false)
  const handleCheckSubmit = async (values: any) => {
    try {
      const { data } = await API.post("check", values);
      notifySuccess("Check successfully created")

      const id = data.id;

      const newCheck = {
        id,
        title: values.title
      }
      setChecks((prevState) => [...prevState, newCheck])
      form.setFieldsValue({ checkId: id })
      checkForm.resetFields()
      setShowCheckModal(false)
    } catch (er) {
      notifyResponseError(er);
    }
  }

  const handleCheckReset = () => {
    checkForm.resetFields()
  }

  const searchButtonSuffix = <Button onClick={fetchChecksAndTasksWithModelId} size="small" htmlType="button" type="primary">Search</Button>


  // @ts-ignore
  return (
    <div>
      <CommonLayout>
        <ARMBreadCrumbs>
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <i className="fas fa-chart-line" />
              <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              <Link to="/planning/ac-checks">{t("planning.A/C Checks.A/C Checks")}</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item> {id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
          </Breadcrumb>
        </ARMBreadCrumbs>

        <Permission permission={["PLANNING_CHECK_AC_CHECKS_SAVE","PLANNING_CHECK_AC_CHECKS_EDIT"]} showFallback>
        <ARMCard title={<LinkAndTitle title={title} link="/planning/ac-checks" addBtn={false} permission="PLANNING_CHECK_AC_CHECKS_SAVE" />}>
          <ARMForm
            {...layout}
            form={form}
            name="nest-messages"
            onFinish={handleSubmit}
            validateMessages={validateMessages}
            initialValues={{
              aircraftModelId: null,
              checkId: null,
              flyingHour: null,
              flyingDay: null,
              tasks: [],
              taskIds: []
            }}
          >
            <Row gutter={[12, 12]}>
              <Col span={12}>

                <Form.Item
                  name="aircraftModelId"
                  label={t("planning.Aircrafts.A/C Type")}
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <Select
                    disabled={!!id}
                    placeholder={t("planning.A/C Type.Aircraft Model")}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                      </>
                    )}
                  >
                    {
                      aircraftModelFamilies?.map(({ id , aircraftModelName} : any) => <Select.Option value={id} key={id}>{aircraftModelName}</Select.Option>)
                    }
                  </Select>
                </Form.Item>

                <Form.Item
                  name="checkId"
                  label={t("planning.A/C Checks.Check")}
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <Select
                    placeholder={t("planning.A/C Checks.Check")}
                    dropdownRender={(menu) => (
                      <>
                        <Button
                          style={{ width: "100%" }}
                          type="primary"
                          onClick={() => setShowCheckModal(true)}
                        >
                          + {t("planning.Checks.Add Check")}
                        </Button>
                        {menu}
                      </>
                    )}
                  >
                    {
                      checks.map((check) =>
                        <Select.Option value={check.id} key={check.id}>{check.title}</Select.Option>
                      )
                    }
                  </Select>
                </Form.Item>

                <Form.Item
                  name="flyingHour"
                  label={t("planning.A/C Checks.Flying Hour")}
                  rules={[]}
                >
                  <InputNumber maxLength={8} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="flyingDay"
                  label={t("planning.A/C Checks.Flying Day")}
                  rules={[
                    () => ({
                      async validator(_, flyingDay) {
                        if (!flyingDay) {
                          return Promise.resolve();
                        }

                        if (isNaN(parseInt(flyingDay))) {
                          return Promise.reject(new Error('Only numbers are allowed!'));
                        }

                        if (!isInteger(flyingDay)) {
                          return Promise.reject(new Error('Only integers are allowed!'));
                        }

                        return Promise.resolve();
                      },
                    })
                  ]}
                >
                  <Input maxLength={8} style={{ width: "100%" }}  suffix={searchButtonSuffix} />
                </Form.Item>

                <Form.Item
                  name="taskIds"
                  label="Tasks"
                  rules={[]}
                  valuePropName="targetKeys"
                >
                  <Transfer
                    titles={['Not Applicable', 'Applicable']}
                    listStyle={{ width: 250 }}
                    dataSource={taskRecords}
                    render={item => item.title}
                  />
                </Form.Item>

              </Col>
            </Row>
            <br />

            <Row>
              <Col span={12}>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                  <ARMButton type="primary" htmlType="submit">
                    {id ? t("common.Update") : t("common.Submit")}
                  </ARMButton>{" "}
                  <ARMButton onClick={handleReset} type="primary" danger>
                    {t("common.Reset")}
                  </ARMButton>
                </Form.Item>
              </Col>
            </Row>


          </ARMForm>
        </ARMCard>
        </Permission>
        {/* <Modal
          title={t("planning.A/C Type.Add A/C Type")}
          style={{
            top: 20,
          }}
          onOk={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
          centered
          visible={showModal}
          width={1080}
          footer={null}
        >
          <AddAircraftModelFamilyForm onFinish={handleModelSubmit} onReset={handleModelReset} formData={formData} form={formData} />
        </Modal> */}
        <Modal
          title={t("planning.Checks.Add Check")}
          style={{
            top: 20,
          }}
          onOk={() => setShowCheckModal(false)}
          onCancel={() => setShowCheckModal(false)}
          centered
          visible={showCheckModal}
          width={1080}
          footer={null}
        >
          <ChecksAddForm form={checkForm} handleSubmit={handleCheckSubmit} id={id} handleReset={handleCheckReset} layout={layout} validateMessages={validateMessages} />
        </Modal>
      </CommonLayout>
    </div>
  );
}