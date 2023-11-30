import styled from "styled-components";
import {Breadcrumb, Col, Form, Input, Row, Select, Space} from "antd";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Link} from "react-router-dom";
import Permission from "../../auth/Permission";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMForm from "../../../lib/common/ARMForm";
import {formLayout} from "../../../lib/constants/form";
import ARMButton from "../../common/buttons/ARMButton";
import React from "react";
import LastShopInfoForm from "./LastShopInfoForm";
import {useLastShopInfo} from "../../../lib/hooks/planning/useLastShopInfo"
import {t} from "i18next";

const AntdFormItem = styled(Form.Item)`
  .ant-col-16 {
    max-width: 100%;
  }
`;


export default function AddLastShopListInfo() {
    const {
        aircrafts,
        onFinish,
        onReset,
        form,
        id,
    } = useLastShopInfo();

    let TITLE = id ? "Last Shop Information Edit" : "Last Shop Information Add";

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        {" "}
                        <Link to="/planning">
                            {" "}
                            <i className="fas fa-chart-line" />
                            &nbsp; Planning
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        <Link to="/planning/last-shop-info">Last Shop Information</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>{id ? "edit" : "add"}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission={["PLANNING_OTHERS_APU_LLP_LAST_SHOP_VISIT_INFO_SAVE", "PLANNING_OTHERS_APU_LLP_LAST_SHOP_VISIT_INFO_EDIT"]} showFallback>
                <ARMCard title={getLinkAndTitle(TITLE, "/planning/last-shop-info",false,"PLANNING_OTHERS_APU_LLP_LAST_SHOP_VISIT_INFO_SAVE")}>
                    <ARMForm
                        {...formLayout}
                        form={form}
                        name="lastShopInfo"
                        initialValues={{}}
                        onFinish={onFinish}
                        scrollToFirstError
                    >
                        <AntdFormItem>
                            <Row gutter={10}>
                                <Col xs={24} md={6}>
                                    <Form.Item
                                        name="aircraftId"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please Select Aircraft",
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder="Please Select Aircraft"
                                            disabled={id}
                                        >
                                            {aircrafts?.map((item) => {
                                                return (
                                                    <Select.Option key={item.id} value={item.aircraftId}>
                                                        {item?.aircraftName}{" "}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={6}>
                                    <Form.Item
                                        name="model"
                                        rules={[
                                            {
                                                required: false,
                                                message: "Please Select Aircraft",
                                            },
                                        ]}
                                    >
                                      <Input placeholder={'Enter Model'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </AntdFormItem>

                        <Row gutter={[12, 12]}>

                            <Col sm={24} md={12}>
                                <LastShopInfoForm/>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={24} md={12}>
                                <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
                                    <Space>
                                        <ARMButton type="primary" htmlType="submit">
                                            {id ? t("common.Update") : t("common.Submit")}
                                        </ARMButton>
                                        <ARMButton
                                            size="medium"
                                            type="primary"
                                            danger
                                            onClick={onReset}
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
}
