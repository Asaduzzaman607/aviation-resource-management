import React from 'react';
import {Col, Modal, Row} from "antd";


const ViewModel = ({
                    base,
                    isModalOpen,
                    setIsModalOpen
                }) => {
    return (
        <Modal
            title={"View Model"}
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
                                Module :
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {base?.moduleName}
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                Ordering : 
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {base?.order} 
                            </Col>
                        </Row>
                    </Col>
                </Row> 
        </Modal>
    );
};

export default ViewModel;