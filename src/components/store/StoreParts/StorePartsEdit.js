import React, { useState } from 'react';
import {
  Breadcrumb,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Upload,
  message,
  Checkbox,
  Divider,
  Radio
} from 'antd';
import { Link } from 'react-router-dom';
import ARMForm from '../../../lib/common/ARMForm';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import DebounceSelect from '../../common/DebounceSelect';
import CommonLayout from '../../layout/CommonLayout';
import { useStoreParts } from '../hooks/storeParts';
import RibbonCard from '../../common/forms/RibbonCard';


const StorePartsEdit = () => {

  const { Option } = Select;
  const { TextArea } = Input;
  const [partType, setPartType] = useState('');

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const {
    id,
    form,
    office,
    room,
    rack,
    rackRow,
    rackRowBin,
    uom,
    onReset,
    onFinish,
    isRoomDisabled,
    setIsRoomDisabled,
    isRackDisabled,
    setIsRackDisabled,
    isRackRowDisabled,
    setIsRackRowDisabled,
    isRackRowBinDisabled,
    setIsRackRowBinDisabled,
    storeVal,
    setStoreVal,
    roomVal,
    setRoomVal,
    rackVal,
    setRackVal,
    rackRowVal,
    setRackRowVal,
    isTextAreaHidden,
    setIsTextAreaHidden,
    isRackHidden,
    setIsRackHidden,
    isRackRowHidden,
    setIsRackRowHidden,
    isRackRowBinHidden,
    setIsRackRowBinHidden,
    selectedPart,
    setSelectedPart,
    locationTag,
    setLocationTag,
  } = useStoreParts();

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-archive" />
            <Link to="/store">&nbsp;Store</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/store/parts-availability"> Parts Availability</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{'edit'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard title={getLinkAndTitle('Store Parts Availability', '/store/parts-availability')}>

        <div style={{height:"20px"}}></div>
          <RibbonCard ribbonText={"Update Parts Availability"} >
            <ARMForm
              {...layout}
              form={form}
              name="basic"
              id = "storeparts"
              onFinish={onFinish}
              initialValues={{}}
              autoComplete="off"
              style={{
              backgroundColor: '#ffffff',
              }}
            >
              <Row>
              <Col
                sm={20}
                md={10}
              >
                <Form.Item
                  name="officeId"
                  label="Store"
                  rules={[
                    {
                      required: true,
                      message: 'This field is required!',
                    },
                  ]}
                >
                  <Select
                    allowClear={true}
                    placeholder="--- Select Store ---"
                    onChange={(e) => {
                      setStoreVal(e);
                      console.log('storeVal: ', e);
                      if (e !== '') {
                        setIsRoomDisabled(false);
                      } else {
                        setIsRoomDisabled(true);
                      }
                    }}
                  >
                    {office?.map((data) => (
                      <Option
                        key={data.id}
                        value={data.id}
                      >
                        {data.code}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="roomId"
                  label="Room"
                  rules={[
                    {
                      required: false,
                      message: 'This field is required!',
                    },
                  ]}
                >
                  <Select
                    allowClear={true}
                    placeholder="--- Select Room ---"
                    disabled={isRoomDisabled}
                    onChange={(e) => {
                      setRoomVal(e);
                      if (e !== '') {
                        setIsRackDisabled(false);
                      } else {
                        setIsRackDisabled(true);
                      }
                    }}
                  >
                    {room.map((room) => {
                      if (room.officeId === storeVal) {
                        return (
                          <Option
                            key={room.roomId}
                            value={room.roomId}
                          >
                            <div
                              onClick={() => {
                                setIsRackHidden(false);
                                setIsRackRowHidden(false);
                                setIsRackRowBinHidden(false);
                                setIsTextAreaHidden(true);
                                form.resetFields(['otherLocation']);
                                if (
                                  locationTag !== 'RACK' ||
                                  locationTag !== 'RACKROW' ||
                                  locationTag !== 'RACKROWBIN'
                                ) {
                                  setLocationTag('ROOM');
                                  form.setFieldValue('locationTag', 'ROOM');
                                }
                              }}
                            >
                              {room.roomCode}
                            </div>
                          </Option>
                        );
                      }
                    })}
                    <Option>
                      <div
                        onClick={() => {
                          setIsRackHidden(true);
                          setIsRackRowHidden(true);
                          setIsRackRowBinHidden(true);
                          setIsTextAreaHidden(false);
                          setLocationTag('ROOM');
                          form.setFieldValue('locationTag', 'ROOM');
                          form.resetFields(['rack', 'rackRow', 'rackRowBin']);
                        }}
                      >
                        Other Location
                      </div>
                    </Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  hidden={isRackHidden}
                  name="rackId"
                  label="Rack"
                  rules={[
                    {
                      required: false,
                      message: 'This field is required!',
                    },
                  ]}
                >
                  <Select
                    allowClear={true}
                    placeholder="--- Select Rack ---"
                    disabled={isRackDisabled}
                    onChange={(e) => {
                      setRackVal(e);
                      if (e !== '') {
                        setIsRackRowDisabled(false);
                      } else {
                        setIsRackRowDisabled(true);
                      }
                    }}
                  >
                    {rack.map((rack) => {
                      if (rack.roomId === roomVal) {
                        return (
                          <Option
                            key={rack.rackId}
                            value={rack.rackId}
                          >
                            <div
                              onClick={() => {
                                setIsRackRowHidden(false);
                                setIsRackRowBinHidden(false);
                                setIsTextAreaHidden(true);
                                form.resetFields(['otherLocation']);
                                if (
                                  locationTag !== 'ROOM' ||
                                  locationTag !== 'RACKROW' ||
                                  locationTag !== 'RACKROWBIN'
                                ) {
                                  setLocationTag('RACK');
                                  form.setFieldValue('locationTag', 'RACK');
                                }
                              }}
                            >
                              {rack.rackCode}
                            </div>
                          </Option>
                        );
                      }
                    })}
                    <Option>
                      <div
                        onClick={() => {
                          setIsRackRowHidden(true);
                          setIsRackRowBinHidden(true);
                          setIsTextAreaHidden(false);
                          setLocationTag('RACK');
                          form.setFieldValue('locationTag', 'RACK');
                          form.resetFields(['rackRow', 'rackRowBin']);
                        }}
                      >
                        Other Location
                      </div>
                    </Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  hidden={isRackRowHidden}
                  name="rackRowId"
                  label="Rack Row"
                  rules={[
                    {
                      required: false,
                      message: 'This field is required!',
                    },
                  ]}
                >
                  <Select
                    allowClear={true}
                    placeholder="--- Select Rack Row ---"
                    disabled={isRackRowDisabled}
                    onChange={(e) => {
                      setRackRowVal(e);
                      if (e !== '') {
                        setIsRackRowBinDisabled(false);
                      } else {
                        setIsRackRowBinDisabled(true);
                      }
                    }}
                  >
                    {rackRow.map((rackRow) => {
                      if (rackRow.rackId === rackVal) {
                        return (
                          <Option
                            key={rackRow.rackRowId}
                            value={rackRow.rackRowId}
                          >
                            <div
                              onClick={() => {
                                setIsRackRowBinHidden(false);
                                setIsTextAreaHidden(true);
                                form.resetFields(['otherLocation']);
                                if (
                                  locationTag !== 'RACK' ||
                                  locationTag !== 'ROOM' ||
                                  locationTag !== 'RACKROWBIN'
                                ) {
                                  setLocationTag('RACKROW');
                                  form.setFieldValue('locationTag', 'RACKROW');
                                }
                              }}
                            >
                              {rackRow.rackRowCode}
                            </div>
                          </Option>
                        );
                      }
                    })}
                    <Option>
                      <div
                        onClick={() => {
                          setIsRackRowBinHidden(true);
                          setIsTextAreaHidden(false);
                          setLocationTag('RACKROW');
                          form.setFieldValue('locationTag', 'RACKROW');
                          form.resetFields(['rackRowBin']);
                        }}
                      >
                        Other Location
                      </div>
                    </Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  hidden={isRackRowBinHidden}
                  name="rackRowBinId"
                  label="Rack Row Bin"
                >
                  <Select
                    allowClear={true}
                    placeholder="--- Select Rack Row Bin ---"
                    disabled={isRackRowBinDisabled}
                  >
                    {rackRowBin.map((rackRowBin) => {
                      if (rackRowBin.rackRowBinId === rackRowVal) {
                        return (
                          <Option
                            key={rackRowBin.rackRowBinId}
                            value={rackRowBin.rackRowBinId}
                          >
                            <div
                              onClick={() => {
                                setIsTextAreaHidden(true);
                                form.resetFields(['otherLocation']);
                                if (
                                  locationTag !== 'RACK' ||
                                  locationTag !== 'RACKROW' ||
                                  locationTag !== 'ROOM'
                                ) {
                                  setLocationTag('RACKROWBIN');
                                  form.setFieldValue('locationTag', 'RACKROWBIN');
                                }
                              }}
                            >
                              {rackRowBin.rackRowBinCode}
                            </div>
                          </Option>
                        );
                      }
                    })}
                    <Option>
                      <div
                        onClick={() => {
                          setIsTextAreaHidden(false);
                          setLocationTag('RACKROWBIN');
                          form.setFieldValue('locationTag', 'RACKROWBIN');
                        }}
                      >
                        Other Location
                      </div>
                    </Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  hidden={isTextAreaHidden}
                  name="otherLocation"
                  label="Other Location"
                >
                  <TextArea rows={4} />
                </Form.Item>

                <Form.Item
                  hidden
                  name="locationTag"
                  label="Location Tag"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col
                sm={20}
                md={10}
              >
                <Form.Item
                        name="partId"
                        label="Part No."
                        disabled = "true"
                        rules={[
                          {
                            required: true,
                            message: 'This field is required!',
                          },
                        ]}
                    >
                      <DebounceSelect
                          debounceTimeout={1000}
                          mapper={(v) => ({
                            value: v.id,
                            label: v.partNo,
                          })}
                          showSearch
                          disabled={true}
                          value={selectedPart}
                          placeholder="--- Select Part No. ---"
                          url={`/part/search?page=1&size=20`}
                          params={{
                            partType: partType,
                            isActive: true,
                          }}
                          searchParam="partNo"
                          selectedValue={selectedPart}
                          onChange={(newValue) => {
                            setSelectedPart(newValue);
                          }}
                          style={{
                            width: '100%',
                          }}
                      />
                </Form.Item>

                <Form.Item
                  name="price"
                  label="Price"
                >
                  <InputNumber   disabled={true} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="quantity"
                  label="Quantity"
                >
                  <InputNumber   disabled={true} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="uomId"
                  label="UOM"
                >
                  <Select placeholder="--- Select UOM ---"   disabled={true}>
                      disabled={true}
                    {uom?.map((data) => (
                      <Option
                        key={data.id}
                        value={data.id}
                      >
                        {data.code}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

              </Col>

              <Col
                sm={20}
                md={10}
              >
                <Form.Item
                  style={{ marginTop: '10px' }}
                  wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
                >
                  <Space size="small">
                    <ARMButton
                      type="primary"
                      htmlType="submit"
                    >
                      {id ? 'Update' : 'Submit'}
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
              </Col>
              </Row>
            </ARMForm>

          </RibbonCard>

      </ARMCard>
    </CommonLayout>
  );
};

export default StorePartsEdit;
