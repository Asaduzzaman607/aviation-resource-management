import React from 'react';
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space, Upload} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import moment from "moment";
import {UploadOutlined} from "@ant-design/icons";

const QuoteCollection = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const {Option} = Select;
  let {id} = useParams();
  const currencies = [
    {
      name: "BDT",
      value: "BDT",
    },
    {
      name: "EUR",
      value: "EUR",
    },
    {
      name: "USD",
      value: "USD",
    },
    {
      name: "RUPEE",
      value: "RUPEE",
    },
    {
      name: "GBP",
      value: "GBP",
    },
    {
      name: "SGD",
      value: "SGD",
    },
  ];
  const layout = {
    labelCol: {
      span:7,
    },
    wrapperCol: {
      span:17,
    },
  };
  const onFinish = async (values) => {
  }
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onReset = () => {

    if (id) {
      // form.setFieldsValue({...singleExternal});
    } else {
      form.resetFields()
    }
  };


  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-shopping-basket"/>
            <Link to='/procurment'>
              &nbsp; Procurement
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to='/procurment/quote-collection'>
              &nbsp; Quote Collection
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            Add
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard
        title={getLinkAndTitle(id ? "Update   Quote Collection" : "Add   Quote Collection", '/procurment/quote-collection')}>

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
          onFinishFailed={onFinishFailed}
        >
          <Row justify="center" gutter={10}>
            <Col className="gutter-row" lg={10} md={24} sm={24} xs={24}>

              <Form.Item
                name="cityId"
                label="Quote request No"

                rules={[
                  {
                    required: true,
                    message: "Please select the field !",
                  },
                ]}
              >
                <Select allowClear placeholder="Select a city">
                  {/*{cities.map((base, key) => {*/}

                  {/*    return  <Option key={key} value={base.id}>*/}
                  {/*      {base.name}*/}
                  {/*    </Option>*/}
                  {/*  */}

                  {/*})}*/}
                </Select>
              </Form.Item>

              <Form.Item
                name="quoteDate"
                label="Quote Date"
                // initialValue={moment()}
                rules={[
                  {
                    required: true,
                    message: "Please select the field !",
                  },
                ]}
              >
                <DatePicker style={{width: '100%'}} size='medium'

                            format="YYYY-MM-DD"

                ></DatePicker>
              </Form.Item>

              <Form.Item
                name="currency"
                label="Currency"
                rules={[
                  {
                    required: true,
                    message: "Please select the field !",
                  },
                ]}

              >
                <Select
                  allowClear

                  placeholder="Please select a value"
                >
                  {currencies.map((currency, key) => (
                    <Option key={key} value={currency.name}>
                      {currency.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Quote Validation(Days)"
                name="quoteValidation"
              >
                <Input type='number'/>
              </Form.Item>


            </Col>
            <Col className="gutter-row" lg={10} md={24} sm={24} xs={24}>

              <Form.Item
                name="supplier"
                label="Supplier"
                rules={[
                  {
                    required: true,
                    message: "Please select the field !",
                  },
                ]}

              >
                <Select
                  allowClear

                  placeholder="Please select a value"
                >
                  {/*{currencies.map((currency, key) => (*/}
                  {/*  <Option key={key} value={currency.name}>*/}
                  {/*    {currency.value}*/}
                  {/*  </Option>*/}
                  {/*))}*/}
                </Select>
              </Form.Item>



              <Form.Item
                label="Quote File"
                name="quoteFile"

              >
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture"
                >
                  <Button icon={<UploadOutlined/>}>Upload</Button>
                </Upload>
              </Form.Item>



              <Form.Item
                label="Rate"
                name="rate"
                rules={[
                  {
                    required: true,
                    message: 'Field should not be empty',
                  },

                  {
                    whitespace: true,
                    message: 'Only space is not allowed',
                  },
                ]}
              >
                <Input type={'number'} addonAfter={'with'}  />
              </Form.Item>


              <Form.Item
                label="Quote Ref"
                name="quoteRef"
                rules={[
                  {
                    required: true,
                    message: 'Field should not be empty',
                  },
                  {
                    max: 50,
                    message: 'Maximum 50 characters allowed',
                  },
                  {
                    whitespace: true,
                    message: 'Only space is not allowed',
                  },
                ]}
              >
                <Input type="text"/>
              </Form.Item>


            </Col>


          </Row>
          <Row justify={'center'} gutter={10}>
            <Col className="gutter-row" lg={14} md={12} sm={14} xs={24}>

              <Form.Item>
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
            </Col>
          </Row>

        </ARMForm>
        {/*    </Col>*/}
        {/*</Row>*/}
      </ARMCard>
    </CommonLayout>
  );
};

export default QuoteCollection;