import { Breadcrumb, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import ProqurementRequisitionService from '../../../service/procurment/ProqurementRequisitionService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
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
            <Link to="/store/material-management/requisition/pending">
              &nbsp;Pending Requisition
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp;Pending Requisition Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(
          `Pending Requisition details`,
          `/store/material-management/requisition/pending`
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

              {singleData?.isRejected
                &&
                <>
                  <Col
                    span={12}
                    style={{marginBottom: '10px'}}
                  >
                    <b>Rejected Reason : </b>
                  </Col>
                  <Col
                    span={12}
                    style={{marginBottom: '10px'}}
                  >
                    {singleData?.rejectedDesc}
                  </Col>
                </>
              }
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
                  <th>Quantity Demanded</th>
                  <th>Quantity Requested</th>
                  <th>Unit of Measurement</th>
                  <th>Priority</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {singleData?.requisitionItemViewModels?.map(
                  (demandList, index) => (
                    <tr key={demandList.id}>
                      <td>{demandList.partNo}</td>
                      <td>{demandList.partDescription}</td>
                      <td>{demandList.availablePart}</td>
                      <td>{demandList.quantityDemanded}</td>
                      <td>{demandList.requisitionQuantity}</td>
                      <td>{demandList.unitMeasurementCode}</td>
                      <td>{demandList.requisitionPriority}</td>
                      <td>{demandList.remark}</td>
                    </tr>
                  )
                )}
              </tbody>
            </ARMTable>
          </ResponsiveTable>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default RequisitionDetails;
