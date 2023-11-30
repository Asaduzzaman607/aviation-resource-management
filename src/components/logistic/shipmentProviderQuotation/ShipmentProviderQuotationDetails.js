import { FileOutlined } from '@ant-design/icons';
import { Breadcrumb, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import LogisticQuotationService from '../../../service/logistic/LogisticQuotationService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import RibbonCard from '../../common/forms/RibbonCard';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import {getFileExtension, getFileName} from "../../../lib/common/helpers";

const ShipmentProviderQuotationDetails = () => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState();
  const [attachment, setAttachment] = useState([]);

  const loadSingleData = async () => {
    const { data } = await LogisticQuotationService.getQuotationById(id);
    setSingleData(data);
    setAttachment(data.attachments);
  };

  useEffect(() => {
    if (!id) return;
    loadSingleData().catch(console.error);
  }, [id]);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to="/logistic">
              {' '}
              <i className="fas fa-hand-holding-box" />
              &nbsp; Logistic
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {' '}
            <Link to="/logistic/shipment-provider-quotation">
              &nbsp;Shipment Provider Quotations
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Shipment Provider Quotation Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(
          'Quotation details',
          '/logistic/shipment-provider-quotation',
          false,
          'LOGISTIC_LOGISTIC_QUOTE_REQUEST_LOGISTIC_QUOTATION_SAVE'
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
                className="mb-10"
              >
                Quotation No. :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData?.quotationNo ? singleData?.quotationNo : 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                RFQ No. :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.quoteRequestNo
                  ? singleData?.quoteRequestNo
                  : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                vendor Name:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.vendorName ? singleData?.vendorName : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Quotation Date :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.date ? singleData?.date : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Valid Until:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.validUntil ? singleData?.validUntil : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Attention:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.toAttention ? singleData?.toAttention : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                From:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.vendorFrom ? singleData?.vendorFrom : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                T&C:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.termsCondition
                  ? singleData?.termsCondition
                  : 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Attachment:
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {attachment.length > 0
                  ? attachment?.map((file, index) => (
                      <p key={index}>
                        {getFileExtension(file) ? (
                          <img
                            width="30"
                            height="30"
                            src={file}
                          />
                        ) : (
                          <FileOutlined style={{ fontSize: '25px' }} />
                        )}
                        <a href={file}>
                          {getFileName(file)}
                        </a>
                      </p>
                    ))
                  : 'N/A'}
              </Col>
            </Row>
          </Col>

          <Col
            span={24}
            md={12}
          >
            <Row>
              <Col
                span={12}
                className="mb-10"
              >
                Vendor Defined Quotation No. :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData?.vendorQuotationNo ? singleData?.vendorQuotationNo : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Address :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.vendorAddress ? singleData?.vendorAddress : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Email :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.vendorEmail ? singleData?.vendorEmail : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                To Fax:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.toFax ? singleData?.toFax : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                To Tel:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.toTel ? singleData?.toTel : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Tel:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.vendorTel ? singleData?.vendorTel : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Fax:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.vendorFax ? singleData?.vendorFax : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Website:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.vendorWebsite ? singleData?.vendorWebsite : 'N/A'}
              </Col>

              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Remarks:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData?.remark ? singleData?.remark : 'N/A'}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <RibbonCard ribbonText={'QUOTATION DETAILS'}>
              <ResponsiveTable style={{ marginTop: '20px' }}>
                <ARMTable>
                  <thead>
                    <tr>
                      <th>SL.</th>
                      <th>Part No</th>
                      <th>Part Description</th>
                      <th>Quantity</th>
                      <th>Condition</th>
                      <th>currency</th>
                      <th>Unit Price</th>
                      <th>Extended Price</th>
                      <th>Incoterms</th>
                      <th>Lead Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {singleData?.vendorQuotationDetails?.map(
                      (demandList, index) => (
                        <tr key={demandList.id}>
                          <td>{index + 1}</td>
                          <td>{demandList.partNo}</td>
                          <td>{demandList.partDescription}</td>
                          <td>{demandList.partQuantity}</td>
                          <td>{demandList.condition}</td>
                          <td>{demandList.currencyCode}</td>
                          <td>{demandList.unitPrice}</td>
                          <td>{demandList.extendedPrice}</td>
                          <td>{demandList.incoterms}</td>
                          <td>{demandList.leadTime}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </ARMTable>
              </ResponsiveTable>
            </RibbonCard>
          </Col>
          <Col span={24}>
            <RibbonCard ribbonText={'FEES DETAILS'}>
              <ResponsiveTable style={{ marginTop: '20px' }}>
                <ARMTable>
                  <thead>
                    <tr>
                      <th>SL.</th>
                      <th>CIA Fees</th>
                      <th>Price</th>
                      <th>currency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {singleData?.vendorQuotationFees?.map(
                      (demandList, index) => (
                        <tr key={demandList.id}>
                          <td>{index + 1}</td>
                          <td>{demandList.feeName}</td>
                          <td>{demandList.feeCost}</td>
                          <td>{demandList.currencyCode}</td>
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

export default ShipmentProviderQuotationDetails;
