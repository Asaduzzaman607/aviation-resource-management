import React from 'react';
import {Col, Form, Input, Row, Select, Space} from "antd";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";

const AddRackRowModal = ({
                           form,
                           layout,
                           onFinish,
                           setVal,
                           offices,
                           setRoomVal,
                           rooms,
                           racks,
                           onReset,
                           id,
                           officeId,
                           roomId,
                           rackId
                         }) => {
  React.useEffect(() => {
    form.setFieldsValue({
      rackRowCode: null,
      officeId:officeId,
      roomId:roomId,
      rackId:rackId,
    });
  }, [officeId,roomId,rackId]);
  return (<Row>
      <Col sm={20} md={10}>
        <ARMForm
          form={form}
          name="store"
          {...layout}
          initialValues={{}}
          autoComplete="off"
          style={{
            backgroundColor: "#ffffff",
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Code"
            name="rackRowCode"
            rules={[{
              required: true, message: 'Field should not be empty',
            }, {
              max: 50, message: 'Maximum 50 characters allowed',
            }, {
              whitespace: true, message: 'Only space is not allowed',
            },]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            name="officeId"
            label="Store"

            rules={[{
              required: true, message: "Please select store!",
            },]}
          >
            <Select allowClear placeholder="Select a store" disabled={true} onChange={(e) => {
              setVal(e);
              form.setFieldsValue({...form, roomId: null, rackId: null})
            }}
            >
              {offices?.map((store, key) => (<Select.Option key={key} value={store.id}>
                {store.code}
              </Select.Option>))}
            </Select>
          </Form.Item>

          <Form.Item
            name="roomId"
            label="Room"

            rules={[{
              required: true, message: "Please select room !",
            },]}
          >
            <Select allowClear placeholder="Select a room" disabled={true} onChange={(e) => {
              setRoomVal(e);
            }}
            >
              {rooms?.map((room, key) => {

                return <Select.Option key={room.roomId}
                                      value={room.roomId}>{room.roomCode} </Select.Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="rackId"
            label="Rack"

            rules={[{
              required: true, message: "Please select Rack !",
            },]}
          >
            <Select allowClear placeholder="Select a rack" disabled={true}
            >
              {racks?.map((rack, key) => {


                return <Select.Option key={rack.rackId}
                                      value={rack.rackId}>{rack.rackCode} </Select.Option>

              })}
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
            <Space>
              <ARMButton type="primary" htmlType="submit">
                {id ? "Update" : "Submit"}
              </ARMButton>
              <ARMButton
                onClick={onReset}

                type="primary"
                danger
              >
                Reset
              </ARMButton>
            </Space>
          </Form.Item>
        </ARMForm>
      </Col>
    </Row>);
};

export default AddRackRowModal;