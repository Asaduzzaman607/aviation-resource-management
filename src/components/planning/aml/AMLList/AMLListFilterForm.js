import {Col, DatePicker, Form, Input, Row, Select, Space, InputNumber} from "antd";
import PageSizesFormItem from "../../../common/pagination/PageSizesFormItem";
import ARMButton from "../../../common/buttons/ARMButton";
import {FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import {ALPHABETS} from "../MaintenaceLog/aml.constants";
import DateTimeConverter from "../../../../converters/DateTimeConverter";

export default function AMLListFilterForm({form, fetchData, aircrafts, airports}) {
    const {t} = useTranslation()

    const [startingDate, setStartingDate] = useState("");
    const [endingDate, setEndingDate] = useState("");

    const onFinish = (values) => {
        if (!values.aircraftId) return

        const data = {
            ...values,
            aircraftId: values?.aircraftId,
            fromDate: startingDate || "",
            toDate: endingDate || "",
        };
        fetchData(data);
    };

    const alphabetSelects = (
        <Form.Item name="alphabet" style={{background: "transparent"}} noStyle>
            <Select allowClear size="small" placeholder="-">
                {
                    ALPHABETS.map((letter) => <Select.Option value={letter} key={letter}>{letter}</Select.Option>)
                }
            </Select>
        </Form.Item>
    )

    return (
        <Form
            form={form}
            name="filter-form"
            initialValues={{
                pageNo: '',
                alphabet: null,
                aircraftId: '',
                flightNo: '',
                fromDate: '',
                toDate: '',
                fromAirportId: '',
                toAirportId: '',
                size: 10
            }}
            onFinish={onFinish}
        >
            <Row gutter={20}>
                <Col xs={24} md={4}>
                    <Form.Item name="aircraftId"
                               rules={[
                                   {
                                       required: true,
                                       message: "Aircraft is required",
                                   },
                               ]}>
                        <Select
                            placeholder={t("planning.Aircrafts.Aircraft")}
                        >
                            <Select.Option value="">---{t("planning.Aircrafts.Aircraft")}---</Select.Option>
                            {
                                aircrafts?.map(type => <Select.Option value={type.aircraftId}
                                                                      key={type.aircraftId}>{type.aircraftName}</Select.Option>)
                            }
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                    <Form.Item name="pageNo">
                        <InputNumber maxLength={8} placeholder={t("planning.ATL.Page No")}
                                     onKeyDown={(e) => e.key === "e" && e.preventDefault()}
                                     addonAfter={alphabetSelects}/>
                    </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                    <Form.Item name="flightNo">
                        <Input placeholder={t("planning.ATL.Flight No")}/>
                    </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                    <DatePicker format="YYYY-MM-DD" placeholder={t("planning.ATL.From Date")} style={{width: "100%"}}
                                onChange={(e) => setStartingDate(DateTimeConverter.momentDateToString(e))}/>
                </Col>

                <Col xs={24} md={4}>
                    <DatePicker ormat="YYYY-MM-DD" placeholder={t("planning.ATL.To Date")} style={{width: '100%'}}
                                onChange={(e) => setEndingDate(DateTimeConverter.momentDateToString(e))}/>
                </Col>

                <Col xs={24} md={4}>
                    <Form.Item name="fromAirportId">
                        <Select
                            placeholder={t("planning.ATL.From Airport")}
                        >
                            <Select.Option value="">---{t("planning.ATL.From Airport")}---</Select.Option>
                            {
                                airports?.map(type => <Select.Option value={type.id}
                                                                     key={type.id}>{type.name}</Select.Option>)
                            }
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={4}>
                    <Form.Item name="toAirportId">
                        <Select
                            placeholder={t("planning.ATL.To Airport")}
                        >
                            <Select.Option value="">---{t("planning.ATL.To Airport")}---</Select.Option>
                            {
                                airports?.map(type => <Select.Option value={type.id}
                                                                     key={type.id}>{type.name}</Select.Option>)
                            }
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={5} lg={4}>
                    <PageSizesFormItem/>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item>
                        <Space>
                            <ARMButton size="middle" type="primary" htmlType="submit">
                                <FilterOutlined name="filter"/> {t("common.Filter")}
                            </ARMButton>
                            <ARMButton
                                size="middle"
                                type="primary"
                                onClick={() => {
                                    form.resetFields();
                                    fetchData();
                                }}
                            >
                                <RollbackOutlined name="reset"/> {t("common.Reset")}
                            </ARMButton>
                        </Space>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

AMLListFilterForm.propTypes = {
    form: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
    aircrafts: PropTypes.array.isRequired,
    airports: PropTypes.array.isRequired
};