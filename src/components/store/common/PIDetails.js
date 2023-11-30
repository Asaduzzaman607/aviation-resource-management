import { FileOutlined } from '@ant-design/icons';
import { Breadcrumb, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import { notifyResponseError } from '../../../lib/common/notifications';
import API from '../../../service/Api';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ApprovedRemarks from '../../common/ApprovedRemarks';
import RibbonCard from '../../common/forms/RibbonCard';
import FinancePartOrderTable from '../../finance/common/FinancePartOrderTable';
import CommonLayout from '../../layout/CommonLayout';
import {getFileExtension, getFileName} from "../../../lib/common/helpers";

const PIDetails = ({
  csType,
  baseUrl,
  url,
  icon,
  breadcrumbTitle,
  breadcrumbListTitle,
  breadcrumbListUrl,
  cardTitle,
  permission,
}) => {
  let { id } = useParams();
  const [singleData, setSingleData] = useState({});
  const [attachment, setAttachment] = useState([]);
  const [csList, setCsList] = useState([]);
  const splitCsType = csType.split('_');

  const loadSingleData = async () => {
    try {
      const { data } = await API.get(`${url}/${id}`);
      setSingleData(data);
      setAttachment(data.attachment);
      setCsList(data.csViewModelList);
    } catch (error) {
      notifyResponseError(error);
    }
  };

  useEffect(() => {
    if (!id) return;
    loadSingleData().catch(console.error);
  }, [id]);

  const responseDtoList = singleData?.approvalRemarksResponseDtoList;
  const responseDtoListAudit = singleData?.approvalRemarksResponseDtoListAudit;
  const responseDtoListFinance =
    singleData?.approvalRemarksResponseDtoListFinance;
  const partInvoiceItemDtoList = singleData?.partInvoiceItemDtoList;

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Link to={baseUrl}>
              <i className={icon} /> &nbsp;{breadcrumbTitle}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={breadcrumbListUrl}>&nbsp; {breadcrumbListTitle}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>&nbsp;PI Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(cardTitle, breadcrumbListUrl, false, permission)}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            marginTop: '-20px',
          }}
        >
          <ApprovedRemarks
            responseDtoList={responseDtoList}
            responseDtoListAudit={responseDtoListAudit}
            responseDtoListFinance={responseDtoListFinance}
          />
        </div>
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
                {singleData.invoiceNo ? singleData.invoiceNo : 'N/A'}
              </Col>
              <Col
                span={12}
                className="mb-10"
              >
                Invoice Type :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData.invoiceType ? singleData.invoiceType : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Part Order No. :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData.partOrderNo ? singleData.partOrderNo : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Payment Terms :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData.paymentTerms ? singleData.paymentTerms : 'N/A'}
              </Col>

              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Telephone:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData.toTel ? singleData.toTel : 'N/A'}
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
                {singleData.vendorFax ? singleData.vendorFax : 'N/A'}
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
                {singleData.tac ? singleData.tac : 'N/A'}
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
                {singleData.vendorAddress ? singleData.vendorAddress : 'N/A'}
              </Col>

              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                Attachments:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {attachment
                  ? attachment?.map((file, index) => (
                      <p key={index}>
                        {getFileExtension(file) ? (
                          <img
                            alt="img"
                            width="30"
                            height="30"
                            src={file}
                          />
                        ) : (
                          <FileOutlined style={{ fontSize: '25px' }} />
                        )}
                        <a href={file}>{getFileName(file)}</a>
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
                style={{ marginBottom: '10px' }}
              >
                Email :
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData.vendorEmail ? singleData.vendorEmail : 'N/A'}
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
                {singleData.toFax ? singleData.toFax : 'N/A'}
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                To Bill:
              </Col>
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                {singleData.billTo ? singleData.billTo : 'N/A'}
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
                {singleData.toTel ? singleData.toTel : 'N/A'}
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
                {singleData.vendorWebsite ? singleData.vendorWebsite : 'N/A'}
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
                {singleData.remark ? singleData.remark : 'N/A'}
              </Col>
              {singleData?.isRejected && (
                <>
                  <Col
                    span={12}
                    style={{ marginBottom: '10px' }}
                  >
                    Rejected Reason:
                  </Col>
                  <Col
                    span={12}
                    style={{ marginBottom: '10px' }}
                  >
                    {singleData?.rejectedDesc}
                  </Col>
                </>
              )}
              <Col
                span={12}
                style={{ marginBottom: '10px' }}
              >
                CS List:
              </Col>
              <Col
                span={12}
                style={{
                  marginBottom: '10px',
                  overflow: 'auto',
                  height: '120px',
                }}
              >
                {csList
                  ? csList.map((cs) => {
                      return (
                        <div key={cs.id}>
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href={`/${splitCsType[0]}/final-approved-comparative-statement/detail/${cs.id}`}
                          >
                            {cs.csNo}
                          </a>
                          <br />
                        </div>
                      );
                    })
                  : 'N/A'}
              </Col>
            </Row>
          </Col>
        </Row>
        <div
          style={{
            marginTop: '30px',
          }}
        >
          {splitCsType[1] === 'finance' && (
            <RibbonCard ribbonText={'PART ORDER DETAILS'}>
              <FinancePartOrderTable
                loadSingleData={loadSingleData}
                breadcrumbListTitle={breadcrumbListTitle}
                partInvoiceItemDtoList={partInvoiceItemDtoList}
              />
            </RibbonCard>
          )}
        </div>
      </ARMCard>
    </CommonLayout>
  );
};

export default PIDetails;
