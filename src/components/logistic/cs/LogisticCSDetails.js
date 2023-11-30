import {Breadcrumb, Col, Empty, Row} from 'antd';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import LinkWithDownload from '../../../lib/common/LinkWithDownload';
import API from '../../../service/Api';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import ApprovedRemarks from '../../common/ApprovedRemarks';
import timeConverterWithTZ from '../../common/utils/dateTimeConverterWithTimeZone';
import CommonLayout from '../../layout/CommonLayout';
import CSDetailsTable from './CSDetailsTable';
import ResponsiveTable from "../../common/ResposnsiveTable";
import ARMTable from "../../common/ARMTable";
import ARMButton from "../../common/buttons/ARMButton";
import {EyeOutlined} from "@ant-design/icons";

function modifiedCsDetailsData(vendor) {
  return vendor.csqDetailResponseDtoList.map((csDetail) => ({
    detailId: csDetail.detailId,
    partId: csDetail.partId,
    unitPrice: csDetail.unitPrice,
    leadTime: csDetail.leadTime,
    vendorName: vendor.vendorName,
    currencyCode: csDetail.currencyCode,
    condition: csDetail.condition,
    discount: csDetail.discount,
    vendorUomCode: csDetail.vendorUomCode,
    vendorPartQuantity: csDetail.vendorPartQuantity,
  }));
}

