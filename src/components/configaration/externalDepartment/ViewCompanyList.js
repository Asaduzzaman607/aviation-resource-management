import React from 'react';
import {Col, Modal, Row} from "antd";
import {FileOutlined} from "@ant-design/icons";
import {getFileExtension, getFileName} from "../../../lib/common/helpers";


const ViewCompanyList = ({
                    base,
                    isModalOpen,
                    setIsModalOpen
                }) => {
    return (
        <Modal
            title="Operator List"
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
            width={800}
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
                                Contact Person : 
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {base?.contactPerson} 
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
                                City Name : 
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
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                Office Phone : 
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {base?.officePhone} 
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                Website : 
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {base?.website} 
                            </Col>
                            <Col
                              span={12}
                              className="mb-10"
                            >
                                Documents:
                            </Col>

                            <Col
                              span={12}
                              className="mb-10"
                            >
                                {base?.attachments
                                  ? base?.attachments?.map((file, index) => (
                                    <p key={index}>
                                        {getFileExtension(file) ? (
                                          <img
                                            alt="img"
                                            width="30"
                                            height="30"
                                            src={file}
                                          />
                                        ) : (
                                          <FileOutlined style={{ fontSize: '25px' }} />
                                        )}
                                        <a href={file}>
                                            {getFileName(file)}
                                        </a>
                                    </p>
                                  ))
                                  : 'N/A'}
                            </Col>
                        </Row>
                    </Col>
                   
                </Row> 
          
        </Modal>
    );
};

export default ViewCompanyList;