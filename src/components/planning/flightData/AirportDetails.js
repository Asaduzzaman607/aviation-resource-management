import React from 'react';
import CommonLayout from "../../layout/CommonLayout";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Row} from "antd";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import AirportService from "../../../service/AirportService";
import { useTranslation } from 'react-i18next';

const AirportDetails = () => {
    let { id } = useParams();
    const [singleData, setSingleData] = useState();
    const loadSingleData = async () => {
        const { data } = await AirportService.getAirportById(id);
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
                        <Link to="/planning/airports">
                            {t("planning.Airports.Airports")}

                        </Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>{t("common.Details")}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <ARMCard
                title={getLinkAndTitle(
                    `Airport Details`,
                    `/planning/airports`,
                    false,
                    "PLANNING_CONFIGURATIONS_AIRPORT_SEARCH"
                )}
            >
                <Row>
                    <Col span={24} md={12}>
                        <Row>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                {t("planning.Airports.Airport")} :
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                {singleData?.name}
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                               {t("planning.Airports.IATA Code")} :
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                {singleData?.iataCode}
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                               {t("planning.Airports.Country Code")} :
                            </Col>
                            <Col span={12} style={{ marginBottom: "10px" }}>
                                {singleData?.countryCode}
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

export default AirportDetails;
