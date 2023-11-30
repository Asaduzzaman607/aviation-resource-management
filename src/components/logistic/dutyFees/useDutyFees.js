import { FileHeaderInfo } from "@aws-sdk/client-s3";
import { Form, notification } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useARMFileUpload } from "../../../lib/common/ARMFileUpload";
import { getErrorMessage } from "../../../lib/common/helpers";
import API from "../../../service/Api";
import DutyFeesService from "../../../service/logistic/DutyFeesService";

export function useDutyFees() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [downloadLink, setDownloadLink] = useState([]);
  const [dutyFees, setDutyFees] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    handleFileInput,
    selectedFile,
    setSelectedFile,
    handleFilesUpload,
    fileProcessForEdit,
  } = useARMFileUpload();

  const getSingleData = async (id) => {
    try {
      setLoading(true);
      const { data } = await DutyFeesService.getSingleData(id);

      let fileList = fileProcessForEdit(data?.attachment);
      setDownloadLink(fileList ? fileList : []);
      setSelectedFile(fileList ? fileList : []);

      form.setFieldsValue({
        ...data,
        file: fileList ? fileList : [],
        partInvoiceId: data?.partInvoiceId,
        partsInvoiceItemId: data?.partsInvoiceItemId,
        dutyFeeItemRequestDtoList: data?.dutyFeeItemList?.map((list) => ({
          ...list,
          fees: list?.fees,
          totalAmount: list?.totalAmount,
          currencyId: list?.currencyId,
          id: list?.id,
          isActive: list.isActive,
        })),
      });
      await getPurchaseOrder(data?.partInvoiceId);
      setDutyFees(data);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    getSingleData(id);
  }, [id]);

  const onFinish = async (values) => {
    const files = await handleFilesUpload("duty-fees", selectedFile);
    let DutyFeesDetailsList = values.dutyFeeItemRequestDtoList?.map((list) => {
      return {
        fees: list?.fees,
        totalAmount: list?.totalAmount,
        currencyId: list?.currencyId,
        id: list?.id,
        isActive: list?.isActive,
      };
    });

    const modifiedValue = {
      ...values,
      partsInvoiceItemId: values?.partsInvoiceItemId,
      attachment: files,
      dutyFeeItemRequestDtoList: DutyFeesDetailsList,
    };

    const { partInvoiceId, ...modifiedValue2 } = modifiedValue;

    try {
      if (id) {
        let { data } = await DutyFeesService.UpdateDutyFees(id, modifiedValue2);
      } else {
        let { data } = await DutyFeesService.SaveDutyFees(modifiedValue2);
      }
      navigate("/logistic/duty-fees/List");
      notification["success"]({
        message: id ? "Successfully updated!" : "Successfully added!",
      });
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const getPurchaseOrder = async (piId) => {
    if (piId == "" || piId === undefined) setPurchaseOrder([]);
    else {
      let { data } = await DutyFeesService.getPurchaseInvoiceById(piId);
      setPurchaseOrder(data?.partInvoiceItemDtoList);
    }
  };

  const onReset = () => {
    if (id) {
      getSingleData(id);
    } else {
      form.resetFields();
    }
  };

  return {
    id,
    form,
    purchaseOrder,
    getPurchaseOrder,
    onFinish,
    handleFileInput,
    downloadLink,
    onReset,
    loading,
  };
}
