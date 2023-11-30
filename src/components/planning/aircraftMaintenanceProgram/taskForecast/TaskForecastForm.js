import React from 'react';
import {DatePicker, Form, Input, InputNumber, Select} from "antd";
import {Option} from "antd/lib/mentions";
import {useTaskForecasts} from "../../../../lib/hooks/planning/useTaskForecasts";

const TaskForecastForm = () => {

  const {
    allTask,
    aircrafts
  } = useTaskForecasts()

  return (
    <div>

      <Form.Item
        name="taskId"
        label="Task"
        rules={[
          {
            required: false,
            message: 'Please select Task No',
          },
        ]}>
        <Select placeholder="--Select Task Record--" allowClear>
          {allTask?.map((item, index) => {
            return (
              <Select.Option key={index} value={item.taskId}>
                {item.taskNo}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item
        name="quantity"
        label="Quantity"
        rules={[
          {
            min: 0,
            type: 'number',
            required: false,
            message: "Quantity can not be less than 0",
          },
        ]}

      >
        <InputNumber type='number'/>
      </Form.Item>
      <Form.Item
        name="ipc"
        label="IPC Ref"
        rules={[
          {
            message: "Please input IPC Ref",
          },
        ]}

      >
        <Input/>
      </Form.Item>
      <Form.Item
        name="comment"
        label="Comment"
        rules={[
          {

            message: "Please input comment",
          },
        ]}

      >
        <Input/>
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[
          {
            required: false,
            message: "Please input Description",
          },
        ]}

      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="Due Date"
        name="dueDate"
        rules={[
          {
            required: false,
            message: "Please input a Date",
          },
        ]}

      >
        <DatePicker style={{width: '100%'}}/>
      </Form.Item>

    </div>
  );
};

export default TaskForecastForm;
