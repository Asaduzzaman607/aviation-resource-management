import { Form, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import API from '../../../service/Api';

export function useIssueDemand() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [selectedStockRoom, setSelectedStockRoom] = useState([]);
  const [selectedDemandNo, setSelectedDemandNo] = useState([]);
  const [storeDemandList, setStoreDemandList] = useState([]);
  const [issueById, setIssueById] = useState([]);

  const layout = {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 14,
    },
  };

  const getIssueDemand = async () => {
    try {
      const { data } = await API.get(`/store/issues/${id}`);
      setIssueById(data);

      form.setFieldsValue({
        ...data,
        storeStockRoomId: {
          value: data.storeStockRoomId,
          label: data.storeStockRoom,
        },
        demandId: {
          value: data.storeDemandId,
          label: data.storeDemandNo,
        },
      });
      setSelectedStockRoom([
        {
          value: data.storeStockRoomId,
          label: data.storeStockRoom,
        },
      ]);
      setSelectedDemandNo([
        {
          value: data.storeDemandId,
          label: data.storeDemandNo,
        },
      ]);
      console.log('list: ', data);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const onReset = () => {
    if (id) {
      getIssueDemand();
    } else {
      form.resetFields();
      setSelectedDemandNo([]);
      setSelectedStockRoom([]);
    }
  };

  useEffect(() => {
    id && getIssueDemand();
  }, [id]);

  return {
    id,
    form,
    layout,
    onReset,
    selectedStockRoom,
    setSelectedStockRoom,
    selectedDemandNo,
    setSelectedDemandNo,
    storeDemandList,
    setStoreDemandList,
    issueById,
  };
}
