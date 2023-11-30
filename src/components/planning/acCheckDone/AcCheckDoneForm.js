import React, {useEffect, useState} from 'react';
import ARMForm from "../../../lib/common/ARMForm";
import {formLayout} from "../../../lib/constants/form";
import {Col, DatePicker, Form, Input, InputNumber, Row, Select, Space} from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import {useTranslation} from "react-i18next";
import {useAircraftsList} from "../../../lib/hooks/planning/aircrafts";
import AircraftService from '../../../service/AircraftService';

const AcCheckDoneForm = ({onFinish, form, onReset, id, checkType}) => {

    const {t} = useTranslation()
    const [ aircrafts, setAircrafts ] = useState([]);

    const getAllAircraftList =async () =>{
        const {data} = await AircraftService.getAllAircraftList();
        setAircrafts(data);
    }

    useEffect(()=>{
        (async()=>{
            await getAllAircraftList();

        })();
    },[])

    return (
        <ARMForm
            {...formLayout}
            form={form}
            name="acCheckDone"
            onFinish={onFinish}
            initialValues={{
                aircraftId: null,
                aircraftCheckDoneHour: null,
                aircraftCheckDoneDate: '',
                checkType:'',
                isActive: false,
            }}
            scrollToFirstError
        >
            <Row>
                <Col sm={20} md={10}>
                    <Form.Item
                        name="aircraftId"
                        label={t("planning.Aircrafts.Aircraft")}
                        rules={[
                            {
                                required: true,
                                message: 'Aircraft is required',
                            }
                        ]}
                    >
                        <Select
                            disabled={!!id}
                            placeholder={t("planning.Aircrafts.Aircraft")}
                            allowClear
                        >
                            {
                                aircrafts.map(({ aircraftId, aircraftName }) => <Select.Option value={aircraftId} key={aircraftId}>{aircraftName}</Select.Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="aircraftCheckDoneDate"
                        label="Aircraft Check Done Date"
                        rules={[
                            {
                                required: true,
                                message: 'A/C Done Date is required',
                            },
                        ]}
                    >
                        <DatePicker format='DD-MMM-YYYY' style={{width: '100%'}}/>
                    </Form.Item>

                    <Form.Item
                        name="aircraftCheckDoneHour"
                        label="Aircraft Check Done Hour"
                        rules={[
                            {
                                required: false,
                                message: 'A/C Done Hour is missing',
                            }
                        ]}
                    >
                        <Input style={{width: "100%"}} min={0} maxLength={9} />
                    </Form.Item>

                    <Form.Item
                        name="checkType"
                        label="Check Type"
                        style={{ marginBottom: "12px" }}
                        rules={[
                            {
                            required: true,
                            },
                        ]}
                        >
                        <Select allowClear placeholder="Select check type">
                            {checkType?.map((item) => {
                            return (
                                <Select.Option key={item.id} value={item.id}>
                                {item.name}
                                </Select.Option>
                            );
                            })}
                        </Select>
                        </Form.Item>


                </Col>
            </Row>

            <Row>
                <Col sm={20} md={10}>
                    <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
                        <Space>
                            <ARMButton size="medium" type="primary" htmlType="submit">
                                {id ? t("common.Update") : t("common.Submit")}
                            </ARMButton>
                            <ARMButton onClick={onReset} size="medium" type="primary" danger>
                                Reset
                            </ARMButton>
                        </Space>
                    </Form.Item>
                </Col>
            </Row>
        </ARMForm>
    );
};

export default AcCheckDoneForm;