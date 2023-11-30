import { Form, notification } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import ShipmentProviderRfqService from '../../../service/logistic/ShipmentProviderRfqService';

export function useShipmentProviderRfq() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editRfq, setEditRfq] = useState([]);
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [loading, setLoading] = useState(false);

  const stringToMomentDate = (dateString) => {
    if (!dateString) return '';

    return moment(dateString, 'YYYY-MM-DD');
  };
  const getRequestQuotationById = async () => {
    setLoading(true);
    try {
      const { data } =
        await ShipmentProviderRfqService.getRequestForQuotationById(id);
      getPurchaseOrder(data.rfqVendorResponseDto.partOrderId);
      let vlist = [];
      data.rfqVendorResponseDto.quoteRequestVendorModelList?.map((data) =>
        vlist.push({
          ...data,
          requestDate: stringToMomentDate(data.requestDate),
        })
      );
      const modifiedValue = {
        ...data,
        quoteRequestVendorModelList: vlist,
      };
      form.setFieldsValue({
        ...modifiedValue,
        rfqNo: modifiedValue.rfqVendorResponseDto.rfqNo,
        partOrderId: modifiedValue.rfqVendorResponseDto.partOrderId,
        orderId: modifiedValue.rfqVendorResponseDto.orderId,
      });
      setEditRfq(modifiedValue);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!id) {
      return;
    }
    getRequestQuotationById().catch(console.error);
  }, [id]);

  const onFinish = async (values) => {
    let vlist = [];
    values.quoteRequestVendorModelList?.map((data) =>
      vlist.push({
        ...data,
        requestDate: data['requestDate'].format('YYYY-MM-DD'),
      })
    );

    const modifiedValue = {
      ...values,
      quoteRequestVendorModelList: vlist,
    };
    try {
      if (id) {
        let { data } =
          await ShipmentProviderRfqService.updateRequestForQuotation(
            id,
            modifiedValue
          );
      } else {
        let { data } = await ShipmentProviderRfqService.saveRequestForQuotation(
          modifiedValue
        );
      }
      form.resetFields();
      navigate('/logistic/pending-shipment-provider-rfq');
      notification['success']({
        message: id ? 'Successfully updated!' : 'Successfully added!',
      });
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };
  const onReset = () => {
    id ? form.setFieldsValue({ ...editRfq }) : form.resetFields();
  };
  const getPurchaseOrder = async (value) => {
    if (value === '' || value === undefined) setPurchaseOrder([]);
    else {
      let { data } = await ShipmentProviderRfqService.getPurchaseOrderById(
        value
      );
      setPurchaseOrder(data?.poItemResponseDtoList);
    }
  };

  return {
    id,
    form,
    purchaseOrder,
    getPurchaseOrder,
    onFinish,
    onReset,
    loading
  };
}
