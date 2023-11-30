import React from 'react';
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import CommonLayout from "../../../layout/CommonLayout";
import ARMBreadCrumbs from "../../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Row} from "antd";
import ARMCard from "../../../common/ARMCard";
import {getLinkAndTitle} from "../../../../lib/common/TitleOrLink";
import TaskRecordServices from "../../../../service/TaskRecordServices";
import { useTranslation } from 'react-i18next';
import { DateFormat } from '../../report/Common';

const TaskRecordDetails = () => {
  let {taskId} = useParams();
  const [singleData, setSingleData] = useState();
  const loadSingleData = async () => {
    const {data} = await TaskRecordServices.getTaskById(taskId);
    setSingleData(data);
  };
  useEffect(() => {
    loadSingleData();
  }, [taskId]);



  const convertStatus = (statusId) => {
    switch (statusId) {
      case 0:
        return 'OPEN'

      case 1:
        return 'CLOSED'

      case 2:
        return 'REP'

      default:
        return 0
    }

  }





  const filteredApplicable = singleData?.effectiveAircraftViewModels?.filter(e => e.effectivityType === 1)
  const filteredNonApplicable = singleData?.effectiveAircraftViewModels?.filter(e => e.effectivityType === 0)
  const applicableEffectivity = filteredApplicable?.map(app => app.aircraftName)
  const applicable = applicableEffectivity?.join(",");
  const nonApplicableEffectivity = filteredNonApplicable?.map(app => app.aircraftName)
  const nonApplicable = nonApplicableEffectivity?.join(",");




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
      return 'AC'
    }
    if (value && !isApu) {
      return 'FC'
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
            <Link to="/planning/task-records">
              {t("planning.Task Records.Task Records")}

            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>{t("planning.Task Records.Task Records")} {t("common.Details")}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard
        title={getLinkAndTitle(
          `${t("planning.Task Records.Task Records")} ${t("common.Details")}`,
          `/planning/task-records`,
          false,
          "PLANNING_SCHEDULE_TASKS_TASK_RECORDS_SEARCH"
        )}
      >
        <Row>
          <Col span={24} md={12}>
            <Row>

              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Records.Task No")} :
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {singleData?.taskNo}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Records.Task Type")} :
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {singleData?.taskTypeName}
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Records.Task Status")} :
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {convertStatus(singleData?.status)}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Records.Task Source")} :
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {singleData?.taskSource}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Records.Effective Date")} :
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {DateFormat(singleData?.effectiveDate)}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Records.Trade")} :
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {singleData?.trade?.map(t => t).join(',')}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
               Man Hours :
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {singleData?.manHours}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Records.Description")} :
              </Col>
              <Col span={12} style={{marginBottom: "10px"}} className='newLineInRow'>
                {singleData?.description}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Records.Threshold")} :
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {formatHour(singleData?.thresholdHour, singleData?.isApuControl)}
                <br/> {singleData?.thresholdCycle} {formatCycle(singleData?.thresholdCycle, singleData?.isApuControl)}
                <br/> {singleData?.thresholdDay} {singleData?.thresholdDay ? 'DY' : ''}
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Records.Interval")} :
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {singleData?.intervalHour} {formatHour(singleData?.intervalHour, singleData?.isApuControl)}
                <br/> {singleData?.intervalCycle} {formatCycle(singleData?.intervalCycle, singleData?.isApuControl)}
                <br/> {singleData?.intervalDay} {singleData?.intervalDay ? 'DY' : ''}

              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Records.Position")} :
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {singleData?.taskProcedureViewModels?.map(t => t.name).filter(v => !!v).join(', ')}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}} className='newLineInRow'>
                {t("planning.Task Records.Job Procedure")} :
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {singleData?.taskProcedureViewModels?.map(t => t.jobProcedure).filter(v => !!v).join(', ')}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Records.Applicable Effectivity")} :
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {applicable}
              </Col>

              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Records.Non-applicable Effectivity")} :
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {nonApplicable}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {t("planning.Task Records.Sources")} :
              </Col>
              <Col span={12} style={{marginBottom: "10px"}} className='newLineInRow'>
                {singleData?.sources}
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

export default TaskRecordDetails;
