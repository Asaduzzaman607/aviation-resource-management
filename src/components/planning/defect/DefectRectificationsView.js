import { Link } from "react-router-dom";
import React from "react";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import { Breadcrumb, Col, Descriptions, Row } from "antd";
import ARMCard from "../../common/ARMCard";
import { getLinkAndTitle } from "../../../lib/common/TitleOrLink";
import { useDefect } from "../../../lib/hooks/planning/useDefect";
import RibbonCard from "../../common/forms/RibbonCard";
import ViewItem from "../../common/view/ViewItem";

export default function DefectRectificationsView() {
  const { singleDefectRect } = useDefect();
  
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/planning">
              <i className="fas fa-chart-line" />
              &nbsp; Planning
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>
            <Link to="/planning/defect-rectifications">Defect &amp; Rectifications</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Defect Rectification View</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard title={getLinkAndTitle("Defect Rectification View", "/planning/defect-rectifications")}>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={24} md={12}>
            <ViewItem label="Page No">{singleDefectRect.amlPageNo}</ViewItem>
            <ViewItem label="Sequence No">{singleDefectRect.seqNo}</ViewItem>
          </Col>

          <Col xs={24} sm={24} md={12}></Col>
          <Col xs={24} sm={24} md={12}>
            <RibbonCard ribbonText="Defect">
              <ViewItem label="From DMI No">{singleDefectRect.defectDmiNo}</ViewItem>
              <ViewItem label="Description">{singleDefectRect.defectDescription}</ViewItem>
              <ViewItem label="Name">{singleDefectRect.defectSignedEmployeeName}</ViewItem>
              <ViewItem label="Station">{singleDefectRect.defectStaName}</ViewItem>
              <ViewItem label="Signature Time">{singleDefectRect.defectSignTime}</ViewItem>
            </RibbonCard>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <RibbonCard ribbonText="Rectifications">
              <ViewItem label="To DMI No">{singleDefectRect.rectDmiNo}</ViewItem>
              <ViewItem label="MEL Ref">{singleDefectRect.rectMelRef}</ViewItem>
              <ViewItem label="Category">{singleDefectRect.rectCategory}</ViewItem>
              <ViewItem label="ATA">{singleDefectRect.rectAta}</ViewItem>
              <ViewItem label="POS">{singleDefectRect.rectPos}</ViewItem>
              <ViewItem label="P/N off">{singleDefectRect.rectPnOff}</ViewItem>
              <ViewItem label="S/N off">{singleDefectRect.rectPnOn}</ViewItem>
              <ViewItem label="P/N on">{singleDefectRect.rectSnOff}</ViewItem>
              <ViewItem label="S/N on">{singleDefectRect.rectSnOn}</ViewItem>
              <ViewItem label="GRN">{singleDefectRect.rectGrn}</ViewItem>
              <ViewItem label="Description">{singleDefectRect.rectDescription}</ViewItem>
              <ViewItem label="Name">{singleDefectRect.rectSignedEmployeeName}</ViewItem>
              <ViewItem label="Station">{singleDefectRect.rectStaName}</ViewItem>
              <ViewItem label="Signature Time">{singleDefectRect.rectSignTime}</ViewItem>
            </RibbonCard>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
}
