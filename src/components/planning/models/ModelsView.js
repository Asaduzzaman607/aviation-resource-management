import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Col, Descriptions, Form, Row, Space } from "antd";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import { Link, useParams } from "react-router-dom";
import CommonLayout from "../../layout/CommonLayout";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import ModelsService from "../../../service/ModelsService";
import { useTranslation } from "react-i18next";

const ModelsView = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState();
  const [modelType, setModelType] = useState([]);
  let modelTypeName;
  const getAllModelType = async () => {
    let data = [
      { id: 0, name: "AF TCI" },
      { id: 1, name: "COMPONENT" },
      { id: 2, name: "ENGINE" },
      { id: 3, name: "ENGINE LLP" },
      { id: 4, name: "ENGINE LRU" },
      { id: 5, name: "ENGINE TCI" },
      { id: 6, name: "MLG LLP" },
      { id: 7, name: "NLG" },
      { id: 8, name: "MLG" },
      { id: 9, name: "NLG LLP" },
      { id: 10, name: "PROPELLER" },
      { id: 11, name: "PROPELLER TCI" },
      { id:12,  name: "AF LLP"},
      { id:13,  name: "APU LLP"},
      { id:14,  name: "APU LRU"},
      { id:15,  name: "APU TCI"},
      { id:16, name : "ENGINE TMM"},
      { id:17, name : "ENGINE RGB"},
      { id:18, name : "APU"},
      { id:19, name : "CONSUMABLE MODEL"}
    ];
    setModelType(data);
  };

  useEffect(()=>{
    getAllModelType();
  },[])
  const loadSingleData = async () => {
    const { data } = await ModelsService.singleData(id);
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
            <Link to="/planning/models">{t("planning.Models.Models")}</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("common.Details")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard title={getLinkAndTitle(`Models details`, `/planning/models`,false,"PLANNING_AIRCRAFT_MODEL_SEARCH")}>
        <Row>
          <Col span={24} md={12}>
            <Row>
              <Col span={6} style={{ marginBottom: "10px" }}>
               {t("planning.Aircrafts.A/C Type")} :
              </Col>
              <Col span={18} style={{ marginBottom: "10px" }}>
                {singleData?.aircraftModelName}
              </Col>
              <Col span={6} style={{ marginBottom: "10px" }}>
                {t("planning.Models.Model Type")} :
              </Col>
              <Col span={18} style={{ marginBottom: "10px" }}>
                {
                  modelType?.map((item)=>{
                    if(item.id==singleData?.modelType){
                      modelTypeName=item.name;
                      return;
                    }
                  })
                }
                {modelTypeName}

               
              </Col>
              <Col span={6} style={{ marginBottom: "10px" }}>
                {t("planning.Models.Model Name")} :
              </Col>
              <Col span={18} style={{ marginBottom: "10px" }}>
                {singleData?.modelName}
              </Col>
            </Row>
          </Col>

          <Col span={24} md={12}>
            <Row>
              <Col span={6} style={{ marginBottom: "10px" }}>
                {t("planning.Models.Version")} :
              </Col>
              <Col span={18} style={{ marginBottom: "10px" }}>
                {singleData?.version}
              </Col>
              <Col span={6} style={{ marginBottom: "10px" }}>
                {t("planning.Models.Life Code")} :
              </Col>
              <Col span={18} style={{ marginBottom: "10px" }}>
                {singleData?.lifeCodesValue.join(" , ")}
              </Col>
              <Col span={6} style={{ marginBottom: "10px" }}>
                {t("planning.Models.Description")} :
              </Col>
              <Col span={18} style={{ marginBottom: "10px" }}>
                {singleData?.description}
              </Col>
            </Row>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default ModelsView;
