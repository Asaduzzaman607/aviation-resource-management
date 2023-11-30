import React from 'react';
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import stockInwardService from "../../../service/StockInwardService";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Row} from "antd";
import CommonLayout from "../../layout/CommonLayout";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import { FileOutlined } from '@ant-design/icons';
import {getFileExtension, getFileName} from "../../../lib/common/helpers";

const StockInwardDetails = () => {
    let {id} = useParams();
    const [singleData, setSingleData] = useState([]);

    const loadSingleData = async () => {
        const {data} = await stockInwardService.getStockInwardById(id)
        setSingleData(data);
    };
    useEffect(() => {
        if (!id) return
        loadSingleData().catch(console.error);
    }, [id]);
    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <Link to='/frs'>
                            <i className="fa fa-file-certificate"/>&nbsp; FRS
                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item><Link to='/frs/stock-inwards'>
                        Stock Inward
                    </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        Stock Inward Details
                    </Breadcrumb.Item>

                </Breadcrumb>
            </ARMBreadCrumbs>
<ARMCard title={getLinkAndTitle("Stock Inward Details",'/frs/stock-inwards')}>
    <Row>
        <Col span={24} md={12}>
            <Row>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    Serial No. :
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.serialNo ? singleData?.serialNo : 'N/A'}
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    Invoice No :
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.invoiceNo ? singleData?.invoiceNo : 'N/A'}
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    No. of Item :
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.noOfItems ? singleData?.noOfItems  : 'N/A'}
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    Packing Mode :
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.packingMode ? singleData?.packingMode  : 'N/A'}
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    Import No :
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.importNo ? singleData?.importNo : 'N/A'}
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    Tpt Mode :
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.tptMode ? singleData?.tptMode : 'N/A'}
                </Col><Col span={12} style={{ marginBottom: "10px" }}>
                    Weight :
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.weight ? singleData?.weight : 'N/A'}
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    Discrepancy Report No :
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.discrepancyReportNo ? singleData?.discrepancyReportNo : 'N/A'}
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    Remarks :
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.remarks ? singleData?.remarks : 'N/A'}
                </Col>
            </Row>
        </Col>

        <Col span={24} md={12}>
            <Row>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    Airways Bill :
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.airwaysBill ? singleData?.airwaysBill: 'N/A'}
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    Flight No :
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.flightNo ? singleData?.flightNo: 'N/A'}
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    Arrival Date:
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.arrivalDate ? singleData?.arrivalDate : 'N/A'}
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    Import Date:
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.importDate ? singleData?.importDate : 'N/A'}
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                Receive Date:
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.receiveDate ? singleData?.receiveDate : 'N/A'}
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                Receiver Name:
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.receiverName ? singleData?.receiverName : 'N/A'}
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    Description:
                </Col>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.description ? singleData?.description : 'N/A'}
                </Col>
                {
                    <>
                        <Col span={12} style={{ marginBottom: "10px" }}>
                            Documents:
                        </Col>
                        <Col span={12} style={{ marginBottom: '10px' }}>
                            {singleData?.attachments &&
                              singleData.attachments?.map((file, index) => (
                                <p key={index}>
                                    {getFileExtension(file) ? (
                                      <img
                                        width='30'
                                        height='30'
                                        src={file}
                                        alt='img'
                                      />
                                    ) : (
                                      <FileOutlined style={{ fontSize: '25px' }} />
                                    )}
                                    <a href={file}>
                                        {getFileName(file)}
                                    </a>
                                </p>
                              ))}
                        </Col>
                    </>
                }
            </Row>
        </Col>
    </Row>
</ARMCard>
        </CommonLayout>
    );
};

export default StockInwardDetails;