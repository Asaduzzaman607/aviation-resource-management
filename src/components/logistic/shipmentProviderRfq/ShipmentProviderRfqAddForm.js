import React, {useEffect} from 'react';
import ARMForm from "../../../lib/common/ARMForm";
import {Button, Col, DatePicker, Form, Input, notification, Row, Space} from "antd";
import DebounceSelect from "../../common/DebounceSelect";
import FormControl from "../../store/common/FormControl";
import RibbonCard from "../../common/forms/RibbonCard";
import moment from "moment";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import ARMButton from "../../common/buttons/ARMButton";
import ShipmentProviderRfqService from "../../../service/logistic/ShipmentProviderRfqService";
import {getErrorMessage} from "../../../lib/common/helpers";

const ShipmentProviderRfqAddForm = ({id, setIsRfqModal}) => {
    console.log("logggg", id)
    const [form] = Form.useForm();
    const layout = {
        labelCol: {
            span: 10,
        },
        wrapperCol: {
            span: 14,
        },
    };

    form.setFieldsValue({partOrderId: id});

    const onFinish = async (values) => {
        let vlist = [];
        values.quoteRequestVendorModelList?.map((data) =>
            vlist.push({
                ...data,
                requestDate: data['requestDate']?.format('YYYY-MM-DD'),
            })
        );

        const modifiedValue = {
            ...values,
            quoteRequestVendorModelList: vlist,
        };
        try {

            let {data} = await ShipmentProviderRfqService.saveRequestForQuotation(
                modifiedValue);
            form.resetFields();
            notification['success']({
                message: 'Successfully added!',
            });
            setIsRfqModal(false)
        } catch (er) {
            notification['error']({message: getErrorMessage(er)});
        }

    }
    const dateFormat = 'YYYY/MM/DD';
    return (

        <ARMForm
            {...layout}
            form={form}
            name="SPRFQ"
            onFinish={onFinish}
            scrollToFirstError

        >
            <Row>
                <Col sm={20} md={10}>
                    <Form.Item
                        name="partOrderId"
                        label="PO No"
                    >
                        <DebounceSelect
                            mapper={(v) => ({
                                label: v.orderNo,
                                value: v.id,
                            })}
                            showSearch
                            placeholder="---Select PO no---"
                            type="multi"
                            url={`/procurement/part-orders/search?page=1&size=20`}
                            params={{isActive: true, rfqType: 'PROCUREMENT'}}
                            disabled={id ? true : false}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <FormControl>
                <RibbonCard ribbonText={"Shipment Provider"}>
                    <Form.List name="quoteRequestVendorModelList"
                    >

                        {(fields, {add, remove}) => (
                            <>
                                {fields?.map(({key, name, ...restField}) => (
                                    <Row key={key}>
                                        <Col lg={11} sm={24} md={24}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'requestDate']}
                                                initialValue={moment()}
                                            >
                                                <DatePicker size='medium'
                                                            placeholder="Request Date"
                                                            format={dateFormat}
                                                            style={{width: '45vh'}}

                                                ></DatePicker>
                                            </Form.Item>
                                        </Col>
                                        <Col lg={11} sm={24} md={34}>


                                            <Form.Item
                                                {...restField}
                                                name={[name, 'vendorId']}
                                                style={{width: "45vh"}}
                                            >
                                                <DebounceSelect
                                                    mapper={(v) => ({
                                                        label: v.name,
                                                        value: v.id,
                                                    })}
                                                    showSearch
                                                    placeholder="---Select Shipment Provider---"
                                                    type="multi"
                                                    url={`/material-management/config/shipment_provider/search?page=1&size=20`}
                                                    params={{type: 'APPROVED'}}
                                                />
                                            </Form.Item>

                                        </Col>
                                        <Col lg={2} sm={20} md={10}>
                                            {id ? "" : <Button onClick={() => remove(name)}
                                                               danger><MinusCircleOutlined/></Button>}

                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item wrapperCol={{...layout.labelCol}}>
                                    <ARMButton type="primary" onClick={() => {
                                        add()
                                    }}
                                               icon={<PlusOutlined/>}>Add</ARMButton>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </RibbonCard>
            </FormControl>
            <Row>
                <Col sm={20} md={10}>
                    <Form.Item wrapperCol={{...layout.wrapperCol}}>
                        <Space size="small">
                            <ARMButton type="primary" htmlType="submit">
                                Submit
                            </ARMButton>
                        </Space>
                    </Form.Item>

                </Col>
            </Row>
        </ARMForm>

    );
};

export default ShipmentProviderRfqAddForm;