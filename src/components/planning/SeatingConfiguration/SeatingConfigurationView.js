import { Breadcrumb, Button, Col, Descriptions, Form, Row, Space } from "antd";
import DescriptionsItem from "antd/lib/descriptions/Item";
import Item from "antd/lib/list/Item";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import SeatingConfigurationService from "../../../service/SeatingConfigurationService";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";

const SeatingConfigurationView = () => {
  let { sId } = useParams();
  const [singleData, setSingleData] = useState();
  const loadSingleData = async () => {
    const { data } = await SeatingConfigurationService.singleData(sId);
    setSingleData(data);
  };
  useEffect(() => {
    loadSingleData();
  }, [sId]);

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
            <Link to="/planning/seating-configurations">
              {t("planning.Seating Configurations.Seating Configurations")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("common.Details")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard
        title={getLinkAndTitle(
          `Seating configuration details`,
          `/planning/seating-configurations`,
          false,
          "PLANNING_AIRCRAFT_SEATING_CONFIGURATION_SEARCH"
        )}
      >
        <Row>
          <Col span={24} md={12}>
            <Row>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircrafts.Aircraft Name")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.aircraftName}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Seating Configurations.Cabin")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.cabinInfo}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
               {t("planning.Seating Configurations.Number of Seat")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.numOfSeats}
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

export default SeatingConfigurationView;
