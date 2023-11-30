import React from 'react';
import {Col, Modal, Row} from "antd";


const ViewBasePlanet = ({
                    base,
                    isModalOpen,
                    setIsModalOpen
                }) => {
    return (
        <Modal
            title={"Base Planet"}
            style={{
                top: 20,
                zIndex: 9999,
                justifyContent:"center",
                textAlign:"Left",
            }}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
            centered
            visible={isModalOpen}
            width={500}
            footer={null}
        >
             <Row>
                    <Col
                        span={24}
                        md={12}
                    >
                        <Row>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                Code : 
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {base?.code}
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                DialingCode : 
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {base?.dialingCode} 
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                Name : 
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {base?.name} 
                            </Col>
                        </Row>
                    </Col>
                   
                </Row> 
          
        </Modal>
    );
};

export default ViewBasePlanet;