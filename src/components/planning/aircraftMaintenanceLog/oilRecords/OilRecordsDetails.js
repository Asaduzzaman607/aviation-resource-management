import React from 'react';
import {Breadcrumb, Col, Row} from "antd";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import CommonLayout from "../../../layout/CommonLayout";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import ARMCard from "../../../common/ARMCard";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import PropellerServices from "../../../../service/PropellerServices";

const OilRecordsDetails = () => {
    let { id } = useParams();
    const [singleData, setSingleData] = useState();
    const loadSingleData = async () => {
        const { data } = await PropellerServices.getPropellerById(id);
        setSingleData(data);
    };
    useEffect(() => {
        loadSingleData();
    }, [id]);


    console.log('singleData', singleData)
    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <i className="fas fa-chart-line" />
                        <Link to="/planning">&nbsp; Planning</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        <Link to="/planning/propellers">
                            Propeller

                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>View</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <ARMCard
                title={getLinkAndTitle(
                    `Propeller details`,
                    `/planning/propellers`
                )}
            >
                <Row>
                    <Col span={24} md={12}>
                        <Row>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                Nomen Clature :
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                {singleData?.nomenClature}
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                Current TSN:
                            </Col>

                            <Col span={12} style={{ marginBottom: "10px" }}>
                                {singleData?.currentTsn}
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                Current TSO :
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                {singleData?.currentTso}
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                Estimated Date :
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                {singleData?.estimatedDate}
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                Installation TSN :
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                {singleData?.installationTsn}
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                Installation TSO :
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                {singleData?.installationTso}
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                Limit Month :
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                {singleData?.limitMonth}
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                Limit FH :
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                {singleData?.limitFh}
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                Part No :
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                {singleData?.partNo}
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                serialNo :
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                {singleData?.serialNo}
                            </Col>
                        </Row>
                    </Col>

                    <Col span={24} md={12}>
                        <Row></Row>
                    </Col>
                </Row>
            </ARMCard>
        </CommonLayout>
    );
};

export default OilRecordsDetails;
