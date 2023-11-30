import React from "react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import { Breadcrumb, Col, Row } from "antd";
import ARMCard from "../../../common/ARMCard";
import { getLinkAndTitle } from "../../../../lib/common/TitleOrLink";
import PartsServices from "../../../../service/PartsServices";
import { join } from "lodash";
import { useTranslation } from "react-i18next";

const PartsDetails = () => {
  let { partId } = useParams();
  const [singleData, setSingleData] = useState();
  const loadSingleData = async () => {
    const { data } = await PartsServices.getPartById(partId);
    setSingleData(data);
    console.log({ data });
  };

  useEffect(() => {
    (async () => {
      await loadSingleData();
    })();
  }, []);

  const element = singleData?.alternateParts?.map((item, index) => (
    <>
      {item?.partNo}
      {index === singleData?.alternateParts?.length - 1 ? "" : ", "}
    </>
  ));
  const selectClassification = (id) => {
    switch (id) {
      case 1:
        return "ROTABLE";
      case 2:
        return "CONSUMABLE";
      case 3:
        return "EXPENDABLE";
      default:
        return null;
    }
  };
  const LifeLimitUnit = (id) => {
    switch (id) {
      case 1:
        return "FH";
      case 2:
        return "FC";
      case 3:
        return "AH";
      case 4:
        return "AC";
      case 5:
        return "DY";
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
            <i className="fas fa-chart-line" />
            <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/parts">{t("planning.Parts.Parts")}</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("common.Details")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard
        title={getLinkAndTitle(
          `${t("planning.Parts.Part")} ${t("common.Details")}`,
          `/planning/parts`
        )}
      >
        <Row>
          <Col span={24} md={12}>
            <Row>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Parts.Classification")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {selectClassification(singleData?.classification)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Aircraft Model :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.aircraftModelName}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Models.Model Name")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.modelName}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Count Factor :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.countFactor}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Parts.Part No")} :
              </Col>

              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.partNo}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Parts.Description")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.description}
              </Col>

              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Parts.Unit of Measure")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.unitOfMeasureCode}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Parts.Alternate Parts")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>{element}</Col>

              {singleData?.modelType == 3 ||
              singleData?.modelType == 6 ||
              singleData?.modelType == 7 ||
              singleData?.modelType == 8 ||
              singleData?.modelType == 9 ||
              singleData?.modelType == 12 ||
              singleData?.modelType == 13 ? (
                <>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {t("planning.Parts.Life Limit")} :
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {singleData?.lifeLimit}
                  </Col>
                </>
              ) : null}
              {singleData?.modelType == 3 ||
              singleData?.modelType == 6 ||
              singleData?.modelType == 7 ||
              singleData?.modelType == 8 ||
              singleData?.modelType == 9 ||
              singleData?.modelType == 12 ||
              singleData?.modelType == 13 ? (
                <>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {t("planning.Parts.Life Limit Unit")} :
                  </Col>
                  <Col span={12} style={{ marginBottom: "10px" }}>
                    {LifeLimitUnit(singleData?.lifeLimitUnit)}
                  </Col>
                </>
              ) : null}
            </Row>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default PartsDetails;
