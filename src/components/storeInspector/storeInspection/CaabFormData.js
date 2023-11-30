import ARMCard from "../../common/ARMCard";
import {Col, Form, Input, Row} from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";

const CaabFormData = ({form,onFinish}) => {
    const caabCheckbox = Form.useWatch('caabCheckbox', form);
    const checkboxValues = caabCheckbox?.split(',');

    return (

        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'

        }}>

            <ARMCard
                style={{
                    backgroundColor: '#F8F6F0',
                    marginTop: '10px',
                    marginBottom: '10px',
                    width: '80%',
                }}
            >

                <Form form={form} onFinish={onFinish}>
                    <Row gutter={[16, 16]}>
                        <Col
                            xs={24}
                            sm={24}
                            md={4}
                        >
                            <Form.Item

                                name={'caabStatus'}
                            >
                                <Input readOnly placeholder={"Status"}/>
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={4}
                            lg={20}
                        >
                            <Form.Item

                                name={'caabRemarks'}
                            >
                                <TextArea readOnly autoSize placeholder={"Remarks"}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name={'caabCheckbox'}
                    >
                        {caabCheckbox !=='' ?
                            <ul>
                            {checkboxValues?.map((option, index) => (
                                <li key={index}>
                                    {option}
                                </li>
                            ))}
                        </ul>
                        : null
                        }
                    </Form.Item>

                    <Row gutter={[16, 16]}>
                        <Col
                            xs={24}
                            sm={24}
                            md={4}
                            lg={8}
                        >
                            <Form.Item

                                name={'authorizedUser'}
                            >
                                <Input readOnly placeholder={'Authorized User'}/>
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={4}
                            lg={8}
                        >
                            <Form.Item

                                name={'approvalAuthNo'}
                            >
                                <Input readOnly placeholder={"Authorization No"}/>
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={4}
                            lg={8}
                        >
                            <Form.Item

                                name={'certApprovalRef'}
                            >
                                <Input readOnly placeholder={"Approval Ref. No."}/>
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={4}
                            lg={8}
                        >
                            <Form.Item

                                name={'authorizesUser'}
                            >
                                <Input readOnly placeholder={'Authorizes User'}/>
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={4}
                            lg={8}
                        >
                            <Form.Item

                                name={'authorizedDate'}
                            >
                                <Input
                                    readOnly
                                    style={{width: '100%'}}
                                    size="medium"
                                    placeholder="Authorized Date"/>
                            </Form.Item>
                        </Col> <Col
                        xs={24}
                        sm={24}
                        md={4}
                        lg={8}
                    >
                        <Form.Item

                            name={'authorizesDate'}
                        >
                            <Input
                                readOnly
                                style={{width: '100%'}}
                                size="medium"
                                placeholder="Authorizes Date"/>
                        </Form.Item>
                    </Col>
                    </Row>
                </Form>
            </ARMCard>

        </div>

    );
};

export default CaabFormData;