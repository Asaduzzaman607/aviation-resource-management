import { Form, notification } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import AircraftService from "../../../service/AircraftService";
import SeatingConfigurationService from "../../../service/SeatingConfigurationService";
import { getErrorMessage } from "../../common/helpers";
import axiosInstance from "../../../service/Api";
import { useDispatch } from "react-redux";
import { refreshPagination } from "../paginations";
import {  useParamsId } from "../common";
import {
  notifyResponseError,
  notifySuccess,
  notifyWarning,
} from "../../common/notifications";
import { useBoolean } from "react-use";
import CabinService from "../../../service/CabinService";
import DateTimeConverter from "../../../converters/DateTimeConverter";

export function useAircraftModelList() {
  const [aircraftModelFamilies, setAircraftModelFamilies] = useState([]);
  const getAllAircraftModels = useCallback(async () => {
    try {
      const { data } = await AircraftModelFamilyService.getAllAircraftModels(
        200,
        {
          query: "",
          isActive: true,
        }
      );
      setAircraftModelFamilies(data.model);
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  }, []);
  useEffect(() => {
    getAllAircraftModels();
  }, []);

  return {
    aircraftModelFamilies,
    setAircraftModelFamilies,
  };
}

export function useAircraftsList() {
  const [aircrafts, setAircrafts] = useState([]);
  const [allAircrafts, setAllAircrafts] = useState([]);
  const initAircrafts = useCallback(async () => {
    const res = await AircraftService.getAllAircraft(true);
    setAircrafts(
      res.data.model.map(({ id, aircraftName, airframeSerial, propellerType, engineType }) => ({
        id,
        name: aircraftName,
        serial: airframeSerial,
        propellerType,
        engineType
      }))
    );
  }, []);

  const getAllAircrafts = useCallback(async () => {
    const res = await AircraftService.getAllAircraftList();
    setAllAircrafts(
      res.data.map(({ aircraftId, aircraftName }) => ({
        aircraftId,
        aircraftName,
      }))
    );
  }, []);

  return {
    initAircrafts,
    setAircrafts,
    aircrafts,
    getAllAircrafts,
    allAircrafts
  };
}

export const aircraftValidation = (values) => {
  const specialRegex = `^[0-9.:]+$|^$`;
  if (
    values.airFrameTotalTime &&
    !values.airFrameTotalTime?.toString().match(specialRegex)
  ) {
    notifyWarning("Invalid A/C total time! Only number is allowed");
    return;
  } else if (
    values.bdTotalTime &&
    !values.bdTotalTime?.toString().match(specialRegex)
  ) {
    notifyWarning("Invalid BD total time!Only number is allowed");
    return;
  } else if (
    values.dailyAverageHours &&
    !values.dailyAverageHours?.toString().match(specialRegex)
  ) {
    notifyWarning("Invalid daily average hours!Only number is allowed");
    return;
  } else if (
    values.aircraftCheckDoneHour &&
    !values.aircraftCheckDoneHour?.toString().match(specialRegex)
  ) {
    notifyWarning("Invalid check done hour!Only number is allowed");
    return;
  } else if (
    values.totalApuHours &&
    !values.totalApuHours?.toString().match(specialRegex)
  ) {
    notifyWarning("Invalid total apu hours!Only number is allowed");
    return;
  } else if (
    values.dailyAverageApuHours &&
    !values.dailyAverageApuHours?.toString().match(specialRegex)
  ) {
    notifyWarning("Invalid daily average apu hours!Only number is allowed");
    return;
  }

  const totalApuHours = values.totalApuHours;
  const tapuhs = totalApuHours?.toString().replace(":", ".");
  const tapuh = parseFloat(tapuhs).toFixed(2);
  
  const dailyAverageApuHours = values.dailyAverageApuHours;
  const deapuh = dailyAverageApuHours?.toString().replace(":", ".");
  const dapuh = parseFloat(deapuh).toFixed(2);

  const checkDone = values?.aircraftCheckDoneHour;
  const acdh = checkDone?.toString().replace(":", ".");
  //const acdh = parseFloat(arcdh)?.toFixed(2);

  const totalTime = values?.airFrameTotalTime;
  const aftt = totalTime?.toString().replace(":", ".");
  const aft = parseFloat(aftt).toFixed(2);

  const bdtotaltime = values?.bdTotalTime;
  const bdtt = bdtotaltime?.toString().replace(":", ".");
  const bd = parseFloat(bdtt).toFixed(2);

  const daverage = values?.dailyAverageHours;
  const deavh = daverage?.toString().replace(":", ".");
  const davh=parseFloat(deavh).toFixed(2);

  const value = {
    ...values,
    //manufactureDate: DateTimeConverter.momentDateToString(values.manufactureDate),
    aircraftCheckDoneHour: acdh ? acdh : null,
    airFrameTotalTime: aft,
    bdTotalTime: bd,
    dailyAverageHours: davh,
    totalApuHours: tapuh,
    dailyAverageApuHours: dapuh,
    aircraftCheckDoneDate:
      values.aircraftCheckDoneDate &&
      values["aircraftCheckDoneDate"].format("YYYY-MM-DD"),
    inductionDate:
      values.inductionDate &&
      values["inductionDate"].format("YYYY-MM-DD"),
  };

  const data = {
    ...values,
  //  manufactureDate: DateTimeConverter.momentDateToString(values.manufactureDate),
    aircraftCheckDoneHour: acdh ? acdh : null,
    airFrameTotalTime: aft,
    bdTotalTime: bd,
    dailyAverageHours: davh,
    aircraftCheckDoneDate:
      values.aircraftCheckDoneDate &&
      values["aircraftCheckDoneDate"].format("YYYY-MM-DD"),
    inductionDate:
      values.inductionDate &&
      values["inductionDate"].format("YYYY-MM-DD"),
    totalApuHours: -1,
    totalApuCycle: -1,
    dailyAverageApuHours: -1,
    dailyAverageApuCycle: -1,
  };
  return [value, data];
};

export function useAircrafts() {

  const [aircrafts, setAircrafts] = useState([]);

  const getAllAircrafts = useCallback(async () => {
    const res = await AircraftService.getAllAircraftList();
    setAircrafts(
        res.data.map(({ aircraftId, aircraftName }) => ({
          aircraftId,
          aircraftName,
        }))
    );
  }, []);

  const id = useParamsId();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const cardTitle = id ? "Aircraft Edit" : "Aircraft Add";
  const { aircraftModelFamilies, setAircraftModelFamilies } =
    useAircraftModelList();
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [isApplicableApu, setIsApplicableApu] = useState(false);


  const onApplicableApu = () => {
    setIsApplicableApu(!isApplicableApu);
  };

  useEffect(() => {
    if(id) return
    (async () => {
      await getAllAircrafts();
    })();
  }, [id]);

  const handleModelSubmit = async (values) => {
    const specialRegex = `^[0-9.:]+$|^$`;
    if (values.aircraftCheckHour && !values.aircraftCheckHour.match(specialRegex)) {
      notifyWarning("Invalid check hour! Only number is allowed");
      return;
    }
    const ach = values?.aircraftCheckHour;
    const convertHour = ach?.toString().replace(":", ".");
    const value = {
      ...values,
      aircraftCheckHour: convertHour ? convertHour : null,
    };

    try {
      const { data } = await AircraftModelFamilyService.saveAircraftModelName(
        value
      );

      notification["success"]({
        message: "Model Family successfully created",
      });

      const id = data.id;

      const newModel = {
        aircraftModelName: values.aircraftModelName,
        id,
      };

      console.log({newModel})

      setAircraftModelFamilies((prevState) => [newModel, ...prevState]);
      form.setFieldsValue({ aircraftModelId: id });
      setShowModal(false);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const getAircraftById = async (id) => {
        setIsDisable(true);
    try {
      const { data } = await AircraftService.getAircraftById(id);
      if (
        data.totalApuHours === -1 ||
        data.totalApuCycle === -1 ||
        data.dailyAverageApuHours === -1 ||
        data.dailyAverageApuCycle === -1
      ) {
        setIsApplicableApu(true);
        form.setFieldsValue({
          ...data,
          aircraftCheckDoneHour: data?.aircraftCheckDoneHour?.toFixed(2) .toString().replace(".", ":"),
          airFrameTotalTime: data?.airFrameTotalTime ?.toFixed(2).toString().replace(".", ":"),
          bdTotalTime: data?.bdTotalTime?.toFixed(2).toString().replace(".", ":"),
          dailyAverageHours: data?.dailyAverageHours?.toFixed(2).toString().replace(".", ":"),
          manufactureDate: data?.manufactureDate? moment(data?.manufactureDate): null,
          inductionDate: data?.inductionDate? moment(data?.inductionDate): null,
          aircraftCheckDoneDate: data?.aircraftCheckDoneDate? moment(data?.aircraftCheckDoneDate): null,
          NotApplicableApu: true,
          totalApuHours: "",
          totalApuCycle: "",
          dailyAverageApuHours: "",
          dailyAverageApuCycle: "",
        });
      } else {
        setIsApplicableApu(false);
        form.setFieldsValue({
          ...data,
          aircraftCheckDoneHour: data?.aircraftCheckDoneHour?.toFixed(2).toString().replace(".", ":"),
          airFrameTotalTime: data?.airFrameTotalTime?.toFixed(2).toString().replace(".", ":"),
          bdTotalTime: data?.bdTotalTime?.toFixed(2).toString().replace(".", ":"),
          dailyAverageHours: data?.dailyAverageHours?.toFixed(2).toString().replace(".", ":"),
          totalApuHours: data?.totalApuHours?.toFixed(2).toString().replace(".", ":"),
          dailyAverageApuHours: data?.dailyAverageApuHours?.toFixed(2).toString().replace(".", ":"),
          manufactureDate: data?.manufactureDate? moment(data.manufactureDate): null,
          inductionDate: data?.inductionDate? moment(data.inductionDate): null,
          aircraftCheckDoneDate: data?.aircraftCheckDoneDate? moment(data?.aircraftCheckDoneDate): null,
          NotApplicableApu: false,
        });
        
      }
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  };

  const saveAircraft = async (values) => {

    const [value, data] = aircraftValidation(values);
    try {
      await AircraftService.saveAircraft(isApplicableApu ? data : value);
      notification["success"]({
        message: "Aircraft saved successfully",
      });
      form.resetFields();
      navigate(-1);
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  };

  const updateAircraft = async (id, data) => {
    const specialRegex = `^[0-9.:]+$|^$`;
    if (
      data?.airFrameTotalTime &&
      !data?.airFrameTotalTime?.toString().match(specialRegex)
    ) {
      notifyWarning("Invalid A/C total time! Only number is allowed");
      return;
    } else if (
      data?.bdTotalTime &&
      !data?.bdTotalTime?.toString().match(specialRegex)
    ) {
      notifyWarning("Invalid BD total time!Only number is allowed");
      return;
    } else if (
      data?.dailyAverageHours &&
      !data?.dailyAverageHours?.toString().match(specialRegex)
    ) {
      notifyWarning("Invalid daily average hours!Only number is allowed");
      return;
    } else if (
      data?.aircraftCheckDoneHour &&
      !data?.aircraftCheckDoneHour?.toString().match(specialRegex)
    ) {
      notifyWarning("Invalid check done hour!Only number is allowed");
      return;
    } else if (
      data?.totalApuHours &&
      !data?.totalApuHours?.toString().match(specialRegex)
    ) {
      notifyWarning("Invalid total apu hours!Only number is allowed");
      return;
    } else if (
      data?.dailyAverageApuHours &&
      !data?.dailyAverageApuHours?.toString().match(specialRegex)
    ) {
      notifyWarning("Invalid daily average apu hours!Only number is allowed");
      return;
    }
    const totalApuHours = data.totalApuHours;
    const tapuh = totalApuHours?.toString().replace(":", ".");
    const dailyAverageApuHours = data.dailyAverageApuHours;
    const daapuh = dailyAverageApuHours?.toString().replace(":", ".");
    const dapuh = parseFloat(daapuh).toFixed(2);

    const d = data?.aircraftCheckDoneHour;
    const a = d?.toString().replace(":", ".");
   // const a = parseFloat(acdh).toFixed(2);

    const totalTime = data?.airFrameTotalTime;
    const tt = totalTime?.toString().replace(":", ".");
    const t = parseFloat(tt).toFixed(2);

    const bdtotaltime = data?.bdTotalTime;
    const bdtt = bdtotaltime?.toString().replace(":", ".");
    const bd = parseFloat(bdtt).toFixed(2);

    const daverage = data?.dailyAverageHours;
    const dav = daverage?.toString().replace(":", ".");
    const av= parseFloat(dav).toFixed(2);

    const value = {
      ...data,
      aircraftCheckDoneHour: a ? a : null,
      airFrameTotalTime: t,
      bdTotalTime: bd,
      dailyAverageHours: av,
      totalApuHours: tapuh,
      dailyAverageApuHours: dapuh,
      aircraftCheckDoneDate:
        data?.aircraftCheckDoneDate &&
        data["aircraftCheckDoneDate"].format("YYYY-MM-DD"),
      inductionDate:
        data?.inductionDate &&
        data["inductionDate"].format("YYYY-MM-DD"),
    };
    const values = {
      ...data,
      aircraftCheckDoneHour: a ? a : null,
      airFrameTotalTime: t,
      bdTotalTime: bd,
      dailyAverageHours: av,
      aircraftCheckDoneDate:
        data?.aircraftCheckDoneDate &&
        data["aircraftCheckDoneDate"].format("YYYY-MM-DD"),
      inductionDate:
        data?.inductionDate &&
        data["inductionDate"].format("YYYY-MM-DD"),
      totalApuHours: -1,
      totalApuCycle: -1,
      dailyAverageApuHours: -1,
      dailyAverageApuCycle: -1,
    };
    try {
      await AircraftService.updateAircraft(
        id,
        isApplicableApu ? values : value
      );
      notification["success"]({
        message: "Aircraft updated successfully",
      });
      form.resetFields();
      navigate(-1);
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  };

  const onReset = () => {
    if (id) {
      getAircraftById(id);
    } else {
      form.resetFields();
    }
  };
  const handleModelReset = () => {
    form.resetFields();
  };

  const onFinish = (fieldsValue) => {
    const values = {
      ...fieldsValue,
      manufactureDate: fieldsValue["manufactureDate"]?.format("YYYY-MM-DD"),
    };
    id ? updateAircraft(id, values) : saveAircraft(values);
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    (async () => {
      await getAircraftById(id);
    })();
  }, [id]);

  // useConditionalEffect(() => {
  //   (async () => {
  //     await getAircraftById(id);
  //   })();
  // }, [id], [id !== null])

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  return {
    aircrafts,
    setAircrafts,
    id,
    form,
    navigate,
    showModal,
    setShowModal,
    cardTitle,
    onReset,
    onFinish,
    aircraftModelFamilies,
    onNameChange,
    // addItem,
    name,
    handleModelSubmit,
    handleModelReset,
    isDisable,
    onApplicableApu,
    isApplicableApu,
  };
}

export function useSeatingConfiguration() {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  let { sId } = useParams();
  const [form] = Form.useForm();
  const [aircraft, setAircraft] = useState([]);
  const [cabin, setCabin] = useState([]);
  const [showAircraftModal, setShowAircraftModal] = useBoolean(false);
  const [showCabinModal, setShowCabinModal] = useBoolean(false);
  const [updateData, setUpdateData] = useState();

  const getAllAircraft = async () => {
    const { data } = await AircraftService.getAllAircraftList();
    setAircraft(data);
  };

  const getAllCabin = async () => {
    const { data } = await SeatingConfigurationService.getAllCAbin();
    const temp = data.filter((item) => item.activeStatus == true);
    setCabin(temp);
  };

  const onFinish = async (values) => {
    if (sId) {
      try {
        const single = {
          aircraftId: values.aircraftId,
          cabinId: values.cabinId,
          noOfSeats: values.noOfSeats,
        };
        if (JSON.stringify(single) === JSON.stringify(updateData)) {
          navigate("/planning/seating-configurations");
          return;
        }

        const { data } =
          await SeatingConfigurationService.updateSeatingConfiguration(
            sId,
            single
          );
        dispatch(refreshPagination("aircraftCabin", "aircraft/cabin/search"));
        navigate("/planning/seating-configurations");
        notifySuccess("Seating configuration successfully updated!");
      } catch (er) {
        notification["error"]({ message: getErrorMessage(er) });
      }
    } else {
      try {
        const { data } =
          await SeatingConfigurationService.saveSeatingConfiguration(values);
        dispatch(refreshPagination("aircraftCabin", "aircraft/cabin/search"));
        navigate("/planning/seating-configurations");
        notifySuccess("Seating configuration successfully created!");
      } catch (er) {
        notifyResponseError(er);
      }
    }
  };



  const onReset = async () => {
    if (sId) {
      const { data } = await SeatingConfigurationService.singleData(sId);
      form.resetFields();
      form.setFieldsValue({ ...data, noOfSeats: data.numOfSeats });
    } else {
      form.resetFields();
    }
  };

  const onAircraftFinish = async (values) => {
    const isApplicableTrue = {
      ...values,
      manufactureDate: values["manufactureDate"]?.format("YYYY-MM-DD"),
      totalApuCycle: -1,
      totalApuHours: -1,
      dailyAverageApuCycle: -1,
      dailyAverageApuHours: -1,
    };
    const isApplicableFalse = {
      ...values,
      manufactureDate: values["manufactureDate"]?.format("YYYY-MM-DD"),
    };

    try {
      const { data } = await AircraftService.saveAircraft(
        values.NotApplicableApu ? isApplicableTrue : isApplicableFalse
      );
      const id = data.id;
      const newAircrafts = { aircraftId:id, aircraftName: values.aircraftName };
      setAircraft((prevState) => [newAircrafts, ...prevState]);
      form.setFieldsValue({ aircraftId: id });
      setShowAircraftModal(false);
      notification["success"]({
        message: "Aircraft saved successfully",
      });
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  };

  const onCabinFinished = async (values) => {
    try {
      const { data } = await CabinService.saveCabin(values);
      const id = data.id;
      const newCabin = {
        cabinId: id,
        codeTitle: values.code + " - " + values.title,
      };
      setCabin((prevState) => [newCabin, ...prevState]);
      form.setFieldsValue({ cabinId: id });
      setShowCabinModal(false);
      notification["success"]({
        message: "Cabin successfully created",
      });
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };
  
  const loadSingleData = async (sId) => {
    const { data } = await SeatingConfigurationService.singleData(sId);
    const value = {
      aircraftId: data.aircraftId,
      cabinId: data.cabinId,
      noOfSeats: data.numOfSeats,
    };
    setUpdateData(value);
    form.setFieldsValue({
      ...data,
      aircraftId: data.aircraftId,
      cabinId: data.cabinId,
      noOfSeats: data.numOfSeats,
    });
  };

  useEffect(() => {
    if (!sId) {
      return;
    }
    (async () => {
      loadSingleData(sId);
    })();
  }, [sId]);

  useEffect(() => {
    getAllAircraft();
    getAllCabin();
  }, []);

  return {
    sId,
    form,
    onFinish,
    cabin,
    aircraft,
    onReset,
    getAllAircraft,
    showAircraftModal,
    setShowAircraftModal,
    onAircraftFinish,
    showCabinModal,
    setShowCabinModal,
    onCabinFinished,
  };
}

export function useListOfAircrafts() {
  const [aircrafts, setAircrafts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await axiosInstance.get(
        "/aircrafts/?active=" + true + "&size=1000"
      );
      setAircrafts(
        res.data.model.map(({ id, aircraftName }) => ({
          id,
          name: aircraftName,
        }))
      );
    })();
  }, []);

  return {
    aircrafts,
    setAircrafts,
  };
}

export function useAllAircraftList() {
  const [aircrafts, setAircrafts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await axiosInstance.get(
        "/aircrafts/find-all-active_aircraft");
      setAircrafts(
        res?.data?.map(({ aircraftId, aircraftName }) => ({
          aircraftId,
          aircraftName,
        }))
      );
    })();
  }, []);

  return {
    aircrafts,
    setAircrafts,
  };
}
