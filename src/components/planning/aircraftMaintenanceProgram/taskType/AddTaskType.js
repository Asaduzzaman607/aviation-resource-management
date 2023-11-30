import React from 'react';
import { useTranslation } from 'react-i18next';
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Row} from "antd";
import {Link} from "react-router-dom";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import ARMCard from "../../../common/ARMCard";
import AddTaskTypeForm from "./AddTaskTypeForm";
import {useTaskTypes} from "../../../../lib/hooks/planning/useTaskTypes";
import Permission from '../../../auth/Permission';


const AddTaskType = () => {

  const { form, id, onReset, onFinish } = useTaskTypes();
  const PAGE_TITLE = id ? "TASK TYPE EDIT" : "TASK TYPE ADD";
  const { t } = useTranslation();
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" />
              &nbsp; {t("planning.Planning")}
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/task-type">Task Type</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{!id ? t("common.Add") : t("common.Edit")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <Permission permission={["PLANNING_SCHEDULE_TASKS_TASK_TYPE_SAVE","PLANNING_SCHEDULE_TASKS_TASK_TYPE_EDIT"]} showFallback>
      <ARMCard title={getLinkAndTitle(PAGE_TITLE, "/planning/task-type/",false,"PLANNING_SCHEDULE_TASKS_TASK_TYPE_SAVE")}>
            <AddTaskTypeForm form={form} onFinish={onFinish} onReset={onReset} id={id} />
      </ARMCard>
      </Permission>
    </CommonLayout>
  );
};

export default AddTaskType;
