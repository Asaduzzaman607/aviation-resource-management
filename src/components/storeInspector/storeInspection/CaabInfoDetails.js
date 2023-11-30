import ARMCard from "../../common/ARMCard";
import {Col, Row} from "antd";
import React from "react";

const CaabInfoDetails = ({caabInfo}) => {


    const checkboxValues = caabInfo?.caabCheckbox?.split(',');


    return (

        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '80%',

        }}>

            <ARMCard
                style={{
                    backgroundColor: '#F8F6F0',
                    marginTop: '10px',
                    marginBottom: '10px',
                    width: '100%',
                }}
            >

                <Row gutter={[16, 16]}>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        lg={8}
                    >
                        <p>Status : {caabInfo?.caabStatus}</p>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        lg={8}
                    >
                        <p>Remarks : {caabInfo?.caabRemarks}</p>

                    </Col>
                </Row>

                <Row>
                    <Col>
                        {caabInfo?.caabCheckbox !== '' ?
                            <ul>
                                {checkboxValues?.map((option, index) => (
                                    <li key={index}>
                                        {option}
                                    </li>
                                ))}
                            </ul>
                            : null
                        }
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>


                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        lg={8}
                    >
                        <p>Authorized User : {caabInfo?.authorizedUser}</p>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        lg={8}
                    >
                        <p>Auth No : {caabInfo?.approvalAuthNo}</p>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        lg={8}
                    >
                        <p>Approval Ref : {caabInfo?.certApprovalRef}</p>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        lg={8}
                    >
                        <p>Authorizes User : {caabInfo?.authorizesUser}</p>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        lg={8}
                    >
                        <p>Authorized Date : {caabInfo?.authorizedDate}</p>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={4}
                        lg={8}
                    >
                        <p>Authorizes Date : {caabInfo?.authorizesDate}</p>
                    </Col>
                </Row>
            </ARMCard>

        </div>

    );
};

export default CaabInfoDetails;