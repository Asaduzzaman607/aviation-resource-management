import {
  ArrowLeftOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Upload,
} from 'antd';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ARMForm from '../../../lib/common/ARMForm';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import Permission from '../../auth/Permission';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import RibbonCard from '../../common/forms/RibbonCard';
import CommonLayout from '../../layout/CommonLayout';
import FormControl from '../common/FormControl';
import { ROTABLE, useScrapParts } from '../hooks/scrapParts';
import ScrapPartsBreadcrumb from './ScrapPartsBreadcrumb';
import ScrapPartsDeBounce from './ScrapPartsDeBounce';
import ScrapPartService from './ScrapPartService';
import DebounceSelect from "../../common/DebounceSelect";
import React from "react";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const ScrapParts = () => {
  const {
    form,
    id,
    onReset,
    onFinish,
    handleFileInput,
    attachmentList,
    serials,
    setSerials,
    loading,
    selectedPartValue,
    setSelectedPartValue,
    partsId,
    setPartsId,
    classification,
    getPartDetails
  } = useScrapParts();

  const navigate = useNavigate();

  const allSerials = async (id) => {
    const data = await ScrapPartService.fetchSerialsByPartId(id);
    console.log('serials: ', data);
    setSerials(data);
  };

  useEffect(() => {
    partsId && allSerials(partsId);
  }, [partsId]);

  const route = useSelector((state) => state.routeLocation.previousRoute);

  return (
    <CommonLayout>
      <ScrapPartsBreadcrumb id={id} />
      <Permission
        permission={[
          'STORE_SCRAP_PARTS_SCRAP_PART_SAVE',
          'STORE_SCRAP_PARTS_SCRAP_PART_EDIT',
        ]}
        showFallback
      >
        <ARMCard
          title={
            route === 'list'
              ? getLinkAndTitle('Scrap Parts', '/store/pending-scrap-parts')
              : getLinkAndTitle('Scrap Parts', '/store')
          }
        >
          <ARMForm
            {...layout}
            form={form}
            name="basic"
            initialValues={{
              remarks: '',
              partId: null,
              partClassification: 1,
              attachmentList: [],
              scrapPartSerialDtos: [
                {
                  quantity: 1,
                  storeSerialId: null,
                  isActive: true,
                },
              ],
            }}
            onFinish={onFinish}
            autoComplete="off"
            style={{
              backgroundColor: '#ffffff',
            }}
          >
            <Row>
              <Col md={10}>
                <Form.Item
                  name="partClassification"
                  label="Part Type"
                  rules={[
                    {
                      required: true,
                      message: 'Part Type. is required!',
                    },
                  ]}
                >
                  <Select
                    allowClear
                    placeholder="--- Select Part Type ---"
                  >
                    <Option value={1}>ROTABLE</Option>
                    <Option value={2}>CONSUMABLE</Option>
                    <Option value={3}>EXPENDABLE</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col md={10}>
                <Form.Item
                  name="remarks"
                  label="Remarks"
                >
                  <Input.TextArea rows={2} />
                </Form.Item>
              </Col>

              <Col md={10}>
                <Form.Item
                  name="partId"
                  label="Search Part"
                  rules={[
                    {
                      required: true,
                      message: 'Part is required!',
                    },
                  ]}
                >
                  <ScrapPartsDeBounce
                    disabled={!classification}
                    debounceTimeout={1000}
                    mapper={(v) => ({
                      label: v.partNo,
                      value: v.id,
                    })}
                    showSearch
                    placeholder="---Search Part ---"
                    url={`part/search?page=1&size=20`}
                    params={{ partClassification: classification }}
                    selectedValue={selectedPartValue}
                    onChange={(newValue) => {
                      setPartsId(newValue?.value);
                      allSerials(newValue?.value);
                      setSelectedPartValue(newValue);
                      getPartDetails(newValue?.value);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col md={10}>
                <Form.Item
                  name="uomId"
                  label="UOM"

                >
                  <DebounceSelect
                    debounceTimeout={1000}
                    mapper={(v) => ({
                      label: v.code,
                      value: v.id,
                    })}
                    showArrow
                    searchParam="query"
                    showSearch
                    placeholder={"Select UOM"}
                    url={`/store/unit/measurements/search?page=1&size=20`}
                    selectedValue={ Form.useWatch('uomId',form)}
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Col>

              <Col md={10}>
                {!loading && (
                  <Form.Item label="File Upload">
                    <Upload.Dragger
                      multiple
                      onChange={handleFileInput}
                      showUploadList={true}
                      type="file"
                      listType="picture"
                      defaultFileList={[...attachmentList]}
                      beforeUpload={() => false}
                    >
                      <Button icon={<UploadOutlined />}>Click to upload</Button>{' '}
                      &nbsp;
                    </Upload.Dragger>
                  </Form.Item>
                )}
              </Col>
            </Row>

            <FormControl>
              <RibbonCard ribbonText="Scrap Parts Details">
                <p />
                <Form.List name="scrapPartSerialDtos">
                  {(fields, { add, remove }) => (
                    <>
                      {fields?.map(({ key, name, ...restField }, index) => {
                        if (
                          form.getFieldValue('scrapPartSerialDtos')[index]
                            ?.isActive
                        ) {
                          return (
                            <Row
                              key={key}
                              gutter={16}
                            >
                              <Col
                                xs={24}
                                lg={7}
                                className="parent"
                              >
                                <label> 
                                  <span style={{color: 'red'}}>*</span> Quantity
                                 </label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'quantity']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'required!',
                                    },
                                  ]}
                                  style={{ marginBottom: '23px' }}
                                >
                                  <InputNumber
                                    disabled={
                                      classification === ROTABLE ||
                                      classification === undefined
                                    }
                                    //placeholder="Quantity"
                                    min={1}
                                    style={{ width: '100%' }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                lg={7}
                                className="parent"
                                style={{ marginBottom: 20 }}
                              >
                                <label>
                                  <span style={{color: 'red'}}>*</span> Select Serial
                                </label>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'storeSerialId']}
                                  shouldUpdate={true}
                                  rules={[
                                    {
                                      validator: async (_, ids) => {
                                        console.log(ids);
                                        if (!ids || ids.length === 0) {
                                          return Promise.reject(
                                            new Error('Serial is Required!')
                                          );
                                        }
                                      },
                                    },
                                  ]}
                                >
                                  <Select
                                    //placeholder="--- Select Serial ---"
                                    style={{ width: '100%' }}
                                  >
                                    {serials.map((serial) => (
                                      <Option
                                        key={serial.id}
                                        value={serial.id}
                                      >
                                        {serial.serialNo}
                                      </Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <input
                                type="text"
                                name="isActive"
                                style={{ display: 'none' }}
                              />
                              &nbsp; &nbsp; &nbsp; &nbsp;
                              <Col
                                lg={1}
                                xs={24}
                              >
                                <Button
                                  danger
                                  onClick={() => {
                                    form.getFieldValue('scrapPartSerialDtos')[
                                      index
                                    ].id
                                      ? form.setFieldsValue(
                                          (form.getFieldValue(
                                            'scrapPartSerialDtos'
                                          )[index].isActive = false)
                                        )
                                      : remove(index);
                                    form.setFieldsValue({ ...form });
                                  }}
                                >
                                  <MinusCircleOutlined />
                                </Button>
                              </Col>
                              {/* <Divider /> */}
                            </Row>
                          );
                        }
                      })}
                      
                      <Form.Item wrapperCol={{ ...layout.labelCol }}>
                        <ARMButton
                          type="primary"
                          onClick={() => {
                            form.setFieldsValue({
                              ...form,
                              scrapPartSerialDtos: [
                                ...form.getFieldValue('scrapPartSerialDtos'),
                                {
                                  quantity: 1,
                                  storeSerialId: null,
                                  isActive: true,
                                },
                              ],
                            });
                          }}
                          icon={<PlusOutlined />}
                        >
                          Add
                        </ARMButton>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </RibbonCard>
            </FormControl>
            <Row>
              <Col
                sm={20}
                md={10}
              >
                <Form.Item
                  style={{ marginTop: '10px' }}
                  wrapperCol={{ ...layout.wrapperCol }}
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
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default ScrapParts;
