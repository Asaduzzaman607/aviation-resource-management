import React from 'react';
import CommonLayout from "../../layout/CommonLayout";
import {Breadcrumb, Col, Row} from "antd";
import ARMCard from "../../common/ARMCard";
import {Link} from "react-router-dom";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import AddAirportForm from "./AddAirportForm";
import useAddAirport from "../../../lib/hooks/planning/useAddAirport";
import { useTranslation } from 'react-i18next';
import Permission from "../../auth/Permission";



const AddAirport = () => {
  
  const { form, id, onReset, onFinish } = useAddAirport();
  const { t } = useTranslation();
  const PAGE_TITLE = id ? `${t("planning.Airports.Airport")} ${t("common.Edit")}` : `${t("planning.Airports.Airport")} ${t("common.Add")}`;
    return (
      <CommonLayout>
        <ARMBreadCrumbs>
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              {" "}
              <Link to="/planning">
                {" "}
                <i className="fas fa-chart-line" />
                &nbsp; {t("planning.Planning")}
              </Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              <Link to="/planning/airports">{t("planning.Airports.Airports")}</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>{!id ? t("common.Add") : t("common.Edit")}</Breadcrumb.Item>
          </Breadcrumb>
        </ARMBreadCrumbs>
        <Permission permission={["PLANNING_CONFIGURATIONS_AIRPORT_SAVE","PLANNING_CONFIGURATIONS_AIRPORT_EDIT"]} showFallback>
        <ARMCard title={getLinkAndTitle(PAGE_TITLE, "/planning/airports/",false,"PLANNING_CONFIGURATIONS_AIRPORT_SAVE")}>
          <Row>
            <Col sm={20} md={10}>
              <AddAirportForm form={form} onFinish={onFinish} onReset={onReset} id={id} />
            </Col>
          </Row>
        </ARMCard>
        </Permission>
      </CommonLayout>
    );
};

export default AddAirport;
