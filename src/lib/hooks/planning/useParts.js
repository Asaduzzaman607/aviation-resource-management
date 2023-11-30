import { useNavigate, useParams } from "react-router-dom";
import { Form, notification } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../../common/helpers";
import { useDispatch } from "react-redux";
import PartsServices from "../../../service/PartsServices";
import { refreshPagination } from "../paginations";
import ModelsService from "../../../service/ModelsService";
import { useBoolean } from "react-use";
import ModelTreeService from "../../../service/ModelTreeService";
import { useTranslation } from "react-i18next";
import UseUOM from "../../../components/configaration/unitofMeasurement/uom";
import UnitofMeasurementService from "../../../service/UnitofMeasurementService";
import { notifyResponseError } from "../../common/notifications";

const lifeLimitUnit = [
  { id: 0, name: "FH" },
  { id: 1, name: "FC" },
  { id: 2, name: "AH" },
  { id: 3, name: "AC" },
  { id: 4, name: "DY" },
];

let classifications = [
  {
    id: 1,
    name: "ROTABLE",
  },
  {
    id: 2,
    name: "CONSUMABLE",
  },
  {
    id: 3,
    name: "EXPENDABLE",
  },
];

export function useModelList() {
  const [models, setModels] = useState([]);

  const getAllModels = useCallback(async () => {
    try {
      let { data } = await PartsServices.getAllModels();
      setModels(data.model);
    } catch (er) {
      console.log(er);
    }
  }, []);

  useEffect(() => {
    getAllModels().then(() => console.log("Model Fetched!"));
  }, []);

  return {
    models,
    setModels,
  };
}

export function useParts() {
  const [form] = Form.useForm();
  const aircraftModelId = Form.useWatch("aircraftModelId", form);
  const { partId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedAlternatePart, setSelectedAlternatePart] = useState([]);
  const [partsData, setPartsData] = useState({});
  const { models, setModels } = useModelList();
  const [showModal, setShowModal] = useBoolean(false);

  const [aircraftModelFamilies, setAircraftModelFamilies] = useState([]);
  const [model, setModel] = useState([]);
  const [consumModel, setConsumModel] = useState([]);

  // const [aircraftModelId, setAircraftModelId] = useState();

  const [disable, setDisable] = useState(true);
  const [acTypeDisable, setAcTypeDisable] = useState(false);

  const { t } = useTranslation();

  // const getAircraftModelId = (e) => {
  //   setAircraftModelId(e);
  // };

  const getConsumModel = async (aircraftModelId) => {
    try {
      const { data } = await ModelsService.getConsumModelByAircraftModelId( aircraftModelId);
      setConsumModel(data);
    } catch (er) { 
      notifyResponseError(er);
    }
  };

  const getAllModelByAircraftModelId = async (aircraftModelId) => {
    try {
      const { data } = await ModelTreeService.getAllModelByAircraftModelId(
        aircraftModelId
      );
      setModel(data);
      setDisable(false);
    } catch (er) { }
  };

  useEffect(() => {
    if (!aircraftModelId) {
      return;
    }
    if (aircraftModelId) {
      getAllModelByAircraftModelId(aircraftModelId);
      getConsumModel(aircraftModelId)
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

  const handleModelSubmit = async (values) => {
    try {
      const { data } = await ModelsService.saveModels(values);

      notification["success"]({
        message: "Models successfully created",
      });

      const modelId = data.id;

      const newModel = {
        modelName: values.modelName,
        modelId,
      };

      setModel((prevState) => [newModel, ...prevState]);
      form.setFieldsValue({ modelId: modelId });
      setShowModal(false);

      return Promise.resolve(data.id);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
      return Promise.reject("Message");
    }
  };

  // handle reset input fields
  const onReset = () => {
    if (partId) {
      form.setFieldsValue({ ...partsData });
    } else {
      form.resetFields();
    }
  };

  // get Parts data by id
  useEffect(() => {
    if (!partId) {
      return;
    }
    getPartById().catch(console.error);
  }, [partId]);

  const getPartById = async () => {
    try {
      const { data } = await PartsServices.getPartById(partId);
      getConsumModel(data.aircraftModelId)
      setModel([
        {
          modelId: data.modelId,
          modelName: data.modelName,
          modelType: data.modelType,
        },
      ]);
      setAircraftModelFamilies([
        {
          aircraftModelId: data.aircraftModelId,
          aircraftModelName: data.aircraftModelName,
        },
      ]);


      let temp = [];

      data?.alternateParts?.map((item) => {
        temp.push({
          value: item.id,
          label: item.partNo,
        });
      });

      setSelectedAlternatePart(temp);
      let uom = [];

      data?.partWiseUomResponseDtoList?.map((item) => {
        uom.push({
          value: item.uomId,
          label: item.uomCode,
        });
      });
      form.setFieldsValue({...data, partWiseUomIds: uom});
      setPartsData({...data, partWiseUomIds: uom});
      setAcTypeDisable(true);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  // post api call using async await
  const onFinish = async (values) => {
    let ids = values?.alternatePartIds?.map((part) => {
      return part.value;
    });
    let uomIds = values?.partWiseUomIds?.map((part) => {
      return part.value;
    });

    let ids1= selectedAlternatePart?.map((part) => {
      return part.value;
    }); 
      
    try {
      if (partId) {
        let modifiedValues = { ...values, alternatePartIds: ids ? ids : ids1,partWiseUomIds:uomIds};

        await PartsServices.updatePart(partId, modifiedValues);
      } else {
        let modifiedValues = { ...values, alternatePartIds: ids,partWiseUomIds:uomIds };
        let { data } = await PartsServices.savePart(modifiedValues);
      }

      form.resetFields();
      dispatch(refreshPagination("part", "part/search"));
      navigate("/planning/parts");
      notification["success"]({
        message: partId ? "Successfully updated!" : "Successfully added!",
      });
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  //Title separating
  const TITLE = partId ? t("common.Edit") : t("common.Add");

  return {
    onFinish,
    onReset,
    partId,
    showModal,
    setShowModal,
    setSelectedAlternatePart,
    setPartsData,
    classifications,
    form,
    navigate,
    TITLE,
    selectedAlternatePart,
    models,
    model,
    handleModelSubmit,
    aircraftModelFamilies,
    setAircraftModelFamilies,
    disable,
    acTypeDisable,
    lifeLimitUnit,
    consumModel,
    aircraftModelId
  };
}
