import { Form, notification } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import AirportService from "../../../service/AirportService";
import { getErrorMessage } from "../../common/helpers";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import {useAircraftsList} from "./aircrafts";
import {useCallback} from "react";
import API from "../../../service/Api";
import NonRoutineCardServices from "../../../service/NonRoutineCardServices";
import moment from "moment";
import {notifyResponseError, notifyWarning} from "../../common/notifications";

export function useNonRoutineCards() {
  const {id: nonRoutineId} = useParams();
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(true);
  const [airports, setAirports] = useState([]);
  const [currentPage, setCurrentPage] = useState();
  const [singleDefectRect, setSingleDefectRect] = useState([]);
  const navigate = useNavigate();
  const [acCheckIndexs, setAllAcCheckIndexs] = useState([]);
  const aircraftId = Form.useWatch('aircraftId', form);
  const {allAircrafts, getAllAircrafts} = useAircraftsList();

  useEffect(() => {
    (async () => {
      await getAllAircrafts();

    })();
  }, [getAllAircrafts])



  useEffect(() => {
    (async () => {
      await getAllAirports();
    })();
  }, []);


  const getAllACCheckIndex = useCallback(async () => {
    if (!aircraftId) return;
    try {
      const {data} = await API.get(`aircraft-check-index/find-all-ac-check-index/${aircraftId}`)

      setAllAcCheckIndexs(data)
    } catch (er) {
    }
  }, [aircraftId])


  useEffect(() => {
    (async () => {
      await getAllACCheckIndex();
    })();
  }, [getAllACCheckIndex])





  const getAllAirports = async () => {
    try {
      const { data } = await AirportService.getAllAirport();
      setAirports(data);
    } catch (e) {
      notification["error"]({
        message: getErrorMessage(e),
      });
    }
  };

  const handleReset = () => {

    if (nonRoutineId) {
      // form.setFieldsValue({
      //   ...singleDefectRect,
      //   defectDescription:singleDefectRect.defectDescription,
      //   rectDescription:singleDefectRect.rectDescription,
      //   defectSignTime: DateTimeConverter.stringToMomentDateTime(singleDefectRect.defectSignTime),
      //   rectSignTime: DateTimeConverter.stringToMomentDateTime(singleDefectRect.rectSignTime),
      //   issueDate :DateTimeConverter.stringToMomentDateTime(singleDefectRect.issueDate)
      // });
      getNonRoutineCardById()

    } else {
      form.resetFields();
    }
  };


  const onFinish = async (values) => {
    const defectDate1 = form.getFieldValue('defectDate1');
    const defectTime1 = form.getFieldValue('defectTime1');
    const defectDate2 = form.getFieldValue('defectDate2');
    const defectTime2 = form.getFieldValue('defectTime2');

    if (defectDate1 && !defectTime1) {
      notifyWarning("please input defect signature time")
      return;
    }
    if (defectDate2 && !defectTime2) {
      notifyWarning("please input rectifications signature time")
      return;
    }
    if (!defectDate1 && defectTime1) {
      notifyWarning("please input defect signature date")
      return;
    }
    if (!defectDate2 && defectTime2) {
      notifyWarning("please input rectifications signature date")
      return;
    }

    const defectSignDate1 = DateTimeConverter.momentDateToString(values.defectDate1)
    const defectSignTime1 = DateTimeConverter.momentDateTimeToString(values.defectTime1)?.slice(11)
    const rectSignDate1 = DateTimeConverter.momentDateToString(values.defectDate2)
    const rectSignTime1 = DateTimeConverter.momentDateTimeToString(values.defectTime2)?.slice(11)
    const issueDate = DateTimeConverter.momentDateToString(values.issueDate)

    const customValues = {
      ...values,
      id : null,
      defectSignTime : defectSignDate1 + ' ' + defectSignTime1,
      rectSignTime: rectSignDate1 + ' ' + rectSignTime1

    };


    const modifiedValues = {
      aircraftId: customValues.aircraftId,
      nrcNo :  customValues.nrcNo ,
      acCheckIndexId :customValues.acCheckIndexId,
      reference : customValues.reference,
      issueDate : issueDate,
      amlDefectRectificationDto : {
        seqNo: customValues.seqNo,
        defectSignId: customValues.defectSignId,
        defectStaId: customValues.defectStaId,
        defectDmiNo: customValues.defectDmiNo,
        defectDescription: customValues.defectDescription,
        defectSignTime: customValues.defectSignTime,
        rectSignTime: customValues.rectSignTime,
        rectSignId: customValues.rectSignId,
        rectStaId: customValues.rectStaId,
        rectDmiNo: customValues.rectDmiNo,
        rectMelRef: customValues.rectMelRef,
        rectCategory: customValues.rectCategory,
        rectAta: customValues.rectAta,
        rectPos: customValues.rectPos,
        rectPnOff: customValues.rectPnOff,
        rectSnOff: customValues.rectSnOff,
        rectPnOn: customValues.rectPnOn,
        rectSnOn: customValues.rectSnOn,
        rectGrn: customValues.rectGrn,
        rectDescription: customValues.rectDescription,
        reasonForRemoval: customValues.reasonForRemoval,
        remark: customValues.remark,
        id : singleDefectRect?.amlDefectRectificationModelView?.id
      }
    }



    try {
      if (nonRoutineId) {
        await NonRoutineCardServices.updateNonRoutineCard(nonRoutineId, modifiedValues)
      } else {
        let {data} = await NonRoutineCardServices.saveNonRoutineCard(modifiedValues)
      }

      form.resetFields()
      navigate('/planning/non-routine-card')

      notification["success"]({
        message: nonRoutineId ? "Successfully updated!" : "Successfully added!",
      });

    } catch (er) {
      notifyResponseError(er)
    }

  };



  useEffect(() => {
    if (!nonRoutineId) {
      return;
    }
    getNonRoutineCardById().catch(console.error);
  }, [nonRoutineId]);

  const getNonRoutineCardById = async () => {
    try {
      const {data} = await NonRoutineCardServices.getNonRoutineCardById(nonRoutineId);

      const defectDate1 = data?.amlDefectRectificationModelView?.defectSignTime?.slice(0, 10)
      const defectDate2 = data?.amlDefectRectificationModelView?.rectSignTime?.slice(0, 10)
      const defectTime1 = data?.amlDefectRectificationModelView?.defectSignTime?.slice(11)
      const defectTime2 = data?.amlDefectRectificationModelView?.rectSignTime?.slice(11)



      form.setFieldsValue({
        ...data,
        issueDate : data.issueDate? moment(data.issueDate) : null,
        seqNo: data?.amlDefectRectificationModelView?.seqNo,
        defectSignId: data?.amlDefectRectificationModelView?.defectSignId,
        defectStaId: data?.amlDefectRectificationModelView?.defectStaId,
        defectDmiNo: data?.amlDefectRectificationModelView?.defectDmiNo,
        defectDescription: data?.amlDefectRectificationModelView?.defectDescription,
        rectSignId: data?.amlDefectRectificationModelView?.rectSignId,
        rectStaId: data?.amlDefectRectificationModelView?.rectStaId,
        rectDmiNo: data?.amlDefectRectificationModelView?.rectDmiNo,
        rectMelRef: data?.amlDefectRectificationModelView?.rectMelRef,
        rectCategory: data?.amlDefectRectificationModelView?.rectCategory,
        rectAta: data?.amlDefectRectificationModelView?.rectAta,
        rectPos: data?.amlDefectRectificationModelView?.rectPos,
        rectPnOff: data?.amlDefectRectificationModelView?.rectPnOff,
        rectSnOff: data?.amlDefectRectificationModelView?.rectSnOff,
        rectPnOn: data?.amlDefectRectificationModelView?.rectPnOn,
        rectSnOn: data?.amlDefectRectificationModelView?.rectSnOn,
        rectGrn: data?.amlDefectRectificationModelView?.rectGrn,
        rectDescription: data?.amlDefectRectificationModelView?.rectDescription,
        remark: data?.amlDefectRectificationModelView?.remark,
        reasonForRemoval: data?.amlDefectRectificationModelView?.reasonForRemoval,
        defectDate1: defectDate1 && DateTimeConverter.stringToMomentDate(defectDate1),
        defectDate2: defectDate2 && DateTimeConverter.stringToMomentDate(defectDate2),
        defectTime1: defectTime1 && moment(defectTime1, 'HH:mm:ss'),
        defectTime2: defectTime2 && moment(defectTime2, 'HH:mm:ss'),
        nrcId: data?.amlDefectRectificationModelView?.nrcId,
        id: data?.amlDefectRectificationModelView?.id,

      });

      setSingleDefectRect(data)

    } catch (er) {
      notifyResponseError(er)
    }
  };

  return {
    form,
    airports,
    onFinish,
    currentPage,
    setCurrentPage,
    singleDefectRect,
    handleReset,
    isActive,
    setIsActive,
    allAircrafts,
    acCheckIndexs,
    nonRoutineId
  };
}
