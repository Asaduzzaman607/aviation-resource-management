import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Row} from "antd";
import ARMCard from "../../../common/ARMCard";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import InterruptionServices from "../../../../service/InterruptionServices";
import {DateFormat} from "../../../planning/report/Common";

const InterruptionDetails = () => {
    let { intId : id } = useParams();
    const [singleData, setSingleData] = useState();
    const loadSingleData = async () => {
        const { data } = await InterruptionServices.getInterruptionById(id);
        setSingleData(data);
    };
    useEffect(() => {
        loadSingleData();
    }, [id]);

    const { t } = useTranslation()

    return (
        <CommonLayout>
            <ARMBreadCrumbs>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item>
                        <i className="fas fa-chart-line" />
                        <Link to="/reliability">&nbsp; Reliability</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        <Link to="/reliability/interruption">Interruption</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>{t("common.Details")}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <ARMCard title={getLinkAndTitle(`Interruption details`, `/reliability/interruption`,false,"")}>
                <Row>
                    <Col span={24} md={12}>
                        <Row>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                Aircraft :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.aircraftName}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                Location :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.locationName}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                Date :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {DateFormat(singleData?.date)}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                Defect Description :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.defectDescription}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                Rectification Description :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.rectDescription}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                Duration :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.duration}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </ARMCard>
        </CommonLayout>
    );
};

export default InterruptionDetails;
