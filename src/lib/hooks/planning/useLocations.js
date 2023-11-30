import { Form, notification } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../service/Api";
import LocationsService from "../../../service/planning/configurations/LocationsService";
import { getErrorMessage } from "../../common/helpers";

export function useLocations() {
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(true);
  const [location, setLocation] = useState({});

  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [allLocations, setAllLocations] = useState([]);
  const [pagesize, setPageSize] = useState(10);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getAllLocation();
  }, [isActive,currentPage,pagesize]);

  const getAllLocation = async () => {
    try {
      const { data } = await LocationsService.getAllLocations(isActive, currentPage,pagesize);
      setAllLocations(data.model);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (e) {
      notification["error"]({
        message: getErrorMessage(e),
      });
    }
  };


  const singleLocation = useCallback(async () => {
    if (id === undefined) return;
    try {
      const { data } = await LocationsService.getSingleLocation(id);
      form.setFieldsValue({ ...data });
      setLocation({...data})
    } catch (e) {
      notification["error"]({
        message: getErrorMessage(e),
      });
    }
  }, [id]);

  useEffect(() => {
    singleLocation();
  }, [singleLocation]);

  const onFinish = async (values) => {
    if (!id) {
      try {
        const { data } = await LocationsService.saveLocation(values);
        navigate("/planning/locations");
        notification["success"]({
          message: "Successfully added location",
        });
      } catch (error) {
        notification["error"]({
          message: getErrorMessage(error),
        });
      }
    } else {
      try {
        const { data } = await LocationsService.updateLocation(id, values);
        navigate("/planning/locations");
        notification["success"]({
          message: "Successfully updated location",
        });
      } catch (error) {
        notification["error"]({
          message: getErrorMessage(error),
        });
      }
    }
  };

  
  const handleReset = () => {
    if (id) {
      form.setFieldsValue({ ...location });
      return;
    }
    form.resetFields();
  };


  return {
    id,
    isActive,
    setIsActive,
    location,
    onFinish,
    form,
    getAllLocation,
    allLocations,
    totalPages,
    setTotalPages,
    currentPage,
    setPageSize,
    pagesize,
    setCurrentPage,
    handleReset,
  };
}