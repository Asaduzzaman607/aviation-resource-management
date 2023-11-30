import {Breadcrumb, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space} from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import ARMForm from '../../../lib/common/ARMForm';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMButton from '../../common/buttons/ARMButton';
import CommonLayout from '../../layout/CommonLayout';
import {useUnserviceableItem} from "../hooks/unserviceableItem";
import Permission from "../../auth/Permission";
const {Option} = Select;
const UnserviceableItem = () => {
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const {
        aircraft,
        airport,
        issue,
        partReturn,
        storeReturnPart,
        form,
        id,
        onReset,
        onFinish,
        handleChange
    } = useUnserviceableItem();

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

                        &nbsp;Unserviceable Item

                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission={["STORE_UNSERVICEABLE_ITEM_UNSERVICEABLE_ITEM_SAVE","STORE_UNSERVICEABLE_ITEM_UNSERVICEABLE_ITEM_EDIT"]}>
            <ARMCard
                title="Unserviceable Item"
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
                                name="storeIssueId"
                                label="Issue No"

                            >
                                <Select
                                    allowClear
                                    placeholder="Select Part Return"
                                    onChange={handleChange}
                                >
                                    {
                                        issue?.map((data) => (
                                            <Option key={data.id}
                                                    value={data.id}>{data.voucherNo}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="storeReturnId"
                                label="Store Return No"

                            >
                                <Select
                                    allowClear
                                    placeholder="Select Part Return"
                                    onChange={handleChange}
                                >
                                    {
                                        partReturn?.map((data) => (
                                            <Option key={data.id}
                                                    value={data.id}>{data.voucherNo}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="storeReturnPartId"
                                label="Store Return Part"


                            >
                                <Select
                                    allowClear
                                    placeholder="Select Part No"
                                >
                                    {
                                        storeReturnPart?.map((data) => (
                                            <Option key={data.id}
                                                    value={data.id}>{data.partNo}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="installedPartSerialId"
                                label="Installed Serial No"
                            >
                                <InputNumber/>
                            </Form.Item>
                            <Form.Item
                                name="removedPartSerialId"
                                label="Removed Serial No"

                            >
                                <InputNumber/>
                            </Form.Item>
                            <Form.Item
                                name="authCodeNo"
                                label="Auth Code No"

                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                name="reasonRemoved"
                                label="Removal Reason"

                            >

                                <Input/>
                            </Form.Item>

                            <Form.Item
                                name="aircraftId"
                                label="Aircraft"
                                rules={[
                                    {
                                        required: false,
                                        message: "This field is required!"
                                    },
                                ]}
                            >
                                <Select
                                    allowClear
                                    placeholder="Select Aircraft"
                                >
                                    {
                                        aircraft?.map((data) => (
                                            <Option key={data.id}
                                                    value={data.id}>{data.aircraftName}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>


                        </Col>
                        <Col sm={20} md={10}>
                            <Form.Item
                                name="airportId"
                                label="At Station"
                                rules={[
                                    {
                                        required: false,
                                        message: "This field is required!"
                                    },
                                ]}
                            >
                                <Select
                                    allowClear
                                    placeholder="Select Station"
                                >
                                    {
                                        airport?.map((data) => (
                                            <Option key={data.id}
                                                    value={data.id}>{data.name}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>


                            <Form.Item
                                name="removalDate"
                                label="Removed Date"

                            >

                                <DatePicker style={{width: '100%'}} size='medium'

                                            format="YYYY-MM-DD"

                                ></DatePicker>
                            </Form.Item>
                            <Form.Item
                                name="tsn"
                                label="TSN"

                            >

                                <Input/>
                            </Form.Item>
                            <Form.Item
                                name="csn"
                                label="CSN"

                            >

                                <Input/>
                            </Form.Item>
                            <Form.Item
                                name="tso"
                                label="TSO"

                            >

                                <Input/>
                            </Form.Item>
                            <Form.Item
                                name="cso"
                                label="CSO"

                            >

                                <Input/>
                            </Form.Item>
                            <Form.Item
                                name="tsr"
                                label="TSR"

                            >

                                <Input/>
                            </Form.Item>
                            <Form.Item
                                name="csr"
                                label="CSR"

                            >

                                <Input/>
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
            </Permission>
        </CommonLayout>
    );
};

export default UnserviceableItem;