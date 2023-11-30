import React from 'react';
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Row} from "antd";
import ARMCard from "../../../common/ARMCard";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import { useTranslation } from 'react-i18next';
import TaskDoneServices from "../../../../service/TaskDoneServices";
import { DateFormat } from '../../report/Common';

const TaskDoneDetails = () => {
  let {id} = useParams();
  const [singleData, setSingleData] = useState();
  const loadSingleData = async () => {
    const {data} = await TaskDoneServices.getTaskDoneById(id);
    setSingleData(data);
  };
  useEffect(() => {
    loadSingleData();
  }, [id]);

  const formatHour = (value, isApu) => {
    if (value && isApu) {
        return Number(value).toFixed(2).replace(".", ":") + ' AH';
    }if (value && !isApu) {
        return Number(value).toFixed(2).replace(".", ":") + ' FH';
    } 
    return "";
};


  const formatCycle = (value, isApu) => {
    if (value && isApu) {
      return `${value} AC`
    }
    if (value && !isApu) {
      return `${value} FC`
    }
    return ''
  }

  const { t } = useTranslation()

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-chart-line"/>
            <Link to="/planning">&nbsp; {t("planning.Planning")}</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/task-done-list">
              {t("planning.Task Done.Task Done")}

            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("planning.Task Done.Task Done")} {t("common.Details")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard
        title={getLinkAndTitle(
          `${t("planning.Task Done.Task Done")} ${t("common.Details")}`,
          `/planning/task-done-list`,
          false,
          "PLANNING_SCHEDULE_TASKS_TASK_DONE_SEARCH"
        )}
      >
        <Row>
          <Col span={24} md={12}>
            <Row>
              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Done.Aircraft")} :
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {singleData?.aircraftName}
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Done.Task No")} :
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {singleData?.taskNo}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Done.Part")} :
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {singleData?.partNo}
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Done.Serial No.")} :
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {singleData?.serialNo}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Done.Position")} :
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {singleData?.position}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Done.Done Date")} :
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {DateFormat(singleData?.doneDate)}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Done.Done Hours")} :
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {formatHour(singleData?.doneHour, singleData?.isApuControl)}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Done.Done Cycle")} :
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {formatCycle(singleData?.doneCycle, singleData?.isApuControl)}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                Remark :
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {singleData?.remark}
              </Col>
            </Row>
          </Col>

          <Col span={24} md={12}>
            <Row>
            </Row>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default TaskDoneDetails;
