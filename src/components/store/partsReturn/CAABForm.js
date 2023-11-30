import React from 'react';
import ARMCard from "../../common/ARMCard";
import {Col, Row, Form, Input, Checkbox, DatePicker} from "antd";
import TextArea from "antd/es/input/TextArea";
import DebounceSelect from "../../common/DebounceSelect";

const CaabForm = ({name,restField}) => {
    const checkItem=[
        {name:"Approved Design Data and are in condition for safe operation"},
        {name:"Part 145.A.50 Release to service"},
        {name:"Non-Approved Design Data specified in remarks"},
        {name:"Other regulation specified in remarks"},
    ]


    return (
        <ARMCard
            style={{
                backgroundColor: '#F8F6F0',
                marginTop: '10px',
                marginBottom: '10px',
                width: '92%',
            }}
        >
            <Row gutter={[16, 16]}>
                <Col
                    xs={24}
                    sm={24}
                    md={4}
                >
                    <Form.Item
                        {...restField}
                        name={[name, 'caabStatus']}
                    >
                        <Input placeholder={"Status"}/>
                    </Form.Item>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    md={4}
                    lg={20}
                >
                    <Form.Item
                        {...restField}
                        name={[name, 'caabRemarks']}
                    >
                        <TextArea placeholder={"Remarks"}/>
                    </Form.Item>
                </Col>
            </Row>
           <Form.Item
               {...restField}
               name={[name, 'caabCheckbox']}
           >
               <Checkbox.Group
                   style={{
                       width: '100%',
                   }}
               >
                   <Row>
                       {checkItem?.map((data,index) => (


                           <Col lg={12} xs={24}>
                               <Checkbox key={index} value={data.name}>{data.name}</Checkbox>
                           </Col>

                       ))}
                   </Row>
               </Checkbox.Group>
           </Form.Item>
            <Row gutter={[16,16]}>
                <Col
                    xs={24}
                    sm={24}
                    md={4}
                    lg={8}
                >
                    <Form.Item
                        {...restField}
                        name={[name, 'authorizedUserId']}
                    >
                        <DebounceSelect
                            allowClear
                            mapper={(v) => ({
                                label: v.name,
                                value: v.id,
                            })}
                            showSearch
                            placeholder="Select Authorized"
                            url={`/employee/search?page=0&size=20`}
                            type="multi"
                        />
                    </Form.Item>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    md={4}
                    lg={8}
                >
                    <Form.Item
                        {...restField}
                        name={[name, 'approvalAuthNo']}
                    >
                        <Input placeholder={"Authorization No"}/>
                    </Form.Item>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    md={4}
                    lg={8}
                >
                    <Form.Item
                        {...restField}
                        name={[name, 'certApprovalRef']}
                    >
                        <Input placeholder={"Approval Ref. No."}/>
                    </Form.Item>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    md={4}
                    lg={8}
                >
                    <Form.Item
                        {...restField}
                        name={[name, 'authorizesUserId']}
                    >
                        <DebounceSelect
                            allowClear
                            mapper={(v) => ({
                                label: v.name,
                                value: v.id,
                            })}
                            showSearch
                            placeholder="Select Authorizes"
                            url={`/employee/search?page=0&size=20`}
                            type="multi"
                        />
                    </Form.Item>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    md={4}
                    lg={8}
                >
                    <Form.Item
                        {...restField}
                        name={[name, 'authorizedDate']}
                    >
                      <DatePicker
                          style={{width: '100%'}}
                          size="medium"
                          format="YYYY-MM-DD"
                          placeholder="Authorized Date"/>
                    </Form.Item>
                </Col> <Col
                    xs={24}
                    sm={24}
                    md={4}
                    lg={8}
                >
                    <Form.Item
                        {...restField}
                        name={[name, 'authorizesDate']}
                    >
                      <DatePicker
                          style={{width: '100%'}}
                          size="medium"
                          format="YYYY-MM-DD"
                          placeholder="Authorizes Date"/>
                    </Form.Item>
                </Col>
            </Row>
        </ARMCard>
    );
};

export default CaabForm;