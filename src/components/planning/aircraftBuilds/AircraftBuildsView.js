import { Breadcrumb, Col, Row } from "antd";
import { bool } from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { boolean } from "yup";
import { showTrueFalse } from "../../../lib/common/helpers";
import { formatTimeValue } from "../../../lib/common/presentation";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import AircraftBuildsService from "../../../service/AircraftBuildsService";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import { DateFormat, ViewDateFormat } from "../report/Common";

const AircraftBuildsView = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState();

  const loadSingleData = async (id) => {
    const { data } = await AircraftBuildsService.singleData(id);
    setSingleData(data);
  };
  useEffect(() => {
    if (id) {
      loadSingleData(id);
    }
  }, [id]);

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
            <Link to="/planning/aircraft-builds">
              {t("planning.Aircraft Builds.Aircraft Builds")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("common.Details")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard
        title={getLinkAndTitle(
          `${t("planning.Aircraft Builds.Aircraft Build")} ${t(
            "common.Details"
          )}`,
          `/planning/aircraft-builds`,
          false,
          "PLANNING_AIRCRAFT_BUILD_AIRCRAFT_SEARCH"
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
                {t("planning.Aircraft Builds.Higher Model Name")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.higherModelName}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Models.Model Name")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.modelName}
              </Col>

              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircraft Builds.Higher Part")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.higherPartNo}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Parts.Part")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.partNo}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircraft Builds.Higher Serial No")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.higherSerialNo}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircraft Builds.Serial No")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.serialNo}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircraft Builds.Position Name")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.positionName}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircraft Builds.Location Name")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.locationName}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircraft Builds.Installation Date")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {DateFormat(singleData?.attachDate)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircraft Builds.Manufacture Date")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {DateFormat(singleData?.comManufactureDate)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Com {t("planning.Aircraft Builds.Certificate Date")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {DateFormat(singleData?.comCertificateDate)}
              </Col>
            </Row>
          </Col>

          <Col span={24} md={12}>
            <Row>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Input Reference Message :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.inRefMessage}
              </Col>

              {singleData?.isTsnAvailable?
                <>
                <Col span={12} style={{ marginBottom: "10px" }}>
                    {t("planning.Aircraft Builds.TSN")} Hour :
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {formatTimeValue(singleData?.tsnHour?.toFixed(2))}
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {t("planning.Aircraft Builds.TSN")} Cycle :
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.tsnCycle}
                  </Col>
                </>:null
              }

              {singleData?.isOverhauled ? (
                <>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {t("planning.Aircraft Builds.TSO Hour")} :
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {formatTimeValue(singleData?.tsoHour?.toFixed(2))}
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {t("planning.Aircraft Builds.TSO Cycle")} :
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.tsoCycle}
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {t("planning.Aircraft Builds.TSLSV Hour")} :
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {formatTimeValue(singleData?.tslsvHour?.toFixed(2))}
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {t("planning.Aircraft Builds.TSLSV Cycle")} :
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.tslsvCycle}
                  </Col>
                </>
              ) : null}

              {singleData?.isShopVisited ? (
                <>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {t("planning.Aircraft Builds.TSLSV Hour")} :
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {formatTimeValue(singleData?.tslsvHour?.toFixed(2))}
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {t("planning.Aircraft Builds.TSLSV Cycle")} :
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.tslsvCycle}
                  </Col>
                </>
              ) : null}

              {singleData?.isActive == true ? (
                <Col span={12} style={{ marginBottom: "10px" }}>
                  {t("planning.Aircraft Builds.Aircraft In Hour")} :
                </Col>
              ) : (
                <Col span={12} style={{ marginBottom: "10px" }}>
                  {t("planning.Aircraft Builds.Aircraft Out Hour")} :
                </Col>
              )}
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.isActive === true
                  ? formatTimeValue(singleData?.aircraftInHour?.toFixed(2))
                  : formatTimeValue(singleData?.aircraftOutHour?.toFixed(2))}
              </Col>
              {singleData?.isActive == true ? (
                <Col span={12} style={{ marginBottom: "10px" }}>
                  {t("planning.Aircraft Builds.Aircraft In Cycle")} :
                </Col>
              ) : (
                <Col span={12} style={{ marginBottom: "10px" }}>
                  {t("planning.Aircraft Builds.Aircraft Out Cycle")} :
                </Col>
              )}
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.isActive === true
                  ? singleData?.aircraftInCycle
                  : singleData?.aircraftOutCycle}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircraft Builds.Is Overhauled")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {showTrueFalse(singleData?.isOverhauled)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Aircraft Builds.Is Shop Visited")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {showTrueFalse(singleData?.isShopVisited)}
              </Col>
            </Row>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default AircraftBuildsView;
