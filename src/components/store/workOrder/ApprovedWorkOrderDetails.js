import React from 'react';
import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import WorkOrderService from "../../../service/store/WorkOrderService";
import UnserviceableItemService from "../../../service/store/UnserviceableItemService";
import {Breadcrumb, Col, notification, Row} from "antd";
import {getErrorMessage} from "../../../lib/common/helpers";
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import ARMCard from "../../common/ARMCard";
import UnServiceablePartDetails from "./UnServiceablePartDetails";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";

const ApprovedWorkOrderDetails = () => {
  const [workOrder, setWorkOrder] = useState([]);
  const [unSPartIdSingle, setUnSPartIdSingle] = useState([]);
  const {id} = useParams();
  const getWorkOrderById = async () => {
    const {data} = await WorkOrderService.getWorkOrderById(id);
    setWorkOrder(data);
    console.log("woById", data)
    getUnserviceableItem(data.unserviceablePartId);
  }
  const getUnserviceableItem = async (id) => {
    try {
      let {data} = await UnserviceableItemService.getUnserviceableItemById(id)
      console.log("USItem", data)
      setUnSPartIdSingle(data)
    } catch (er) {
      notification["error"]({message: getErrorMessage(er)});
    }
  }
  useEffect(() => {
    if (!id)
      return;
    getWorkOrderById().catch(console.error)
  }, [id])
  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/store">
              {' '}
              <i className="fas fa-archive"/> &nbsp;Store
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
          {' '}
          <Link to="/store/approved-work-order">
            {' '}
            Approved Work Order
          </Link>
        </Breadcrumb.Item>
          <Breadcrumb.Item>Approved Work Order Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard title={
        getLinkAndTitle('Approved Work Order Details', '/store/approved-work-order',)
      }>
        <Row>
          <Col span={24} md={12}>
            <Row>
              <Col span={12} style={{marginBottom: "10px"}}>
                Work Order No. :
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {workOrder.workOrderNo?workOrder.workOrderNo:"N/A"}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                Part No. :
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {workOrder.partNo?workOrder.partNo:"N/A"}
              </Col> <Col span={12} style={{marginBottom: "10px"}}>
              Remark :
            </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {workOrder.reasonRemark?workOrder.reasonRemark:"N/A"}
              </Col>
            </Row>
          </Col>
        </Row>
        <UnServiceablePartDetails unSPartIdSingle={unSPartIdSingle}/>
      </ARMCard>
    </CommonLayout>
  );
};

export default ApprovedWorkOrderDetails;