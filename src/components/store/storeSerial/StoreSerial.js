import React from 'react';
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import {useSerial} from "../hooks/serial";

const {Option} = Select;
const StoreSerial = () => {
    const {
        id,
        onFinish,
        onReset,
        partAvailability,
        form,
        layout
    } = useSerial();

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        {" "}
                        <Link to="/store">
                            {" "}
                            <i className="fas fa-archive"/> &nbsp;Store
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/store/store-serial-list">
                            &nbsp;Serial
                        </Link>

                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {id ? "edit" : "add"}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <ARMCard
                title="Serial"
            >
                <ARMForm
                    {...layout}
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                    style={{
                        backgroundColor: "#ffffff",
                    }}
                >
                    <Row>
                        <Col sm={20} md={10}>
                            <Form.Item
                                name="availId"
                                label="Part Availability No"

                            >
                                <Select
                                    allowClear
                                    placeholder="Select Part Availability"

                                >
                                    {
                                        partAvailability?.map((data) => (
                                            <Option key={data.id}
                                                    value={data.id}>{data.partNo}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="serialNo"
                                label="Serial No"
                                rules={[
                                    {
                                        required: true,
                                        message: ' Serial No is required!',
                                    },
                                    {
                                        whitespace: true,
                                        message: 'Only space is not allowed!',
                                    },
                                    {
                                        max: 255,
                                        message: 'Maximum 255 characters allowed',
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                name="price"
                                label="Price"


                            >
                                <InputNumber style={{width: '100%'}}/>
                            </Form.Item>


                            <Form.Item
                                name="grnNo"
                                label="GRN No"

                            >
                                <Input/>
                            </Form.Item>


                        </Col>
                        <Col sm={20} md={10}>
                            <Form.Item
                                name="partStatus"
                                label="Part Status"

                            >
                                <Select
                                    allowClear
                                    placeholder="Select Part Status"
                                >
                                    <Option value={"SERVICEABLE"}>SERVICEABLE</Option>
                                    <Option value={"UNSERVICEABLE"}>UNSERVICEABLE</Option>
                                    <Option value={"SCARP"}>SCARP</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="parentType"
                                label="Parent Type"

                            >
                                <Select
                                    allowClear
                                    placeholder="Select Parent Type"
                                >
                                    <Option value={"ISSUE"}>ISSUE</Option>
                                    <Option value={"RETURN"}>RETURN</Option>
                                    <Option value={"DEMAND"}>DEMAND</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="rackLife"
                                label="Rack Life"
                            >
                                <DatePicker style={{width: '100%'}} size='medium'

                                            format="YYYY-MM-DD"

                                ></DatePicker>
                            </Form.Item>
                            <Form.Item
                                name="selfLife"
                                label="Self Life"

                            >
                                <DatePicker style={{width: '100%'}} size='medium'

                                            format="YYYY-MM-DD"

                                ></DatePicker>
                            </Form.Item>

                        </Col>

                        <Col sm={20} md={10}>
                            <Form.Item style={{marginTop: '10px'}} wrapperCol={{...layout.wrapperCol, offset: 8}}>
                                <Space size="small">
                                    <ARMButton type="primary" htmlType="submit">
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
        </CommonLayout>
    );
};

export default StoreSerial;