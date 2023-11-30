import React, {useEffect, useState} from 'react';
import CommonLayout from "../../layout/CommonLayout";
import ARMBreadCrumbs from "../../common/ARMBreadCrumbs";
import {Breadcrumb, Col, Empty, Form, Input, notification, Pagination, Row, Select, Space} from "antd";
import {Link, useParams} from "react-router-dom";
import ARMCard from "../../common/ARMCard";
import ARMButton from "../../common/buttons/ARMButton";
import {EyeOutlined, FilterOutlined, RollbackOutlined} from "@ant-design/icons";
import ResponsiveTable from "../../common/ResposnsiveTable";
import ARMTable from "../../common/ARMTable";
import ARMForm from "../../../lib/common/ARMForm";
import TextArea from "antd/es/input/TextArea";
import UnServiceablePartDetails from "./UnServiceablePartDetails";
import {useWorkOrder} from "../hooks/workOrder";
import WorkOrderService from "../../../service/store/WorkOrderService";
import UnserviceableItemService from "../../../service/store/UnserviceableItemService";
import {getErrorMessage} from "../../../lib/common/helpers";
import {getLinkAndTitle} from "../../../lib/common/TitleOrLink";

const {Option} = Select;
const PendingWorkOrderDetails = () => {
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
          </Breadcrumb.Item><Breadcrumb.Item>
          {' '}
          <Link to="/store/pending-work-order">
            {' '}
            Pending Work Order
          </Link>
        </Breadcrumb.Item>
          <Breadcrumb.Item>Pending Work Order Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard title={
        getLinkAndTitle('Pending Work Order Details', '/store/pending-work-order',)
      }>
        <Row>
          <Col span={24} md={12}>
            <Row>
              <Col span={12} style={{marginBottom: "10px"}}>
                Work Order No :
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {workOrder.workOrderNo}
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                Part No :
              </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {workOrder.workOrderNo}
              </Col> <Col span={12} style={{marginBottom: "10px"}}>
              Remark :
            </Col>
              <Col span={12} style={{marginBottom: "10px"}}>
                {workOrder.reasonRemark}
              </Col>
            </Row>
          </Col>
        </Row>
        <UnServiceablePartDetails unSPartIdSingle={unSPartIdSingle}/>
      </ARMCard>
    </CommonLayout>
  );
};

export default PendingWorkOrderDetails;