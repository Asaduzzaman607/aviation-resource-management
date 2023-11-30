import { Breadcrumb, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import API from "../../../service/Api";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import { DateFormat, HourFormat, ViewDateFormat } from "../report/Common";

const EngineTimesView = () => {
  let { aircraftBuildId } = useParams();
  const [singleData, setSingleData] = useState();

  const getSingleData = async () => {
    try {
      const { data } = await API.get(
        `engine/find-by-aircraft-build/${aircraftBuildId}`
      );
      setSingleData(data);
    } catch (er) {}
  };
  useEffect(() => {
    if (!aircraftBuildId) {
      return;
    }
    (async () => {
      await getSingleData();
    })();
  },[aircraftBuildId]);

  const { t } = useTranslation();
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-chart-line" />
            <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/engine/times">Engine Information</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("common.View")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard
        title={getLinkAndTitle(
          `Engine Information ${t("common.Details")}`,
          `/planning/engine/times`,
          false,
          "PLANNING_ENGINE_PROPELLER_LANDING_GEAR_ENGINE_INFORMATION_SEARCH"
        )}
      >
        <Row>
          <Col span={24} md={24}>
            <Row>
              <Col span={6} style={{ marginBottom: "10px" }}>
                Aircraft name:
              </Col>
              <Col span={4} style={{ marginBottom: "10px" }}>
                {singleData?.aircraftName}
              </Col>
            </Row>
            <Row>
              <Col span={6} style={{ marginBottom: "10px" }}>
                Name Extension:
              </Col>
              <Col span={4} style={{ marginBottom: "10px" }}>
                {singleData?.engineTimeViewModels[0].nameExtension}
              </Col>
            </Row>
            <Row>
              <Col span={6} style={{ marginBottom: "10px" }}>
                Position name:
              </Col>
              <Col span={4} style={{ marginBottom: "10px" }}>
                {singleData?.position}
              </Col>
            </Row>
          </Col>
          <Col span={24} md={12}>
            <h4>
              <b>Shop Visit TMM</b>
            </h4>
            <Row>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Date:
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {DateFormat(singleData?.engineShopVisitViewModels[0]?.date)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                TSN :
              </Col>

              <Col span={12} style={{ marginBottom: "10px" }}>
                {HourFormat(singleData?.engineShopVisitViewModels[0]?.tsn)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                CSN :
              </Col>

              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.engineShopVisitViewModels[0]?.csn}
              </Col>

              <Col span={12} style={{ marginBottom: "10px" }}>
                TSO :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {HourFormat(singleData?.engineShopVisitViewModels[0]?.tso)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                CSO :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.engineShopVisitViewModels[0]?.cso}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Status :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.engineShopVisitViewModels[0]?.status}
              </Col>
            </Row>

            <h4>
              <b>Engine Times TMM</b>
            </h4>
            <Row>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Date :
              </Col>

              <Col span={12} style={{ marginBottom: "10px" }}>
                {DateFormat(singleData?.engineTimeViewModels[0].date)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Hour :
              </Col>

              <Col span={12} style={{ marginBottom: "10px" }}>
                {HourFormat(singleData?.engineTimeViewModels[0].hour)}
              </Col>

              <Col span={12} style={{ marginBottom: "10px" }}>
                Cycle :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.engineTimeViewModels[0].cycle}
              </Col>
            </Row>
          </Col>
          <Col span={24} md={12}>
            <h4>
              <b>Shop Visit RGB</b>
            </h4>
            <Row>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Date:
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {DateFormat(singleData?.engineShopVisitViewModels[1]?.date)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                TSN :
              </Col>

              <Col span={12} style={{ marginBottom: "10px" }}>
                {HourFormat(singleData?.engineShopVisitViewModels[1]?.tsn)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                CSN :
              </Col>

              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.engineShopVisitViewModels[1]?.csn}
              </Col>

              <Col span={12} style={{ marginBottom: "10px" }}>
                TSO :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {HourFormat(singleData?.engineShopVisitViewModels[1]?.tso)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                CSO :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.engineShopVisitViewModels[1]?.cso}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Status :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.engineShopVisitViewModels[1]?.status}
              </Col>
            </Row>
            <h4>
              <b>Engine Times RGB</b>
            </h4>
            <Row>
              
              <Col span={12} style={{ marginBottom: "10px" }}>
                Date :
              </Col>

              <Col span={12} style={{ marginBottom: "10px" }}>
                {DateFormat(singleData?.engineTimeViewModels[1].date)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Hour :
              </Col>

              <Col span={12} style={{ marginBottom: "10px" }}>
                {HourFormat(singleData?.engineTimeViewModels[1].hour)}
              </Col>

              <Col span={12} style={{ marginBottom: "10px" }}>
                Cycle :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.engineTimeViewModels[1].cycle}
              </Col>
            </Row>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default EngineTimesView;
