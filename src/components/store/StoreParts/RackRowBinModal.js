import React from 'react';
import {Button, Col, Form, Input, Row, Select, Space} from "antd";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";

const RackRowBinModal = ({
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
                          isRackRowDisabled,
                          rackRows,
                          setRackRowModal,

                          officeId,
                          roomId,
                          rackId,
                          rackRowId
                        }) => {
  const {Option} = Select;

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };
  React.useEffect(() => {
    form.setFieldsValue({
      rackRowId: rackRowId,
      officeId: officeId,
      roomId: roomId,
      rackId: rackId,
    });
  }, [officeId, roomId, rackId]);

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
          name="rackRowBinCode"

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
          <Select allowClear placeholder="Select a store"
                  disabled={true}
                  showSearch
                  optionFilterProp="children"
                  onSearch={onSearch}
                  onChange={(e) => {
                    onChange()
                    form.setFieldsValue({...form, roomId: null, rackId: null, rackRowId: null})
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
            {offices?.map((store, index) => (<Option key={index} value={store.id}>
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
          <Select placeholder="Select a room"
                  disabled={true}
                  showSearch
                  optionFilterProp="children"
                  onSearch={onSearch}
                  onChange={(e) => {
                    form.setFieldsValue({...form, rackId: null, rackRowId: null})
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
                  </>)}
          >
            {rooms.map((room, index) => (<Option key={room.roomId} value={room.roomId}>
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
          <Select placeholder="Select a rack" disabled={true}
                  showSearch
                  optionFilterProp="children"
                  onSearch={onSearch}
                  onChange={(e) => {
                    onChange()
                    form.setFieldsValue({...form, rackRowId: null})
                  }}
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

            {racks.map((rack, index) => (<Option key={index} value={rack.rackId}>
              {rack.rackCode}
            </Option>))}
          </Select>
        </Form.Item>

        <Form.Item
          name="rackRowId"
          label="RackRow"

          rules={[{
            required: true, message: "RackRow is required!",
          },]}
        >
          <Select placeholder="Select a rack row" disabled={true}
                  showSearch
                  optionFilterProp="children"
                  onSearch={onSearch}
                  onChange={(e) => {
                    onChange()
                  }}
                  dropdownRender={(menu) => (<>
                    <Button
                      style={{width: "100%"}}
                      type="primary"
                      onClick={() => setRackRowModal(true)}
                    >
                      + Add Racks Row
                    </Button>
                    {menu}
                  </>)}
          >

            {rackRows.map((rackRow, index) => (<Option key={index} value={rackRow.rackRowId}>
              {rackRow.rackRowCode}
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

export default RackRowBinModal;