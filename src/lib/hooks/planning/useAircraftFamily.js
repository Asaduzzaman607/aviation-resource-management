import { Form, notification } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import { getErrorMessage } from "../../common/helpers";
import { notifyError, notifyWarning } from "../../common/notifications";

const useAircraftFamily = () => {
  const [formData] = Form.useForm();
  const navigate = useNavigate();
  const { amId } = useParams();
  console.log(amId);

  const saveAircraftModelName = async (data) => {
    const specialRegex = `^[0-9.:]+$|^$`;
    if (data.checkHourForA && !data.checkHourForA.match(specialRegex)) {
      notifyWarning("Invalid A check hour! Only number is allowed");
      return;
    }
    if (data.checkHourForC && !data.checkHourForC.match(specialRegex)) {
      notifyWarning("Invalid C check hour! Only number is allowed");
      return;
    }
    const ach = data?.checkHourForA;
    const convertHour = ach?.toString().replace(":", ".");

    const cch = data?.checkHourForC;
    const convertCHour = cch?.toString().replace(":", ".");
    const values = {
      ...data,
      checkHourForA: convertHour ? convertHour : null,
      checkHourForC: convertCHour ? convertCHour : null,
    };

    try {
      await AircraftModelFamilyService.saveAircraftModelName(values);
      notification["success"]({
        message: "Aircraft model successfully created",
      });
      formData.resetFields();
      navigate(-1);
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  };

  const getAircraftModelById = async (amId) => {
    try {
      const { data } = await AircraftModelFamilyService.getAircraftModelById(
        amId
      );
      formData.setFieldsValue({
        ...data,
        checkHourForA: data?.checkHourForA
          ?.toFixed(2)
          .toString()
          .replace(".", ":"),
        checkHourForC: data?.checkHourForC
          ?.toFixed(2)
          .toString()
          .replace(".", ":"),
      });
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  };

  useEffect(() => {
    if (!amId) {
      return;
    }
    (async () => {
      await getAircraftModelById(amId);
    })();
  }, [amId]);

  const updateAircraftModelName = async (amId, data) => {
    const specialRegex = `^[0-9.:]+$|^$`;
    if (data.checkHourForA && !data.checkHourForA.match(specialRegex)) {
      notifyWarning("Invalid A check hour! Only number is allowed");
      return;
    }
    if (data.checkHourForC && !data.checkHourForC.match(specialRegex)) {
      notifyWarning("Invalid C check hour! Only number is allowed");
      return;
    }
    const ach = data?.checkHourForA;
    const convertHour = ach?.toString().replace(":", ".");

    const cch = data?.checkHourForC;
    const convertCHour = cch?.toString().replace(":", ".");
    const values = {
      ...data,
      checkHourForA: convertHour ? convertHour : null,
      checkHourForC: convertCHour ? convertCHour : null,
    };
    try {
      await AircraftModelFamilyService.updateAircraftName(amId, values);
      notification["success"]({
        message: "Aircraft model successfully updated",
      });
      formData.resetFields();
      navigate(-1);
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  };

  const onReset = () => {
    if (amId) getAircraftModelById(amId);
    else formData.resetFields();
  };

  const onFinish = (values) => {
    console.log("values", values);
    amId
      ? updateAircraftModelName(amId, values)
      : saveAircraftModelName(values);
  };

  return {
    amId,
    formData,
    onReset,
    onFinish,
  };
};

export default useAircraftFamily;
