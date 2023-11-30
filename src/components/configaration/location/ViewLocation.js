import React from 'react';
import {Col, Modal, Row} from "antd";


const ViewLocation = ({
                    base,
                    isModalOpen,
                    setIsModalOpen
                }) => {
    return (
        <Modal
            title={"Location"}
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
                                Address : 
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {base?.address}
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                CityName : 
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {base?.cityName} 
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                Country Name : 
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {base?.countryName} 
                            </Col>
                        </Row>
                    </Col>
                   
                </Row> 
          
        </Modal>
    );
};

export default ViewLocation;