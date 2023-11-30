import React from 'react';
import {Button, Col, Form, Input, Row, Select, Space} from "antd";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";

const SaveRackRow = ({
                       form,
                       layout,
                       onFinish,
                       offices,
                       isRoomDisabled,
                       setRackModal,
                       rooms,
                       isRackDisabled,
                       racks,
                       onReset,
                       id,
                       setShowModal,
                       setRoomModal,
                     }) => {
  const {Option} = Select;
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };

  console.log("racks", racks)
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
            required: true, message: 'Code is required!',
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
            required: true, message: "Store is required!",
          },]}
        >
          <Select placeholder="Select a store"
                  showSearch
                  optionFilterProp="children"
                  onSearch={onSearch}
                  onChange={(e) => {
                    onChange()
                    form.setFieldsValue({...form, roomId: null, rackId: null})
                  }}
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                  dropdownRender={(menu) => (<>
                    <Button
                      style={{width: "100%"}}
                      type="primary"
                      onClick={() => setShowModal(true)}
                    >
                      + Add Store
                    </Button>
                    {menu}
                  </>)}
          >
            {offices.map((store, key) => (<Option key={key} value={store.id}>
              {store.code}
            </Option>))}
          </Select>
        </Form.Item>

        <Form.Item
          name="roomId"
          label="Room"

          rules={[{
            required: true, message: "Room is required!",
          },]}
        >
          <Select placeholder="Select a room" disabled={isRoomDisabled}
                  showSearch
                  optionFilterProp="children"
                  onSearch={onSearch}
                  onChange={(e) => {
                    onChange()
                    form.setFieldsValue({...form, rackId: null})
                  }}

                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                  dropdownRender={(menu) => (<>
                    <Button
                      style={{width: "100%"}}
                      type="primary"
                      onClick={() => setRoomModal(true)}
                    >
                      + Add Rooms
                    </Button>
                    {menu}
                  </>)}>
            {rooms?.map((room, index) => (<Option key={index} value={room.roomId}>
              {room.roomCode}
            </Option>))}
          </Select>
        </Form.Item>
        <Form.Item
          name="rackId"
          label="Rack"

          rules={[{
            required: true, message: "Rack is required!",
          },]}
        >
          <Select allowClear placeholder="Select a rack" disabled={isRackDisabled}
                  showSearch
                  optionFilterProp="children"
                  onChange={onChange}
                  onSearch={onSearch}
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                  dropdownRender={(menu) => (<>
                    <Button
                      style={{width: "100%"}}
                      type="primary"
                      onClick={() => setRackModal(true)}
                    >
                      + Add Racks
                    </Button>
                    {menu}
                  </>)}
          >

            {racks?.map((rack, index) => (<Option key={index} value={rack.rackId}>
              {rack.rackCode}
            </Option>))}
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

export default SaveRackRow;