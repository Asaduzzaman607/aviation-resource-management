import {Breadcrumb, Col, Row} from 'antd';
import {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {getLinkAndTitle} from '../../../lib/common/TitleOrLink';
import PurchaseInvoiceService from '../../../service/procurment/PurchaseInvoiceService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ARMTable from '../../common/ARMTable';
import RibbonCard from '../../common/forms/RibbonCard';
import ResponsiveTable from '../../common/ResposnsiveTable';
import CommonLayout from '../../layout/CommonLayout';
import {FileOutlined} from "@ant-design/icons";
import { notifyResponseError } from '../../../lib/common/notifications';
import {getFileExtension, getFileName} from "../../../lib/common/helpers";

const PIDetails = () => {
  let {id} = useParams();
  const [singleData, setSingleData] = useState({});
  const [attachment, setAttachment] = useState([]);

  const loadSingleData = async () => {
    try {
      const { data } = await PurchaseInvoiceService.getInvoiceById(id);
      setSingleData(data);
      setAttachment(data?.attachment);
    } catch (e) {
      notifyResponseError(e);
    }
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
            <Link to="/material-management">
              <i className="fa fa-shopping-basket"/> &nbsp;Material Management
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/material-management/purchase-invoice/pending">
              &nbsp;Pending PI List
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp;PI Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(
          `PI details`,
          `/material-management/purchase-invoice/pending`,
          false,
          'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_PARTS_INVOICE_MATERIAL_MANAGEMENT_PARTS_INVOICE_SEARCH'
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
                Invoice No. :
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                {singleData?.invoiceNo ? singleData?.invoiceNo : 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Invoice Type :
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                {singleData?.invoiceType ? singleData?.invoiceType : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                Part Order No. :
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                {singleData?.partOrderNo ? singleData?.partOrderNo : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                Payment Terms :
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                {singleData?.paymentTerms ? singleData?.paymentTerms : 'N/A'}
              </Col>

              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                Telephone:
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                {singleData?.toTel ? singleData?.toTel : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                Fax:
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                {singleData?.vendorFax ? singleData?.vendorFax : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                T&C:
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                {singleData?.tac ? singleData?.tac : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                Address :
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                {singleData?.vendorAddress ? singleData?.vendorAddress : 'N/A'}
              </Col>

              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                Attachments:
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                {attachment
                  ? attachment?.map((file, index) => (
                    <p key={index}>
                      {getFileExtension(file) ? (
                        <img
                          width="30"
                          height="30"
                          src={file}
                          alt="img"
                        />
                      ) : (
                        <FileOutlined style={{fontSize: '25px'}}/>
                      )}
                      <a href={file}>
                        {getFileName(file)}
                      </a>
                    </p>
                  ))
                  : 'N/A'
                }
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
                style={{marginBottom: '10px'}}
              >
                Email :
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                {singleData?.vendorEmail ? singleData?.vendorEmail : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                To Fax:
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                {singleData?.toFax ? singleData?.toFax : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                To Bill:
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                {singleData?.billTo ? singleData?.billTo : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                To Tel:
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                {singleData?.toTel ? singleData?.toTel : 'N/A'}
              </Col>

              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                Website:
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                {singleData?.vendorWebsite ? singleData?.vendorWebsite : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                Remarks:
              </Col>
              <Col
                span={12}
                style={{marginBottom: '10px'}}
              >
                {singleData?.remark ? singleData?.remark : 'N/A'}
              </Col>
            </Row>
          </Col>
        </Row>
        {/* <Row>
          <Col span={24}>
            <RibbonCard ribbonText={'QUOTATION DETAILS'}>
              <ResponsiveTable style={{marginTop: '20px'}}>
                <ARMTable>
                  <thead>
                  <tr>
                    <th>SL.</th>
                    <th>Part No</th>
                    <th>Part Description</th>
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
              <ResponsiveTable style={{marginTop: '20px'}}>
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
        </Row> */}
      </ARMCard>
    </CommonLayout>
  );
};

export default PIDetails;
