import {useTranslation} from "react-i18next";
import {Breadcrumb, Col, DatePicker, Form,  Row, Select, Space} from "antd";
import Permission from "../../../auth/Permission";
import ARMButton from "../../../common/buttons/ARMButton";
import React from "react";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Link, useParams} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import {formLayout} from "../../../../lib/constants/layout";
import {ProfileOutlined} from "@ant-design/icons";
import {useCancellation} from "../../../../lib/hooks/planning/useCancellation";

const cancellationTypes = [
    {id: 0, name: "Initial Calculation"},
    {id: 1, name: "Total Cancellation"},
]


const AddCancellation = () => {


    const {
        onFinish,
        onReset,
        aircraft,
        form,
    } = useCancellation();
    const {t} = useTranslation()
    let {cId: id} = useParams();

    const title = id ? `Cancellation ${t("common.Edit")}` : `Cancellation ${t("common.Add")}`;

    return (

        <CommonLayout>

            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/reliability">
                            <ProfileOutlined/>
                            &nbsp; Reliability
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        <Link to="/reliability/cancellation">Cancellation</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>{id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission={[""]} showFallback>
                <ARMCard title={getLinkAndTitle(title, "/reliability/cancellation", false, "")}>
                    <div>
                        <Form
                            {...formLayout}
                            form={form}
                            name="cancellationForm"
                            onFinish={onFinish}
                            scrollToFirstError
                        >
                            <Row>
                                <Col sm={20} md={10}>
                                    <Form.Item
                                        name="aircraftModelId"
                                        label={t("planning.Aircrafts.A/C Type")}
                                        style={{marginBottom: "12px"}}
                                        rules={[
                                            {
                                                required: true,
                                                message: t("planning.A/C Type.Please Select A/C Type"),
                                            },
                                        ]}
                                    >
                                        <Select
                                            disabled={id}
                                            placeholder={t("planning.A/C Type.Select A/C Type")}
                                            allowClear
                                            showSearch
                                            filterOption={(inputValue, option) =>
                                                option.children
                                                    .toString("")
                                                    .toLowerCase()
                                                    .includes(inputValue.toLowerCase())
                                            }
                                        >
                                            {aircraft?.map((item) => {
                                                return (
                                                    <Select.Option key={item.id} value={item.id}>
                                                        {item.aircraftModelName}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label="Date" name='date'
                                               rules={[
                                                   {
                                                       required: true,
                                                       message: "Date is required ",
                                                   },
                                               ]}>
                                        <DatePicker
                                            style={{
                                                width: "100%",
                                            }}
                                            format="DD-MMM-YYYY"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="cancellationTypeEnum"
                                        label="Cancellation Type"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Cancellation Type is required ",
                                            }
                                        ]}
                                        style={{marginBottom: "12px"}}
                                    >
                                        <Select placeholder={'Select Cancellation Type'}>

                                            {cancellationTypes?.map((item) => {
                                                return (
                                                    <Select.Option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col sm={20} md={10}></Col>
                            </Row>
                            <Row>
                                <Col sm={20} md={10}>
                                    <Form.Item wrapperCol={{...formLayout.wrapperCol, offset: 8}}>
                                        <Space size="small">
                                            <ARMButton size="medium" type="primary" htmlType="submit">
                                                {id ? t("common.Update") : t("common.Submit")}
                                            </ARMButton>
                                            <ARMButton
                                                onClick={onReset}
                                                size="medium"
                                                type="primary"
                                                danger
                                            >
                                                {t("common.Reset")}
                                            </ARMButton>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </ARMCard>
            </Permission>
        </CommonLayout>

    );
};

export default AddCancellation;