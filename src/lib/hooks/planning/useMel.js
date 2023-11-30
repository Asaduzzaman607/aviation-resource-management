import { Form, notification } from "antd";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import MelService from "../../../service/planning/MelService";
import { getErrorMessage } from "../../common/helpers";
import useAmlOptions from "./useAmlOptions";
import { useParamsId } from "../common";

export function useMel() {
  const id = useParamsId("melId")
  const [isActive, setIsActive] = useState(true);
  const [def, setDef] = useState([]);
  const [rect, setRect] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [allMel, setAllMel] = useState([]);
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [singleMel, setSingleMel] = useState({});
  const [melReport, setMelReport] = useState([]);
  const { initAmls, amls } = useAmlOptions();
  
  const amlItId = Form.useWatch("amlItId", form);
  const amlCtId = Form.useWatch("amlCtId", form);
  
  useEffect(() => {
    if (!amlItId) return;
    
    (async () => {
      await searchDefectByAtlId(amlItId)
    })();
    
  }, [amlItId])
  
  useEffect(() => {
    if (!amlCtId) return;
    
    (async () => {
      await searchRectByAtlId(amlCtId)
    })();
  }, [amlCtId])

  useEffect(() => {
    (async () => {
      await initAmls();
    })();
  }, []);

  useEffect(() => {
    getAllMel();
  }, [isActive, currentPage]);

  const getAllMel = async () => {
    const { data } = await MelService.getAllMel(isActive, currentPage);
    setAllMel(data.model);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
  };

  const getSingleMel = useCallback(async () => {
    
    if (!id) return;
    
    try {
      const { data } = await MelService.getSingleMel(id);
      const { itDefectAmlPageId: amlItId, ctRectificationAmlPageId: amlCtId, itDefectId: intDefRectId, ctRectificationId: correctDefRectId } = data.amlPage;
      
      form.setFieldsValue({
        dueDate: DateTimeConverter.stringToMomentDate(data.dueDate),
        clearedDate: DateTimeConverter.stringToMomentDate(data.clearedDate),
        melCategory: data.melCategory,
        defermentCode: data.defermentCode,
        dmiNo: data.dmiNo,
        intermediateAction: data.intermediateAction,
        amlItId,
        amlCtId,
        intDefRectId,
        correctDefRectId
      })
      
    } catch (error) {
      notification["error"]({
        message: getErrorMessage(error),
      });
    }
  }, [id]);

  useEffect(() => {
    getSingleMel();
  }, [getSingleMel]);

  const onFinish = async (values) => {
    const customValues = {
      ...values,
      dueDate: DateTimeConverter.momentDateToString(values.dueDate),
      clearedDate: DateTimeConverter.momentDateToString(values.clearedDate),
    };
    try {
      if (!id) {
        await MelService.saveMel(customValues);
        notification["success"]({ message: "MEL Added Successfully" });
        navigate("/planning/mel");
      } else {
        await MelService.updateMel(id, customValues);
        notification["success"]({ message: "MEL updated Successfully" });
        navigate("/planning/mel");
      }
    } catch (e) {
      notification["error"]({ message: getErrorMessage(e) });
    }
  };

  const handleReset = () => {
    if (id) {
      form.setFieldsValue({ ...singleMel });
      return;
    }
    form.resetFields();
  };

  const handleStatus = async (id, isActive) => {
    try {
      await MelService.toggleStatus(id, isActive);
      getAllMel();
      notification["success"]({
        message: "Status changed successfully!",
      });
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const searchDefectByAtlId = async (amlId) => {
    const { data } = await MelService.searchDefect(amlId);
    setDef(data);
  };
  
  
  const searchRectByAtlId = async (amlId) => {
    const { data } = await MelService.searchRect(amlId);
    setRect(data);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onMelSearch = async (values) => {
    const searchValues = {
      fromDate: DateTimeConverter.momentDateToString(values.fromDate),
      toDate: DateTimeConverter.momentDateToString(values.toDate),
    };
    try {
      const { data } = await MelService.searchMel(searchValues);
      setMelReport(data.model);
    } catch (error) {
      notification["error"]({ message: getErrorMessage(error) });
    }
  };

  return {
    amls,
    isActive,
    setIsActive,
    onFinish,
    handleReset,
    form,
    def,
    rect,
    searchDefectByAtlId,
    searchRectByAtlId,
    allMel,
    currentPage,
    totalPages,
    handleStatus,
    onReset,
    onMelSearch,
    melReport,
    id,
    setCurrentPage
  };
}
