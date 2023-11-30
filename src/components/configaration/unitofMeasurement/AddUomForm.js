import React from 'react';
import ARMForm from "../../../lib/common/ARMForm";
import {formLayout} from "../../../lib/constants/layout";
import {Form, Col, Input, Row, Space} from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import PropTypes from "prop-types";

const AddUomForm = ({id,form,onFinish,onReset}) => {
    return (
        <ARMForm
            {...formLayout}
            form={form}
            name="unitofMeasurement"
            onFinish={onFinish}
            scrollToFirstError
        >
            <Form.Item
                name="code"
                label="Name"
                rules={[
                    {
                        required: true,
                        message: "Please input Name!"
                    },
                    {
                        max: 255,
                        message: 'Maximum 255 character allowed',
                    },
                    {
                        whitespace: true,
                        message: 'Only space is not allowed!',
                    },
                ]}

            >
                <Input />
            </Form.Item>
            <Form.Item wrapperCol={{...formLayout.wrapperCol, offset: 8}}>
                <Space size="small">
                    <ARMButton  type="primary" htmlType="submit">
                        {id ? 'Update' : 'Submit'}
                    </ARMButton>
                    <ARMButton onClick={onReset} type="primary" danger>
                        Reset
                    </ARMButton>
                </Space>
            </Form.Item>
        </ARMForm>
    );
};

AddUomForm.defaultProps = {
    id: null
}

AddUomForm.propTypes = {
    onFinish: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    id: PropTypes.any
};

export default AddUomForm;