import { PrinterOutlined } from '@ant-design/icons';
import { Breadcrumb, Col, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import ProqurementRequisitionService from '../../../service/procurment/ProqurementRequisitionService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ARMButton from '../../common/buttons/ARMButton';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import ApprovedRemarks from '../../common/ApprovedRemarks';

const RequisitionDetails = () => {
  const [singleData, setSingleData] = useState();
  let { id } = useParams();
  const loadSingleData = async () => {
    const { data } = await ProqurementRequisitionService.getRequisitionById(id);
    setSingleData(data);
  };

  useEffect(() => {
    loadSingleData();
  }, [id]);

  const responseDtoList = singleData?.approvalRemarksResponseDtoList;


  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to="/store">
              <i className="fas fa-archive" /> &nbsp;Store
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/store/material-management/requisition/approved">
              &nbsp;Approved Requisition
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp;Approved Requisition Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(
          `Approve Requisition details`,
          `/store/material-management/requisition/approved`
        )}
      >
        <Row>
          <Col
            span={24}
            md={12}
          >
            <Row>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Store Demand No :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.storeDemandNo}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Voucher No :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.voucherNo}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Department Type :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.departmentType}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Remarks :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.remarks}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                <ApprovedRemarks responseDtoList={responseDtoList}/>
              </Col>
            </Row>
          </Col>

          <ResponsiveTable style={{ marginTop: '20px' }}>
            <ARMTable>
              <thead>
                <tr>
                  <th>Part No</th>
                  <th>Part Description</th>
                  <th>Available Part</th>
                  <th>Aircraft Item</th>
                  <th>Quantity Demanded</th>
                  <th>Quantity Requested</th>
                  <th>Unit of Measurement</th>
                  <th>Priority</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>

              {
                singleData?.requisitionItemViewModels?.map((demandList,index) => (
                  <tr key={demandList.id}>
                    <td>{demandList.partNo}</td>
                    <td>{demandList.partDescription}</td>
                    <td>{demandList.availablePart}</td>
                    <td>aircraft-{index+1}</td>
                    <td>{demandList.quantityDemanded}</td>
                    <td>{demandList.requisitionQuantity}</td>
                    <td>{demandList.unitMeasurementCode}</td>
                    <td>{demandList.requisitionPriority}</td>
                    <td>{demandList.remark}</td>
                  </tr>
                ))
              }

              </tbody>
            </ARMTable>
          </ResponsiveTable>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col>
            <Space>
              <Link
                to={`/store/material-management/requisition/approved/details/print/${id}`}
              >
                <ARMButton type={'primary'}>
                  {' '}
                  {<PrinterOutlined />}Print Preview
                </ARMButton>
              </Link>
            </Space>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default RequisitionDetails;
