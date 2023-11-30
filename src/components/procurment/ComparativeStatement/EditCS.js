import { Breadcrumb, Col, Form } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ARMForm from '../../../lib/common/ARMForm';
import { LinkAndTitle, getLinkAndTitle } from '../../../lib/common/TitleOrLink';
import {
  notifyResponseError,
  notifySuccess,
} from '../../../lib/common/notifications';
import { formLayout } from '../../../lib/constants/layout';
import CSService from '../../../service/procurment/CSService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import CommonLayout from '../../layout/CommonLayout';
import SubmitReset from '../../store/common/SubmitReset';
import CSDetailsTableEdit from './CSDetailsTableEdit';

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

const EditCS = ({
  isEditDisposal = false,
  title,
  cardTitle,
  breadcrumbListUrl,
}) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [vendorLength, setVendorLength] = useState([]);
  const [validTill, setValidTill] = useState([]);
  const [rfq, setRfq] = useState({});
  const [generateCS, setGenerateCS] = useState({});
  const [rfqNo, setRfqNo] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [csNo, setCsNo] = useState();
  const navigate = useNavigate();

  const getTableInfo = async () => {
    try {
      const {
        data: {
          remarks,
          rfqId,
          csNo,
          quotationIdList,
          csItemPartResponseDtoList: csItemPartResponse,
          csVendorResponseDtoList: vendors,
        },
      } = await CSService.getExistingCS(id);

      form.setFieldValue('remarks', remarks);
      setCsNo(csNo);
      setRemarks(remarks);
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
                condition: null,
                mov: null,
                moq: null,
                mlv: null,
                currencyCode: null,
                exchangeType: null,
                exchangeFee: null,
                repairCost: null,
                berLimit: null,
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

  const onFinish = async ({ remarks }) => {
    try {
      await CSService.updateRemarks(id, remarks);
      navigate('/material-management/pending-comparative-statement');
      notifySuccess('Updated Successfully');
    } catch (error) {
      notifyResponseError(error);
    }
  };

  const onReset = () => {
    form.setFieldValue('remarks', remarks);
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
            <Link to="/material-management">
              {' '}
              <i className="fa fa-shopping-basket" />
              &nbsp; material-management
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={breadcrumbListUrl}>{title}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {isEditDisposal ? 'Disposal Edit' : 'Edit'}
          </Breadcrumb.Item>
        </Breadcrumb>
      </ARMBreadCrumbs>

      {!isEditDisposal && (
        <>
          <ARMCard
            title={
              <LinkAndTitle
                title="Comparative Statement"
                link="/material-management/pending-comparative-statement"
                addBtn={false}
                permission="MATERIAL_MANAGEMENT_MATERIAL_MANAGEMENT_COMPARATIVE_STATEMENT_MATERIAL_MANAGEMENT_FINAL_PENDING_CS_SAVE"
              />
            }
          >
            <ARMForm
              {...formLayout}
              form={form}
              name="cs"
              onFinish={onFinish}
              scrollToFirstError
            >
              <Col
                sm={20}
                md={10}
              >
                <Form.Item
                  label="Remarks"
                  name="remarks"
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
              <Col style={{ marginLeft: '14%' }}>
                <SubmitReset
                  id={id}
                  onReset={onReset}
                />
              </Col>
            </ARMForm>
          </ARMCard>
          <br />
        </>
      )}
      <ARMCard
        title={getLinkAndTitle(
          cardTitle,
          null, // link is not mandatory
          isEditDisposal ? false : 'blank'
        )}
      >
        {rfqNo && (
          <>
            {generateCS && (
              <>
                <CSDetailsTableEdit
                  csID={id}
                  rfq={rfq}
                  generateCS={generateCS}
                  vendorLength={vendorLength}
                  validTill={validTill}
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

export default EditCS;
