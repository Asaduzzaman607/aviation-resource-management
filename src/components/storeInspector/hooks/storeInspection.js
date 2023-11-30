import { Form, notification } from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../../lib/common/helpers';
import { notifyError, notifyWarning } from '../../../lib/common/notifications';
import API from '../../../service/Api';
import InspectionChecklistService from '../../../service/storeInspector/InspectionChecklistService';
import StoreInspectionService from '../../../service/storeInspector/StoreInspectionService';
import StockInwardService from '../../../service/StockInwardService';

export function useStoreInspector() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [storeInspector, setStoreInspector] = useState([]);
  const [serial, setSerial] = useState([]);
  const [inward, setInward] = useState(true);
  const [loading, setLoading] = useState(false);
  const [field, setField] = useState([]);
  const [stockInwardParts, setStockInwardParts] = useState([]);
  const [poInfo, setPoInfo] = useState({});

  const [selectedPart, setSelectedPart] = useState({ label: '', value: null });
  const checkBoxItem = [
    {
      id: 1,
      name: 'NEW',
    },
    {
      id: 2,
      name: 'O/H',
    },
    {
      id: 3,
      name: 'REP',
    },
    {
      id: 4,
      name: 'MOD',
    },
    {
      id: 5,
      name: 'SHP CK',
    },
    {
      id: 6,
      name: 'INSP',
    },
    {
      id: 7,
      name: 'TEST',
    },
    {
      id: 8,
      name: 'WT CK',
    },
  ];
  const getAllInspectionChecklist = async () => {
    try {
      let { data } = await InspectionChecklistService.getAllInspectionChecklist(
        true,
        'APPROVED'
      );

      const fields = data.model?.map((d) => ({
        descriptionId: d.id,
        description: d.description,
        inspectionStatus: '',
      }));
      setField(fields);
      // render inspection criterion list
      form.setFieldsValue({ inspectionCriterionList: fields });
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const getStoreInspectionById = useCallback(async () => {
    if (field.length === 0) return;

    let copyFields = [...field];

    try {
      let { data } = await StoreInspectionService.getStoreInspectionById(id);
      if (data.inspectionCriterionList != null) {
        data.inspectionCriterionList.forEach((element) => {
          const itemIndex = copyFields.findIndex(
            (o) => o.descriptionId === element.descriptionId
          );
          if (itemIndex > -1) {
            copyFields[itemIndex] = element;
          }
        });
      }

      const { storeStockInward } = data;

      if (!!storeStockInward) {
        // await getSerial(data.partId);
        const modValue = {
          ...data,
          partId: { label: data.partNo, value: data.partId },
          expireDate: !!data.expireDate ? moment(data.expireDate) : '',
          shelfLife: !!data.shelfLife ? moment(data.shelfLife) : '',
          validUntil: data.validUntil,
          serialId: data.serialIdNoDto.serialId,
          uomId: {
            label: data?.serialIdNoDto.uomCode,
            value: data?.serialIdNoDto.uomId,
          },
          inwardId: data.storeStockInward.id,
          inspectionCriterionList: copyFields,
        };

        form.setFieldsValue({ ...modValue });
        setStoreInspector(modValue);
        setInward(true);
      } else {
        const modData = {
          ...data,
          partId: { label: data.partNo, value: data.partId },
          shelfLife: !!data.shelfLife ? moment(data.shelfLife) : '',
          expireDate: !!data.expireDate ? moment(data.expireDate) : '',
          validUntil: data.validUntil,
          storeReturnPartStoreReturnVoucherNo:
            data.storeReturn.storeReturnPartStoreReturnVoucherNo,
          uomId: {
            label: data?.serialIdNoDto.uomCode,
            value: data?.serialIdNoDto.uomId,
          },
          serialNo: data.serialIdNoDto.serialNo,
          approvalAuthNo: data.storeReturn.approvalAuthNo,
          authorizedUser: data.storeReturn.authorizedUser,
          authorizesUser: data.storeReturn.authorizesUser,
          caabRemarks: data.storeReturn.caabRemarks,
          caabStatus: data.storeReturn.caabStatus,
          certApprovalRef: data.storeReturn.certApprovalRef,
          caabCheckbox: data.storeReturn.caabCheckbox,
          authorizedDate: data?.storeReturn.authorizedDate,
          authorizesDate: data?.storeReturn.authorizesDate,
          inspectionCriterionList: copyFields,
        };

        form.setFieldsValue({ ...modData });
        setStoreInspector(modData);
        setInward(false);
      }
    } catch (er) {
      notifyError(getErrorMessage(er));
    }
  }, [field]);

  //fetchng serial by partId
  const getSerial = async (partId) => {
    if (!partId) {
      setSerial([]);
    } else {
      const { partNo } = stockInwardParts?.find(part => part?.partId === partId);
      try {
        const { data } = await API.get(
          `serials/serial-by-part?partId=${partId}`
        );
        setSerial(data);
        setSelectedPart({ label: partNo, value: partId })
      } catch (e) {
        notifyError(getErrorMessage(e) || 'Something went wrong!');
      }
    }
  };

  useEffect(() => {
    (async () => {
      await getAllInspectionChecklist();
    })();
  }, []);

  useEffect(() => {
    if (!id) {
      return;
    }

    (async () => {
      await getStoreInspectionById();
    })();
  }, [id, getStoreInspectionById]);

  const onFinish = async (value) => {

    let saveCriterion = [];

    value.inspectionCriterionList.map((data) => {
      if (data.inspectionStatus.length > 0) {
        saveCriterion.push(data);
      }
    });

    const { shelfLife, expireDate, uomId } = value;
    const partIdType=typeof (value.partId);

    const modvalue = {
      ...value,
      inspectionCriterionList: saveCriterion,
      partId: partIdType === 'number' ? value.partId : value.partId.value,
      shelfLife: !shelfLife ? shelfLife : shelfLife.format('YYYY-MM-DD'),
      expireDate: !expireDate ? expireDate : expireDate.format('YYYY-MM-DD'),
      detailsId: storeInspector?.storeReturn?.storeReturnPartStoreReturnId,
      uomId: uomId.value,
      storeInspectionGrnId:value?.storeInspectionGrnId?.value
    };

    const {approvalAuthNo, authorizedUser,authorizesUser,caabRemarks,caabStatus,certApprovalRef,caabCheckbox, authorizedDate,authorizesDate,...updatedModvalue } = modvalue;
    if (modvalue.inspectionCriterionList.length === 0) {
      notifyWarning('At least Select One description Status');
      return;
    }

    try {
      if (id) {
        const {storeInspectionGrnId,...updateValue}= updatedModvalue
        let { data } = await StoreInspectionService.updateStoreInspection(
          id,
          updateValue
        );
      } else {
        let { data } = await StoreInspectionService.saveStoreInspection(
            updatedModvalue
        );
      }
      form.resetFields();
      navigate('/storeInspector/store-inspection-list');
      notification['success']({
        message: id ? 'Successfully updated!' : 'Successfully added!',
      });
    } catch (er) {
      notification['error']({ message: getErrorMessage(er) });
    }
  };

  const onReset = () => {
    id ? form.setFieldsValue({ ...storeInspector }) : form.resetFields();
  };

  const getStockInwardParts = async (stockInwardId) => {
    try {
      const { data } = await API.get(
        `/store/stock-inwards/poi/${stockInwardId}`
      );
      setStockInwardParts(data);
    } catch (e) {
      notifyError(getErrorMessage(e) || 'Something went wrong!');
    }
  };

  const findPartDescription = (e) => {
    const selectedPart = stockInwardParts?.find((item)=> item.partId===e)
    form.setFieldsValue({ partDescription : selectedPart?.partDescription });
  }


  const getPoByStockInwardId = async (stockInwardId) => {
    try {
      const { data } = await StockInwardService.getPoByStockInwardId(stockInwardId)
      setPoInfo(data);
    } catch (e) {
      notifyError(getErrorMessage(e) || 'Something went wrong!');
    }
  };

  return {
    getSerial,
    loading,
    serial,
    setSerial,
    form,
    id,
    onReset,
    onFinish,
    inward,
    storeInspector,
    checkBoxItem,
    getStockInwardParts,
    stockInwardParts,
    getPoByStockInwardId,
    poInfo,
    findPartDescription,
    selectedPart
  };
}
