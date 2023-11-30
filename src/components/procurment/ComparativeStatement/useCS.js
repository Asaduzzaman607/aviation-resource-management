import { Form, notification } from 'antd';
import { useState } from 'react';
import { getErrorMessage } from '../../../lib/common/helpers';
import CSService from '../../../service/procurment/CSService';

export default function useCS() {
  const [form] = Form.useForm();
  const [allCS, setAllCS] = useState([]);
  const [existingCS, setExistingCS] = useState(null);
  const [quotationList, setQuotationList] = useState([]);
  const [quotationIdList, setQuotationIdList] = useState([]);
  const [orderType, setOrderType] = useState(null);
  const [remarks, setRemarks] = useState('');

  const getAllCS = async (rfqNo) => {
    try {
      const {
        data: { model },
      } = await CSService.getAllCS({
        query: '',
        isActive: true,
        type: 'ALL',
        rfqId: rfqNo,
      });
      setAllCS(model);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getExistingCS = async () => {
    try {
      const { data } = await CSService.getExistingCS(existingCS);
      setQuotationIdList(data.quotationIdList);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getQuotationList = async (id, orderType) => {
    try {
      const {
        data: { model },
      } = await CSService.getQuotationList(id, orderType);
      setQuotationList(model);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const onFinish = (values) => {
    setRemarks(values.remarks);
    getQuotationList(values.rfqNo.value, orderType);
  };

  const onReset = () => {
    form.resetFields();
  };

  return {
    form,
    onFinish,
    onReset,
    allCS,
    getAllCS,
    existingCS,
    setExistingCS,
    getExistingCS,
    quotationList,
    quotationIdList,
    orderType,
    setOrderType,
    remarks,
  };
}
