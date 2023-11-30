import { ProfileOutlined } from "@ant-design/icons";
import { Breadcrumb, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import API from "../../../service/Api";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import { DateFormat } from "../../planning/report/Common";

const IncidentDetails = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState();

  const loadSingleData = async (id) => {
    const { data } = await API.get(`aircraft-incidents/${id}`);
    setSingleData(data);
  };

  useEffect(() => {
    if(!id) return ;
    loadSingleData(id);
  }, [id]);

  const selectClassification = (id) => {
    switch (id) {
      case 0:
        return "TAKE OFF ABANDONED";
      case 1:
        return "RETURNS BEFORE TAKE OFF";
      case 2:
        return "RETURNS AFTER TAKE OFF";
      case 3:
        return "ENGINE SHUT DOWN IN FLIGHT";
      case 4:
        return "FIRE WARNING LIGHT";
      case 5:
        return "FUEL DUMPING";
      case 6:
        return "OTHER REPORTABLE DEFECT";
      case 7:
        return "TURBULENCE";
      case 8:
        return "LIGHTNING STRIKE";
      case 9:
        return "BIRD STRIKE JACKAL HIT";
      case 10:
        return "FOREIGN OBJECT DAMAGE";
      case 11:
        return "AC DAMAGED BY GROUND EQPT";
      case 12:
        return "OTHER";
      default:
        return null;
    }
  };

  const selectIncidentType = (id) => {
    switch (id) {
      case 0:
        return "TECHNICAL INCIDENTS";
      case 1:
        return "NON TECHNICAL INCIDENTS";
      default:
        return null;
    }
  };
  

  const { t } = useTranslation();

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <ProfileOutlined />
            <Link to="/reliability">&nbsp; Reliability</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/reliability/incident">
             Aircraft Incidents
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("common.Details")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard
        title={getLinkAndTitle(
          "Aircraft Incident Details",
          `/reliability/incident`
        )}
      >
        <Row>
          <Col span={24} md={12}>
            <Row>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Aircraft Name :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.aircraftName}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Date :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {DateFormat(singleData?.date)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Incident Type :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {selectIncidentType(singleData?.incidentTypeEnum)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Classification :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {selectClassification(singleData?.classificationTypeEnum)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Incident Description :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.incidentDesc}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Action Description :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.actionDesc}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Reference Atl :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.referenceAtl}
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

export default IncidentDetails;
