import { Breadcrumb, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import ShipmentProviderRfqService from '../../../service/logistic/ShipmentProviderRfqService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import ApprovedRemarks from '../../common/ApprovedRemarks';

const PendingLogisticRFQDetails = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState();

  const loadSingleData = async () => {
    const { data } =
      await ShipmentProviderRfqService.getRequestForQuotationById(id);
    console.log('details data', data);
    setSingleData(data);
  };

  useEffect(() => {
    loadSingleData().catch(console.error);
  }, [id]);
  
  const responseDtoList = singleData?.rfqVendorResponseDto?.approvalRemarksResponseDtoList;

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <i className="fas fa-hand-holding-box" />
            <Link to="/logistic">&nbsp; Logistic</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/logistic/pending-shipment-provider-rfq">
              &nbsp; Pending Logistic RFQ List
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>
      <ARMCard
        title={getLinkAndTitle(
          `Pending Logistic RFQ details`,
          `/logistic/pending-shipment-provider-rfq`
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
                Order No :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.rfqVendorResponseDto.voucherNo === null ||
                singleData?.rfqVendorResponseDto.voucherNo.startsWith(
                  'INVISIBLE'
                )
                  ? singleData?.rfqVendorResponseDto.orderNo
                  : singleData?.rfqVendorResponseDto.voucherNo}
              </Col>
              {singleData?.rfqVendorResponseDto.isRejected && (
                <>
                  <Col
                    span={12}
                    style={{ marginBottom: '10px' }}
                  >
                    Rejected Reason :
                  </Col>
                  <Col
                    span={12}
                    style={{ marginBottom: '10px' }}
                  >
                    {singleData?.rfqVendorResponseDto.rejectedDesc}
                  </Col>
                </>
              )}

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
                  <th>Vendor Name</th>
                  <th>Vendor Type</th>
                  <th>Request Date</th>
                </tr>
              </thead>
              <tbody>
                {singleData?.rfqVendorResponseDto.quoteRequestVendorModelList?.map(
                  (data) => (
                    <tr key={data.id}>
                      <td>{data.vendorName}</td>
                      <td>{data.vendorType}</td>
                      <td>{data.requestDate}</td>
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

export default PendingLogisticRFQDetails;
