import {Col, Modal, Row} from "antd";
import React from "react";

export default function CompanyViewModal({handleCloseModal, isModalOpen, company}) {
    return (
        <Modal
            title="Company"
            onOk={handleCloseModal}
            onCancel={handleCloseModal}
            visible={isModalOpen}
            width={800}
        >
            <Row>
                <Col
                    span={24}
                    md={12}
                >
                    <Row>
                        <DetailItem label="Company Name" value={company.companyName} />
                        <DetailItem label="Address Line 1" value={company.addressLineOne} />
                        <DetailItem label="Address Line 2" value={company.addressLineTwo} />
                        <DetailItem label="Address Line 3" value={company.addressLineThree} />
                        <DetailItem label="Address Line 3" value={company.addressLineThree} />
                        <DetailItem label="Country" value={company.countryName} />
                        <DetailItem label="City" value={company.cityName} />
                        <DetailItem label="Phone Number" value={company.phone} />
                        <DetailItem label="Fax" value={company.fax} />
                        <DetailItem label="Email" value={company.email} />
                        <DetailItem label="Contact Person" value={company.contactPerson} />
                        <DetailItem label="Base Currency" value={company.baseCurrency} />
                        <DetailItem label="Local Currency" value={company.localCurrency} />
                        <DetailItem label="Shipment Address 1" value={company.shipmentAddressOne} />
                        <DetailItem label="Shipment Address 2" value={company.shipmentAddressTwo} />
                        <DetailItem label="Shipment Address 3" value={company.shipmentAddressThree} />
                        <DetailItem label="Company URL" value={company.companyUrl} />
                    </Row>
                </Col>
            </Row>

        </Modal>
    )
}

function DetailItem({label, value}) {
    return (
        <>
            <Col
                span={12}
                style={{marginBottom: '10px'}}
            >
                {label}:
            </Col>

            <Col
                span={12}
                style={{marginBottom: '10px'}}
            >
                {value}
            </Col>
        </>
    )
}