import { Form, notification } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import CabinService from "../../../service/CabinService";
import { getErrorMessage } from "../../common/helpers";

export default function useCabin() {
    let { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [singleData, setSingleData] = useState({});
  const { t } = useTranslation()
  const loadSingleData = async (id) => {
    try {
      const { data } = await CabinService.singleData(id);
      form.setFieldsValue({
        id: id,
        code: data.code,
        title: data.title,
      });
      setSingleData({
        cabinId: id,
        code: data.code,
        title: data.title,
      });
    } catch (er) {}
  };
  const onFinish = async (values) => {
    if (id) {
      try {
        const single = {
          cabinId: id.toString(),
          code: values.code,
          title: values.title,
        };
        if (JSON.stringify(single) === JSON.stringify(singleData)) {
          navigate("/planning/cabins");
          return;
        }
        const { data } = await CabinService.updateCabin(id, single);
        navigate("/planning/cabins");
        notification["success"]({
          message: "Cabin successfully updated",
        });
      } catch (er) {
        notification["error"]({ message: getErrorMessage(er) });
      }
    } else {
      try {
        const { data } = await CabinService.saveCabin(values);
        navigate("/planning/cabins");
        notification["success"]({
          message: "Cabin successfully created",
        });
      } catch (er) {
        notification["error"]({ message: getErrorMessage(er) });
      }
    }
  };
  const onReset = async () => {
    if (id) {
      const { data } = await CabinService.singleData(id);
      form.resetFields();
      form.setFieldsValue({ ...data });
    } else {
      form.resetFields();
    }
  };
  useEffect(() => {
    if (!id) return;
    loadSingleData(id);
  }, [id]);

  return{
    id,
    t,
    onFinish,
    onReset,
    form
  }
};
