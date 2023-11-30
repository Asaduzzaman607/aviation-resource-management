import React from 'react';
import {Col, Form, Row, Space} from "antd";
import ARMButton from "../../common/buttons/ARMButton";
import {formLayout} from "../../../lib/constants/layout";

const SubmitReset = ({id,onReset, submitting}) => {
    return (
        <Row>
            <Col sm={20} md={10}>
                <Form.Item style={{ marginTop: '15px' }} wrapperCol={{ ...formLayout.wrapperCol }}>
                    <Space size="small">
                        <ARMButton disabled={submitting} type="primary" htmlType="submit" loading={submitting}>
                            {id ? 'Update' : 'Submit'}
                        </ARMButton>
                        <ARMButton
                            onClick={onReset}
                            type="primary"
                            danger
                            disabled={submitting}
                        >
                            Reset
                        </ARMButton>
                    </Space>
                </Form.Item>
            </Col>
        </Row>
    );
};
export default SubmitReset;