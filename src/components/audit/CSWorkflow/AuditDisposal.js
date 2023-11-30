import { Breadcrumb } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import CSService from '../../../service/procurment/CSService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import CommonLayout from '../../layout/CommonLayout';
import CSTable from './CSTable';

function modifiedCsDetailsData(vendor) {
  return vendor.csqDetailResponseDtoList.map((csDetail) => ({
    detailId: csDetail.detailId,
    partId: csDetail.partId,
    unitPrice: csDetail.unitPrice,
    condition: csDetail.condition,
    mov: csDetail.mov,
    moq: csDetail.moq,
    mlv: csDetail.mlv,
    exchangeType: csDetail.exchangeType,
    exchangeFee: csDetail.exchangeFee,
    repairCost: csDetail.repairCost,
    berLimit: csDetail.berLimit,
    currencyCode: csDetail.currencyCode,
    leadTime: csDetail.leadTime,
    discount: csDetail.discount,
    vendorUomCode: csDetail.vendorUomCode,
    vendorPartQuantity: csDetail.vendorPartQuantity,
    vendorName: vendor.vendorName,
    vendorWorkFlowName: vendor.vendorWorkFlowName,
  }));
}

const AuditDisposal = ({title,cardTitle,breadcrumbListUrl}) => {
  const { id } = useParams();
  const [vendorLength, setVendorLength] = useState([]);
  const [validTill, setValidTill] = useState([]);
  const [rfq, setRfq] = useState({});
  const [generateCS, setGenerateCS] = useState({});
  const [rfqNo, setRfqNo] = useState(null);
  const [csNo, setCsNo] = useState();

  const getTableInfo = async () => {
    try {
      const {
        data: {
          rfqId,
          csNo,
          quotationIdList,
          csItemPartResponseDtoList: csItemPartResponse,
          csVendorResponseDtoList: vendors,
        },
      } = await CSService.getExistingCS(id);

      setCsNo(csNo);
      setRfqNo(rfqId);
      setRfq({ rfqId, quotationIdList });
      const csDetails = vendors.map(modifiedCsDetailsData).flat();

      const vendorNameListLength = vendors.map((v) => {
        return {
          vendorName: v.vendorName,
          vendorWorkFlowName: v.vendorWorkFlowName,
        };
      });
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
                mov: null,
                moq: null,
                mlv: null,
                exchangeType: null,
                exchangeFee: null,
                repairCost: null,
                berLimit: null,
                discount: null,
                vendorPartQuantity: null,
                vendorUomCode: null,
                vendorName: null,
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
            <Link to="/audit">
              {' '}
              <i className="fas fa-user-shield"></i>
              &nbsp; audit
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={breadcrumbListUrl}>{title}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Disposal Edit</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(
           cardTitle,
          '/audit/pending-audit-cs'
        )}
      >
        {rfqNo && (
          <>
            {generateCS && (
              <CSTable
                csID={id}
                rfq={rfq}
                generateCS={generateCS}
                vendorLength={vendorLength}
                validTill={validTill}
                csNo={csNo}
              />
            )}
          </>
        )}
      </ARMCard>
    </CommonLayout>
  );
};

export default AuditDisposal;
