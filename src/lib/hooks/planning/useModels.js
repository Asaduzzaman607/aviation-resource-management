import { useNavigate, useParams } from "react-router-dom";
import { Form, notification } from "antd";
import { useCallback, useEffect, useState } from "react";
import ModelsService from "../../../service/ModelsService";
import { getErrorMessage } from "../../common/helpers";
import { useParts } from "./useParts";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";

export function useAircraftModelList() {
  const [aircraft, setAircraft] = useState([]);
  const getAllAircraft = useCallback(async () => {
    try {
      const { data } = await ModelsService.getAllAircraftModel();
      setAircraft(data.model);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  }, []);

  useEffect(() => {
    getAllAircraft();
  }, []);

  return {
    aircraft,
    setAircraft,
  };
}

export function useModels() {
  let { id } = useParams();
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const { aircraft, setAircraft } = useAircraftModelList();
  const [modelType, setModelType] = useState([]);
  const [lifeCode, setLifeCode] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [aircraftModelFamilies, setAircraftModelFamilies] = useState([]);

  const handleModelSubmit = async (values) => {
    try {
      const { data } = await AircraftModelFamilyService.saveAircraftModelName(
        values
      );

      notification["success"]({
        message: "Model Family successfully created",
      });

      const id = data.id;

      const newModel = {
        aircraftModelName: values.aircraftModelName,
        id,
      };

      setAircraft((prevState) => [newModel, ...prevState]);
      form.setFieldsValue({ aircraftModelId: id });
      setShowModal(false);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const getLifeCode = () => {
    const data = [
      { id: 1, name: "FLY_HOUR" },
      { id: 2, name: "FLY_CYCLE" },
      { id: 3, name: "CALENDER" },
      { id: 4, name: "APU_HOUR" },
      { id: 5, name: "APU_CYCLE" },
    ];
    setLifeCode(data);
  };
  const getAllModelType = async () => {
    const data = [
      { id: 0, name: "AF TCI" },
      { id: 1, name: "COMPONENT" },
      { id: 2, name: "ENGINE" },
      { id: 3, name: "ENGINE LLP" },
      { id: 4, name: "ENGINE LRU" },
      { id: 5, name: "ENGINE TCI" },
      { id: 6, name: "MLG LLP" },
      { id: 7, name: "NLG" },
      { id: 8, name: "MLG" },
      { id: 9, name: "NLG LLP" },
      { id: 10, name: "PROPELLER" },
      { id: 11, name: "PROPELLER TCI" },
      { id:12,  name: "AF LLP"},
      { id:13,  name: "APU LLP"},
      { id:14,  name: "APU LRU"},
      { id:15,  name: "APU TCI"},
      { id:16, name : "ENGINE TMM"},
      { id:17, name : "ENGINE RGB"},
      { id:18, name : "APU"},
      { id:19, name : "CONSUMABLE MODEL"}
    ];
    setModelType(data);
  };

  useEffect(() => {
    getAllModelType();
    getLifeCode();
  }, []);

  useEffect(() => {
    if (id) {
      getLifeCode();
    }
  }, [id]);

  const loadSingleData = async () => {
    try {
      const { data } = await ModelsService.singleData(id);
      form.setFieldsValue({
        ...data,
      });
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const onFinish = async (values) => {
    if (id) {
      try {
        const { data } = await ModelsService.updateModels(id, values);
        navigate("/planning/models");
        notification["success"]({
          message: "Models successfully updated",
        });
      } catch (er) {
        notification["error"]({ message: getErrorMessage(er) });
      }
    } else {
      try {
        const { data } = await ModelsService.saveModels(values);

        notification["success"]({
          message: "Models successfully created",
        });

        navigate("/planning/models");
      } catch (er) {
        notification["error"]({ message: getErrorMessage(er) });
      }
    }
  };

  const onReset = async () => {
    if (id) {
      const { data } = await ModelsService.singleData(id);
      form.resetFields();
      form.setFieldsValue({ ...data });
    } else {
      form.resetFields();
    }
  };

  useEffect(() => {
    if (id) {
      loadSingleData();
    }
  }, [id]);

  return {
    onFinish,
    onReset,
    id,
    setModelType,
    setAircraft,
    setLifeCode,
    modelType,
    aircraft,
    lifeCode,
    form,
    navigate,
    setShowModal,
    showModal,
    handleModelSubmit,
  };
}
