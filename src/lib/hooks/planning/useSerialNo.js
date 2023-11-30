import { Form, notification } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SerialNoServices from "../../../service/SerialNoServices";
import { notifyResponseError } from "../../common/notifications";
import { useCallback } from "react";
import { getErrorMessage } from "../../common/helpers";
import AircraftBuildsService from "../../../service/AircraftBuildsService";
import ModelsService from "../../../service/ModelsService";
import ModelTreeService from "../../../service/ModelTreeService";

export function useSerialNo() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [serials, setSerials] = useState({});
  const [parts, setParts] = useState([]);
  const [consumParts, setConsumParts] = useState([]);
  const [higherPart, setHigherPart] = useState([]);
  const [aircraftMId, setAircraftId] = useState();
  const [modelId, setModelId] = useState();
  const [higherModel, setHigherModel] = useState([]);
  const [aircraftModelFamilies, setAircraftModelFamilies] = useState([]);
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();
  const [consumModel, setConsumModel] = useState([]);

  const getAllAircraftModel = async () => {
    try {
      const { data } = await ModelsService.getAllAircraftModel();
      setAircraftModelFamilies(data.model);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const getComsumModel = async (aircraftMId) => {
    try {
      const { data } = await ModelsService.getConsumModelByAircraftModelId(
        aircraftMId
      );
      setConsumModel(data);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  useEffect(() => {
    if (!aircraftMId) return;
    getComsumModel(aircraftMId);
  }, [aircraftMId]);

  useEffect(() => {
    getAllAircraftModel();
    getAllConsumPart();
  }, []);

  const getAllModel = async (aircraftMId) => {
    try {
      const { data } = await ModelTreeService.getAllModelByAircraftModelId(
        aircraftMId
      );
      setHigherModel(data);
    } catch (er) {}
  };

  useEffect(() => {
    if (!aircraftMId) {
      return;
    }
    (async () => {
      await getAllModel(aircraftMId);
    })();
  }, [aircraftMId]);

  const getAllPart = async (modelId) => {
    try {
      const { data } = await AircraftBuildsService.getAllPartByModelId(modelId);
      setHigherPart(data);
    } catch (er) {}
  };

  const getAllConsumPart = async () => {
    try {
      const { data } = await AircraftBuildsService.getAllConsumPart(modelId);
      setConsumParts(data);
    } catch (er) {}
  };

  useEffect(() => {
    if (!modelId) {
      return;
    }
    (async () => {
      await getAllPart(modelId);
    })();
  }, [modelId]);

  const onSearch = async (value) => {
    try {
      const { data } = await SerialNoServices.searchParts(value);
      setParts(data);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const onFinish = async (values) => {
    // const getPartId = parts?.find(v => v.partNo === values.partId)

    const modifiedValues = {
      // partId: getPartId === undefined ? serials.partId : getPartId.partId,
      partId: values.partId,
      serialNumber: values.serialNumber,
      aircraftModelId: values.aircraftModelId,
    };

    try {
      if (id) {
        await SerialNoServices.updateSerialNo(id, modifiedValues);
        navigate("/planning/serials");
      } else {
        let { data } = await SerialNoServices.saveSerialNo(modifiedValues);
        navigate("/planning/serials");
      }

      notification["success"]({
        message: id
          ? "Serial successfully updated!"
          : " Serial successfully created!",
      });
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const handleReset = () => {
    if (id) {
      form.setFieldsValue({
        partId: serials.partNo,
        serialNumber: serials.serialNumber,
      });
    } else {
      form.resetFields();
    }
  };

  const getSingleSerial = useCallback(async () => {
    if (id === undefined) return;
    try {
      const { data } = await SerialNoServices.getSerialNoById(id);
      getAllModel(data.aircraftModelId);
      getAllPart(data.modelId);

      setSerials({ ...data });
      getComsumModel(data.aircraftModelId);

      // const modelId = data.id;
      //
      // const newModel = {
      //   modelName: values.modelName,
      //   modelId,
      // };
      //
      // setModel((prevState) => [newModel, ...prevState]);
      // form.setFieldsValue({modelId: modelId});
      form.setFieldsValue({ ...data });
      setDisable(true);
    } catch (e) {
      notification["error"]({
        message: getErrorMessage(e),
      });
    }
  }, [id]);

  useEffect(() => {
    (async () => {
      await getSingleSerial();
    })();
  }, [getSingleSerial]);

  return {
    id,
    form,
    handleReset,
    onFinish,
    onSearch,
    setParts,
    parts,
    aircraftModelFamilies,
    setAircraftId,
    higherModel,
    setModelId,
    higherPart,
    disable,
    consumModel,
  };
}
