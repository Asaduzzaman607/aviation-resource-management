import React from 'react';
import {DatePicker, Form, Input, InputNumber} from "antd";
import RibbonCard from "../../common/forms/RibbonCard";
import {max_size} from "../../../lib/common/validation";

const LastShopInfoForm = () => {
    return (
        <div>
            <RibbonCard ribbonText="Last Shop List Information">
                <Form.Item
                    name="date"
                    label="Date"
                    rules={[
                        {
                            required: false,
                            message: "This field is required",
                        }
                    ]}
                >
                    <DatePicker size="small" format="DD-MM-YYYY" placeholder="" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="tsn" label="TSN">
                    <Input style={{width:"100%"}} min={0} maxLength={9} size="small"/>
                </Form.Item>
                <Form.Item name="csn" label="CSN">
                    <Input style={{width:"100%"}} min={0} maxLength={9} size="small"/>
                </Form.Item>
                <Form.Item name="tsr" label="TSR">
                    <Input style={{width:"100%"}} min={0} maxLength={9} size="small"/>
                </Form.Item>
                <Form.Item name="csr" label="CSR">
                    <Input style={{width:"100%"}} min={0} maxLength={9} size="small"/>
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                        {
                            max: 20,
                            message: "Maximum 20 characters is allowed!",
                        },
                    ]}
                >
                    <Input size="small" />
                </Form.Item>
            </RibbonCard>

        </div>
    );
};

export default LastShopInfoForm;
