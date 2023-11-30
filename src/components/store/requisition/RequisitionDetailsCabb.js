import React from 'react';
import RibbonCard from "../../common/forms/RibbonCard";
import {Col, Row} from "antd";

const RequisitionDetailsCabb = ({partViewModel}) => {
  function getCheckBox(caabCheckbox) {
    let modCaab
    if (caabCheckbox !== " ") {
      modCaab = caabCheckbox.split(',').map((data) => (
        <p>{data}</p>
      ))
    }
    return modCaab;
  }

  return (
    <>
      <RibbonCard ribbonText={"CAAB INFO"}>
        <Row>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            Caab Status :
          </Col>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            {partViewModel?.caabStatus}
          </Col>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            Caab Remarks :
          </Col>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            {partViewModel?.caabRemarks}
          </Col>

          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            Approval Reference:
          </Col>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            {partViewModel?.certApprovalRef}
          </Col>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            Approval Auth No:
          </Col>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            {partViewModel?.approvalAuthNo}
          </Col>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            Authorized User:
          </Col>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            {partViewModel?.authorizedUserName}
          </Col>

          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            Authorized Date:
          </Col>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            {partViewModel?.authorizedDate}
          </Col>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            Authorizes User :
          </Col>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            {partViewModel?.authorizesUserName}
          </Col>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            Authorizes Date :
          </Col>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            {partViewModel?.authorizesDate}
          </Col>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            Caab Checkbox :
          </Col>
          <Col
            span={12}
            style={{marginBottom: '10px'}}
          >
            {getCheckBox(partViewModel?.caabCheckbox)}
          </Col>
        </Row>
      </RibbonCard>
    </>
  );
};

export default RequisitionDetailsCabb;