import { Form} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useARMFileUpload } from '../../../lib/common/ARMFileUpload';
import {
  notifyError,
  notifyResponseError,
  notifySuccess,
} from '../../../lib/common/notifications';
import { useParamsId } from '../../../lib/hooks/common';
import ScrapPartsService from '../../../service/store/ScrapPartsService';
import PartsServices from "../../../service/PartsServices";
import {getErrorMessage} from "../../../lib/common/helpers";

export const ROTABLE = 1
export const CONSUMABLE = 2

export function useScrapParts() {
  const id = useParamsId();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [serialNo, setSerialNo] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);
  const [serials, setSerials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [partsId, setPartsId] = useState(null);
  const [storePartsId, setStorePartsId] = useState(null);
  const [selectedPartValue, setSelectedPartValue] = useState(null);
  const { handleFileInput, selectedFile, handleFilesUpload, fileProcessForEdit } =
    useARMFileUpload();

  const fetchEditData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const res = await ScrapPartsService.getScrapPartsById(id);
      const { attachmentList, storeScrapPartViewModels, remarks } = res.data;
      let scrapParts = [];
      if (attachmentList != null) {
        setAttachmentList(fileProcessForEdit(attachmentList));
      }

      let partId;
      let partClassification;
      let scrapPartSerialDtos;

      if (storeScrapPartViewModels != null) {
        scrapParts = storeScrapPartViewModels[0];
        partId = scrapParts.partId;
        partClassification = scrapParts.partClassification;
        setStorePartsId(scrapParts.id);
        setSelectedPartValue({
          label: scrapParts.partNo,
          value: scrapParts.partId,
        });
        scrapPartSerialDtos = scrapParts.partSerialViewModelList.map((item) => {
          return {
            id: item.id,
            quantity: item.quantity,
            storeSerialId: item.serialId,
            serialNo: item.serialNo,
            isActive: item.isActive,
          };
        });
      }
      setPartsId(partId);
      form.setFieldsValue({
        partClassification,
        scrapParts,
        scrapPartSerialDtos,
        remarks,
        partId,
        uomId:{label:scrapParts?.uomCode,value:scrapParts?.uomId}
      });
    } catch (e) {
      notifyResponseError(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  /**
   * This effect fetches edit data when there's an id in route url
   */
  useEffect(() => {
    (async () => {
      await fetchEditData();
    })();
  }, [id, fetchEditData]);

  /**
   * @param {Array} files Array of files
   * @returns {Array} Array of fileLinks
   */

  /**
   * It handles form submit for save and update scrapParts.
   * @param values
   * @returns {Promise<void>}
   */
  const onFinish = async (values) => {
    const files = await handleFilesUpload('ScrapParts', selectedFile);
    const { remarks, scrapPartSerialDtos, partId,uomId} = values;

    let data;

    if (id) {
      data = {
        id,
        remarks,
        attachmentList: files,
        scrapParts: [{ id: storePartsId, scrapPartSerialDtos, partId: partId, uomId: uomId?.value }],
      };
    } else {
      data = {
        remarks,
        attachmentList: files,
        scrapParts: [{ scrapPartSerialDtos, partId: partId?.value,uomId: uomId?.value }],
      };
    }

    console.log('scrap data: ', data);
    try {
      console.log({ id });
      if (id) {
        await ScrapPartsService.updateScrapParts(id, data);
      } else {
        await ScrapPartsService.saveScrapParts(data);
      }
      form.resetFields();
      navigate('/store/pending-scrap-parts');
      notifySuccess(id ? 'Successfully updated!' : 'Successfully added!');
    } catch (er) {
      notifyResponseError(er);
    }
  };

  /**
   * Reset form to initial state
   */
  const onReset = async () => {
    if (id) {
      await fetchEditData();
    } else {
      form.resetFields();
    }
  };

  const classification = Form.useWatch('partClassification', form);
  const getPartDetails=async (value)=>{
   try{
     let {data} = await PartsServices.getPartById(value)
     form.setFieldsValue({uomId:{label:data.unitOfMeasureCode, value :data.unitOfMeasureId}})
   }
   catch (e) {
     notifyError(getErrorMessage(e))
   }
  }

  useEffect(() => {
    const dto = form.getFieldValue('scrapPartSerialDtos');
    const scrapPartSerialDtos = dto.map((item) => ({
      ...item,
      quantity: classification === ROTABLE ? 1 : item.quantity,
    }));
    form.setFieldsValue({ scrapPartSerialDtos });
  }, [classification, form]);

  return {
    form,
    id,
    onReset,
    onFinish,
    serialNo,
    setSerialNo,
    handleFileInput,
    attachmentList,
    serials,
    setSerials,
    loading,
    selectedPartValue,
    setSelectedPartValue,
    partsId,
    setPartsId,
    classification,
    getPartDetails
  };
}
