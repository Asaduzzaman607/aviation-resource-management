import {MinusCircleOutlined, PlusOutlined, UploadOutlined} from '@ant-design/icons';
import {Breadcrumb, Button, Col, DatePicker, Form, Input, Row, Select, Space, Upload,} from 'antd';
import moment from 'moment';
import {Link} from 'react-router-dom';
import ARMForm from '../../../lib/common/ARMForm';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import DebounceSelect from '../../common/DebounceSelect';
import RibbonCard from '../../common/forms/RibbonCard';
import CommonLayout from '../../layout/CommonLayout';
import FormControl from '../../store/common/FormControl';
import {useTracker} from './useTracker';
import Loading from "../../store/common/Loading";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import Permission from "../../auth/Permission";

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
const {Option} = Select;

const Tracker = () => {
  const dateFormat = 'YYYY/MM/DD';
  const {
    id,
    form,
    purchaseOrder,
    getPurchaseOrder,
    onFinish,
    onReset,
    loading,
    handleFileInput,
    downloadLink
  } = useTracker();
  const poId = Form.useWatch("partOrderId", form);
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-hand-holding-box"/>
            <Link to="/logistic">&nbsp; Logistic</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/logistic/tracker-list">Tracker List</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id ? 'edit' : 'add'}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      {
        !loading ? <>
          <ARMCard
            title={getLinkAndTitle("Tracker", '/logistic/tracker-list', false, "LOGISTIC_LOGISTIC_TRACKER_TRACKER_SEARCH")}>
            <Permission
              permission={[
                'LOGISTIC_LOGISTIC_TRACKER_TRACKER_SAVE',
                'LOGISTIC_LOGISTIC_TRACKER_TRACKER_EDIT',
              ]}
              showFallback
            >
              <ARMForm
                {...layout}
                form={form}
                name="tracker"
                initialValues={{
                  "poTrackerLocationList": [{
                    id: null,
                    isActive: true
                  }]
                }}
                onFinish={onFinish}
                scrollToFirstError
              >
                <Row>
                  <Col
                    sm={20}
                    md={10}
                  >
                    <Form.Item
                      hidden={!id}
                      name="trackerNo"
                      label="Tracker No"
                    >
                      <Input disabled/>
                    </Form.Item>
                    <Form.Item
                      name="partOrderId"
                      label="PO No"
                      rules={[
                        {
                          required: true,
                          message: 'Required',
                        },
                      ]}
                    >
                      <DebounceSelect
                        mapper={(v) => ({
                          label: v.voucherNo,
                          value: v.id,
                        })}
                        showSearch
                        placeholder="--- Select PO No. ---"
                        url={`/logistic/part-orders/search?page=1&size=20`}
                        params={{type: 'APPROVED', rfqType: 'LOGISTIC'}}
                        disabled={!!id}
                        onChange={(newValue) => {
                          getPurchaseOrder(newValue.value);
                        }}
                        selectedValue={poId}
                      />
                    </Form.Item>

                    <Form.Item
                      name="partOrderItemId"
                      label="Part Order Item"
                      rules={[
                        {
                          required: true,
                          message: 'Required',
                        },
                      ]}
                    >
                      <Select
                        disabled={id}
                        placeholder="--- Select PO Item ---"
                      >
                        {purchaseOrder.map((item) => (
                          <Option
                            key={item.id}
                            value={item.id}
                          >
                            {item.partNo}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="trackerStatus"
                      label="Status"
                      rules={[
                        {
                          required: true,
                          message: 'Required',
                        },
                      ]}
                    >
                      <Select placeholder="--- Select Status ---">
                        <Option value="ON_THE_WAY">On The Way</Option>
                        <Option value="RECEIVED">Received</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Attachment"
                      name="file"
                      rules={[
                        {
                          required: false,
                          message: 'required!',
                        },
                      ]}
                    >
                      <Upload.Dragger
                        multiple
                        onChange={handleFileInput}
                        showUploadList={true}
                        type="file"
                        listType="picture"
                        defaultFileList={[...downloadLink]}
                        beforeUpload={() => false}
                      >
                        <Button icon={<UploadOutlined/>}>Click to upload</Button> &nbsp;
                      </Upload.Dragger>
                    </Form.Item>
                  </Col>
                </Row>
                <FormControl>
                  <RibbonCard ribbonText={'Tracker'}>
                    <Form.List name="poTrackerLocationList">
                      {(fields, {add, remove}) => (
                        <>
                          {fields?.map(({key, name, ...restField}, index) => (
                            <Row
                              key={key}
                              gutter={16}
                            >
                              <Col
                                xs={24}
                                sm={24}
                                md={7}
                              >
                                <Form.Item
                                  {...restField}
                                  name={[name, 'location']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Required',
                                    },
                                  ]}
                                >
                                  <Input placeholder="Enter Location"/>
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={7}
                              >
                                <Form.Item
                                  {...restField}
                                  name={[name, 'awbNo']}
                                >
                                  <Input placeholder="Enter AWB No"/>
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={7}
                              >
                                <Form.Item
                                  {...restField}
                                  name={[name, 'date']}
                                  initialValue={moment()}
                                >
                                  <DatePicker
                                    placeholder="Enter Date"
                                    format={dateFormat}
                                    style={{width: '100%'}}
                                  ></DatePicker>
                                </Form.Item>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={3}
                              >
                                {form.getFieldValue('poTrackerLocationList')[index]
                                  ?.id ? (
                                  ''
                                ) : (
                                  <Button
                                    onClick={() => remove(index)}
                                    danger
                                  >
                                    <MinusCircleOutlined/>
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          ))}
                          <Form.Item wrapperCol={{...layout.labelCol}}>
                            <ARMButton
                              type="primary"
                              onClick={() => {
                                add();
                              }}
                              icon={<PlusOutlined/>}
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
                    <Form.Item wrapperCol={{...layout.wrapperCol}}>
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
            </Permission>
          </ARMCard>
        </> : <Loading/>
      }

    </CommonLayout>
  );
};

export default Tracker;
