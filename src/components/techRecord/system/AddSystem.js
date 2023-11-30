import {useTranslation} from "react-i18next";
import {Link, useParams} from "react-router-dom";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Button, Col, Form, Input, Modal, Row, Select, Space} from "antd";
import {ProfileOutlined} from "@ant-design/icons";
import Permission from "../../auth/Permission";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import {formLayout} from "../../../lib/constants/layout";
import ARMButton from "../../common/buttons/ARMButton";
import React from "react";
import AddLocationForm from "../../planning/configurations/AddLocationForm";
import {useLocations} from "../../../lib/hooks/planning/useLocations";
import {useSystems} from "../../../lib/hooks/planning/useSystems";


const AddSystem = () => {


    const {handleReset: handleLocationReset, form: locationForm} =
        useLocations();

    const {
        onFinish,
        onReset,
        form,
        location,
        showLocationModal,
        setShowLocationModal,
        handleLocationSubmit,
    } = useSystems(locationForm);

    const {t} = useTranslation()
    let {sId: id} = useParams();

    const title = id ? `System ${t("common.Edit")}` : `System ${t("common.Add")}`;

    return (

        <CommonLayout>
            <Modal
                title={t("planning.Locations.Add Location")}
                style={{
                    top: 20,
                }}
                onOk={() => setShowLocationModal(false)}
                onCancel={() => setShowLocationModal(false)}
                centered
                visible={showLocationModal}
                width={1080}
                footer={null}
            >
                <AddLocationForm
                    onFinish={handleLocationSubmit}
                    handleReset={handleLocationReset}
                    form={locationForm}
                />
            </Modal>

            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to="/reliability">
                            <ProfileOutlined/>
                            &nbsp; Reliability
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        <Link to="/reliability/systems">Systems</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>{id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission={[""]} showFallback>
                <ARMCard title={getLinkAndTitle(title, "/reliability/systems", false, "")}>
                    <div>
                        <Form
                            {...formLayout}
                            form={form}
                            name="systemForm"
                            onFinish={onFinish}
                            scrollToFirstError
                        >
                            <Row>
                                <Col sm={20} md={10}>
                                    <Form.Item
                                        name="locationId"
                                        label={t("planning.Locations.Location")}
                                        style={{marginBottom: "12px"}}
                                        rules={[
                                            {
                                                required: true,
                                                message: t("planning.Locations.Please select Location"),
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            showSearch
                                            filterOption={(inputValue, option) =>
                                                option.children
                                                    .toString("")
                                                    .toLowerCase()
                                                    .includes(inputValue.toLowerCase())
                                            }
                                            placeholder={t("planning.Locations.Select a Location")}
                                            dropdownRender={(menu) => (
                                                <>
                                                    <Permission permission="PLANNING_AIRCRAFT_AIRCRAFT_LOCATION_SAVE">
                                                        <Button
                                                            style={{width: "100%"}}
                                                            type="primary"
                                                            onClick={() => setShowLocationModal(true)}
                                                        >
                                                            + Add Location
                                                        </Button>
                                                    </Permission>
                                                    {menu}
                                                </>
                                            )}
                                        >
                                            {location?.map((loc) => {
                                                return (
                                                    <Select.Option key={loc.id} value={loc.id}>
                                                        {loc.name}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name={'name'} label={'Name'}
                                               rules={[
                                                   {
                                                       required: true,
                                                       message: t("planning.Locations.Please select Location"),
                                                   },
                                               ]}>
                                        <Input placeholder={'Enter System Name'}/>
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

export default AddSystem;