import { Breadcrumb, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { getVendorStatus } from '../../../lib/common/manufacturerSupplierUtils';
import RequestforQuotationService from '../../../service/procurment/RequestforQuotationService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ApprovedRemarks from '../../common/ApprovedRemarks';
import ResponsiveTable from '../../common/ResposnsiveTable';
import RibbonCard from '../../common/forms/RibbonCard';
import CommonLayout from '../../layout/CommonLayout';

const ApprovedRfqDetails = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState();

  const loadSingleData = async () => {
    const { data } =
      await RequestforQuotationService.getRequestforQuotationById(id);
    setSingleData(data);
  };

  useEffect(() => {
    loadSingleData().catch(console.error);
  }, [id]);

  const responseDtoList =
    singleData?.rfqVendorResponseDto?.approvalRemarksResponseDtoList;

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fa fa-shopping-basket" />
            <Link to="/material-management">&nbsp; Material-Management</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/material-management/approved-rfq">
              &nbsp; Approved RFQ List
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard
        title={getLinkAndTitle(
          `Approve RFQ details`,
          `/material-management/approved-rfq`,
          false,
          'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_QUOTE_REQUEST_MATERIAL_MANAGEMENT_REQUEST_FOR_QUOTATION_SAVE'
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
                RFQ No:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.rfqVendorResponseDto.rfqNo}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.rfqVendorResponseDto.partOrderId
                  ? 'Order No:'
                  : 'Requisition No :'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.rfqVendorResponseDto.partOrderId ? (
                  <Link
                    to={`/material-management/purchase-order/edit/${singleData?.rfqVendorResponseDto.partOrderId}`}
                    target="_blank"
                  >
                    {singleData?.rfqVendorResponseDto.orderNo}
                  </Link>
                ) : (
                  <Link
                    to={`/store/material-management/requisition/edit/${singleData?.rfqVendorResponseDto.requisitionId}`}
                    target="_blank"
                  >
                    {singleData?.rfqVendorResponseDto.voucherNo}
                  </Link>
                )}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                <ApprovedRemarks responseDtoList={responseDtoList} />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col
            md={24}
            sm={24}
          >
            <RibbonCard ribbonText={'Vendors Info'}>
              <ResponsiveTable>
                <ARMTable>
                  <thead>
                    <tr>
                      <th>Vendor Name</th>
                      <th>Vendor Type</th>
                      <th>Request Date</th>
                      <th>Vendor Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {singleData?.rfqVendorResponseDto.quoteRequestVendorModelList?.map(
                      (data) => (
                        <tr key={data.id}>
                          <td>{data.vendorName}</td>
                          <td>{data.vendorType}</td>
                          <td>{data.requestDate}</td>
                          <td>{getVendorStatus(data.vendorWorkFlowName)}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </ARMTable>
              </ResponsiveTable>
            </RibbonCard>
          </Col>
        </Row>
      </ARMCard>
    </CommonLayout>
  );
};

export default ApprovedRfqDetails;
