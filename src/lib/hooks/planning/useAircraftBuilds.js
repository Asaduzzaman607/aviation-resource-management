import { Form, notification } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBoolean } from "react-use";
import { boolean } from "yup";
import { amlFormInitialValues } from "../../../components/planning/aml/MaintenaceLog/aml.constants";
import AircraftBuildsService from "../../../service/AircraftBuildsService";
import AircraftService from "../../../service/AircraftService";
import API from "../../../service/Api";
import SerialNoServices from "../../../service/SerialNoServices";
import { getErrorMessage } from "../../common/helpers";
import { notifyResponseError, notifyWarning } from "../../common/notifications";

export function useAircraftBuilds(parts,serials,serialForm) {

  let { id } = useParams();
  let { status } = useParams();
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const [location, setLocation] = useState([]);

  const [aircraft, setAircraft] = useState([]);
  const [part, setPart] = useState([]);
  const [model, setModel] = useState([]);
  const [higherModel, setHigherModel] = useState([]);
  const [higherPart, setHigherPart] = useState([]);
  const [position, setPosition] = useState([]);

  const [higherModelId, setHigherModelId] = useState();
  const [modelId, setModelId] = useState();

  const [isOver, setIsOver] = useState(false);
  const [isShop, setIsShop] = useState(false);
  const [isTsnAvailable, setIsTsnAvailable] = useState(true);
  const [updatedAircarftDisabled, setUpdatedAircraftDisabled] = useState(false);

  const [p, setP] = useState();
  const [l, setL] = useState();
  const [aicrfatId, setAircraftId] = useState();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(true);

  const [serialId, setSerialId] = useState();
  const [serialData, setSerialData] = useState([]);
  const [higherSerialData, setHigherSerialData] = useState([]);
  const [partId, setPartId] = useState();
  const [higherPartId, setHigherPartId] = useState();

  const [showSerialModal, setShowSerialModal] = useBoolean(false);
  const [showHigherSerialModal, setShowHigherSerialModal] = useBoolean(false);
  let getPartoOject = part?.find((item)=>item.partId===partId)
  let getHigherPartObject = higherPart?.find((item)=>item.partId===higherPartId)


  const handleHigherSerialSubmit = async (values) => {
    try {
      const modifiedValues = {
        partId:getHigherPartObject?.partId,
        serialNumber: values.serialNumber
      }
      let {data} = await SerialNoServices.saveSerialNo(modifiedValues);
        
        notification["success"]({
        message: "Higher serial no successfully created",
      });
      const id = data.id;

      const newParts = {
        higherSerialNo: values.serialNumber,
        higherSerialId:id,
      };

      setHigherSerialData((prevState) => [newParts, ...prevState]);
      form.setFieldsValue({ higherSerialId: id });
      setShowHigherSerialModal(false);
      serialForm.resetFields();
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };


  const handleSerialSubmit = async (values) => {
    try {
      const modifiedValues = {
        partId:getPartoOject.partId,
        serialNumber: values.serialNumber
      }
      let {data} = await SerialNoServices.saveSerialNo(modifiedValues);
      
        notification["success"]({
        message: "Serial no successfully created",
      });
      const id = data.id;

      const newParts = {
        serialId:id,
        serialNo: values.serialNumber
      };

      setSerialData((prevState) => [...prevState ,newParts ]);
      form.setFieldsValue({ serialId: id });
      setShowSerialModal(false);
      serialForm.resetFields();
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };


  const getHigherSerialNoByHigherPartId = async () => {
    const { data } = await API.get(
      `serials/serial-by-part?partId=${higherPartId}`
    );
    const convertData = data?.map((item) => {
      return {
        higherSerialId: item.serialId,
        higherSerialNo: item.serialNo,
      };
    });
    setHigherSerialData(convertData);
  };
  useEffect(() => {
    if (!higherPartId) {
      return;
    }
    (async () => {
      await getHigherSerialNoByHigherPartId(higherPartId);
    })();
  }, [higherPartId]);

  const getSerialNoByPartId = async () => {
    const { data } = await API.get(`serials/serial-by-part?partId=${partId}`);
    setSerialData(data);
  };

  useEffect(() => {
    if (!partId) {
      return;
    }
    (async () => {
      await getSerialNoByPartId();
    })();
  }, [partId]);

  const getAircraftHourAndCycle = async () => {
    const { data } = await API.get(`aircrafts/info/${aicrfatId}`);
    form.setFieldsValue({
      aircraftInHour: data.acHour,
      aircraftInCycle: data.acCycle,
    });
  };

  useEffect(() => {
    if (!aicrfatId) {
      return;
    }
    (async () => {
      await getAircraftHourAndCycle();
    })();
  }, [aicrfatId]);

  const findExistInactiveAircraftBuild = async () => {
    const values = {
      partId: partId,
      serialId: serialId,
    };
    try {
      if (!partId && !serialId) {
        return;
      }
      const { data } =
        await AircraftBuildsService.searchExistInactiveAircraftBuild(values);
      setIsOver(data?.isOverhauled);
      setIsShop(data?.isShopVisited);
      setIsTsnAvailable(data?.isTsnAvailable)
      form.setFieldsValue({
        tsnHour: data.tsnHour.toFixed(2).replace(".", ":"),
        tsnCycle: data.tsnCycle,
        tslsvCycle: data.tslsvCycle,
        tslsvHour: data.tslsvHour.toFixed(2).replace(".", ":"),
        tsoCycle: data.tsoCycle,
        tsoHour: data.tsoHour.toFixed(2).replace(".", ":"),
      });
    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    (async () => {
      if (id) {
        const { data } = await AircraftBuildsService.singleData(id);
        setSerialId(data.serialId);
        setPartId(data.partId);
      }
    })();
  }, [id]);

  // const getSerialNo = (e) => {
  //   setSerialId(e.target.value);
  // };
  const getAircraftId = (e) => {
    setAircraftId(e);
  };
  const getHigherModelId = (e) => {
    setHigherModelId(e);
    form.setFieldsValue({
      higherPartId: "",
      higherSerialNo: "",
      modelId: "",
      partId: "",
      serialNo: "",
      locationId: "",
      positionId: "",
    });
  };

  const getModelId = (e) => {
    setModelId(e);
    form.setFieldsValue({
      partId: "",
      serialNo: "",
      locationId: "",
      positionId: "",
    });
  };

  useEffect(() => {
    getAllAircraft();
  }, []);

  useEffect(() => {
    if (aicrfatId) {
      getAllHigherModel(aicrfatId);
    }
  }, [aicrfatId]);

  useEffect(() => {
    if (higherModelId) {
      getAllModel();
      getAllHigherPart();
    }
    return;
  }, [higherModelId]);

  useEffect(() => {
    if (modelId) {
      getAllPart();
    }
    return;
  }, [modelId]);

  useEffect(() => {
    if (higherModelId && modelId) {
      getLocation();
      getPosition();
    }
  }, [higherModelId, modelId]);

  const onChange = () => {
    setIsOver(!isOver);
  };
  const onShopChange = () => {
    setIsShop(!isShop);
  };
  const onTsnAvailableChange = () => {
    setIsTsnAvailable(!isTsnAvailable);
  };

  useEffect(() => {
    if (isOver === true) {
      setIsShop(true);
    } else {
      setIsShop(false);
    }
  }, [isOver]);

  useEffect(() => {
    if (!id) {
      return;
    }
    (async () => {
      await loadSingleData(id);
    })();
  }, [id]);

  const loadSingleData = async (id) => {
    try {
      const { data } = await AircraftBuildsService.singleData(id);
      const partId = data.partId;
      const hPartId = data.higherPartId;
      setHigherPartId(hPartId);
      setUpdatedAircraftDisabled(true);
      setIsOver(data.isOverhauled);
      setIsShop(data.isShopVisited);
      // setAircraftId(data.aircraftId);
      setHigherModelId(data.higherModelId);
      setIsTsnAvailable(data.isTsnAvailable);
      setModelId(data.modelId);
      setLocation([
        {
          locationId: data.locationId,
          locationName: data.locationName,
          positionId: data.positionId,
          positionName: data.positionName,
        },
      ]);
      setPosition([
        {
          locationId: data.locationId,
          locationName: data.locationName,
          positionId: data.positionId,
          positionName: data.positionName,
        },
      ]);
      setModel([{ modelId: data.modelId, modelName: data.modelName }]);
      setHigherModel([
        {
          modelName: data.higherModelName,
          modelId: data.higherModelId,
        },
      ]);
      form.setFieldsValue({
        ...data,
        tsnHour: data?.tsnHour?.toFixed(2).replace(".", ":"),
        tsoHour: data?.tsoHour?.toFixed(2).replace(".", ":"),
        tslsvHour: data?.tslsvHour?.toFixed(2).replace(".", ":"),
        aircraftInHour: data?.aircraftInHour?.toFixed(2).replace(".", ":"),
        attachDate: moment(data.attachDate),
        comManufactureDate: data.comManufactureDate
          ? moment(data.comManufactureDate)
          : null,
        comCertificateDate: data.comCertificateDate
          ? moment(data.comCertificateDate)
          : null,
      });
      await getSerialNoByPartId(partId);
      await getHigherSerialNoByHigherPartId();
    } catch (er) {}
  };

  const getLocation = async () => {
    try {
      const { data } = await AircraftBuildsService.getLocationAndPosition(
        modelId,
        higherModelId
      );
      const res = data.filter((v,i,a)=>a.findIndex(v2 => (v2.locationId === v.locationId)) ===i );
      setLocation(res);
    } catch (er) {}
  };

  const getPosition = async () => {
    try {
      const { data } = await AircraftBuildsService.getLocationAndPosition(
        modelId,
        higherModelId
      );
      setPosition(data);
    } catch (er) {}
  };

  const getAllAircraft = async () => {
    try {
      const { data } = await AircraftService.getAllAircraftList();
      setAircraft(data);
    } catch (er) {}
  };

  const getAllHigherModel = async (aicrfatId) => {
    try {
      const { data } =
        await AircraftBuildsService.getAllHigherModelByAircraftId(aicrfatId);
      setHigherModel(data);
    } catch (er) {}
  };

  const getAllHigherPart = async () => {
    try {
      const { data } = await AircraftBuildsService.getAllHigherPartByModelId(
        higherModelId
      );
      setHigherPart(data);
    } catch (er) {}
  };

  const getAllModel = async () => {
    try {
      const { data } = await AircraftBuildsService.getAllModelByHigherModelId(
        higherModelId
      );
      setModel(data);
    } catch (er) {}
  };

  const getAllPart = async () => {
    try {
      const { data } = await AircraftBuildsService.getAllPartByModelId(modelId);
      setPart(data);
    } catch (er) {}
  };

  const getPostionIdByLocationId = (locationId) => {
    let data = location.find((l) => l.locationId == locationId);
    console.log("Selected object", data);

    console.log("location ID: ", locationId);
    console.log("Position ID: ", data.positionId);

    setL(data.positionId);
    form.setFieldsValue({ ...form, positionId: data.positionId });
  };

  const getLocationIdByPositionId = (positionId) => {
    let data = position.find((p) => p.positionId == positionId);
    console.log("Selected object", data);

    console.log("Position ID: ", positionId);
    console.log("Location ID: ", data.locationId);

    setP(data.locationId);
    form.setFieldsValue({ ...form, locationId: data.locationId });
  };

  const onFinish = async (values) => {
    
    const specialRegex = `^[0-9.:]+$|^$`;
    if (values?.tsnHour && !values?.tsnHour?.toString().match(specialRegex)) {
      notifyWarning("Invalid TSN hour! Only number is allowed");
      return;
    } else if (values?.tsoHour && !values?.tsoHour?.toString().match(specialRegex)) {
      notifyWarning("Invalid TSO hour! Only number is allowed");
      return;
    } else if (values?.tslsvHour && !values?.tslsvHour?.toString().match(specialRegex)) {
      notifyWarning("Invalid TSLSV hour! Only number is allowed");
      return;
    } else if (values?.aircraftInHour && !values?.aircraftInHour?.toString().match(specialRegex)) {
      notifyWarning("Invalid aircraft in hour! Only number is allowed");
      return;
    }

    const tsnHr = values?.tsnHour;
    const convertTsnHour = tsnHr?.toString().replace(":", ".");

    const tsoHr = values?.tsoHour;
    const convertTsoHour = tsoHr?.toString().replace(":", ".");

    const tslsvHr = values?.tslsvHour;
    const convertTslsvHour = tslsvHr?.toString().replace(":", ".");

    const arInHr = values?.aircraftInHour;
    const convertArInHour = arInHr?.toString().replace(":", ".");

    if (id) {
      const frmate = {
        ...values,
        tsnHour:convertTsnHour,
        tsoHour: convertTsoHour,
        tslsvHour: convertTslsvHour,
        aircraftInHour: convertArInHour,
        locationId: values.locationId,
        positionId: values?.positionId,
        isOverhauled: isOver,
        isShopVisited: isShop,
        partId: values.partId,
        higherPartId: values.higherPartId,
        attachDate: values["attachDate"].format("YYYY-MM-DD"),
        comManufactureDate:
          values.comManufactureDate &&
          values["comManufactureDate"].format("YYYY-MM-DD"),
        comCertificateDate:
          values.comCertificateDate &&
          values["comCertificateDate"].format("YYYY-MM-DD"),
      };
      try {
        console.log("values", frmate);
        const { data } = await AircraftBuildsService.updateAircarftBuild(
          id,
          frmate
        );
        navigate("/planning/aircraft-builds");
        notification["success"]({
          message: "Aircraft Builds successfully updated",
        });
      } catch (er) {
        notification["error"]({ message: getErrorMessage(er) });
      }
    } else {
      const frmate = {
        ...values,
        tsnHour: convertTsnHour,
        tsoHour: convertTsoHour,
        tslsvHour: convertTslsvHour,
        aircraftInHour: convertArInHour,
        locationId: values.locationId,
        positionId: values?.positionId,
        isOverhauled: isOver,
        isShopVisited: isShop,
        partId: values.partId,
        higherPartId: values.higherPartId,
        attachDate: values["attachDate"].format("YYYY-MM-DD"),
        comManufactureDate:
          values.comManufactureDate &&
          values["comManufactureDate"].format("YYYY-MM-DD"),
        comCertificateDate:
          values.comCertificateDate &&
          values["comCertificateDate"].format("YYYY-MM-DD"),
      };
      console.log({ frmate });
      try {
        // console.log({frmate});
        // return
        const { data } = await AircraftBuildsService.saveAircraftBuild(frmate);
        navigate("/planning/aircraft-builds");
        notification["success"]({
          message: "Aircraft Builds successfully created",
        });
      } catch (er) {
        notification["error"]({ message: getErrorMessage(er) });
      }
    }
  };
  const onReset = async () => {
    if (id) {
      const { data } = await AircraftBuildsService.singleData(id);
      form.resetFields();
      form.setFieldsValue({
        ...data,

        attachDate: moment(data.attachDate),
        comManufactureDate: data.comManufactureDate
          ? moment(data.comManufactureDate)
          : null,
        comCertificateDate: data.comCertificateDate
          ? moment(data.comCertificateDate)
          : null,
      });
    } else {
      form.resetFields();
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onAircraftFinish = async (values) => {
    try {
      const { data } = await AircraftService.saveAircraft(values);
      notification["success"]({
        message: "Aircraft saved successfully",
      });

      const aircraftId = data.id;

      const newAircraft = {
        aircraftName: values.aircraftName,
        aircraftId,
      };

      setAircraft((prevState) => [newAircraft, ...prevState]);

      form.setFieldsValue({ aircraftId: aircraftId });
      setIsModalVisible(false);
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  };

  return {
    id,
    form,
    onFinish,
    aircraft,
    getAircraftId,
    getHigherModelId,
    higherModel,
    higherPart,
    model,
    part,
    getPostionIdByLocationId,
    location,
    position,
    getLocationIdByPositionId,
    onChange,
    isOver,
    isShop,
    onShopChange,
    onReset,
    getModelId,
    showModal,
    isModalVisible,
    handleCancel,
    onAircraftFinish,
    openDropdown,
    setOpenDropdown,
    status: status,
    setPartId,
    findExistInactiveAircraftBuild,
    isTsnAvailable,
    onTsnAvailableChange,
    updatedAircarftDisabled,
    serialData,
    setHigherPartId,
    higherSerialData,
    setSerialId,
    showSerialModal,
    setShowSerialModal,
    handleSerialSubmit,
    getPartoOject,
    showHigherSerialModal,
    setShowHigherSerialModal,
    handleHigherSerialSubmit,
    getHigherPartObject
  };
}
