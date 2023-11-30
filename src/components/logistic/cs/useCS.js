import { Form, notification } from 'antd';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../../lib/common/helpers';
import API from '../../../service/Api';

export default function useCS() {
  const [form] = Form.useForm();
  const [allCS, setAllCS] = useState([]);
  const [existingCS, setExistingCS] = useState(null);
  const [quotationList, setQuotationList] = useState([]);
  const [quotationIdList, setQuotationIdList] = useState([]);
  const [remarks, setRemarks] = useState('');

  const getAllCS = async (rfqNo) => {
    try {
      const {
        data: { model },
      } = await API.post('/logistic/comparative-statements/material-management/search', {
        query: '',
        isActive: true,
        type: 'ALL',
        rfqId: rfqNo,
      });
      setAllCS(model);
      console.log('model: ', model);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getExistingCS = async () => {
    try {
      const { data } = await API.get(
        `/logistic/comparative-statements/material-management/existing/${existingCS}`
      );
      console.log('existingCS: ', data);
      setQuotationIdList(data.quotationIdList);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getQuotationList = async (id) => {
    try {
      const {
        data: { model },
      } = await API.get(`/logistic/vendor/quotations/cs/${id}`, {
        query: '',
        isActive: true,
      });
      setQuotationList(model);

      console.log({ model });
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };


  const onFinish = (values) => {
    setRemarks(values.remarks);
    getQuotationList(values.rfqNo.value);
  };

  const onReset = () => {
    form.resetFields();
    // form.setFieldsValue({rfqNo: {label:'',value:''}})
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
    remarks
  };
}
