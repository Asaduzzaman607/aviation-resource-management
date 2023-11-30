import React, {useState} from 'react';
import CommonLayout from "../../layout/CommonLayout";
import {Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Radio, Row, Select, Space} from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import ARMCard from "../../common/ARMCard";
import {CloseCircleFilled} from "@ant-design/icons";

const Option = Select.Option;

const AirCraft = () => {
    const [form] = Form.useForm();

    const onReset = () => {
        form.resetFields();
    };



    const onFinish = (values) => {
        console.log('fieldsValue', values)

        const value = {
            ...values,
            'date-picker': values['date-picker'].format('YYYY-MM-DD'),
        };
        console.log('Received values of form: ', value);
    };

    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };


    return (
        <CommonLayout>
            <Space
                direction="vertical"
                size="medium"
                style={{
                    display: "flex",
                }}
            >

                {/*Aircraft*/}
                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 12,
                    }}
                    wrapperCol={{
                        span: 12,
                    }}
                    initialValues={{
                        remember: true,

                    }}

                    autoComplete="off"
                    style={{
                        backgroundColor: "#ffffff",
                    }}
                    onFinish={onFinish}
                >
                <ARMCard title="Aircraft" >

                        <Row  gutter={[16,16]} justify="center">
                            <Col className="gutter-row" lg={12} xl={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    label="Aircraft Model Family"
                                    name="aircraftModelFamily"
                                    style={{marginBottom: "0px"}}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your Aircraft Model Family",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Select a Aircraft Model Family" allowClear size="small">

                                        <Option key='key' value='aircraftModelFamily'>
                                            Aircraft Model Family
                                        </Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Name"
                                    name="name"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please input Name",
                                        },
                                    ]}
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>

                                <Form.Item
                                    label="Type"
                                    name="type"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please input Type",
                                        },
                                    ]}
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>
                                <Form.Item
                                    label="Date Of Manufacture"
                                    name="dateOfManufacture"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please input Date Of Manufacture",
                                        },
                                    ]}
                                    style={{marginBottom: "0px"}}
                                >
                                    <DatePicker style={{ width: '100%'}} size="small" />
                                </Form.Item>
                                <Form.Item
                                    label="Registration"
                                    name="registration"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please input Registration"
                                        },
                                    ]}
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>
                                <Form.Item
                                    label="Airframe Serial No."
                                    name="airframeSerialNo"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please input Airframe Serial No.",
                                        },
                                    ]}
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>


                            </Col>
                            <Col className="gutter-row"  lg={12} xl={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    name="civilAviationRegistrationNo"
                                    label="Civil Aviation Registration No:"
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>

                                <Form.Item
                                    name="shortNameOfAircraft"
                                    label="Short name of aircraft:"
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size='small'/>
                                </Form.Item>
                                <Form.Item
                                    name="airframeTotalTime"
                                    label="Airframe Total Time:"
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>
                                <Form.Item
                                    name="airframeTotalCycle"
                                    label="Airframe Total Cycle:"
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>
                                <Form.Item
                                    name="cabinSeatConfiguration"
                                    label="Cabin Seat Configuration:"
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>
                                <Form.Item
                                    name="inspectionLocation"
                                    label="Inspection Location:"
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>
                                <Form.Item name="active" label=" Is Active?" valuePropName="checked" >
                                    <Checkbox value="A" style={{ lineHeight: '32px' }}>
                                    </Checkbox>
                                </Form.Item>


                            </Col>
                        </Row>
                </ARMCard>
                {/*// Engine Model*/}
                <ARMCard title="Engine Model">

                        <Row  gutter={[16,16]} justify="initial">
                            <Col className="gutter-row" lg={8} xl={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    label="Engine Model"
                                    name="engineModel"
                                    style={{marginBottom: "0px"}}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your Engine Model!",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Select a Engine Model" allowClear size="small">

                                        <Option key='key' value='engineModel'>
                                            Engine Model
                                        </Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Time Since New(TSN):"
                                    name="timeSinceNew"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please input Time Since New(TSN):",
                                        },
                                    ]}
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>

                                <Form.Item
                                    label="Cycle Since New (CSN):"
                                    name="cycleSinceNew"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please input Cycle Since New (CSN):",
                                        },
                                    ]}
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>
                                <Form.Item
                                    label="Engine throst rating :"
                                    name="engineThrostRating"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please input Engine throst rating :",
                                        },
                                    ]}
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>


                            </Col>
                            <Col className="gutter-row"  lg={8} xl={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    name="serialNo"
                                    label="Serial No:"
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>

                                <Form.Item
                                    name="timeSinceRepair"
                                    label="Time Since Repair(TSR):"
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size='small'/>
                                </Form.Item>
                                <Form.Item
                                    name="cycleSinceRepair"
                                    label="Cycle Since Repair(CSR):"
                                    style={{marginBottom: "0px"}}
                                >
                                   <Input size="small"/>
                                </Form.Item>


                            </Col>

                            <Col className="gutter-row"  lg={8} xl={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    // style={{ marginBottom: '10px' }}
                                    label="Position : "
                                    name="position"
                                    style={{marginBottom: "0px"}}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your Position!",
                                        },
                                    ]}
                                >
                                    <Input size="small"/>
                                </Form.Item>

                                <Form.Item
                                    label="Time Since Overall(TSO):"
                                    name="timeSinceOverall"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please input Time Since Overall(TSO)",
                                        },
                                    ]}
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>

                                <Form.Item
                                    label="Cycle Since Overall(CSO):"
                                    name="cycleSinceOverall"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please input Cycle Since Overall(CSO):",
                                        },
                                    ]}
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>

                            </Col>

                        </Row>

                </ARMCard>
                <ARMCard title="Configuration">

                        <Row justify="center" gutter={[16,16]} >
                            <Col lg={12} xl={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    label="Seat Name"
                                    name="seatName"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please enter Seat Name",
                                        },
                                    ]}
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>

                            </Col>
                            <Col lg={12} xl={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    label="Seat No."
                                    name="seatNo"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please enter Seat No.",
                                        },
                                    ]}
                                    style={{marginBottom: "0px"}}
                                >
                                    <Input size="small"/>
                                </Form.Item>

                            </Col>
                            <Col lg={8} md={12} sm={24} xs={24}>
                                <Form.Item
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please enter Seat No.",
                                        },
                                    ]}
                                    style={{marginBottom: "0px", textAlign:'right'}}
                                >
                                    <CloseCircleFilled style={{color: 'red', fontSize: '30px', cursor: 'pointer'}} />

                                </Form.Item>


                            </Col>
                        </Row>

                </ARMCard>
                    <Row justify={"center"} style={{textAlign:'center', marginTop: '20px'}} gutter={[16,16]}>
                        <Col className="gutter-row"  >
                            <Form.Item  {...tailLayout}
                            >
                                <ARMButton type="primary"  htmlType="button" onClick={onReset}>
                                    Reset
                                </ARMButton>

                            </Form.Item>
                        </Col>
                        <Col className="gutter-row">
                            <Form.Item  {...tailLayout}
                            >
                                <ARMButton type="primary" htmlType="submit" danger>
                                    Submit
                                </ARMButton>

                            </Form.Item>
                        </Col>

                    </Row>

                </Form>

            </Space>
        </CommonLayout>
    );
};

export default AirCraft;
