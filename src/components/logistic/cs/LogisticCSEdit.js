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
import LogisticCSService from '../../../service/logistic/LogisticCSService';
import ARMBreadCrumbs from '../../common/ARMBreadCrumbs';
import ARMCard from '../../common/ARMCard';
import CommonLayout from '../../layout/CommonLayout';
import SubmitReset from '../../store/common/SubmitReset';
import LogisticCSTableEdit from './LogisticCSTableEdit';

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

const LogisticCSEdit = ({
  isEditDisposal = false,
  title,
  cardTitle,
  breadcrumbListUrl,
}) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [vendorLength, setVendorLength] = useState([]);
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
          csItemPartResponseDtoList: csItemPartResponse,
          csVendorResponseDtoList: vendors,
        },
      } = await LogisticCSService.getExistingCS(id);

      form.setFieldValue('remarks', remarks);
      setCsNo(csNo);
      setRemarks(remarks);
      setRfqNo(rfqId);
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
      await LogisticCSService.updateRemarks(id, remarks);
      navigate('/logistic/pending-comparative-statement');
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
            <Link to="/logistic">
              {' '}
              <i className="fas fa-hand-holding-box" />
              &nbsp; Logistic
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
                link="/logistic/pending-comparative-statement"
                addBtn={false}
                permission="LOGISTIC_LOGISTIC_COMPARATIVE_STATEMENT_LOGISTIC_PENDING_CS_SAVE"
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
                <LogisticCSTableEdit
                  generateCS={generateCS}
                  vendorLength={vendorLength}
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

export default LogisticCSEdit;
