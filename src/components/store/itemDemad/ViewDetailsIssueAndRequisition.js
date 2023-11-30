import React from 'react';
import {Col, Modal, Row} from "antd";
import ResponsiveTable from "../../common/ResposnsiveTable";
import ARMTable from "../../common/ARMTable";

const ViewDetailsIssueAndRequisition = ({
                                            issue,
                                            isIssue,
                                            isModalOpen,
                                            requisition,
                                            setIsModalOpen
                                        }) => {

  return (
        <Modal
            title={isIssue ? "Issue Details" : "Requisition Details"}
            style={{
                top: 20,
                zIndex: 9999,
            }}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
            centered
            visible={isModalOpen}
            width={1080}
            footer={null}
        >
            {
                isIssue ? <Row>
                    <Col
                        span={24}
                        md={12}
                    >
                        <Row>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                Voucher No :
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {issue?.voucherNo ? issue?.voucherNo : 'N/A'}
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                Demand No :
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {issue?.storeDemandNo ? issue?.storeDemandNo : 'N/A '}
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                Stage :
                            </Col>
                            <Col
                                span={12}
                                style={{marginBottom: '10px'}}
                            >
                                {issue?.editable ? "Pending" : "Approved"}
                            </Col>
                        </Row>
                    </Col>
                    <ResponsiveTable style={{marginTop: '20px'}}>
                        <ARMTable>
                            <thead>
                            <tr>
                                <th>Part No</th>
                                <th>Quantity Demanded</th>
                                <th>Quantity Issued</th>
                                <th>Card Line No.</th>
                                <th>Serial</th>
                                <th>Remark</th>
                                <th>Unit of Measurement</th>
                                <th>Priority</th>
                            </tr>
                            </thead>
                            <tbody>
                            {issue?.storeIssueItemResponseDtos?.map((demandList) => (
                                <tr key={demandList.id}>
                                    <td>{demandList.partNo}</td>
                                    <td>{demandList.quantityDemanded}</td>
                                    <td>{demandList.issuedQuantity}</td>
                                    <td>{demandList.cardLineNo}</td>
                                  <td>{
                                    demandList.grnAndSerialDtoList ?
                                      demandList.grnAndSerialDtoList.map((d, i) => (
                                        <span key={i}>
                                        {d.serialNo} <br/>
                                         </span>

                                      )) : ""}</td>
                                    <td>{demandList.remark}</td>
                                    <td>{demandList.unitMeasurementCode}</td>
                                    <td>{demandList.priorityType}</td>
                                </tr>
                            ))}
                            </tbody>
                        </ARMTable>
                    </ResponsiveTable>
                </Row> : <Row>
                    <Col span={24} md={12}>
                        <Row>
                            <Col span={12} style={{marginBottom: "10px"}}>
                                Store Demand No :
                            </Col>
                            <Col span={12} style={{marginBottom: "10px"}}>
                                {requisition.storeDemandNo ? requisition.storeDemandNo : "N/A"}
                            </Col>
                            <Col span={12} style={{marginBottom: "10px"}}>
                                Voucher No :
                            </Col>
                            <Col span={12} style={{marginBottom: "10px"}}>
                                {requisition.voucherNo ? requisition.voucherNo : 'N/A'}
                            </Col>
                            <Col span={12} style={{marginBottom: "10px"}}>
                                Remarks :
                            </Col>
                            <Col span={12} style={{marginBottom: "10px"}}>
                                {requisition.remarks ? requisition.remarks : 'N/A'}
                            </Col>
                            <Col span={12} style={{marginBottom: "10px"}}>
                                Stage :
                            </Col>
                            <Col span={12} style={{marginBottom: "10px"}}>
                                {requisition.editable ? 'Pending' : 'Approved'}
                            </Col>
                        </Row>
                    </Col>
                    <ResponsiveTable style={{marginTop: '20px'}}>
                        <ARMTable>
                            <thead>
                            <tr>
                                <th>Part No</th>
                                <th>Part Description</th>
                                <th>Aircraft Item</th>
                                <th>Quantity Demanded</th>
                                <th>Quantity Requested</th>
                                <th>Unit of Measurement</th>
                                <th>Priority</th>
                                <th>Remarks</th>
                            </tr>
                            </thead>
                            <tbody>

                            {
                                requisition?.requisitionItemViewModels?.map((demandList, index) => (
                                    <tr key={demandList.id}>
                                        <td>{demandList.partNo}</td>
                                        <td>{demandList.partDescription}</td>
                                        <td>aircraft-{index + 1}</td>
                                        <td>{demandList.quantityDemanded}</td>
                                        <td>{demandList.requisitionQuantity}</td>
                                        <td>{demandList.unitMeasurementCode}</td>
                                        <td>{demandList.requisitionPriority}</td>
                                        <td>{demandList.remark}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </ARMTable>
                    </ResponsiveTable>
                </Row>
            }
        </Modal>
    );
};

export default ViewDetailsIssueAndRequisition;