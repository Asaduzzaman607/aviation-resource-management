import { Form } from "antd";
import { useWatch } from "antd/lib/form/Form";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../service/Api";
import { notifyResponseError, notifySuccess } from "../../common/notifications";

export function useEngineIncident() {
  const [form] = Form.useForm();
  let navigate = useNavigate();
  let { id } = useParams();
  const [engineEnum, setEngineEnum] = useState([]);
  const incidentId = useWatch("engineIncidentsEnum", form);

  const onFinish = async (values) => {
    const customData = {
      ...values,
      date: values["date"].format("YYYY-MM-DD"),
    };
    if (id) {
      try {
        const { data } = await API.put(`engine-incidents/${id}`, customData);
        navigate("/reliability/engine-incidents");
        notifySuccess("Engine Incident successfully updated !");
      } catch (er) {
        notifyResponseError(er);
      }
    } else {
      try {
        const { data } = await API.post(`engine-incidents`, customData);
        navigate("/reliability/engine-incidents");
        notifySuccess("Engine Incident successfully created !");
      } catch (er) {
        notifyResponseError(er);
      }
    }
  };

  const loadSingleData = async (id) => {
    try {
      const { data } = await API.get(`engine-incidents/${id}`);

      form.setFieldsValue({
        ...data,
        date: data?.date ? moment(data?.date) : null,
      });
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const onReset = async () => {
    if (!id) {
      form.resetFields();
    }
    await loadSingleData(id);
  };

  useEffect(() => {
    if (!id) return;
    loadSingleData(id);
  }, [id]);

  const getEngineIncident = () => {
    const data = [
      { id: 0, name: "ENGINE IN FLIGHT SHUT DOWNS INCIDENTS" },
      { id: 1, name: "ENGINES UNSCHEDULED REMOVALS" },
    ];
    setEngineEnum(data);
  };

  useEffect(() => {
    getEngineIncident();
  }, []);

  return {
    engineEnum,
    onFinish,
    form,
    onReset,
  };
}
