import React, {useEffect, useState} from 'react';
import {Breadcrumb, Col, Form, Input, InputNumber, notification, Row, Select, Space} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import RackService from "../../../service/RackService";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import WorkshopService from "../../../service/WorkshopService";

const Workshop = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {Option} = Select;
    const [singleWorkshop, setSingleWorkshop] = useState();
    let {id} = useParams();
    const countries = useSelector((state) => state.countries.model);
    const cities = useSelector((state) => state.cities.model);
    const layout = {
        labelCol: {
            span: 8,
        }, wrapperCol: {
            span: 16,
        },
    };


    const onFinish = async (values) => {
        if (id) {
            try {
                await WorkshopService.updateWorkshop(id, values);

                notification["success"]({
                    message: "Workshop successfully updated",
                });
                navigate(-1)
            } catch (er) {
                notification["error"]({
                    message: er.response.data.apiErrors[0].message,
                });
            }
        } else {
            await WorkshopService.SaveWorkshop(values)
                .then((response) => {
                    if (response.status === 200) {

                        notification["success"]({
                            message: "Successfully Created",
                        });

                        form.resetFields();
                        navigate(-1)

                    }
                })
                .catch((error) => {
                    notification["error"]({
                        message: error.response.data.apiErrors[0].message,
                    });
                    console.log("something went wrong", error);
                });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const loadSingleWorkshop = async () => {
        try {
            const {data} = await WorkshopService.singleWorkshop(id);
            console.log('hi data',data)
            form.setFieldsValue({...data});
            setSingleWorkshop({...data});
        } catch (er) {
            console.log(er);
        }
    };
    useEffect(() => {
        if (!id) return form.resetFields();
        loadSingleWorkshop()
    }, [id]);

    const onReset = () => {

        if (id) {
            form.setFieldsValue({...singleWorkshop});
        } else {
            form.resetFields()
        }
    };
    return (<div>
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        {" "}
                        <Link to="/store/">
                            {" "}
                            <i className="fas fa-archive"/> &nbsp;Store
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {" "}
                        <Link to="/store/workshop">
                            {" "}
                            Workshop
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {" "}
                        {id ? 'Update' : "Add"}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <ARMCard title={getLinkAndTitle(id ? "Update Workshop" : "Add Workshop", "/store/workshop")}>
                <Row>
                    <Col sm={20} md={10}>
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
                            <Form.Item
                                label="Code"
                                name="code"

                                rules={[{
                                    required: true, message: "Please input the code!",
                                },]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                name="countryId"
                                label="Country"

                                rules={[{
                                    required: false, message: "Please select Country !",
                                },]}
                            >
                                <Select allowClear placeholder="Select a country">
                                    {countries.map((country, key) => (<Option key={key} value={country.id}>
                                        {country.name}
                                    </Option>))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="cityId"
                                label="City"

                                rules={[{
                                    required: true, message: "Please select City !",
                                },]}
                            >
                                <Select allowClear placeholder="Select a City">
                                    {cities.map((city, key) => (<Option key={key} value={city.id}>
                                        {city.name}
                                    </Option>))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="address"
                                label="Address"

                                rules={[{
                                    required: true, message: "Please select City !",
                                },]}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>




                            <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
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
                        </ARMForm>
                    </Col>
                </Row>
            </ARMCard>
        </CommonLayout>
    </div>);
};

export default Workshop;