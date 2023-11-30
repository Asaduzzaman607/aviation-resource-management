import { Form, notification } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import { getErrorMessage } from "../../../lib/common/helpers";
import API from "../../../service/Api";

export function useGrn() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const modifiedValues = {
      ...values,
      grnNo: values.grnNo,
      createdDate: DateTimeConverter.momentDateToString(values.createdDate),
    };
    try {
      if (id) {
        let { data } = await API.put(`store-inspector/grn/${id}`, {
          ...modifiedValues,
          id,
        });
      } else {
        let { data } = await API.post(`store-inspector/grn`, modifiedValues);
      }
      navigate("/storeInspector/grn-list");
      notification["success"]({
        message: id ? "Successfully updated!" : "Successfully added!",
      });
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const getSingleData = async (id) => {
    try {
      const { data } = await API.get(`store-inspector/grn/${id}`);
      form.setFieldsValue({
        ...data,
        createdDate: data.createdDate ? moment(data.createdDate) : null,
      });
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  useEffect(() => {
    if (!id) return;
    getSingleData(id);
  }, [id]);

  const onReset = () => {
    if (id) {
      getSingleData(id);
    }
    form.resetFields();
  };

  return {
    form,
    onFinish,
    id,
    onReset,
  };
}
