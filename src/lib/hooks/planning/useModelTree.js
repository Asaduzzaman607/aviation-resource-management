import { useNavigate, useParams } from "react-router-dom";
import { Form, notification } from "antd";
import { useEffect, useState, useCallback } from "react";
import { getErrorMessage } from "../../common/helpers";
import ModelTreeService from "../../../service/ModelTreeService";
import LocationsService from "../../../service/planning/configurations/LocationsService";
import PositionsService from "../../../service/planning/configurations/PositionsService";
import { useParts } from "./useParts";
import { useBoolean } from "react-use";
import ModelsService from "../../../service/ModelsService";
import { notifySuccess, notifyWarning } from "../../common/notifications";

const MODEL = "modelId";
const HIGHER_MODEL = "higherModelId";

export function useModelTree(modelForm, positionForm, locationForm) {
  let { MtId } = useParams();
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const [position, setPosition] = useState([]);
  const [location, setLocation] = useState([]);
  const [models, setModels] = useState([]);
  const [higherModels, setHigherModels] = useState([]);
  const [showPositionModal, setShowPositionModal] = useBoolean(false);
  const [showLocationModal, setShowLocationModal] = useBoolean(false);
  const [modelField, setModelField] = useState(MODEL);
  const { handleModelSubmit, showModal, setShowModal } = useParts();
  const [aircraftModelFamilies, setAircraftModelFamilies] = useState([]);
  console.log({ aircraftModelFamilies });
  const [aircraftModelId, setAircraftModelId] = useState();
  const [isDisble,setIsDisable] = useState(false);
  const [updateData, setUpdateData] = useState();

  const getAircraftModelId = (e) => {
    setAircraftModelId(e);
  };
  const getAllModelByAircraftModelId = async () => {
    try {
      const { data } = await ModelTreeService.getAllModelByAircraftModelId(
        aircraftModelId
      );
      setModels(data);
      setHigherModels(data);
    } catch (er) {}
  };
  useEffect(() => {
    if (aircraftModelId) {
      getAllModelByAircraftModelId();
    }
  }, [aircraftModelId]);

  const getAllAircraft = async () => {
    try {
      const { data } = await ModelsService.getAllAircraftModel();
      setAircraftModelFamilies(data.model);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };
  useEffect(() => {
    getAllAircraft();
  }, []);

  const getModelField = useCallback(
    (modelType) => async () => {
      setShowModal();
      setModelField(modelType);
    },
    []
  );

  const getAllPosition = async () => {
    try {
      const { data } = await ModelTreeService.getAllPosition();
      setPosition(data.model);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const getAllLocation = async () => {
    try {
      const { data } = await ModelTreeService.getAllLocation();
      setLocation(data.model);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const loadtSingleData = async () => {
    try {
      const { data } = await ModelTreeService.singleData(MtId);
      
      const updateValues ={
        aircraftModelId: data.aircraftModelId,
        modelId: data.modelId,
        higherModelId: data.higherModelId,
        locationId: data.locationId,
        positionId: data.positionId,
      }
      setUpdateData(updateValues);
      setModels([{ modelId: data.modelId, modelName: data.modelName }]);
      setHigherModels([
        { modelId: data.higherModelId, modelName: data.higherModelName },
      ]);

      form.setFieldsValue({
        ...data,
      });
      setIsDisable(true);
    } catch (er) {}
  };

  const onFinish = async (values) => {
    if (MtId) {
      try {
        if(JSON.stringify(values) === JSON.stringify(updateData)){
         //notifyWarning("Nothing to update!")
         navigate("/planning/model-trees");
         return;
        }
        const { data } = await ModelTreeService.updateModelTree(MtId, values);
        navigate("/planning/model-trees");
        notification["success"]({
          message: "Model tree successfully updated",
        });
      } catch (er) {
        notification["error"]({ message: getErrorMessage(er) });
      }
    } else {
      try {
        const { data } = await ModelTreeService.saveModelTree(values);
        navigate("/planning/model-trees");
        notification["success"]({
          message: "Model tree successfully created",
        });
      } catch (er) {
        notification["error"]({ message: getErrorMessage(er) });
      }
    }
  };

  const onReset = async () => {
    if (MtId) {
      const { data } = await ModelTreeService.singleData(MtId);
      form.resetFields();
      form.setFieldsValue({
        ...data,
      });
      return;
    }
    form.resetFields();
  };

  useEffect(() => {
    loadtSingleData(MtId);
  }, [MtId]);

  useEffect(() => {
    getAllPosition();
    getAllLocation();
  }, []);

  // handle model using promise

  const handleModelAtModelTree = async (values) => {
    try {
      const id = await handleModelSubmit(values);
      modelForm.resetFields();

      setShowModal(false);

      const modelId = id;
      const newModel = {
        modelName: values.modelName,
        modelId,
      };

      setModels((prevState) => [newModel, ...prevState]);

      form.setFieldsValue({ [modelField]: modelId });
    } catch (er) {
    }
  };

  //add location

  const handleLocationSubmit = async (values) => {
    try {
      const { data } = await LocationsService.saveLocation(values);
      locationForm.resetFields();
      notification["success"]({
        message: "Location successfully created",
      });

      const id = data.id;

      const newLocation = {
        name: values.name,
        id,
      };

      setLocation((prevState) => [newLocation, ...prevState]);
      form.setFieldsValue({ locationId: id });
      setShowLocationModal(false);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  // add position
  const handlePositionSubmit = async (values) => {
    try {
      const { data } = await PositionsService.savePosition(values);
      positionForm.resetFields();

      notification["success"]({
        message: "Position successfully created",
      });

      const positionId = data.id;

      const newLocation = {
        name: values.name,
        positionId,
      };

      setPosition((prevState) => [newLocation, ...prevState]);
      form.setFieldsValue({ positionId: positionId });
      setShowPositionModal(false);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  return {
    onFinish,
    onReset,
    MtId,
    form,
    position,
    location,
    models,
    higherModels,
    showPositionModal,
    setShowPositionModal,
    showLocationModal,
    setShowLocationModal,
    handleLocationSubmit,
    handlePositionSubmit,
    handleModelAtModelTree,
    showModal,
    setShowModal,
    getModelField,
    MODEL,
    HIGHER_MODEL,
    modelField,
    setAircraftModelFamilies,
    aircraftModelFamilies,
    getAircraftModelId,
    isDisble
  };
}
