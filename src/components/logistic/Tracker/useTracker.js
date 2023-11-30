import {Form, notification} from 'antd';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {getErrorMessage} from '../../../lib/common/helpers';
import ShipmentProviderRfqService from '../../../service/logistic/ShipmentProviderRfqService';
import TrackerService from '../../../service/logistic/TrackerService';
import {useARMFileUpload} from "../../../lib/common/ARMFileUpload";

export function useTracker() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editTracker, setEditTracker] = useState([]);
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [downloadLink, setDownloadLink] = useState([]);
  const [loading, setLoading] = useState(false);
  const {handleFileInput, selectedFile, setSelectedFile, handleFilesUpload, fileProcessForEdit} =
    useARMFileUpload();
  const stringToMomentDate = (dateString) => {
    if (!dateString) return '';
    return moment(dateString, 'YYYY-MM-DD');
  };

  const onFinish = async (values) => {
    let fixingDate = [];
    const files = await handleFilesUpload('po-tracker', selectedFile);
    values.poTrackerLocationList?.forEach((item) =>
      fixingDate.push({
        ...item,
        date: item['date'].format('YYYY-MM-DD'),
      })
    );
    const modifiedValue = {
      ...values,
      poTrackerLocationList: fixingDate,
      attachment: files,
      partOrderId: values?.partOrderId.value
    };
    try {
      if (id) {
        await TrackerService.UpdateTracker(id, modifiedValue);
      } else {
        await TrackerService.SaveTracker(modifiedValue);
      }
      form.resetFields();
      navigate('/logistic/tracker-list');
      notification['success']({
        message: id ? 'Successfully updated!' : 'Successfully added!',
      });
    } catch (er) {
      notification['error']({message: getErrorMessage(er)});
    }
  };

  const onReset = () => {
    id ? form.setFieldsValue({...editTracker}) : form.resetFields();
  };

  const getPurchaseOrder = async (value) => {
    if (value === '' || value === undefined) setPurchaseOrder([]);
    else {
      let {data} = await ShipmentProviderRfqService.getPurchaseOrderById(
        value
      );
      setPurchaseOrder(data.poItemResponseDtoList);
    }
  };

  const getTrackerById = async (id) => {
    try {
      setLoading(true);
      const {data} = await TrackerService.getTrackerById(id);
      let fixingDate = [];
      let fileList = [];
      if (data.attachment !== null) {
        fileList = fileProcessForEdit(data?.attachment);
      }
      setDownloadLink(fileList ? fileList : []);
      setSelectedFile(fileList ? fileList : []);
      data.poTrackerLocationList?.map((item) =>
        fixingDate.push({
          ...item,
          date: stringToMomentDate(item.date),
        })
      );
      const modifiedValue = {
        ...data,
        poTrackerLocationList: fixingDate,
        file: fileList ? fileList : [],
        partOrderId:{label:data.partOrderNo, value:data.partOrderId}
      };
      form.setFieldsValue(modifiedValue);
      getPurchaseOrder(data.partOrderId);
      setEditTracker(modifiedValue);

    } catch (er) {
      notification['error']({message: getErrorMessage(er)});
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    id && getTrackerById(id);
  }, [id]);
  return {
    id,
    form,
    purchaseOrder,
    getPurchaseOrder,
    onFinish,
    onReset,
    handleFileInput,
    downloadLink,
    loading
  };
}
