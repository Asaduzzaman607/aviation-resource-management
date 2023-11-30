import React from 'react';
import {Col, Modal, Row} from "antd";


const ViewWorkflow = ({
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
                                Name : 
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {base?.name}
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                Order Number : 
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {base?.orderNumber} 
                            </Col>
                            
                        </Row>
                    </Col>
                   
                </Row> 
          
        </Modal>
    );
};

export default ViewWorkflow;