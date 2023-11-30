import { Form, notification } from "antd";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PositionsService from "../../../service/planning/configurations/PositionsService";
import { getErrorMessage } from "../../common/helpers";

export function usePositions() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [isActive, setIsActive] = useState(true);
  const [position, setPosition] = useState({});
  const [allPositions, setAllPositions] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState();
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  console.log({ pageSize });


  useEffect(() => {
    if (id) {
      getSinglePosition(id);
    }
  }, [id]);

  const initAllPositions = useCallback(async () => {
    try {
      const { data } = await PositionsService.getAllPositions(isActive, currentPage, pageSize);
      setAllPositions(data.model);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (e) {
      notification["error"]({
        message: getErrorMessage(e),
      });
    }
  }, [isActive, currentPage, pageSize]);

  const onFinish = async (values) => {
    if (!id) {
      try {
        const { data } = await PositionsService.savePosition(values);
        notification["success"]({
          message: "Successfully added position",
        });
        navigate("/planning/positions");
      } catch (e) {
        notification["error"]({
          message: getErrorMessage(e),
        });
      }
    } else {
      try {
        const { data } = await PositionsService.updatePosition(id, values);
        notification["success"]({
          message: "Successfully updated position",
        });
        navigate("/planning/positions");
      } catch (e) {
        notification["error"]({
          message: getErrorMessage(e),
        });
      }
    }
  };

  const handleReset = () => {
    if (id) {
      form.setFieldsValue({ ...position });
    } else {
      form.resetFields();
    }
  };

  const getSinglePosition = async () => {
    const { data } = await PositionsService.getSinglePosition(id);
    setPosition({ ...data });
    form.setFieldsValue({ ...data });
  };


  return {
    id,
    allPositions,
    form,
    handleReset,
    onFinish,
    isActive,
    setIsActive,
    totalPages,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    initAllPositions,
  };
}
