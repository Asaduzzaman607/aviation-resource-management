import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import ModelsService from "../../../service/ModelsService";
import {useTranslation} from "react-i18next";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Row} from "antd";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import LastShopInfoServices from "../../../service/LastShopInfoServices";
import { HourFormat } from "../report/Common";

const LastShopInfoDetails = () => {
    let { id } = useParams();
    const [singleData, setSingleData] = useState();
    const loadSingleData = async () => {
        const { data } = await LastShopInfoServices.getLastShopById(id);
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
                        <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        <Link to="/planning/last-shop-info">Last Shop Information</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>{t("common.Details")}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <ARMCard title={getLinkAndTitle(`Last Shop Info details`, `/planning/last-shop-info`,false,"")}>
                <Row>
                    <Col span={24} md={12}>
                        <Row>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                Aircraft Name :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.aircraftName}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                Model :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.model}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                TSN :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {HourFormat(singleData?.tsn)}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                               CSN :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.csn}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                               TSR :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {HourFormat(singleData?.tsr)}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                               CSR :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.csr}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                Status :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.status}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </ARMCard>
        </CommonLayout>
    );
};

export default LastShopInfoDetails;
