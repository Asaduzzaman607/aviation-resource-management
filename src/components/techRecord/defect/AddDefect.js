import {useTranslation} from "react-i18next";
import {Link, useParams} from "react-router-dom";
import CommonLayout from "../../layout/CommonLayout";
import {AutoComplete, Breadcrumb, Button, Col, DatePicker, Form, Modal, Row, Select, Space} from "antd";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {ProfileOutlined} from "@ant-design/icons";
import Permission from "../../auth/Permission";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import {formLayout} from "../../../lib/constants/layout";
import TextArea from "antd/lib/input/TextArea";
import ARMButton from "../../common/buttons/ARMButton";
import {useDefectRecord} from "../../../lib/hooks/planning/useDefectRecord";
import React from "react";
import debounce from "lodash/debounce";
import AddLocationForm from "../../planning/configurations/AddLocationForm";
import {useLocations} from "../../../lib/hooks/planning/useLocations";

const {Option} = AutoComplete;

const AddDefect = () => {

    const { handleReset: handleLocationReset, form: locationForm } =
        useLocations();

    const {
        onFinish,
        onReset,
        form,
        locations,
        aircrafts,
        parts,
        onSearchParts,
        defectTypes,
        showLocationModal,
        setShowLocationModal,
        handleLocationSubmit
    } = useDefectRecord(locationForm);
    const {t} = useTranslation()
    let {dId: id} = useParams();




    const title = id ? `Defect ${t("common.Edit")}` : `Defect ${t("common.Add")}`;

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
                        <Link to="/reliability/defect">Defects</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>{id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <Permission permission={[""]} showFallback>
                <ARMCard title={getLinkAndTitle(title, "/reliability/defect", false, "")}>
                    <div>
                        <Form
                            {...formLayout}
                            form={form}
                            name="defectForm"
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
                                    <Form.Item
                                        name="locationId"
                                        label={t("planning.Locations.Location")}
                                        style={{ marginBottom: "12px" }}
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
                                                            style={{ width: "100%" }}
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
                                            {locations?.map((loc) => {
                                                return (
                                                    <Select.Option key={loc.id} value={loc.id}>
                                                        {loc.name}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label='Part'
                                        name="partId"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Part is required',
                                            }
                                        ]}
                                    >
                                        <AutoComplete showSearch onSearch={debounce(onSearchParts, 1000)} placeholder='Input Part No'  onChange={() => {
                                            form.setFieldsValue({serialId: ""})
                                        }}>
                                            {parts.map((part) => (
                                                <Option key={part.partNo} value={part.partNo}>
                                                    {part.partNo}
                                                </Option>
                                            ))}
                                        </AutoComplete>

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
                                        name="defectDesc"
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
                                        name="actionDesc"
                                        label="Action"
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
                                        name="reference"
                                        label="Reference"
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
                                        name="defectType"
                                        label="Defect Type"
                                        rules={[
                                            {
                                                required: false,
                                            }
                                        ]}
                                        style={{marginBottom: "12px"}}
                                    >
                                        <Select
                                            placeholder="Please Select Defect Type"
                                        >
                                            {defectTypes?.map((item) => {
                                                return (
                                                    <Select.Option key={item.id} value={item.id}>
                                                        {item?.type}
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

export default AddDefect;