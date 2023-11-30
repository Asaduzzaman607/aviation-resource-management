import {useTranslation} from "react-i18next";
import {Breadcrumb, Button, Col, DatePicker, Form, Input, Modal, Row, Select, Space} from "antd";
import Permission from "../../../auth/Permission";
import TextArea from "antd/lib/input/TextArea";
import ARMButton from "../../../common/buttons/ARMButton";
import React from "react";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Link, useParams} from "react-router-dom";
import ARMCard from "../../../common/ARMCard";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import {formLayout} from "../../../../lib/constants/layout";
import AddLocationForm from "../../../planning/configurations/AddLocationForm";
import {useLocations} from "../../../../lib/hooks/planning/useLocations";
import {useInterruption} from "../../../../lib/hooks/planning/useInterruption";
import {ProfileOutlined} from "@ant-design/icons";


const sequences = [
    {value: 'A'},
    {value: 'B'},
]

const AddInterruption = () => {

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
        aircrafts,
        pageNoAlphabets

    } = useInterruption(locationForm);
    const {t} = useTranslation()
    let {intId: id} = useParams();

    const title = id ? `Interruption ${t("common.Edit")}` : `Interruption ${t("common.Add")}`;

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
                        <Link to="/reliability/interruption">Interruption</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>{id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission={[""]} showFallback>
                <ARMCard title={getLinkAndTitle(title, "/reliability/interruption", false, "")}>
                    <div>
                        <Form
                            {...formLayout}
                            form={form}
                            name="interruptionForm"
                            onFinish={onFinish}
                            scrollToFirstError
                            initialValues={{
                                duration: null
                            }}
                        >
                            <Row>
                                <Col sm={20} md={10}>
                                    <Form.Item
                                        name="aircraftId"
                                        label={'Aircraft'}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Aircraft is required",
                                            },
                                        ]}
                                    >
                                        <Select
                                            allowClear
                                            placeholder="Please Select Aircraft"
                                            disabled={id}
                                            onChange={(e) => {form.setFieldsValue({amlPageNo: ""})}}
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
                                    <Form.Item
                                        name="amlPageNo"
                                        label={'Page No'}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Page no is required",
                                            },
                                        ]}
                                    >
                                        <Select
                                            onChange={(e) => {form.setFieldsValue({seqNo: ""})}}
                                            allowClear
                                            placeholder="Please Select Page No"
                                        >
                                            {pageNoAlphabets?.map((item) => {
                                                return (
                                                    <Select.Option key={item.amlPageNo} value={item.amlPageNo}>
                                                        {item?.amlPageNo}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
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
                                            format="DD-MM-YYYY"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="seqNo"
                                        label={'Seq'}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Seq  is required",
                                            },
                                        ]}
                                    >
                                        <Select
                                            onChange={(e) => {form.setFieldsValue({defectDescription: "", rectDescription : ""})}}
                                            placeholder="Please Select Seq"
                                            allowClear
                                        >
                                            {sequences?.map((item) => {
                                                return (
                                                    <Select.Option key={item.value} value={item.value}>
                                                        {item?.value}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name="defectDescription"
                                        label="Defect"
                                        rules={[
                                            {
                                                required: false,
                                            },
                                            {
                                                max: 255,
                                                message: t("common.Maximum 255 characters allowed")
                                            },
                                        ]}
                                        style={{marginBottom: "12px"}}
                                    >
                                        <TextArea/>
                                    </Form.Item>
                                    <Form.Item
                                        name="rectDescription"
                                        label="Rectification"
                                        rules={[
                                            {
                                                required: false,
                                            },
                                            {
                                                max: 255,
                                                message: t("common.Maximum 255 characters allowed")
                                            },
                                        ]}
                                        style={{marginBottom: "12px"}}
                                    >
                                        <TextArea/>
                                    </Form.Item>
                                    <Form.Item
                                        name="duration"
                                        label="Duration"
                                        rules={[
                                            {
                                                required: false,
                                            }
                                        ]}
                                        style={{marginBottom: "12px"}}
                                    >
                                        <Input style={{width: "100%"}} min={0} maxLength={9} size="small"/>
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

export default AddInterruption;