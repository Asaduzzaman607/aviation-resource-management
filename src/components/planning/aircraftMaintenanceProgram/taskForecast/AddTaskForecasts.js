import React from 'react';
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,

  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space
} from "antd";
import {Link,} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import ARMButton from "../../../common/buttons/ARMButton";
import ARMForm from "../../../../lib/common/ARMForm";
import {formLayout} from "../../../../lib/constants/layout";
import {useTaskForecasts} from "../../../../lib/hooks/planning/useTaskForecasts";
import ARMTable from "../../../common/ARMTable";
import {useAircraftsList} from "../../../../lib/hooks/planning/aircrafts";
import {useEffect} from "react";
import {DeleteOutlined} from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import Permission from '../../../auth/Permission';
import {DateFormat} from "../../report/Common";

const { TextArea } = Input;

const AddTaskForecasts = () => {


  const {
    id,
    form,
    onFinish,
    onReset,
    getTaskByAircraftId,
    generateTaskForecast,
    taskDoneList,
    handleSearchTasks,
    onChangeTaskId,
    taskIds,
    removeGeneratedTask,

  } = useTaskForecasts()

  const { t } = useTranslation()

  const {aircrafts, initAircrafts} = useAircraftsList()

  useEffect(() => {
    (async () => {
      await initAircrafts();
    })();
  }, [])

  const forecastDtoListValue = form?.getFieldValue('forecastDtoList')


  return (
    <CommonLayout>
    <Permission permission={["PLANNING_SCHEDULE_TASKS_TASK_FORECASTS_SAVE","PLANNING_SCHEDULE_TASKS_TASK_FORECASTS_EDIT"]} showFallback>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item> <Link to='/planning'> <i className="fas fa-chart-line"/>&nbsp; Planning
          </Link></Breadcrumb.Item>

          <Breadcrumb.Item><Link to='/planning/task-forecasts'>
            {t("planning.Task Forecasts.Task Forecasts")}
          </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            {!id ? t("common.Add") : t("common.Edit")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      
      <ARMCard
        title={
          getLinkAndTitle(id ? `${t("planning.Task Forecasts.Task Forecast")} ${t("common.Edit")}` : `${t("planning.Task Forecasts.Task Forecast")} ${t("common.Add")}`, '/planning/task-forecasts',false,"PLANNING_SCHEDULE_TASKS_TASK_FORECASTS_SAVE")
        }

      >
        <ARMForm
          preserve={true}
          labelCol={{
            span: 3,
          }}
          wrapperCol={{
            span: 21,
          }}

          form={form}
          name="taskForecasts"
          onFinish={onFinish}
          scrollToFirstError
          initialValues={{
            taskLists: [],
            forecastDtoList: []
          }}
        >
          <Row justify={"start"}>

            <Col sm={20} md={28}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Please input name",
                  },
                ]}

              >
                <Input/>
              </Form.Item>

              <Form.Item label='Aircraft'
                         rules={[
                           {
                             required: true,
                             message: 'Please select Aircraft ',
                           },
                         ]}>
                <Row gutter={8}>
                  <Col span={18}>
                    <Row gutter={8}>
                      <Col span={12}>
                        <Form.Item
                          name="aircraftId"
                          rules={[
                            {
                              required: true,
                              message: 'Please select Aircraft ',
                            },
                          ]}>
                          <Select placeholder="--Select Aircraft --"

                                  onChange={(e) => getTaskByAircraftId(e)}
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
                      </Col>
                      <Col span={12}>

                        <Form.Item
                          name="date"
                          rules={[
                            {
                              required: true,
                              message: 'Please select date ',
                            },
                          ]}
                        >
                          <DatePicker.RangePicker format="DD-MM-YYYY" style={{width: '100%'}}/>
                        </Form.Item>

                      </Col>
                    </Row>

                  </Col>
                  <Col span={6}>
                    <Button
                      onClick={
                        (searchKey) => handleSearchTasks(searchKey)}>Find LDND Tasks</Button>
                  </Col>
                </Row>
              </Form.Item>


              {
                taskDoneList.length > 0 ?
                  <Form.Item name='taskListView' label='LDND Tasks'>
                    <Row className="table-responsive"
                         style={
                           taskDoneList?.length<10 ? { height: "auto"} : { height: "450px" }}
                    >
                      <Checkbox.Group style={{width: '100%'}} value={taskIds} onChange={onChangeTaskId}>
                        <ARMTable className='foreCastLdNdTaskTable'>
                          <thead style={{position: 'sticky', top: 0, overflow: 'auto', zIndex: 99}}>
                          <tr>
                            <th>Select Task</th>
                            <th>Task No</th>
                            <th>Part No</th>
                            <th>Serial No</th>
                            <th>Estimated Due Date</th>
                          </tr>

                          </thead>

                          <tbody>
                          {taskDoneList?.map((task, index) => (
                            <tr key={index}>
                              <td>
                                <Checkbox id={task.ldndId} value={task.ldndId} style={{marginTop: '5px'}}/>
                              </td>
                              <td>{task.taskNo}</td>
                              <td>{task.partNo}</td>
                              <td>{task.serialNo}</td>
                              <td>{DateFormat(task.dueDate)}</td>

                            </tr>
                          ))}
                          </tbody>
                        </ARMTable>
                      </Checkbox.Group>

                    </Row>
                    {
                      taskDoneList?.length > 0 ?
                        <Button
                          type={"primary"}
                          style={{float: 'left', marginTop : '30px'}}
                          disabled={taskIds?.length < 1}
                          onClick={generateTaskForecast}>
                          Generate Forecast Task
                        </Button>
                        : null

                    }

                  </Form.Item>
                  : null
              }

              {
                forecastDtoListValue?.length < 1 ? null :
                    <Form.Item label={'Forecast Tasks'} name="forecastDtoList">
                      <Form.List name="forecastDtoList" label='Forecast Procedure'>
                        {(fields, {add, remove}) => (
                            <>

                              {/*<pre>*/}
                              {/*  {*/}
                              {/*    JSON.stringify(form.getFieldsValue(true), null, 2)*/}
                              {/*  }*/}
                              {/*</pre>*/}

                              {/*<hr/>*/}

                              {fields.map((field, index) => (

                                  <Row key={`${index}-forecastDtoList`} gutter={8}>

                                    <Col span={24}>
                                      <Form.Item>

                                        <Row className="table-responsive">

                                          <Form.List name={[field.name]}>
                                            {(tasks, {add, remove}) => (
                                                <>
                                                  <Form.Item shouldUpdate style={{marginBottom: "-2px"}}>
                                                    <Input value={`${form.getFieldValue(['forecastDtoList', field.name, 0, "aircraftName"])} ( MSN ${form.getFieldValue(['forecastDtoList', field.name, 0, "aircraftSerial"] )})`} disabled/>
                                                  </Form.Item>
                                                  <ARMTable>
                                                    <thead>
                                                    <tr style={{fontSize: "10px"}}>
                                                      <th>Task No</th>
                                                      <th>Part No</th>
                                                      <th>Quantity</th>
                                                      <th>IPC Ref</th>
                                                      <th>Description</th>
                                                      <th>Comment</th>
                                                      <th>Due Date</th>
                                                      <th>Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {tasks.map((field, key) => (
                                                        <tr key={key}>



                                                          <Form.Item
                                                              hidden={true}
                                                              {...tasks}
                                                              name={[field.name, "ldndId"]}
                                                              rules={[
                                                                {
                                                                  required: false,
                                                                  message: "Missing LDND Id",
                                                                },
                                                              ]}
                                                              style={{margin: "5px"}}
                                                          >
                                                            <Input readOnly/>
                                                          </Form.Item>

                                                          <td style={{width: '20%', height: '20%'}}>

                                                            <Form.Item
                                                                {...tasks}
                                                                name={[field.name, "taskNo"]}
                                                                rules={[
                                                                  {
                                                                    required: false,
                                                                    message: "Missing task no",
                                                                  },
                                                                ]}
                                                                style={{margin: "5px"}}
                                                            >
                                                              <Input  readOnly/>
                                                            </Form.Item>
                                                          </td>
                                                          <td style={{width: '15%', height: '15%'}}>

                                                            <Form.List name={[field.name, 'forecastTaskPartDtoList']}>
                                                              {(parts, {add, remove}) => (<>
                                                                {parts.map((field, index) => (
                                                                    <Row key={`${index}-forecastTaskPartDtoList`} gutter={8}>
                                                                      <Col span={24}>
                                                                        <Form.Item
                                                                            {...parts}
                                                                            name={[field.name, 'partNo']}
                                                                            rules={[
                                                                              {
                                                                                required: false,
                                                                                message: "Missing part no",
                                                                              },
                                                                            ]}
                                                                            style={{margin: "5px"}}
                                                                        >

                                                                          {/*{*/}
                                                                          {/*  JSON.stringify(form.getFieldValue(['forecastDtoList', field.name, 'partId']), null, 2)*/}
                                                                          {/*}*/}

                                                                          {/*<Select disabled placeholder="Please Select Part No."*/}
                                                                          {/*>*/}
                                                                          {/*  {parts?.map((item) => {*/}
                                                                          {/*    return (*/}
                                                                          {/*      <Select.Option key={item.partId} value={item.partId}>*/}
                                                                          {/*        {item.partNo}*/}
                                                                          {/*      </Select.Option>*/}
                                                                          {/*    );*/}
                                                                          {/*  })}*/}
                                                                          {/*</Select>*/}
                                                                          <Input  readOnly/>

                                                                          {/*<pre>*/}
                                                                          {/*  {*/}
                                                                          {/*    JSON.stringify(form.getFieldsValue(true), null, 2)*/}
                                                                          {/*  }*/}
                                                                          {/*</pre>*/}
                                                                        </Form.Item>

                                                                      </Col>

                                                                    </Row>))}
                                                              </>)}
                                                            </Form.List>

                                                          </td>
                                                          <td>

                                                            <Form.List name={[field.name, 'quantity']}>
                                                              {(parts, {add, remove}) => (<>
                                                                {parts.map((field, index) => (
                                                                    <Row key={`${index}-quantity`} gutter={8}>
                                                                      <Col span={24}>
                                                                        <Form.Item
                                                                            {...tasks}
                                                                            name={[field.name, 'quantity']}
                                                                            rules={[
                                                                              {
                                                                                required: false,
                                                                                type: 'number',
                                                                                min: 0,
                                                                                message: "Quantity can not be less than 0",
                                                                              },
                                                                            ]}
                                                                            style={{margin: "5px"}}
                                                                        >
                                                                          <InputNumber  type='number'/>
                                                                        </Form.Item>

                                                                      </Col>

                                                                    </Row>))}
                                                              </>)}
                                                            </Form.List>

                                                          </td>
                                                          <td >

                                                            <Form.List name={[field.name, 'ipcRef']}>
                                                              {(parts, {add, remove}) => (<>
                                                                {parts.map((field, index) => (
                                                                    <Row key={`${index}-ipcRef`} gutter={8}>
                                                                      <Col span={24}>
                                                                        <Form.Item
                                                                            {...tasks}
                                                                            name={[field.name, 'ipcRef']}
                                                                            rules={[
                                                                              {
                                                                                required: false,
                                                                                message: "Missing ipc Ref",
                                                                              },
                                                                            ]}
                                                                            style={{margin: "5px"}}
                                                                        >
                                                                          <TextArea maxLength={255} style={{width: '100%', height: 'auto'}} autoSize />
                                                                        </Form.Item>
                                                                      </Col>

                                                                    </Row>))}
                                                              </>)}
                                                            </Form.List>
                                                          </td>

                                                          <td style={{width: '20%', height: '15%'}}>
                                                            <Form.List name={[field.name, 'description']}>
                                                              {(parts, {add, remove}) => (<>
                                                                {parts.map((field, index) => (
                                                                    <Row key={`${index}-description`} gutter={8}>
                                                                      <Col span={24}>
                                                                        <Form.Item
                                                                            {...tasks}
                                                                            name={[field.name, 'description']}
                                                                            rules={[
                                                                              {
                                                                                required: false,
                                                                                message: "Missing description",
                                                                              },
                                                                            ]}
                                                                            style={{margin: "5px"}}
                                                                        >
                                                                          <TextArea readOnly maxLength={255} style={{width: '100%', height: 'auto'}} autoSize />
                                                                        </Form.Item>
                                                                      </Col>

                                                                    </Row>))}
                                                              </>)}
                                                            </Form.List>
                                                          </td>
                                                          <td>
                                                            <Form.Item
                                                                {...tasks}
                                                                name={[field.name, "comment"]}
                                                                rules={[
                                                                  {
                                                                    required: false,
                                                                    message: "Missing comment",
                                                                  },
                                                                ]}
                                                                style={{margin: "5px"}}
                                                            >
                                                              <TextArea maxLength={255} style={{width: '100%', height: 'auto'}} autoSize />
                                                            </Form.Item>
                                                          </td>

                                                          <td>
                                                            <Form.Item
                                                                {...tasks}
                                                                name={[field.name, "dueDate"]}
                                                                rules={[
                                                                  {
                                                                    required: false,
                                                                    message: "Missing description",
                                                                  },
                                                                ]}
                                                                style={{margin: "5px"}}
                                                            >
                                                              <DatePicker style={{width: '100%'}} format='DD-MMM-YYYY'/>

                                                              {/*<Input type='date'/>*/}
                                                            </Form.Item>
                                                          </td>
                                                          <td>
                                                            <ARMButton type="primary"
                                                                       size="small"
                                                                       style={{
                                                                         backgroundColor: 'white',
                                                                         borderColor: 'grey',
                                                                         color: 'red',
                                                                         margin: '4px'
                                                                       }}
                                                                       onClick={() => removeGeneratedTask(index, field.name)}>
                                                              <DeleteOutlined twoToneColor/>

                                                            </ARMButton>

                                                          </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                  </ARMTable>

                                                </>
                                            )}
                                          </Form.List>

                                        </Row>
                                      </Form.Item>

                                    </Col>

                                  </Row>))}

                            </>)
                        }
                      </Form.List>

                    </Form.Item>
              }



            </Col>
          </Row>
          <Row>
            <Col sm={20} md={10}>
              <Form.Item
                  wrapperCol={{...formLayout.wrapperCol, offset: 6}}

              >
                <Space>
                  <ARMButton
                      size="medium"
                      type="primary"
                      htmlType="submit"
                      disabled={forecastDtoListValue?.length < 1}
                  >
                    {id ? 'Update' : 'Submit'}
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
      </Permission>
    </CommonLayout>
  );
};

export default AddTaskForecasts;
