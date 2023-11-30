import { Form } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AircraftBuildsService from "../../../service/AircraftBuildsService";
import AircraftService from "../../../service/AircraftService";
import API from "../../../service/Api";
import { notifyResponseError, notifySuccess } from "../../common/notifications";

const constantMessage = {
  message: {
    success: "Engine times successfully created!",
    update: "Engine Times successfully updated!",
  },
};

export function useEngineTimesAdd() {
  const [aircrafts, setAircrafts] = useState([]);
  const [aircraftId, setAircraftId] = useState();
  const [engines, setEngines] = useState([]);
  const [form] = Form.useForm();
  let { aircraftBuildId } = useParams();
  const [shopVisitTmmId, setShopVisitTmmId] = useState();
  const [shopVisitRgbId, setShopVisitRgbId] = useState();
  const [engineTimesTmmId, setEngineTimesTmmId] = useState();
  const [engineTimesRgbId, setEngineTimesRgbId] = useState();
  let navigate = useNavigate();

  const singleData = async () => {
    const { data } = await API.get(
      `engine/find-by-aircraft-build/${aircraftBuildId}`
    );
    setShopVisitTmmId(data.engineShopVisitViewModels[0].engineShopVisitId);
    setShopVisitRgbId(data.engineShopVisitViewModels[1].engineShopVisitId);
    setEngineTimesTmmId(data.engineTimeViewModels[0].engineTimeId);
    setEngineTimesRgbId(data.engineTimeViewModels[1].engineTimeId);

    form.setFieldsValue({
      ...data,
      nameExtension: data.engineTimeViewModels[1].nameExtension,
      aircraftBuildId: data.aircraftBuildId,
      shopVisitTmmTsn: data.engineShopVisitViewModels[0].tsn,
      shopVisitTmmCsn: data.engineShopVisitViewModels[0].csn,
      shopVisitTmmTso: data.engineShopVisitViewModels[0].tso,
      shopVisitTmmCso: data.engineShopVisitViewModels[0].cso,
      shopVisitTmmStatus: data.engineShopVisitViewModels[0].status,
      shopVisitTmmDate: data.engineShopVisitViewModels[0].date
        ? moment(data.engineShopVisitViewModels[0].date)
        : null,

      shopVisitRgbDate: data.engineShopVisitViewModels[1].date
        ? moment(data.engineShopVisitViewModels[1].date)
        : null,
      shopVisitRgbTsn: data.engineShopVisitViewModels[1].tsn,
      shopVisitRgbCsn: data.engineShopVisitViewModels[1].csn,
      shopVisitRgbTso: data.engineShopVisitViewModels[1].tso,
      shopVisitRgbCso: data.engineShopVisitViewModels[1].cso,
      shopVisitRgbStatus: data.engineShopVisitViewModels[1].status,

      tmmEngineTimesDate: data.engineTimeViewModels[0].date
        ? moment(data.engineTimeViewModels[0].date)
        : null,
      engineTimesTmmHour: data.engineTimeViewModels[0].hour,
      engineTimesTmmCycle: data.engineTimeViewModels[0].cycle,

      engineTimesRgbDate: data.engineTimeViewModels[1].date
        ? moment(data.engineTimeViewModels[1].date)
        : null,
      EngineTimesRgbHour: data.engineTimeViewModels[1].hour,
      EngineTimesRgbCycle: data.engineTimeViewModels[1].cycle,
    });

    const aircraftId = data.aircraftId;
    await getAllEngineByAircraftId(aircraftId);
  };
  useEffect(() => {
    if (!aircraftBuildId) {
      return;
    }
    singleData();
  }, [aircraftBuildId]);

  const getAllAircraft = async () => {
    try {
      const { data } = await AircraftService.getAllAircraftList();
      setAircrafts(data);
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const getAllEngineByAircraftId = async (aircraftId) => {
    try {
      const { data } = await AircraftBuildsService.getAllEngineByAircraftId(
        aircraftId
      );
      setEngines(data);
    } catch (er) {
      notifyResponseError(er);
    }
  };
  const onFinish = async (values) => {
    const convertData = {
      aircraftBuildId: values.aircraftBuildId,
      nameExtension:values.nameExtension,
      engineShopVisitDtoList: [
        //tmm
        {
          engineShopVisitId: aircraftBuildId ? shopVisitTmmId : null,
          modelType: 16,
          date:
            values.shopVisitTmmDate &&
            values["shopVisitTmmDate"].format("YYYY-MM-DD"),
          tsn: values.shopVisitTmmTsn,
          csn: values.shopVisitTmmCsn,
          tso: values.shopVisitTmmTso,
          cso: values.shopVisitTmmCso,
          status: values.shopVisitTmmStatus,
        },
        //rgb
        {
          engineShopVisitId: aircraftBuildId ? shopVisitRgbId : null,
          modelType: 17,
          date:
            values.shopVisitRgbDate &&
            values["shopVisitRgbDate"].format("YYYY-MM-DD"),
          tsn: values.shopVisitRgbTsn,
          tso: values.shopVisitRgbTso,
          csn: values.shopVisitRgbCsn,
          cso: values.shopVisitRgbCso,
          status: values.shopVisitRgbStatus,
        },
      ],
      engineTimeDtoList: [
        //tmm
        {
          engineTimeId: aircraftBuildId ? engineTimesTmmId : null,
          modelType: 16,
          date:
            values.tmmEngineTimesDate &&
            values["tmmEngineTimesDate"].format("YYYY-MM-DD"),
          hour: values.engineTimesTmmHour,
          cycle: values.engineTimesTmmCycle,
        },
        //rgb
        {
          engineTimeId: aircraftBuildId ? engineTimesRgbId : null,
          modelType: 17,
          date:
            values.engineTimesRgbDate &&
            values["engineTimesRgbDate"].format("YYYY-MM-DD"),
          hour: values.EngineTimesRgbHour,
          cycle: values.EngineTimesRgbCycle,
        },
      ],
    };
    try {
      if (aircraftBuildId) {
        const { data } = await API.post(
          `engine/save-update-engine-info`,
          convertData
        );
        notifySuccess(constantMessage.message.update);
        navigate("/planning/engine/times");
      } else {
        const { data } = await API.post(
          `engine/save-update-engine-info`,
          convertData
        );
        notifySuccess(constantMessage.message.success);
        navigate("/planning/engine/times");
      }
    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    if (!aircraftId) {
      return;
    }
    (async () => {
      await getAllEngineByAircraftId(aircraftId);
    })();
  }, [aircraftId]);

  useEffect(() => {
    (async () => {
      await getAllAircraft();
    })();
  }, []);

  const onReset = async () => {
    if (!aircraftBuildId) {
      form.resetFields();
    }
    await singleData();
  };

  return {
    setAircrafts,
    aircrafts,
    setAircraftId,
    engines,
    getAllEngineByAircraftId,
    onFinish,
    onReset,
    form,
    aircraftBuildId,
  };
}
