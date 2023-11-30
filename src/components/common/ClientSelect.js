import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Row, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import {
  notifyResponseError,
  notifySuccess,
  notifyWarning,
} from '../../lib/common/notifications';
import ClientListService from '../../service/ClientListService';

const { Option } = Select;

const ClientSelect = ({ onChange, armForm }) => {
  const [form] = Form.useForm();
  const [editId, setEditId] = useState(null);
  const inputRef = useRef(null);
  const [vendorClients, setVendorClients] = useState([]);

  const addItem = async ({ clientName }) => {
    if (!clientName) {
      notifyWarning("Client Name can't be empty!");
      return;
    }
    try {
      const { data } = await ClientListService.saveClient({ clientName });
      notifySuccess('Successfully Added');
      form.resetFields();
      setVendorClients([...vendorClients, { id: data.id, clientName }]);
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const updateItem = async ({ clientName }) => {
    if (!clientName) {
      notifyWarning("Client Name can't be empty!");
      return;
    }
    try {
      await ClientListService.updateClient(editId, {
        clientName,
      });
      notifySuccess('Successfully Updated');
      form.resetFields();
      setEditId(null);
      setVendorClients((prevClients) => {
        return prevClients.map((client) => {
          if (client.id === editId) {
            return {
              ...client,
              clientName,
            };
          } else {
            return client;
          }
        });
      });
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const handleEdit = (id) => {
    setEditId(id);
    const { clientName } = vendorClients.find((item) => item.id === id);
    form.setFieldValue('clientName', clientName);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { model },
        } = await ClientListService.getClients();
        setVendorClients(model);
      } catch (error) {
        notifyResponseError(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Select
      placeholder="--Please select--"
      optionLabelProp="label"
      style={{ width: '100%' }}
      mode="multiple"
      value={armForm.getFieldValue('clientList')}
      onChange={onChange}
      filterOption={(input, option) => {
        // console.log({ option });
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider
            style={{
              margin: '8px 0',
            }}
          />
          <Form
            form={form}
            name="vendorClient"
            style={{
              padding: '0px 4px',
            }}
            onFinish={!editId ? addItem : updateItem}
          >
            <Row gutter={5}>
              <Col flex={15}>
                <Form.Item
                  name="clientName"
                  style={{ margin: 0 }}
                >
                  <Input
                    placeholder="Vendor Client"
                    ref={inputRef}
                    onKeyDown={(e) => {
                      if (e.keyCode === 8) {
                        e.stopPropagation();
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item style={{ margin: 0 }}>
                  <Button
                    type="primary"
                    icon={editId ? <UpOutlined /> : <PlusOutlined />}
                    htmlType="submit"
                    title={editId ? 'Update' : 'Add'}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item style={{ margin: 0 }}>
                  <Button
                    danger
                    type="primary"
                    icon={<CloseOutlined />}
                    onClick={() => {
                      form.resetFields();
                      setEditId(null);
                    }}
                    htmlType="button"
                    title="Reset"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      )}
    >
      {vendorClients?.map((client, index) => (
        <Option
          key={index}
          value={client.id}
          label={client.clientName}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{client.clientName}</span>
            <Button
              type="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(client.id);
              }}
              style={{ marginRight: 5 }}
              title="Edit"
            >
              <EditOutlined />
            </Button>
          </div>
        </Option>
      ))}
    </Select>
  );
};

export default ClientSelect;
