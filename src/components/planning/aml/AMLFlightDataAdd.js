import {useAmlFlightDataAdd} from "../../../lib/hooks/planning/aml";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, DatePicker, Form, InputNumber, Row, Select, Space} from "antd";
import {Link} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMForm from "../../../lib/common/ARMForm";
import {formLayout} from "../../../lib/constants/form";
import ARMButton from "../../common/buttons/ARMButton";
import React, {useEffect, useState} from "react";
import API from "../../../service/Api";


export default function AMLFlightDataAdd() {
    const {id, form, onReset, onFinish} = useAmlFlightDataAdd();
    const [amls, setAmls] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await API.get('aircraft-maintenance-log/all');
            setAmls([...res.data].map(({amlId, pageNo}) => ({id: amlId, name: pageNo})))
        })();
    }, [])

    const TITLE = id ? 'Flight Data Edit' : 'Flight Data Add';

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item> <Link to='/planning'> <i className="fas fa-chart-line"/>&nbsp; Planning
                    </Link></Breadcrumb.Item>

                    <Breadcrumb.Item>
                        <Link to='/planning/aml'>
                            Flight Data
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        {TITLE}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>

            <ARMCard
                title={
                    getLinkAndTitle(TITLE, '/planning/flight-data')
                }
            >

                <ARMForm
                    {...formLayout}
                    form={form}
                    name="aml"
                    preserve={true}
                    onFinish={onFinish}
                    initialValues={{
                        amlId: '',
                        noOfLanding: '',
                        blockOnTime: '',
                        blockOffTime: '',
                        landingTime: '',
                        takeOffTime: '',
                        commencedTime: '',
                        completedTime: ''
                    }}
                    scrollToFirstError
                >

                    <Row>
                        <Col sm={24} md={12}>
                            <Form.Item
                                name="amlId"
                                label="ATL"
                                rules={[
                                    {
                                        required: true,
                                        message: "ATL is required!"
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value="">---Select---</Select.Option>
                                    {
                                        amls.map(({id, name}) => <Select.Option value={id}
                                                                                key={id}>{name}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="blockOnTime"
                                label="Block On Time"
                                rules={[
                                    {
                                        required: true,
                                        message: "Block On Time is Required!"
                                    },
                                ]}
                            >
                                <DatePicker placeholder={''} style={{width: '100%'}} showTime/>
                            </Form.Item>

                            <Form.Item
                                name="blockOffTime"
                                label="Block Off Time"
                                rules={[
                                    {
                                        required: true,
                                        message: "Block Off Time is Required!"
                                    },
                                ]}
                            >
                                <DatePicker placeholder={''} style={{width: '100%'}} showTime/>
                            </Form.Item>

                            <Form.Item
                                name="takeOffTime"
                                label="Take Off Time"
                                rules={[
                                    {
                                        required: true,
                                        message: "Take off time is required!"
                                    },
                                ]}
                            >
                                <DatePicker placeholder={''} style={{width: '100%'}} showTime/>
                            </Form.Item>

                            <Form.Item
                                name="landingTime"
                                label="Landing Time"
                                rules={[
                                    {
                                        required: true,
                                        message: "Landing time is required!"
                                    },
                                ]}
                            >
                                <DatePicker placeholder={''} style={{width: '100%'}} showTime/>
                            </Form.Item>
                        </Col>

                        <Col sm={24} md={12}>
                            <Form.Item
                                name="noOfLanding"
                                label="No of Landing"
                                rules={[
                                    {
                                        required: true,
                                        message: "No of landing is required!",
                                    }
                                ]}
                            >
                                <InputNumber min={1} step={1} style={{width: '100%'}} controls={false}
                                             onKeyDown={(e) => {
                                                 (e.key === "0" || e.key === "-") && e.preventDefault();
                                             }}/>
                            </Form.Item>

                            <Form.Item
                                name="commencedTime"
                                label="Commenced Time"
                            >
                                <DatePicker placeholder={''} style={{width: '100%'}} showTime/>
                            </Form.Item>

                            <Form.Item
                                name="completedTime"
                                label="Completed Time"
                            >
                                <DatePicker placeholder={''} style={{width: '100%'}} showTime/>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row>
                        <Col sm={24} md={12}>
                            <Form.Item wrapperCol={{...formLayout.wrapperCol, offset: 8}}>
                                <Space>
                                    <ARMButton size="medium" type="primary" htmlType="submit">
                                        {id ? 'Update' : 'Submit'}
                                    </ARMButton>
                                    <ARMButton onClick={onReset} size="medium" type="primary" danger>
                                        Reset
                                    </ARMButton>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>

                </ARMForm>

            </ARMCard>
        </CommonLayout>
    )
}