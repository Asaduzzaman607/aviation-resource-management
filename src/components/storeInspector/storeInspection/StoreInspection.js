import { SolutionOutlined } from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ARMForm from '../../../lib/common/ARMForm';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import Permission from '../../auth/Permission';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import DebounceSelect from '../../common/DebounceSelect';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import Loading from '../../store/common/Loading';
import { useStoreInspector } from '../hooks/storeInspection';
import AddSerial from './AddSerial';
import CaabFormData from "./CaabFormData";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const StoreInspection = () => {
  const {
    serial,
    setSerial,
    getSerial,
    loading,
    form,
    id,
    onReset,
    onFinish,
    inward,
    checkBoxItem,
    getStockInwardParts,
    stockInwardParts,
    selectedPart,
    getPoByStockInwardId,
    poInfo,
    findPartDescription,
    storeInspector
  } = useStoreInspector();

  const [showModal, setShowModal] = useState(false);
  const partId = Form.useWatch('partId', form);
  // const partId = part?.value;
  const inwardId = Form.useWatch('inwardId', form);
  const storeInspectionGrnId = Form.useWatch('storeInspectionGrnId', form);

  const uom = Form.useWatch('uomId', form);
  const status = Form.useWatch('status', form) === 'ACCEPTED' ? true : false;

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/storeInspector">
              {' '}
              <SolutionOutlined /> &nbsp;Store Inspector
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {' '}
            <Link to="/storeInspector/store-inspection-list">
              {' '}
              Store Inspection List
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp;{id ? 'edit' : 'add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <Permission
        permission={[
          'STORE_INSPECTOR_STORE_INSPECTOR_STORE_INSPECTION_SAVE',
          'STORE_INSPECTOR_STORE_INSPECTOR_STORE_INSPECTION_EDIT',
        ]}
      >
        <ARMCard
          title={getLinkAndTitle(
            'Store Inspection',
            '/storeInspector/store-inspection-list'
          )}
        >
          {!loading ? (
            <>
              <ARMForm
                {...layout}
                form={form}
                name="basic"
                initialValues={{
                  inspectionCriterionList: [],
                }}
                onFinish={onFinish}
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
                      name="inspectionNo"
                      label="Inspection No"
                      hidden={!id}
                    >
                      <Input
                        disabled
                        style={{ backgroundColor: '#fff', color: '#000' }}
                      />
                    </Form.Item>

                    {inward ? (
                        <>
                          <Form.Item
                              name="inwardId"
                              label="Stock Inward"
                              rules={[
                                {
                                  required: true,
                                  message: 'Stock Inward is Required!',
                                },
                              ]}
                          >
                            <DebounceSelect
                                mapper={(v) => ({
                                  label: v.serialNo,
                                  value: v.id,
                                })}
                                showSearch
                                placeholder="---Select Stock Inward No.--"
                                type="multi"
                                url={`/store/stock-inwards/search?page=1&size=20`}
                                selectedValue={inwardId}
                                disabled={!!id}
                                onChange={(e) => {
                                  getStockInwardParts(e);
                                  getPoByStockInwardId(e);
                                }}
                            />
                          </Form.Item>
                          {poInfo.orderId && (
                              <Form.Item label="Order No">
                                <Link
                                    target="_blank"
                                    to={`/material-management/purchase-order/detail/${poInfo?.orderId}`}
                                    state={{ pendingOrApproved: 'approved' }}
                                >
                                  {poInfo?.orderNo}
                                </Link>
                              </Form.Item>
                          )}
                        </>
                    ) : (
                        <Form.Item
                            name="storeReturnPartStoreReturnVoucherNo"
                            label="Part Return No."
                        >
                          <Input disabled />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="partId"
                        label="Part No."
                        rules={[
                          {
                            required: true,
                            message: 'Part No. is required!',
                          },
                        ]}
                    >
                      <Select
                          disabled={!!id}
                          placeholder="---Select Part---"
                          onChange={(e) => {
                            getSerial(e);
                            findPartDescription(e)
                          }}
                      >
                        {stockInwardParts.map((stockInwardPart) => (
                            <Option
                                key={stockInwardPart.partId}
                                value={stockInwardPart.partId}
                            >
                              {stockInwardPart.partNo}
                            </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                        name="partDescription"
                        label="Part Name"
                        rules={[
                          {
                            required: true,
                            message: 'Part Name is required!',
                          },
                        ]}
                    >
                      <Input />
                    </Form.Item>
                    {
                      id ? (<Form.Item name="grnNo" label="Grn No">
                        <Input disabled={!!id}/>
                      </Form.Item>
                      ):(
                      <Form.Item 
                        name="storeInspectionGrnId" 
                        label="Grn No"
                        rules={[
                          {
                            required: id ? false : true,
                            message: 'Grn No is Required!',
                          },
                        ]}
                      >
                        <DebounceSelect
                          mapper={(v) => ({
                            label: v.grnNo,
                            value: v.id,
                          })}
                          showSearch
                          placeholder="---Select Grn No.--"
                          url={`/store-inspector/grn/search?page=1&size=20`}
                          selectedValue={storeInspectionGrnId}
                          disabled={!!id}
                        />
                      </Form.Item>)
                    }
                    <Form.Item
                        name="expectedSerials"
                        label="Expected Serials"
                    >
                      <TextArea disabled />
                    </Form.Item>

                    {inward && !id ? (
                        <Form.Item
                            name="serialId"
                            label="Serial No."
                            rules={[
                              {
                                required: true,
                                message: 'Serial No. Required!',
                              },
                            ]}
                        >
                          <Select
                              allowClear
                              showSearch
                              placeholder="--Select Serial No.--"
                              filterOption={(input, option) =>
                                  option.children
                                      .toLowerCase()
                                      .includes(input.toLowerCase())
                              }
                              disabled={!!id}
                              dropdownRender={(menu) => (
                                  <>
                                    <Button
                                        style={{ width: '100%' }}
                                        type="primary"
                                        onClick={() => {
                                          setShowModal(true);
                                        }}
                                    >
                                      + Add Serial
                                    </Button>
                                    {menu}
                                  </>
                              )}
                          >
                            {serial?.map((data) => (
                                <Option
                                    key={data.serialId}
                                    value={data.serialId}
                                >
                                  {data.serialNo}
                                </Option>
                            ))}
                          </Select>
                        </Form.Item>
                    ) : (
                        <Form.Item
                            name="serialNo"
                            label="Serial No"
                        >
                          <Input
                              disabled
                              style={{ backgroundColor: '#fff', color: '#000' }}
                          />
                        </Form.Item>
                    )}


                    <Form.Item
                        name="uomId"
                        label="UOM"
                        rules={[
                          {
                            required: true,
                            message: 'UOM Required!',
                          },
                        ]}
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
                          placeholder={'Select UOM'}
                          url={`/store/unit/measurements/search?page=1&size=20`}
                          selectedValue={uom}
                          style={{
                            width: '100%',
                          }}
                          disabled={!inward}
                      />
                    </Form.Item>


                      <Form.Item
                          name="partStateNameList"
                          label={'Part State'}
                      >
                        <Checkbox.Group
                            style={{
                              width: '100%',
                            }}
                        >
                          <Row style={{ alignItems: 'left' }}>
                            {checkBoxItem?.map((data, index) => (
                                <Col
                                    xs={24}
                                    md={6}
                                    key={data.id}
                                >
                                  <Checkbox
                                      key={data.id}
                                      value={data.name}
                                  >
                                    {data.name}
                                  </Checkbox>
                                </Col>
                            ))}
                          </Row>
                        </Checkbox.Group>
                      </Form.Item>


                    <Form.Item
                      name="shelfLife"
                      label="Shelf Life"
                    >
                      <DatePicker
                        placeholder="Shelf Life"
                        format={'YYYY/MM/DD'}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                    <Form.Item
                        name="validUntil"
                        label="Valid Until"
                    >
                      <Input/>
                    </Form.Item>

                    <Form.Item
                        name="expireDate"
                        label="HST/Cal"
                    >
                      <DatePicker
                          placeholder="Select"
                          format={'YYYY/MM/DD'}
                          style={{ width: '100%' }}
                      />
                    </Form.Item>

                  </Col>
                  <Col
                    sm={20}
                    md={10}
                  >
                    <Form.Item
                        name="lotNum"
                        label="Batch/Lot No."
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                        name="certiNo"
                        label="Cert. No"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                        name="inspectionAuthNo"
                        label="Auth No"
                        rules={[
                          {
                            required: true,
                            message: 'Auth No is required!',
                          },
                        ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                        name="remarks"
                        label="Remarks"
                    >
                      <TextArea />
                    </Form.Item>
                    <Form.Item
                      name="tsn"
                      label="TSN"
                      rules={[{
                        required: status && inwardId,
                        message: 'TSN is required'
                      }]}
                    >
                      <Input disabled={!inwardId && id} />
                    </Form.Item>
                    <Form.Item
                      name="csn"
                      label="CSN"
                      rules={[{
                        required: status && inwardId,
                        message: 'CSN is required'
                      }]}
                    >
                      <Input disabled={!inwardId && id} />
                    </Form.Item>
                    <Form.Item
                      name="tso"
                      label="TSO"
                      rules={[{
                        required: status && inwardId,
                        message: 'TSO is required'
                      }]}
                    >
                      <Input disabled={!inwardId && id} />
                    </Form.Item>
                    <Form.Item
                      name="cso"
                      label="CSO"
                      rules={[{
                        required: status && inwardId,
                        message: 'CSO is required'
                      }]}
                    >
                      <Input disabled={!inwardId && id} />
                    </Form.Item>
                    <Form.Item
                      name="tsr"
                      label="TSR"
                      rules={[{
                        required: status && inwardId,
                        message: 'TSR is required'
                      }]}
                    >
                      <Input disabled={!inwardId && id} />
                    </Form.Item>
                    <Form.Item
                      name="csr"
                      label="CSR"
                      rules={[{
                        required: status && inwardId,
                        message: 'CSR is required'
                      }]}
                    >
                      <Input disabled={!inwardId && id} />
                    </Form.Item>

                    <Form.Item
                      name="status"
                      label="Status"
                    >
                      <Radio.Group>
                        <Radio value={'ACCEPTED'}>Accepted</Radio>
                        <Radio value={'NOT_ACCEPTED'}>Not Accepted</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>

                {
                  !inward && storeInspector.storeReturn?.caabEnabled ?
                      <CaabFormData form={form} onFinish={onFinish}/> : null
                }

                <ARMCard title={'Inspection Criterion'}>
                  <Row
                    style={{
                      border: '1px solid lightgrey',
                      textAlign: 'center',
                      height: '6vh',
                      fontWeight: 'bold',
                      paddingTop: '5px',
                    }}
                  >
                    <Col
                      lg={1}
                      xs={24}
                    ></Col>
                    <Col
                      lg={10}
                      xs={24}
                    >
                      Description of Inspection
                    </Col>
                    <Col
                      lg={4}
                      xs={24}
                    ></Col>
                    <Col
                      lg={7}
                      xs={24}
                    >
                      Status
                    </Col>
                  </Row>

                  <Form.List name="inspectionCriterionList">
                    {(fields, { add, remove }) => (
                      <>
                        {fields?.map(({ key, name, ...restField }, index) => {
                          return (
                            <Row
                              key={name}
                              style={{
                                border: '1px solid lightgrey',
                                textAlign: 'center',
                              }}
                            >
                              <Col
                                lg={1}
                                xs={24}
                              >
                                <Form.Item
                                  {...restField}
                                  name={[name, 'descriptionId']}
                                  hidden={true}
                                >
                                  <Input />
                                </Form.Item>
                              </Col>
                              <Col
                                lg={15}
                                xs={24}
                              >
                                <p
                                  style={{
                                    border: 'none',
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    cursor: 'default',
                                    textAlign: 'left',
                                    width: '80%',
                                  }}
                                >
                                  {
                                    form.getFieldValue(
                                      'inspectionCriterionList'
                                    )[key].description
                                  }
                                </p>
                              </Col>

                              <Col
                                lg={8}
                                xs={24}
                              >
                                <Form.Item
                                  {...restField}
                                  name={[name, 'inspectionStatus']}
                                  hidden={false}
                                >
                                  <Radio.Group>
                                    <Radio value={'SAT'}>SAT</Radio>
                                    <Radio value={'UNSAT'}>UNSAT</Radio>
                                    <Radio value={'NA'}>NA</Radio>
                                  </Radio.Group>
                                </Form.Item>
                              </Col>
                            </Row>
                          );
                        })}
                      </>
                    )}
                  </Form.List>
                </ARMCard>

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

                <Modal
                  title="Add Serial"
                  style={{
                    top: 20,
                    zIndex: 1,
                  }}
                  onOk={() => setShowModal(false)}
                  onCancel={() => setShowModal(false)}
                  centered
                  visible={showModal}
                  width={800}
                  footer={null}
                  destroyOnClose
                >
                  <AddSerial
                    setShowModal={setShowModal}
                    form={form}
                    partId={partId}
                    partNo={selectedPart}
                    setSerial={setSerial}
                  />
                </Modal>
              </ARMForm>
            </>
          ) : (
            <Loading />
          )}
        </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default StoreInspection;
