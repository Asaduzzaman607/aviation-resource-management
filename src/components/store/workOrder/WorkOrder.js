import React from 'react';

import {useWorkOrder} from "../hooks/workOrder";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Form, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import ARMForm from "../../../lib/common/ARMForm";
import TextArea from "antd/es/input/TextArea";
import ARMButton from "../../common/buttons/ARMButton";
import UnServiceablePartDetails from "./UnServiceablePartDetails";
import CommonLayout from "../../layout/CommonLayout";

const {Option} = Select;
const WorkOrder = () => {
    const {
        layout,
        unSPartId,
        form,
        id,
        onReset,
        onFinish,
        handleChange,
        unSPartIdSingle
    } = useWorkOrder();
    console.log("by id", unSPartIdSingle)
    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        {' '}
                        <Link to="/store">
                            {' '}
                            <i className="fas fa-archive"/> &nbsp;Store
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Work Order</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <ARMCard title={'Work Order'}>
                <ARMForm
                    {...layout}
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Row>
                        <Col sm={20} md={10}>
                            <Form.Item
                                name="unserviceablePartId"
                                label="Part No."
                                rules={[

                                    {
                                        required: true,
                                        message: 'Please Select Part Number',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={"Select Part Number"}
                                    onChange={handleChange}
                                >
                                    {
                                        unSPartId?.map((data) => (
                                            <Option value={data.id}>{data.partNo}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="reasonRemark"
                                label="Remark"
                                rules={[

                                    {
                                        whitespace: true,
                                        message: 'Only space is not allowed!',
                                    },
                                    {
                                        max: 255,
                                        message: 'Maximum 255 character allowed',
                                    },
                                ]}
                            >
                                <TextArea/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item wrapperCol={{...layout.wrapperCol, offset: 4}}>
                        <Space size="small">
                            <ARMButton type="primary" htmlType="submit">
                                {id ? 'Update' : 'Submit'}
                            </ARMButton>
                            <ARMButton onClick={onReset} type="primary" danger>
                                Reset
                            </ARMButton>
                        </Space>
                    </Form.Item>
                </ARMForm>
                <UnServiceablePartDetails unSPartIdSingle={unSPartIdSingle}/>
            </ARMCard>
        </CommonLayout>
    );
};

export default WorkOrder;