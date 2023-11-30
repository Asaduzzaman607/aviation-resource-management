/* eslint-disable no-template-curly-in-string */
import { Breadcrumb, Button, Checkbox, Col, DatePicker, Form, InputNumber, Modal, Row, Select, Typography } from "antd";
import { Link } from "react-router-dom";
import React from "react";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import { LinkAndTitle } from "../../../lib/common/TitleOrLink";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import { useTranslation } from "react-i18next";
import useACCheckIndexAdd from "./useACCheckIndexAdd";
import { formLayout as layout } from "../../../lib/constants/form";
import ARMTable from "../../common/ARMTable";
import {formatCycle, formatHour, HourFormat, HourFormatWithName} from "../report/Common";
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

type TITLE = "AC Check Index Edit" | "AC Check Index Add";

export default function ACCheckIndexAdd() {
  const { id, form, checks, handleSubmit, aircrafts, workOrders, onAcCheckChange, handleLoadTask, tasks, isModalVisible, showModal, handleOk, handleCancel,
    onNormalTaskChange, onLdndTaskChange, ldndTasks, onReset, previousSelectedTasks } = useACCheckIndexAdd()
  const title: TITLE = id ? "AC Check Index Edit" : "AC Check Index Add";
  const { t } = useTranslation();
  

  // @ts-ignore
  return (
    <div>
      <CommonLayout>
      <Permission permission={["PLANNING_CHECK_AC_CHECK_INDEX_SAVE","PLANNING_CHECK_AC_CHECK_INDEX_EDIT"]} showFallback>
        <>
        {/*-------------BREADCRUMB--------------*/}
        <ARMBreadCrumbs>
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <i className="fas fa-chart-line" />
              <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              <Link to="/planning/ac-check-index">{t("planning.A/C Checks.A/C Check Index")}</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item> {id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
          </Breadcrumb>
        </ARMBreadCrumbs>

        <ARMCard title={<LinkAndTitle title={title} link="/planning/ac-check-index" addBtn={false} permission="PLANNING_CHECK_AC_CHECK_INDEX_EDIT" />}>
          {/*-------------FORM---------------*/}
          <ARMForm
            {...layout}
            form={form}
            name="nest-messages"
            onFinish={handleSubmit}
            validateMessages={validateMessages}
            initialValues={{
              aircraftModelId: null,
              checkId: [],
              flyingHour: null,
              flyingDay: null,
              tasks: []
            }}
          >
            <Row gutter={[12, 12]}>
              <Col span={10}>

                <Form.Item
                  name="aircraftId"
                  label={t("planning.Aircrafts.Aircraft")}
                  rules={[
                    {
                      required: true,
                    }
                  ]}
                >
                  <Select
                    disabled={!!id}
                    placeholder={t("planning.Aircrafts.Aircraft")}
                    allowClear
                  >
                    {
                      aircrafts.map(({ aircraftId, aircraftName }) => <Select.Option value={aircraftId} key={aircraftId}>{aircraftName}</Select.Option>)
                    }
                  </Select>
                </Form.Item>

                <Form.Item
                  name="woId"
                  label={t("planning.A/C Checks.Work Order")}
                  rules={[
                    {
                      required: false,
                    }
                  ]}
                >
                  <Select
                    placeholder={t("planning.A/C Checks.Work Order")}
                    allowClear
                  >
                    {
                      workOrders.map(({ woId, woNo }) => <Select.Option value={woId} key={woId}>{woNo}</Select.Option>)
                    }
                  </Select>
                </Form.Item>

                <Row>
                  <Form.Item style={{ width: "100%", marginBottom: '0' }}
                    name="aircraftTypeCheckIds"
                    label={t("planning.A/C Checks.Check")}
                    rules={[
                      {
                        required: true,
                      }
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      mode="multiple"
                      placeholder={t("planning.A/C Checks.Check")}
                      onChange={onAcCheckChange}
                      allowClear
                    >
                      {
                        checks.map(({ acCheckId, checkTitle }) =>
                          <Select.Option value={acCheckId} key={acCheckId}>{checkTitle}</Select.Option>
                        )
                      }
                    </Select>
                  </Form.Item>
                  <Button style={{ margin: "10px 33%" }} onClick={handleLoadTask}>Load Task</Button>
                </Row>
                <Form.Item label={t("planning.A/C Checks.Done Date")} name="doneDate" >
                  <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label={t("planning.A/C Checks.Done Hours")} name="doneHour">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label={t("planning.A/C Checks.Done Cycles")} name="doneCycle">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>

                {/*---------TASK LIST-------------*/}
                {/* <ACCheckIndexTaskList tasks={tasks} /> */}
                {/* {tasks && tasks.length > 0 ? (<>
                  <Typography.Title>Tasks</Typography.Title>
                  <Checkbox.Group onChange={onNormalTaskChange} defaultValue={previousSelectedTasks}>
                    <Row>
                      {tasks.map(task => <Col span={24}><Checkbox checked={true} value={task.ldndId}>{task.taskNo}</Checkbox>  </Col>)}
                    </Row>
                  </Checkbox.Group></>) : null
                } */}

                {tasks && tasks.length > 0 ? (<div style={{ marginLeft: "33%" }}>
                  <Typography.Title>Tasks</Typography.Title>
                  <Form.Item name="taskIds">
                    <Checkbox.Group onChange={onNormalTaskChange}>
                      <ARMTable className='foreCastLdNdTaskTable' style={{ width: "150%" }}>
                        <thead style={{ position: 'sticky', top: 0, overflow: 'auto', zIndex: 99 }}>
                          <tr>
                            <th style={{ padding: "0 10px" }}>Select Task</th>
                            <th style={{ padding: "0 10px" }}>AMP Reference</th>
                            <th style={{ padding: "0 10px" }}>Part No</th>
                            <th style={{ padding: "0 10px" }}>Serial No</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks?.map((task: { ldndId: any; taskNo: any; partNo: any; serialNo: any; }) => (
                            <tr key={task.ldndId}>
                              <td>
                                <Checkbox id={task.ldndId} value={task.ldndId} style={{ marginTop: '5px' }} />
                              </td>
                              <td style={{ padding: "0 15px" }}>
                                {task.taskNo}
                              </td>
                              <td style={{ padding: "0 15px" }}>
                                {task.partNo}
                              </td>
                              <td style={{ padding: "0 15px" }}>
                                {task.serialNo}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </ARMTable>
                    </Checkbox.Group></Form.Item></div>) : null
                }

                <Row style={{ margin: "15px 33%" }}>
                  <Button onClick={showModal}>Add LDND Tasks</Button>
                </Row>
                {/*--------------FORM BUTTONS------------*/}
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                  <ARMButton type="primary" htmlType="submit">
                    {id ? t("common.Update") : t("common.Submit")}
                  </ARMButton>{" "}
                  <ARMButton onClick={onReset} type="primary" danger>
                    {t("common.Reset")}
                  </ARMButton>
                </Form.Item>

              </Col>
              <Col span={16}>
                <Modal title="LDND Tasks" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                  <Form.Item name="ldndIds" noStyle>

                  <Checkbox.Group onChange={onLdndTaskChange} defaultValue={previousSelectedTasks} style={{
                    width: '100%'
                  }}>

                    <ARMTable>
                      <thead>
                      <tr>
                        <th rowSpan={2}>Task NO</th>
                        <th colSpan={3}>Threshold</th>
                        <th colSpan={3}>Interval</th>
                        <th rowSpan={2}>Description</th>
                      </tr>
                      </thead>
                      <tbody>

                      {
                        ldndTasks.length > 0 && ldndTasks.map(task => <tr>
                          <td>
                            <Checkbox value={task.ldndId}>{task.taskNo}</Checkbox>
                          </td>

                          <td>{formatHour(task.thresholdHour, task.isApuControl)}</td>
                          <td>{formatCycle(task.thresholdCycle, task.isApuControl)}</td>
                          <td>{task.thresholdDay? `${task.thresholdDay} DY`: ''}</td>


                          <td>{formatHour(task.intervalHour, task.isApuControl)}</td>
                          <td>{formatCycle(task.intervalCycle, task.isApuControl)}</td>
                          <td>{task.intervalDay? `${task.intervalDay} DY`: ''}</td>
                          <td>
                            {task.taskDescription}
                          </td>
                        </tr> )
                      }

                      </tbody>
                    </ARMTable>
                  </Checkbox.Group>



                  </Form.Item>
                </Modal>
              </Col>
              {/* <Col></Col> */}
              <Col span={10}>
              </Col>
            </Row>
          </ARMForm>
        </ARMCard>
        </>
        </Permission>
      </CommonLayout>
    </div >
  );
}