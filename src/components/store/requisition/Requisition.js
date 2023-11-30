import { Form, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-use';
import { useARMFileUpload } from '../../../lib/common/ARMFileUpload';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError } from '../../../lib/common/notifications';
import ItemDemandService from '../../../service/ItemDemandService';
import ProqurementRequisitionService from '../../../service/procurment/ProqurementRequisitionService';
import { EditableCell, EditableRow } from './EditableRowAndCell';

export function useRequisition() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [pRequisition, setPRequisition] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [remarks, setRemarks] = useState('');
  const location = useLocation();
  const sdId = location.state.usr?.singleData?.id;

  const [loading, setLoading] = useState(false);
  const [attachmentList, setAttachmentList] = useState([]);
  const {
    handleFileInput,
    selectedFile,
    setSelectedFile,
    handleFilesUpload,
    fileProcessForEdit,
  } = useARMFileUpload();

  console.log('sdId1: ', location);
  console.log('id: ', id);

  const defaultColumns = [
    {
      title: 'Part No.',
      dataIndex: 'partNo',
      width: '10%',
      editable: false,
    },
    {
      title: 'Part Desc.',
      dataIndex: 'partDesc',
      width: '15%',
      editable: false,
    },
    {
      title: 'Available Part',
      dataIndex: 'availablePart',
      width: '5%',
      editable: false,
    },
    {
      title: 'Qty. Demanded',
      dataIndex: 'qtyDemanded',
      width: '10%',
      editable: false,
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      width: '15%',
      editable: false,
      align: 'center',
    },
    {
      title: 'Required Qty.',
      dataIndex: 'requiredQty',
      width: '5%',
      editable: true,
    },
    {
      title: 'Remarks',
      dataIndex: 'remark',
      width: '20%',
      editable: true,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      width: '20%',
      editable: true,
    },
  ];

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        inputType:
          col.dataIndex === 'requiredQty'
            ? 'number'
            : col.dataIndex === 'remark'
            ? 'text-area'
            : col.dataIndex === 'priority'
            ? 'select'
            : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const requisitionDataSave = (data) => {
    let list = data?.map((demand, index) => ({
      key: index.toString(),
      demandItemId: demand.id,
      partNo: demand.partNo,
      partDesc: demand.partDescription,
      availablePart: demand.availablePart,
      qtyDemanded: demand.quantityDemanded,
      issuedQty: demand.quantityIssued,
      uom: demand.unitMeasurementCode,
      requiredQty: demand.requisitionQuantity || 0,
      remark: '',
      priority: demand.priorityType || 'NORMAL',
    }));
    return list ? list : [];
  };

  const requisitionDataUpdate = (data) => {
    let list = data?.map((demand, index) => ({
      key: index.toString(),
      id: demand.id,
      demandItemId: demand.demandItemId,
      partNo: demand.partNo,
      partDesc: demand.partDescription,
      availablePart: demand.availablePart,
      qtyDemanded: demand.quantityDemanded,
      issuedQty: demand.quantityIssued,
      uom: demand.unitMeasurementCode,
      requiredQty: demand.requisitionQuantity,
      remark: demand.remark || '',
      priority: demand.requisitionPriority,
    }));
    return list ? list : [];
  };

  const getOldDemandById = async (id) => {
    if (!id) {
      setDataSource([]);
    } else {
      try {
        const { data } = await ItemDemandService.getItemDemandById(id);
        const list = requisitionDataSave(data.storeDemandDetailsDtoList);
        console.log('data: ', data);
        setDataSource(list);
      } catch (er) {
        notification['error']({ message: getErrorMessage(er) });
      }
    }
  };

  const validateQuantity = (data) => {
    let warning = true;
    data.forEach((item) => {
      if (item.requiredQty > 0) {
        warning = false;
        return warning;
      }
    });
    return warning;
  };

  const onFinish = async (values) => {
    const isEmpty = validateQuantity(dataSource);
    if (isEmpty) {
      notifyError(
        'At least one parts required quantity must be greater than 0!'
      );
      return;
    }

    //file uploading to s3
    const files = await handleFilesUpload('Requisition', selectedFile);
    try {
      if (id) {
        let modifiedValue = {
          ...values,
          attachment: files,
          procurementRequisitionItemDtoList: dataSource.map((data) => ({
            id: data.id,
            demandItemId: data.demandItemId,
            quantityRequested: data.requiredQty,
            remark: data.remark,
            priorityType: data.priority,
          })),
        };
        console.log({ modifiedValue });
        await ProqurementRequisitionService.updateProRequisition(
          id,
          modifiedValue
        );
      } else {
        let modifiedValue = {
          ...values,
          attachment: files,
          procurementRequisitionItemDtoList: dataSource.map((data) => ({
            demandItemId: data.demandItemId,
            quantityRequested: data.requiredQty,
            remark: data.remark,
            priorityType: data.priority,
          })),
        };
        await ProqurementRequisitionService.saveProRequisition(modifiedValue);
      }
      form.resetFields();
      navigate('/store/material-management/requisition/pending');
      notification['success']({
        message: id ? 'Successfully updated!' : 'Successfully added!',
      });
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const onReset = () => {
    if (!id) {
      form.resetFields();
      setDataSource([]);
    } else {
      setDataSource([...pRequisition]);
      form.setFieldsValue({ remarks: remarks });
    }
  };

  const getRequisitionById = async () => {
    try {
      setLoading(true);
      const { data } = await ProqurementRequisitionService.getRequisitionById(
        id
      );
      //console.log('data: ', data);

      let fileList = [];

      if (data.attachment != null) {
        fileList = fileProcessForEdit(data?.attachment);
      }
      setAttachmentList(fileList);
      setSelectedFile(fileList);

      const list = requisitionDataUpdate(data.requisitionItemViewModels);
      form.setFieldsValue({
        voucherNo: data.voucherNo,
        storeDemandId: data.storeDemandId,
        remarks: data.remarks,
      });

      setRemarks(data.remarks);
      setDataSource(list);
      setPRequisition(list);
      console.log('list: ', list);
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    getRequisitionById().catch(console.error);
  }, [id]);

  return {
    id,
    form,
    dataSource,
    components,
    columns,
    getOldDemandById,
    onFinish,
    onReset,
    sdId,
    handleFileInput,
    attachmentList,
    loading,
  };
}
