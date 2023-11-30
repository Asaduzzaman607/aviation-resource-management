import {
  Breadcrumb,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Space,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import ARMForm from "../../../lib/common/ARMForm";
import { getErrorMessage } from "../../../lib/common/helpers";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import useCabin from "../../../lib/hooks/planning/useCabin";
import CabinService from "../../../service/CabinService";
import Permission from "../../auth/Permission";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import CommonLayout from "../../layout/CommonLayout";
import ARMCabin from "./ARMCabin";

const Cabin = () => {
  const { id, t, form, onFinish, onReset  } = useCabin()

  let title = id ? `${t("planning.Cabins.Cabin")} ${t("common.Edit")}` : `${t("planning.Cabins.Cabin")} ${t("common.Add")}`;

  return (
    <div>
      <CommonLayout>
        <ARMBreadCrumbs>
          <Breadcrumb separator="/">
            <Breadcrumb.Item>
              <i className="fas fa-chart-line" />
              <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              <Link to="/planning/cabins">{t("planning.Cabins.Cabins")}</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item> {id ? t("common.Edit") : t("common.Add")}</Breadcrumb.Item>
          </Breadcrumb>
        </ARMBreadCrumbs>
        <Permission permission={["PLANNING_CONFIGURATIONS_CABIN_SEAT_TYPE_SAVE","PLANNING_CONFIGURATIONS_CABIN_SEAT_TYPE_EDIT"]} showFallback>
        <ARMCard title={getLinkAndTitle(title, `/planning/cabins`,false,"PLANNING_CONFIGURATIONS_CABIN_SEAT_TYPE_SAVE")}>
          <Row>
            <Col span={10}>
              <ARMCabin
                form={form}
                onFinish={onFinish}
                onReset={onReset}
                id={id}
              />
            </Col>
          </Row>
        </ARMCard>
        </Permission>
      </CommonLayout>
    </div>
  );
};

export default Cabin;
