import { Breadcrumb, Col, notification, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getErrorMessage } from "../../../../lib/common/helpers";
import {
  getLinkAndTitle,
  LinkAndTitle,
} from "../../../../lib/common/TitleOrLink";
import AircraftService from "../../../../service/AircraftService";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import ARMCard from "../../../common/ARMCard";
import CommonLayout from "../../../layout/CommonLayout";
import { useTranslation } from "react-i18next";
import { formatTimeValue } from "../../../../lib/common/presentation";
import { DateFormat } from "../../report/Common";

const AircraftView = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState();

  const loadSingleData = async (id) => {
    try {
      const { data } = await AircraftService.getAircraftById(id);
      setSingleData(data);
    } catch (er) {
      notification["er"]({ message: getErrorMessage(er) });
    }
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      await loadSingleData(id);
    })();
  }, []);

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
            <Link to="/planning/aircraft">
              {t("planning.Aircrafts.Aircrafts")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("common.View")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={
          <LinkAndTitle
            title={t("planning.Aircrafts.Aircraft Details")}
            link="/planning/aircraft"
            addBtn={false}
            permission="PLANNING_AIRCRAFT_AIRCRAFT_SEARCH"
          />
        }
      >
        <Row>
          <Col span={24} md={12} style={{overflowWrap:"break-word"}}>
            <Row>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircrafts.A/C Type")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.aircraftModelName}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircrafts.Aircraft Name")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.aircraftName}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircrafts.Aircraft Serial No")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.airframeSerial}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircrafts.Aircraft Total Time")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {formatTimeValue(singleData?.airFrameTotalTime)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircrafts.Aircraft Total Cycle")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.airframeTotalCycle}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircrafts.Bangladesh Total Time")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {formatTimeValue(singleData?.bdTotalTime)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircrafts.Bangladesh Total Cycle")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.bdTotalCycle}
              </Col>
            </Row>
          </Col>

          <Col span={24} md={12} style={{overflowWrap:"break-word"}}>
            <Row>
              {" "}
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircrafts.Daily Average Hours")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {formatTimeValue(singleData?.dailyAverageHours)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircrafts.Daily Average Cycle")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.dailyAverageCycle}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                A Check Done Hour :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {formatTimeValue(singleData?.aircraftCheckDoneHour)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                A Check Done Date :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {DateFormat(singleData?.aircraftCheckDoneDate)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircrafts.Date of Manufacture")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {DateFormat(singleData?.manufactureDate)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Induction date :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {DateFormat(singleData?.inductionDate)}
              </Col>
              {singleData?.totalApuHours != -1 && (
                <>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {t("planning.Aircrafts.Total Apu Hours")} :
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {formatTimeValue(singleData?.totalApuHours)}
                  </Col>
                </>
              )}
              {singleData?.totalApuCycle != -1 && (
                <>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {t("planning.Aircrafts.Total Apu Cycle")} :
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.totalApuCycle}
                  </Col>
                </>
              )}
              {singleData?.dailyAverageApuHours != -1 && (
                <>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {t("planning.Aircrafts.Daily Average Apu Hours")} :
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {formatTimeValue(singleData?.dailyAverageApuHours)}
                  </Col>
                </>
              )}
              {singleData?.dailyAverageApuCycle != -1 && (
                <>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {t("planning.Aircrafts.Daily Average Apu Cycle")} :
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.dailyAverageApuCycle}
                  </Col>
                </>
              )}
  
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircrafts.Engine Type")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.engineType}
              </Col>
  
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircrafts.Propeller Type")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.propellerType}
              </Col>
              
            </Row>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default AircraftView;
