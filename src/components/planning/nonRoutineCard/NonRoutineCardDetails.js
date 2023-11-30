import React from 'react';
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Row} from "antd";
import {Link, useParams} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";
import CommonLayout from "../../layout/CommonLayout";
import {useEffect, useState} from "react";
import NonRoutineCardServices from "../../../service/NonRoutineCardServices";
import RibbonCard from "../../common/forms/RibbonCard";
import ARMTable from "../../common/ARMTable";
import {useTranslation} from "react-i18next";
import ViewItem from "../../common/view/ViewItem";
import { DateFormat } from '../report/Common';
import moment from 'moment';

const NonRoutineCardDetails = () => {

  const {id} = useParams();
  const TITLE = 'Non Routine Card View';
  const GUTTERS = [12, 12];

  const [singleData, setSingleData] = useState({});
  const {t} = useTranslation()

  useEffect(() => {

    if (!id) return;

    (async () => {
      const res = await NonRoutineCardServices.getNonRoutineCardById(id);
      setSingleData({...res.data})
    })();

  }, [id])

  const ViewDateFormat = (date) => {
    if (date) {
        return moment(date).format("DD-MMM-YYYY HH:mm:ss");
    }
    return "N/A";
};


  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item> <Link to='/planning'> <i className="fas fa-chart-line"/>&nbsp; Planning
          </Link></Breadcrumb.Item>

          <Breadcrumb.Item><Link to='/planning/non-routine-card'>
            Non Routine Card
          </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            {TITLE}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={
          getLinkAndTitle(TITLE, '/planning/non-routine-card')
        }
      >

        <Row>
          <Col xs={24} sm={24} md={12}>
            <RibbonCard ribbonText="Non Routine Card">
              <ViewItem label="Aircraft">{singleData.aircraftName}</ViewItem>
              <ViewItem label="NRC No">{singleData.nrcNo}</ViewItem>
              <ViewItem label="A/C Check Index">{singleData.aircraftChecksName}</ViewItem>
              <ViewItem label="Reference">{singleData.reference}</ViewItem>
              <ViewItem label="Issue Date">{DateFormat(singleData.issueDate)}</ViewItem>
            </RibbonCard>
          </Col>
        </Row>

        <Row gutter={GUTTERS}>
          <Col span={24}>
            <RibbonCard ribbonText={t("planning.ATL.Defect And Rectification")}>

              <Row gutter={GUTTERS} style={{
                marginBottom: '2.5em'
              }}>

                <Col md={24} sm={24}>
                  <ARMTable>
                    <thead>
                    <tr>
                      <th colSpan={2}>{t("planning.ATL.Defect")}</th>
                      <th colSpan={2}>{t("planning.ATL.Rectifications")}</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr>
                      <th>{t("planning.ATL.From DMI no")}</th>
                      <td>{singleData.amlDefectRectificationModelView?.defectDmiNo}</td>
                      <th>{t("planning.ATL.To DMI no")}</th>
                      <td style={{minWidth: '100px'}}>{singleData.amlDefectRectificationModelView?.rectDmiNo}</td>
                    </tr>
                    <tr>
                      <th>{t("planning.ATL.Description")}</th>
                      <td>{singleData.amlDefectRectificationModelView?.defectDescription}</td>
                      <th>{t("planning.ATL.Description")}</th>
                      <td>{singleData.amlDefectRectificationModelView?.rectDescription}</td>
                    </tr>


                    <tr>
                      <th>{t("planning.ATL.Name")}</th>
                      <td>{singleData.amlDefectRectificationModelView?.defectSignedEmployeeName}</td>
                      <th>{t("planning.ATL.Name")}</th>
                      <td>{singleData.amlDefectRectificationModelView?.rectSignedEmployeeName}</td>

                    </tr>

                    <tr>
                      <th>{t("planning.ATL.Station")}</th>
                      <td>{singleData.amlDefectRectificationModelView?.defectStaName}</td>
                      <th>{t("planning.ATL.Station")}</th>
                      <td>{singleData.amlDefectRectificationModelView?.rectStaName}</td>

                    </tr>

                    <tr>
                      <th>{t("planning.ATL.Signature Date")} &amp; {t("planning.ATL.Time")}</th>
                      <td>{ViewDateFormat(singleData.amlDefectRectificationModelView?.defectSignTime)}</td>
                      <th>{t("planning.ATL.Signature Date")} &amp; {t("planning.ATL.Time")}</th>
                      <td>{ViewDateFormat(singleData.amlDefectRectificationModelView?.rectSignTime)}</td>
                    </tr>
                    <tr>
                      <th>Remark</th>
                      <td>{singleData.amlDefectRectificationModelView?.remark}</td>
                      <th>{t("planning.ATL.P/N on")}</th>
                      <td>{singleData.amlDefectRectificationModelView?.rectPnOn}</td>
                    </tr>


                    <tr>
                      <th></th>
                      <td></td>
                      <th>{t("planning.ATL.POS")}</th>
                      <td>{singleData.amlDefectRectificationModelView?.rectPos}</td>
                    </tr>
                    <tr>
                      <th></th>
                      <td></td>
                      <th>{t("planning.ATL.P/N off")}</th>
                      <td>{singleData.amlDefectRectificationModelView?.rectPnOff}</td>
                    </tr>


                    <tr>
                      <th></th>
                      <td></td>
                      <th>{t("planning.ATL.MEL Ref")}</th>
                      <td>{singleData.amlDefectRectificationModelView?.rectMelRef}</td>
                    </tr>

                    <tr>
                      <th></th>
                      <td></td>

                      <th>{t("planning.ATL.ATA")}</th>
                      <td>{singleData.amlDefectRectificationModelView?.rectAta}</td>
                    </tr>


                    <tr>
                      <th></th>
                      <td></td>

                      <th>{t("planning.ATL.S/N off")}</th>
                      <td>{singleData.amlDefectRectificationModelView?.rectSnOff}</td>
                    </tr>


                    <tr>
                      <th></th>
                      <td></td>
                      <th>{t("planning.ATL.S/N on")}</th>
                      <td>{singleData.amlDefectRectificationModelView?.rectSnOn}</td>
                    </tr>

                    <tr>
                      <th></th>
                      <td></td>
                      <th>{t("planning.ATL.GRN")}</th>
                      <td>{singleData.amlDefectRectificationModelView?.rectGrn}</td>
                    </tr>

                    <tr>
                      <th></th>
                      <td></td>
                      <th>Reason for Removal</th>
                      <td>{singleData.amlDefectRectificationModelView?.reasonForRemoval}</td>
                    </tr>
                    </tbody>
                  </ARMTable>
                </Col>
              </Row>
            </RibbonCard>

          </Col>
        </Row>

      </ARMCard>
    </CommonLayout>
  );
};

export default NonRoutineCardDetails;