const LogisticCSDetails = ({
  baseUrl,
  icon,
  breadcrumbTitle,
  title,
  breadcrumbListTitle,
  breadcrumbListUrl,
  cardTitle,
  permission,
}) => {
  const { id } = useParams();
  const [vendorLength, setVendorLength] = useState([]);
  const [generateCS, setGenerateCS] = useState({});
  const [rfqNo, setRfqNo] = useState(null);
  const [excelData, setExcelData] = useState();
  const [excelDataColumn, setExcelDataColumn] = useState();
  const [remarks, setRemarks] = useState('');
  const [isRejected, setIsRejected] = useState(false);
  const [rejectedDesc, setRejectedDesc] = useState('');
  const [responseDtoList, setResponseDtoList] = useState(null);
  const [responseDtoListAudit, setResponseDtoListAudit] = useState(null);
  const [responseDtoListFinal, setResponseDtoListFinal] = useState(null);
  const [quotationDtoNoList, setResponseQuotationNoList] = useState(null);
  const [csNo, setCsNo] = useState();
  const [createdAtDate, setCreatedAtDate] = useState('');
  const location = useLocation();

  const getTableInfo = async () => {
    const value = location?.state?.isAuditApproved;

    try {
      const {
        data: {
          remarks,
          rfqId,
          csNo,
          createdAt,
          rejectedDesc,
          approvalRemarksResponseDtoList,
          approvalRemarksResponseDtoListAudit,
          approvalRemarksResponseDtoListFinal,
          isRejected,
          csItemPartResponseDtoList: csItemPartResponse,
          csVendorResponseDtoList: vendors,
          quotationNoListDto: quotationNoList,
        },
      } = await API.get(
        value === false
          ? `/logistic/comparative-statements/material-management/existing/${id}`
          : `/logistic/comparative-statements/final-management/existing/${id}`
      );

      setCsNo(csNo);
      setRemarks(remarks);
      setRejectedDesc(rejectedDesc);
      setRfqNo(rfqId);
      setResponseDtoList(approvalRemarksResponseDtoList);
      setResponseDtoListAudit(approvalRemarksResponseDtoListAudit);
      setResponseQuotationNoList(quotationNoList);
      setResponseDtoListFinal(approvalRemarksResponseDtoListFinal);
      setIsRejected(isRejected);
      setCreatedAtDate(timeConverterWithTZ(createdAt));

      const csDetails = vendors.map(modifiedCsDetailsData).flat();
      const vendorNameListLength = vendors.map((v) => v.vendorName);

      const mappedItemParts = csItemPartResponse.map((itemPart) => {
        const { partId } = itemPart;
        const vendors = csDetails.filter((vendor) => partId === vendor.partId);

        return {
          ...itemPart,
          vendors,
        };
      });

      const MAX_COLUMNS = Math.max(
        ...mappedItemParts.map((item) => item.vendors.length)
      );

      setVendorLength(vendorNameListLength);

      const mappedItems = mappedItemParts.map((itemPart) => {
        if (itemPart.vendors.length === MAX_COLUMNS) return itemPart;

        const { vendors } = itemPart;
        const restObjects = MAX_COLUMNS - vendors.length;

        return {
          ...itemPart,
          vendors: [
            ...vendors,
            ...Array(restObjects)
              .fill()
              .map(() => ({
                detailId: null,
                partId: null,
                unitPrice: null,
                leadTime: null,
                currencyCode: null,
                condition: null,
                discount: null,
                vendorPartQuantity: null,
                vendorUomCode: null,
              })),
          ],
          restObjects,
        };
      });
      setGenerateCS(mappedItems);
    } catch (er) {
      console.log(er);
    }
  };

  useEffect(() => {
    getTableInfo();
  }, []);

  return (
    <CommonLayout>
      <ARMBreadCrumbs>
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            {' '}
            <Link to={baseUrl}>
              {' '}
              <i className={icon} />
              &nbsp; {breadcrumbTitle}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={breadcrumbListUrl}>{breadcrumbListTitle}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={LinkWithDownload(
          cardTitle,
          breadcrumbListUrl,
          false,
          permission,
          excelDataColumn,
          excelData,
          csNo
        )}
      >
        <Row style={{ marginLeft: '4px' }}>
          <Col
            sm={24}
            md={2}
          >
            <b>Remarks : </b>
          </Col>
          <Col
            sm={24}
            md={10}
          >
            {remarks || 'N/A'}
          </Col>
        </Row>
        <Row style={{ marginLeft: '4px' }}>
          <Col
            sm={24}
            md={2}
          >
            <b>Created At: </b>
          </Col>
          <Col
            sm={24}
            md={10}
          >
            {createdAtDate || 'N/A'}
          </Col>

          <Col    sm={24}
                  md={10}>
            <ResponsiveTable>
              <div
                  style={
                    quotationDtoNoList?.length > 5
                        ? { height: '220px', overflowY: 'auto' }
                        : null
                  }
              >
                <ARMTable>
                  <thead>
                  <tr>
                    <th>Quotation No</th>
                  </tr>
                  </thead>
                  <tbody>
                  {quotationDtoNoList?.length > 0 &&
                      quotationDtoNoList?.map((data, index) => (
                          <tr key={index}>

                            <td>
                              <Link
                                  to={`/logistic/shipment-provider-quotation/details/${data.quotationId}`}
                                  target="_blank"
                              >

                              {data?.quotationNo}
                              </Link>
                            </td>
                          </tr>
                      ))}
                  </tbody>
                </ARMTable>
                {quotationDtoNoList?.length === 0 && (
                    <Row>
                      <Col style={{ margin: '10px auto' }}>
                        <Empty />
                      </Col>
                    </Row>
                )}
              </div>
            </ResponsiveTable>
          </Col>

        </Row>
        {isRejected && (
          <>
            <Row style={{ marginLeft: '4px' }}>
              <Col
                sm={12}
                md={3}
              >
                <b>Rejected Reason : </b>
              </Col>
              <Col
                sm={12}
                md={20}
              >
                {rejectedDesc || 'N/A'}
              </Col>
            </Row>
          </>
        )}
        <Row style={{ marginLeft: '4px' }}>
          <Col
            sm={24}
            md={2}
          >
            <ApprovedRemarks
              responseDtoList={responseDtoList}
              responseDtoListAudit={responseDtoListAudit}
              responseDtoListFinal={responseDtoListFinal}
            />
          </Col>
        </Row>
      </ARMCard>
      <br />
      <ARMCard title={title}>
        {rfqNo && (
          <>
            {generateCS && (
              <>
                <CSDetailsTable
                  generateCS={generateCS}
                  vendorLength={vendorLength}
                  setExcelData={setExcelData}
                  setExcelDataColumn={setExcelDataColumn}
                  csNo={csNo}
                />
              </>
            )}
          </>
        )}
      </ARMCard>
    </CommonLayout>
  );
};

export default LogisticCSDetails;
