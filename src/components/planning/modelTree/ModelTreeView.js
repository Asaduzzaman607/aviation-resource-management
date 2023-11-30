import { Breadcrumb, Col, Row } from "antd";
import { forEach } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import ModelTreeService from "../../../service/ModelTreeService";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";

const ModelTreeView = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState();
  const [aircraftModel, setAircraftModel] = useState([]);

  const loadSingleData = async () => {
    const { data } = await ModelTreeService.singleData(id);
    setSingleData(data);
  };

  useEffect(() => {
    loadSingleData();
  }, [id]);

  const getAllAircraftModel = async () => {
    const { data } =
      await AircraftModelFamilyService.getAllAircraftModelFamily();
    setAircraftModel(data.model);
  };

  useEffect(() => {
    (async () => {
      await getAllAircraftModel();
    })();
  }, []);

  const getAircraftModelName = (aircraftModelId) => {
    let modelName;
    aircraftModel.forEach((item) => {
      if (item.id === aircraftModelId) {
        modelName = item.aircraftModelName;
      }
    });
    return modelName;
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
            <Link to="/planning/model-trees">
              {t("planning.Model Trees.Model Trees")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("common.Details")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard
        title={getLinkAndTitle(
          `${t("planning.Model Trees.Model Tree")} ${t("common.Details")}`,
          `/planning/model-trees`
        )}
      >
        <Row>
          <Col span={24} md={12}>
            <Row>
              <Col span={12} style={{ marginBottom: "10px" }}>
                Aircraft Model :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {getAircraftModelName(singleData?.aircraftModelId)}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Models.Model")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.modelName}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Model Trees.Higher Model")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.higherModelName}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Positions.Position")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.positionName}
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {t("planning.Locations.Location")} :
              </Col>
              <Col span={12} style={{ marginBottom: "10px" }}>
                {singleData?.locationName}
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

export default ModelTreeView;
