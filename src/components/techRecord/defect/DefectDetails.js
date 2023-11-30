import {Link, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Row} from "antd";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import {DateFormat} from "../../planning/report/Common";
import {useEffect, useState} from "react";
import DefectServices from "../../../service/DefectServices";

const DefectDetails = () => {
    let { dId : id } = useParams();
    const [singleData, setSingleData] = useState();
    const loadSingleData = async () => {
        const { data } = await DefectServices.getDefectById(id);
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
                        <Link to="/reliability/defect">Defect</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>{t("common.Details")}</Breadcrumb.Item>
                </Breadcrumb>
            </ARMBreadCrumbs>
            <ARMCard title={getLinkAndTitle(`Defect details`, `/reliability/defect`,false,"")}>
                <Row>
                    <Col span={24} md={12}>
                        <Row>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                A/C Reg :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.aircraftName}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                ATA :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.location}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                P/N :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.partNumber}
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
                                {singleData?.defectDesc}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                Action Description :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.actionDesc}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                Nomenclature :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.nomenclature}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                Reference :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.reference}
                            </Col>
                            <Col span={6} style={{ marginBottom: "10px" }}>
                                Defect Type :
                            </Col>
                            <Col span={18} style={{ marginBottom: "10px" }}>
                                {singleData?.defectType === 0 ? 'PIREP' : singleData?.defectType === 1 ? 'MAREP' : ''}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </ARMCard>
        </CommonLayout>
    );
};

export default DefectDetails;
