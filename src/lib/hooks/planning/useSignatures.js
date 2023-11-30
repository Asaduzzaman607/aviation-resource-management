import { Form, notification } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SignaturesService from "../../../service/planning/configurations/SignaturesService";
import { getErrorMessage } from "../../common/helpers";
import { refreshPagination } from "../paginations";

export function useSignatures() {
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(true);
  const [signature, setSignature] = useState({});
  const [employees, setEmployees] = useState([]);
  const [allSignatures, setAllSignatures] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
	const dispatch = useDispatch();


  useEffect(() => {
    getAllEmployee();
    // getAllSignatures();
  }, []);

  useEffect(() => {
    // getAllSignatures();
  }, [isActive]);

  const getAllEmployee = async () => {
    try {
      const { data } = await SignaturesService.getAllEmployee();
      setEmployees(data.model);
    } catch (e) {
      notification["error"]({
        message: getErrorMessage(e),
      });
    }
  };

  // const getAllSignatures = async () => {
  //   try {
  //     const { data } = await SignaturesService.getAllSignatures(isActive);
  //     setAllSignatures(data.model);
  //   } catch (e) {
  //     notification["error"]({
  //       message: getErrorMessage(e),
  //     });
  //   }
  // };

  const getSingleSignature = async (id) => {
    try {
      const { data } = await SignaturesService.getSingleSignature(id);
      setSignature(data);
    } catch (e) {
      notification["error"]({
        message: getErrorMessage(e),
      });
    }
  };

  const singleSignature = useCallback(async () => {
    if (id === undefined) return;
    try {
      const { data } = await SignaturesService.getSingleSignature(id);
      form.setFieldsValue({ ...data });
    } catch (e) {
      notification["error"]({
        message: getErrorMessage(e),
      });
    }
  }, [id]);

  useEffect(() => {
    singleSignature();
  }, [singleSignature]);

  const onFinish = async (values) => {
    if (!id) {
      try {
        const { data } = await SignaturesService.saveSignature(values);
        navigate("/planning/signatures");
        notification["success"]({
          message: "Successfully added signature",
        });
      } catch (error) {
        notification["error"]({
          message: getErrorMessage(error),
        });
      }
    } else {
      try {
        const { data } = await SignaturesService.updateSignature(id, values);
        dispatch(refreshPagination("signatures", "signature/search"));
        navigate("/planning/signatures");
        notification["success"]({
          message: "Successfully updated signature",
        });
      } catch (error) {
        notification["error"]({
          message: getErrorMessage(error),
        });
      }
    }
  };

  // const handleStatus = async (id, isActive) => {
  //   try {
  //     const { data } = await SignaturesService.toggleStatus(id, isActive);
  //     getAllSignatures();
  //     notification["success"]({
  //       message: "Status changed successfully!",
  //     });
  //   } catch (er) {
  //     notification["error"]({ message: getErrorMessage(er) });
  //   }
  // };

  const handleReset = () => {
    if(id) {
      singleSignature()
    }
    else{
      form.resetFields()
    }

  }


  return {
    onFinish,
    employees,
    id,
    isActive,
    setIsActive,
    getSingleSignature,
    signature,
    form,
    allSignatures,
    handleReset,
  };
}
