import { useState } from 'react'
import { useParamsId } from "../../../lib/hooks/common";
import { Form } from "antd";
import API from "../../../service/Api";
import { notifyResponseError, notifySuccess } from "../../../lib/common/notifications";
import { useNavigate } from "react-router-dom";

export function useChecksAdd() {
  const id = useParamsId("checkId") as number;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [showCheckModal, setShowCheckModal] = useState(false)

  const initFetchCheckById = async (id: number) => {
    try {
      const { data: { description, title } } = await API.get(`check/${id}`)
      form.setFieldsValue({ description, title })
    } catch (er) {
    }
  };

  const handleSubmit = async (values: any) => {
    console.log(values)
    try {
      if (id) {
        await API.put(`check/${id}`, values);
        notifySuccess("Check successfully updated")
      } else {
        await API.post("check", values);
        notifySuccess("Check successfully created")
      }

      navigate("/planning/checks");
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const handleReset = async () => {
    if (id) {
      form.resetFields();
      await initFetchCheckById(id);
    } else {
      form.resetFields();
    }
  };

  return {
    id,
    form,
    initFetchCheckById,
    handleSubmit,
    handleReset,
    showCheckModal,
    setShowCheckModal,
    // handleCheckSubmit,
    // handleCheckReset
  }
}