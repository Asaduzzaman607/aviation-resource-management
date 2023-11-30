import {Form, notification} from "antd";
import {useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getErrorMessage} from "../../common/helpers";
import API from "../../../service/Api";
import {useAircraftsList} from "./aircrafts";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import moment from "moment";
import WorkPackageCertificationServices from "../../../service/WorkPackageCertificationServices";
import {notifyWarning} from "../../common/notifications";


export function useWorkPackageCertificate() {
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(true);
  const [acCheckIndexs, setAllAcCheckIndexs] = useState([]);
  const {id} = useParams();
  const navigate = useNavigate();
  const aircraftId = Form.useWatch('aircraftId', form);


  const {allAircrafts, getAllAircrafts} = useAircraftsList();

  useEffect(() => {
    (async () => {
      await getAllAircrafts();

    })();
  }, [getAllAircrafts])


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




  const singleWorkPackage = useCallback(async () => {
    if (id === undefined) return;
    try {
      const {data} = await WorkPackageCertificationServices.getWorkPackageCertificationById(id);
      form.setFieldsValue({
        ...data,
        inputDate: data.inputDate ? moment(data.inputDate) : null,
        releaseDate: data.releaseDate ? moment(data.releaseDate) : null,
        asOfDate: data.asOfDate ? moment(data.asOfDate) : null,
        acHours: data?.acHours?.toFixed(2).replace(".", ":"),
        jobCardsDtoList : data.jobCardsViewModels

      });

      setAllAcCheckIndexs([data.acCheckIndexId])

    } catch (e) {
      notification["error"]({
        message: getErrorMessage(e),
      });
    }
  }, [id]);


  useEffect(() => {
    (async () => {
      await singleWorkPackage();
    })();
  }, [singleWorkPackage])


  const onFinish = async (values) => {

    const specialRegex = `^[0-9.:]+$|^$`;
    if (values?.acHours && !values?.acHours?.toString().match(specialRegex)) {
      notifyWarning("Invalid TSN hour! Only number is allowed");
      return;
    }
    const acHr = values?.acHours;
    const convertedAcHour = acHr?.toString().replace(":", ".");

    const modifiedValues = {
      ...values,
      inputDate: DateTimeConverter.momentDateToString(values.inputDate) || '',
      releaseDate: DateTimeConverter.momentDateToString(values.releaseDate) || '',
      asOfDate: DateTimeConverter.momentDateToString(values.asOfDate) || '',
      acHours: convertedAcHour
    }



    try {
      if (id) {
        await WorkPackageCertificationServices.updateWorkPackageCertification(id, modifiedValues)
      } else {
        let {data} = await WorkPackageCertificationServices.saveWorkPackageCertification(modifiedValues)
      }

      form.resetFields()

      navigate('/planning/work-package-certification-record')
      notification["success"]({
        message: id ? "Successfully updated!" : "Successfully added!",
      });

    } catch (er) {
      notification["error"]({message: getErrorMessage(er)});
    }

  };


  const handleStatus = async (id, isActive) => {
    try {
      const {data} = await WorkPackageCertificationServices.toggleStatus(id, isActive);
      notification["success"]({
        message: "Status changed successfully!",
      });
    } catch (er) {
      notification["error"]({message: getErrorMessage(er)});
    }
  };

  const onReset = () => {
    form.resetFields()
  }

  return {
    onFinish,
    onReset,
    id,
    isActive,
    setIsActive,
    form,
    handleStatus,
    acCheckIndexs,
    allAircrafts,

  };
}
