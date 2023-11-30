import { Task } from "./useACCheckIndexAdd";
import { Checkbox, Col, List, Row, Typography } from "antd";
import React from "react";
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

type Props = {
  tasks: Task[]
}
const onChange = (checkedValues: CheckboxValueType[]) => {
  console.log('checked = ', checkedValues);
};
// const options = [
//   { label: 'Apple', value: '1' },
//   { label: 'Pear', value: '2' },
//   { label: 'Orange', value: '3' },
// ];
export default function ACCheckIndexTaskList({ tasks }: Props) {

  return (
    tasks && tasks.length > 0 ? (
      <>
        {/* <List
          size="small"
          bordered
          header={<Typography.Title level={4}>Tasks</Typography.Title>}
          dataSource={tasks}
          renderItem={(task: Task) => (
            <List.Item>
              {task.taskNo}
            </List.Item>
          )}
        >
        </List> */}
        <Typography.Title>Tasks</Typography.Title>
        <Checkbox.Group onChange={onChange}>
          <Row>
              {tasks.map(task => <Col span={24}><Checkbox value={task.taskId}>{task.taskNo}</Checkbox>  </Col>)}
          </Row>
        </Checkbox.Group>
      </>
    ) : null
  )
}