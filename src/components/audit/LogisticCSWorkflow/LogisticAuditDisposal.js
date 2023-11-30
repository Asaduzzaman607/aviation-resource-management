import { Breadcrumb } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import LogisticCSService from '../../../service/logistic/LogisticCSService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import CommonLayout from '../../layout/CommonLayout';
import CSTable from './CSTable';

function modifiedCsDetailsData(vendor) {
  return vendor.csqDetailResponseDtoList.map((csDetail) => ({
    detailId: csDetail.detailId,
    partId: csDetail.partId,
    unitPrice: csDetail.unitPrice,
    leadTime: csDetail.leadTime,
    vendorName: vendor.vendorName,
    currencyCode: csDetail.currencyCode,
    condition: csDetail.condition,
    vendorUomCode: csDetail.vendorUomCode,
    vendorPartQuantity: csDetail.vendorPartQuantity,
    discount: csDetail.discount,
  }));
}

const LogisticAuditDisposal = ({ title,cardTitle,breadcrumbListUrl }) => {
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
          quotationIdList,
          csNo,
          csItemPartResponseDtoList: csItemPartResponse,
          csVendorResponseDtoList: vendors,
        },
      } = await LogisticCSService.getExistingCS(id);

      setCsNo(csNo);
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
            <Link to="/audit">
              {' '}
              <i className="fas fa-user-shield"></i>
              &nbsp; audit
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={breadcrumbListUrl}>
              {title}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Disposal Edit</Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      <ARMCard
        title={getLinkAndTitle(
          cardTitle,
          '/audit/logistic/pending-audit-cs'
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

export default LogisticAuditDisposal;
