import { useParamsId } from "../../../lib/hooks/common";
import { Breadcrumb, Col, Form, Input, notification, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CabinService from "../../../service/CabinService";
import { getErrorMessage } from "../../../lib/common/helpers";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import { LinkAndTitle } from "../../../lib/common/TitleOrLink";
import ARMForm from "../../../lib/common/ARMForm";
import ARMButton from "../../common/buttons/ARMButton";
import API from "../../../service/Api";
import { notifyResponseError, notifySuccess } from "../../../lib/common/notifications";
import { useChecksAdd } from "./useChecksAdd";
import { useTranslation } from "react-i18next";
import ChecksAddForm from "./ChecksAddForm";
import Permission from "../../auth/Permission";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

type TITLE = "Check Edit" | "Check Add";
type ADD_OR_EDIT = "Add" | "Edit";

export default function ChecksAdd() {
  const { id, form, initFetchCheckById, handleSubmit, handleReset } = useChecksAdd();
  const title: TITLE = id ? "Check Edit" : "Check Add"
  const BREADCRUMB_TITLE: ADD_OR_EDIT = id ? "Edit" : "Add";

  useEffect(() => {
    if (!id) return;

    (async () => {
      await initFetchCheckById(id);
    })();
  }, [id])

  const { t } = useTranslation()

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
              <Link to="/planning/checks">{t("planning.Checks.Checks")}</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>{BREADCRUMB_TITLE}</Breadcrumb.Item>
          </Breadcrumb>
        </ARMBreadCrumbs>

        <Permission permission={["PLANNING_CHECK_CHECK_SAVE","PLANNING_CHECK_CHECK_EDIT"]} showFallback>
        <ARMCard title={<LinkAndTitle title={title} link="/planning/checks" addBtn={false} permission="PLANNING_CHECK_CHECK_SAVE" />}>
          <ChecksAddForm
            id={id}
            form={form}
            handleSubmit={handleSubmit}
            handleReset={handleReset}
            layout={layout}
            validateMessages={validateMessages}
          ></ChecksAddForm>
        </ARMCard>
        </Permission>
      </CommonLayout>
    </div>
  );
}