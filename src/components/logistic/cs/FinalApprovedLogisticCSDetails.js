import { Breadcrumb, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLinkAndTitleWithFileDownload } from '../../../lib/common/LinkWithDownload';
import API from '../../../service/Api';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import CommonLayout from '../../layout/CommonLayout';
import DetailLogisticCSTable from './DetailLogisticCSTable';
import ApprovedRemarks from '../../common/ApprovedRemarks';

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
    vendorUomCode:csDetail.vendorUomCode,
    vendorPartQuantity:csDetail.vendorPartQuantity,
  }));
}

const FinalApprovedLogisticCSDetails = () => {
  const { id } = useParams();
  const [vendorLength, setVendorLength] = useState([]);
  const [validTill, setValidTill] = useState([]);
  const [rfq, setRfq] = useState({});
  const [generateCS, setGenerateCS] = useState({});
  const [rfqNo, setRfqNo] = useState(null);
  const [responseDtoList, setResponseDtoList] = useState(null);
  const [responseDtoListAudit, setResponseDtoListAudit] = useState(null);
  const [responseDtoListFinal, setResponseDtoListFinal] = useState(null);
  const [excelData, setExcelData] = useState();
  const [excelDataColumn, setExcelDataColumn] = useState();
  const [remarks, setRemarks] = useState('');
  const [csNo, setCsNo] = useState();

  const getTableInfo = async () => {
    try {
      const {
        data: {
          remarks,
          rfqId,
          csNo,
          approvalRemarksResponseDtoList,
          approvalRemarksResponseDtoListAudit,
          approvalRemarksResponseDtoListFinal,
          quotationIdList,
          csItemPartResponseDtoList: csItemPartResponse,
          csVendorResponseDtoList: vendors,
        },
      } = await API.get(
        `/logistic/comparative-statements/material-management/existing/${id}`
      );

      setCsNo(csNo);
      setRemarks(remarks);
      setResponseDtoList(approvalRemarksResponseDtoList)
      setResponseDtoListAudit(approvalRemarksResponseDtoListAudit)
      setResponseDtoListFinal(approvalRemarksResponseDtoListFinal)
      setRfqNo(rfqId);
      setRfq({ rfqId, quotationIdList });
      const csDetails = vendors.map(modifiedCsDetailsData).flat();

      const vendorNameListLength = vendors.map((v) => v.vendorName);
      const validTill = vendors.map((v) => v.validTill);

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
      setValidTill(validTill);

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
                discount:null,
                vendorPartQuantity:null,
                vendorUomCode:null
              })),
          ],
          restObjects,
        };
      });
      console.log('mapped: ', mappedItemParts);
      setGenerateCS(mappedItems);
    } catch (er) {
      console.log(er);
    }
  };

  useEffect(() => {
    getTableInfo();
  }, []);

  console.log('excelData: ', excelData);

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
          <Breadcrumb.Item>Logistic CS Details</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitleWithFileDownload(
          'Comparative Statement',
          '/logistic/final-approved-comparative-statement',
          false,
          'MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_COMPARATIVE_STATEMENT_MATERIAL_MANAGEMENT_FINAL_PENDING_CS_SAVE',
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
        <Row>
        <Col
            sm={24}
            md={2}
          >
           <ApprovedRemarks responseDtoList={responseDtoList} responseDtoListAudit={responseDtoListAudit} responseDtoListFinal={responseDtoListFinal}/>
          </Col>
        </Row>
      </ARMCard>
      <br />
      <ARMCard title="Final Approved CS Details">
        {rfqNo && (
          <>
            {generateCS && (
              <>
                <DetailLogisticCSTable
                  csID={id}
                  rfq={rfq}
                  generateCS={generateCS}
                  vendorLength={vendorLength}
                  validTill={validTill}
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

export default FinalApprovedLogisticCSDetails;
