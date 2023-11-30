import { Form, notification } from "antd";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import AircraftService from "../../../service/AircraftService";
import PhaseCheckService from "../../../service/planning/PhaseCheckService";
import { getErrorMessage } from "../../common/helpers";

export function usePhaseCheck() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(true);
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [aircrafts, setAircrafts] = useState([]);
  const [phaseCheck, setPhaseCheck] = useState([]);
  const [singlePhaseCheck, setSinglePhaseCheck] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getAllPhaseCheck();
  }, [isActive, currentPage]);

  useEffect(() => {
    getAllAircraft();
  }, []);

  const getAllAircraft = async () => {
    try {
      const { data } = await AircraftService.getAllAircraft(isActive);
      setAircrafts(data.model);
    } catch (e) {
      notification["error"]({
        message: getErrorMessage(e),
      });
    }
  };

  const getAllPhaseCheck = async () => {
    try {
      const { data } = await PhaseCheckService.getAllPhaseCheck(isActive, currentPage);
      setPhaseCheck(data.model);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (e) {
      notification["error"]({
        message: getErrorMessage(e),
      });
    }
  };

  const getSinglePhaseCheck = useCallback(async () => {
    if (id === undefined) return;
    try {
      const { data } = await PhaseCheckService.getSinglePhaseCheck(id);
      const customValues = {
        ...data,
        doneDate: DateTimeConverter.stringToMomentDate(data.doneDate),
      };
      form.setFieldsValue({ ...customValues });
      setSinglePhaseCheck({ ...customValues });
    } catch (e) {
      notification["error"]({
        message: getErrorMessage(e),
      });
    }
  }, [id]);

  useEffect(() => {
    getSinglePhaseCheck();
  }, [getSinglePhaseCheck]);

  const onFinish = async (values) => {
    const customValues = {
      ...values,
      doneDate: DateTimeConverter.momentDateToString(values.doneDate),
    };
    if (!id) {
      try {
        const { data } = await PhaseCheckService.savePhaseCheck(customValues);
        notification["success"]({
          message: "Successfully added A phase check",
        });
        navigate("/planning/phase-check");
      } catch (e) {
        notification["error"]({ message: getErrorMessage(e) });
      }
    } else {
      try {
        const { data } = await PhaseCheckService.updatePhaseCheck(id, customValues);
        notification["success"]({
          message: "Successfully updated A phase check",
        });
        navigate("/planning/phase-check");
      } catch (e) {
        notification["error"]({ message: getErrorMessage(e) });
      }
    }
  };
  const filterAircrafts = async (aircraftId, isActive) => {
    const { data } = await PhaseCheckService.searchPhaseCheckByAircraftId(aircraftId, isActive);
    setPhaseCheck(data);
  };

  const handleResetFilter = () => {
    form.resetFields();
  };

  const onReset = () => {
    if (id) {
      form.setFieldsValue({ ...singlePhaseCheck });
      return;
    }
    form.resetFields();
  };

  const handleStatus = async (id, isActive) => {
    try {
      const { data } = await PhaseCheckService.toggleStatus(id, isActive);
      getAllPhaseCheck();
      notification["success"]({
        message: "Status changed successfully!",
      });
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  return {
    onFinish,
    id,
    form,
    isActive,
    setIsActive,
    currentPage,
    setCurrentPage,
    totalPages,
    handleResetFilter,
    filterAircrafts,
    aircrafts,
    onReset,
    phaseCheck,
    handleStatus,
  };
}
