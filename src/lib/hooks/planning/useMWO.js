import { Form } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AircraftService from "../../../service/AircraftService";
import MWOService from "../../../service/planning/MWOService";
import { notifyResponseError, notifySuccess } from "../../common/notifications";
import moment from "moment";

const constantMessage = {
  message: {
    success: "Maintenance work order successfully created!",
    update: "Maintenance work order successfully updated!",
  },
};

export function useMWO() {
  let { id } = useParams();
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const [aircrafts, setAircrafts] = useState([]);
  const [aircraftId, setAircraftId] = useState();
  const [isDisabled, setIsDisabled] = useState(false);

  const getALlAircraft = async () => {
    const { data } = await AircraftService.getAllAircraftList();
    setAircrafts(data);
  };

  useEffect(() => {
    (async () => {
      await getALlAircraft();
    })();
  }, []);

  useEffect(() => {
    if (!aircraftId) {
      return;
    }
    (async () => {
      const { data } = await MWOService.getAllAircraftData(aircraftId);
      form.setFieldsValue({
        totalAcHours: data.totalAcHours,
        totalAcLanding: data.totalAcLanding,
        airframeSerial: data.airframeSerial,
        asOfDate: data.asOfDate && moment(data.asOfDate),
        woNo: data.woNo,
      });
    })();
  }, [aircraftId]);

  const singleData = async (id) => {
    try {
      const { data } = await MWOService.getSingleData(id);
      form.setFieldsValue({
        ...data,
        date: data.date && moment(data.date),
        asOfDate: data.asOfDate && moment(data.asOfDate),
        woNo: data.woNo,
        woTaskList: data?.woTaskViewModelList?.map((list) => ({
          ...list,
          accomplishDate: list.accomplishDate && moment(list.accomplishDate),
          complianceDate: list.complianceDate && moment(list.complianceDate),
        })),
      });
      setIsDisabled(true);
    } catch (er) {}
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    (async () => {
      await singleData(id);
    })();
  }, [id]);

  const onFinish = async (values) => {
    const allData = {
      ...values,
      asOfDate: values["asOfDate"].format("YYYY-MM-DD"),
      date: values["date"].format("YYYY-MM-DD"),
      woTaskList: values?.woTaskList?.map((list) => ({
        ...list,
        accomplishDate:
          list.accomplishDate && list.accomplishDate.format("YYYY-MM-DD"),
        complianceDate:
          list.complianceDate && list.complianceDate.format("YYYY-MM-DD"),
      })),
    };
    try {
      if (id) {
        await MWOService.updateMWO(id, allData);
        navigate("/planning/mwos");
      } else {
        await MWOService.saveMWO(allData);
        navigate("/planning/mwos");
      }
      id
        ? notifySuccess(constantMessage.message.update)
        : notifySuccess(constantMessage.message.success);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const onReset = async () => {
    if (!id) {
      form.resetFields();
      return;
    }
    const { data } = await MWOService.getSingleData(id);
    form.resetFields();
    form.setFieldsValue({
      ...data,
      date: data.date && moment(data.date),
      asOfDate: data.asOfDate && moment(data.asOfDate),
      woTaskList: data?.woTaskViewModelList?.map((list) => ({
        ...list,
        accomplishDate: list.accomplishDate && moment(list.accomplishDate),
        complianceDate: list.complianceDate && moment(list.complianceDate),
      })),
    });
  };

  return {
    onFinish,
    id,
    form,
    navigate,
    setAircrafts,
    aircrafts,
    aircraftId,
    setAircraftId,
    isDisabled,
    onReset,
  };
}
