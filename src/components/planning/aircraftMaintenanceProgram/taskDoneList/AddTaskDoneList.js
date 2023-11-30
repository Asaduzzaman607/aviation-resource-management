import React from "react";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Button, Col, DatePicker, Form, Input, InputNumber, Radio, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import ARMButton from "../../../common/buttons/ARMButton";
import ARMForm from "../../../../lib/common/ARMForm";
import {formLayout} from "../../../../lib/constants/layout";
import {useTaskDoneList} from "../../../../lib/hooks/planning/useTaskDoneList";
import {useAircraftsList} from "../../../../lib/hooks/planning/aircrafts";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {collect} from 'collect.js';
import TextArea from "antd/es/input/TextArea";
import Permission from "../../../auth/Permission";


const AddTaskDoneList = () => {
  const {
    id,
    form,
    onFinish,
    onReset,
    TITLE,
    handleTaskChange,
    getAircraftId,
    getTaskId,
    allTasksByAircraft,
    isApuControl,
    partSerials,
    positions,
    onChangeInitial,
    rType,
    calculateLDND,
    onChange,
    serials,
    allTaskStatus

  } =
    useTaskDoneList();

  const {allAircrafts, getAllAircrafts} = useAircraftsList()

  const uniqueParts = collect(partSerials)?.unique('partId').items


  useEffect(() => {
    (async () => {
      await getAllAircrafts();
    })();
  }, [])

  const {t} = useTranslation()


  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line"/>
              &nbsp; {t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/task-done-list">{t("planning.Task Done.Task Done")}</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission permission={["PLANNING_SCHEDULE_TASKS_TASK_DONE_SAVE","PLANNING_SCHEDULE_TASKS_TASK_DONE_EDIT"]} showFallback>
      <ARMCard title={getLinkAndTitle(TITLE, "/planning/task-done-list",false,"PLANNING_SCHEDULE_TASKS_TASK_DONE_SAVE")}>
        <ARMForm
          {...formLayout}
          form={form}
          name="lastDoneTask"
          onFinish={onFinish}
          scrollToFirstError
          initialValues={{
            taskId: "",
            aircraftId: "",
            partId: "",
            serialId: "",
            doneDate: "",
            isApuControl: false,
            doneHour: "",
            doneCycle: "",
            intervalType: 0
          }}
        >
          <Row>
            <Col sm={20} md={12}>
              <Form.Item
                name="aircraftId"
                label={t("planning.Aircrafts.Aircraft")}
                rules={[
                  {
                    required: false,
                    message: "Please select an Aircraft",
                  },
                ]}
              >
                <Select disabled={id} placeholder={t("planning.Task Done.Select Aircraft")} allowClear
                        onChange={(e) => getAircraftId(e)}
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
                name="taskId"
                label={t("planning.Task Done.Task")}
                rules={[
                  {
                    required: true,
                    message: t("planning.Task Done.Task no is required"),
                  },
                ]}
              >
                <Select placeholder={t("planning.Task Done.Please select Task No")} onChange={(e) => {
                  handleTaskChange(e);
                  getTaskId(e);
                  onChangeInitial();
                  form.setFieldsValue({serialNo: "", partId: ""})
                }}
                        allowClear
                        showSearch
                        filterOption={(inputValue, option) =>
                          option.children
                            .toString("")
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        }>
                  {allTasksByAircraft?.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.taskId}>
                        {item.taskNo}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>


              <Form.Item
                name="partId"
                label={t("planning.Parts.Part")}
                style={{
                  marginBottom: "12px",
                }}
                rules={[
                  {
                    required: true,
                    message: t("planning.Task Done.Part is required"),
                  }
                ]}
              >
                <Select
                  onChange={() => {
                    form.setFieldsValue({serialNo: ""})
                  }}
                  placeholder={t("planning.Task Done.Select Part")}
                >
                  {uniqueParts?.map((item) => {
                    return (
                      <Select.Option key={item.partId} value={item.partId}>
                        {item.partNo}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>

              <Form.Item
                name="serialId"
                label={t("planning.Task Done.Serial No.")}
                style={{
                  marginBottom: "12px",
                }}
                rules={[
                  {
                    required: true,
                    message: t("planning.Task Done.Serial no. is required"),
                  },
                ]}
              >
                <Select placeholder={t("planning.Task Done.Please Select Serial No.")} options={serials}>
                </Select>
              </Form.Item>


              {
                positions.length && positions.find(p => p.positionId !== null) ?

                  <Form.Item
                    label={t("planning.Task Done.Position")}
                    name="positionId"
                    rules={[
                      {
                        required: false,
                        message: "Please input position",
                      },
                    ]}
                  >
                    <Select placeholder={t("planning.Task Done.Select Position")}>
                      {positions?.map((item) => {
                        return (
                          <Select.Option key={item.positionId} value={item.positionId}>
                            {item.position}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item> : null

              }

              <Form.Item label="Interval Type"
                         name='intervalType'
                         valuePropName="checked"
              >
                <Radio.Group value={rType} onChange={onChange}>
                  <Radio value={0}>Threshold</Radio>
                  <Radio value={1}>Interval</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label='Done / Start Date'
                name="doneDate"
                rules={[
                  {
                    required: true,
                    message: "Please input a Date",
                  },
                ]}
              >
                <DatePicker format="DD-MM-YYYY" style={{width: "100%"}}/>
              </Form.Item>
              <Row gutter={[2, 2]} style={{width: "84%", marginLeft: "16%"}}>
                <Col sm={20} md={12}>
                  <Form.Item label='Done / Start Hrs' name="doneHour" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                      <Input min={0}  addonAfter={isApuControl ? "AH" : "FH"} />
                  </Form.Item>
                  <Form.Item label='Done / Start Cycle' name="doneCycle" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                    <InputNumber addonAfter={isApuControl ? "AC" : "FC"}/>
                  </Form.Item>
                </Col>
                <Col sm={20} md={12}>
                  <Col>
                    <Form.Item label='Initial Hrs' name="initialHour">
                      <Input min={0}  addonAfter={isApuControl ? "AH" : "FH"} />
                    </Form.Item>
                    <Form.Item label='Initial Cycle' name="initialCycle">
                      <InputNumber addonAfter={isApuControl ? "AC" : "FC"}/>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Button onClick={() => calculateLDND()}>Calculate</Button>
                  </Col>
                </Col>

              </Row>
            </Col>
            <Col sm={22} md={12}>
              <Row>
                <Col sm={20} md={13}>
                  <Form.Item label='Due Hours' name="dueHour">
                    <InputNumber readOnly addonAfter={isApuControl ? "AH" : "FH"}/>
                  </Form.Item>
                  <Form.Item label='Due Cycle' name="dueCycle">
                    <InputNumber readOnly addonAfter={isApuControl ? "AC" : "FC"}/>
                  </Form.Item>
                  <Form.Item
                    label='Due Date'
                    name="dueDate"
                    rules={[
                      {
                        required: false,
                        message: "Please input a Date",
                      },
                    ]}
                  >
                    <DatePicker format="DD-MM-YYYY" disabled style={{width: "92%"}}/>
                  </Form.Item>

                </Col>
                <Col sm={20} md={10}>
                  <Form.Item label='Remn Hours' name="remainingHour">
                    <InputNumber readOnly addonAfter={isApuControl ? "AH" : "FH"}/>
                  </Form.Item>
                  <Form.Item label='Remn Cycle' name="remainingCycle">
                    <InputNumber readOnly addonAfter={isApuControl ? "AC" : "FC"}/>
                  </Form.Item>
                  <Form.Item
                    label='Remn Day'
                    name="remainingDay"
                    rules={[
                      {
                        required: false,
                        message: "Please input a Date",
                      },
                    ]}
                  >
                    <Input readOnly/>
                  </Form.Item>
                </Col>
                <Col span={13}>
                  <Form.Item
                    name='taskStatus'
                    label={t("planning.Task Records.Task Status")}
                    rules={[
                      {
                        required: true,
                        message: "Task status is required",
                      },
                    ]}

                  >
                    <Select
                      allowClear
                      style={{
                        width: '100%',
                      }}
                      placeholder={t("planning.Task Records.Please select a status")}

                    >
                      {allTaskStatus?.map((task) => (<Select.Option key={task.id} value={task.id}>
                        {task.taskStatus}
                      </Select.Option>))}
                    </Select>

                  </Form.Item>
                </Col>

                <Col span={23}>
                  <Form.Item
                    label='Estimated Due Date'
                    name="estimatedDueDate"
                    rules={[
                      {
                        required: true,
                        message: "Please calculate the estimated due date",
                      },
                    ]}
                  >
                    <DatePicker format="DD-MM-YYYY" disabled style={{width: "80%"}}/>
                  </Form.Item>

                </Col>
                <Col span={23}>
                  <Form.Item
                    label='Remark'
                    name="remark"
                    rules={[
                      {
                        required: false,
                        message: "Remark is missing",
                      },
                    ]}
                  >
                    <TextArea maxLength={255} style={{width: '80%', height: 'auto'}} autoSize />
                  </Form.Item>
                </Col>


              </Row>

            </Col>
          </Row>
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
  );
};

export default AddTaskDoneList;
