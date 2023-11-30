import { Form, notification } from "antd";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import AirportService from "../../../service/AirportService";
import SignaturesService from "../../../service/planning/configurations/SignaturesService";
import DefectRectificationsService from "../../../service/planning/DefectRectificationsService";
import { getErrorMessage } from "../../common/helpers";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import API from "../../../service/Api";

export function useDefect() {
  const { id: amlId } = useParams();
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(true);
  const [airports, setAirports] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [currentPage, setCurrentPage] = useState();
  const [singleDefectRect, setSingleDefectRect] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [amls, setAmls] = useState([]);
  const [defRectId, setDefRectId] = useState();

  const amlIdNum = parseInt(amlId);

  useEffect(() => {
    (async () => {
      await getAllSignatures();
      await getAllAirports();
    })();
  }, []);
  
  
  useEffect(() => {
    if (!isEdit) {
      return;
    }
    onSearch().catch(console.error);
  }, [isEdit]);


  const onSearch = async () => {
    try {
      const { data } = await DefectRectificationsService.searchDefectRect(amlIdNum);
      const updatedData = [
        {
          ...data[0],
          defectSignTime: DateTimeConverter.stringToMomentDateTime(data[0].defectSignTime),
          rectSignTime: DateTimeConverter.stringToMomentDateTime(data[0].rectSignTime),
        },
        {
          ...data[1],
          defectSignTime: DateTimeConverter.stringToMomentDateTime(data[1].defectSignTime),
          rectSignTime: DateTimeConverter.stringToMomentDateTime(data[1].rectSignTime),
        },
      ];
      form.setFieldsValue({ ...updatedData });
      setIsEdit(true);
      setSingleDefectRect(data);
    } catch (e) {
      notification["error"]({ message: getErrorMessage(e) });
    }
  };

  const getAllSignatures = async () => {
    try {
      const { data } = await SignaturesService.getAllSignatures(isActive);
      setSignatures(data.model);
    } catch (e) {
      notification["error"]({
        message: getErrorMessage(e),
      });
    }
  };

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
    if (amlId) {
      form.setFieldsValue({
        ...singleDefectRect,
        defectSignTime: DateTimeConverter.stringToMomentDateTime(singleDefectRect.defectSignTime),
        rectSignTime: DateTimeConverter.stringToMomentDateTime(singleDefectRect.rectSignTime),
      });
    } else {
      form.resetFields();
    }
  };

  const onFinish = async (values) => {
    console.log({ values });
    try {
      setSubmitting(true);
      const customValues = {
        data: [
          {
            ...values[0],
            amlId: amlIdNum,
            defectSignTime: DateTimeConverter.momentDateTimeToString(values[0].defectSignTime),
            rectSignTime: DateTimeConverter.momentDateTimeToString(values[0].rectSignTime),
          },
          {
            ...values[1],
            amlId: amlIdNum,
            defectSignTime: DateTimeConverter.momentDateTimeToString(values[1].defectSignTime),
            rectSignTime: DateTimeConverter.momentDateTimeToString(values[1].rectSignTime),
          },
        ],
      };

      if (!isEdit) {
        console.log("!isEdit", !isEdit);
        const { data } = await DefectRectificationsService.saveDefectRect(customValues);
        await onSearch();
        notification["success"]({
          message: "Successfully added defects & rectifications",
        });

        console.log({ data });
        setSingleDefectRect(data);
        setIsEdit(true);
      } else {
        console.log("values in update block", values[0]);
        console.log("isEdit in else block", isEdit);
        console.log("singleDefectRect[0].id", singleDefectRect);
        const updatedValue = {
          data: [
            {
              ...values[0],
              amlId: amlIdNum,
              id: singleDefectRect[0].id,
              defectSignTime: DateTimeConverter.momentDateTimeToString(values[0].defectSignTime),
              rectSignTime: DateTimeConverter.momentDateTimeToString(values[0].rectSignTime),
            },
            {
              ...values[1],
              amlId: amlIdNum,
              id: singleDefectRect[1].id,
              defectSignTime: DateTimeConverter.momentDateTimeToString(values[0].defectSignTime),
              rectSignTime: DateTimeConverter.momentDateTimeToString(values[0].rectSignTime),
            },
          ],
        };
        console.log("updatedValue", updatedValue);

        const { data } = await DefectRectificationsService.updateDefectRect(updatedValue);
        notification["success"]({
          message: "Successfully updated defects & rectifications",
        });
      }
    } catch (e) {
      notification["error"]({ message: getErrorMessage(e) });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    amls,
    signatures,
    airports,
    onFinish,
    amlId,
    currentPage,
    setCurrentPage,
    singleDefectRect,
    handleReset,
    onSearch,
    isEdit,
    submitting,
    defRectId,
    isActive,
    setIsActive,
  };
}
