import { Form, notification } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../../common/helpers";
import TaskTypeServices from "../../../service/TaskTypeServices";

export function useTaskTypes() {
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(true);
  const [taskType, setTaskType] = useState({});
  const [allTaskTypes, setAllTaskTypes] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();


  const getAllTaskTypes = async () => {
    try {
      const { data } = await TaskTypeServices.getAllTaskTypes(isActive);
      setAllTaskTypes(data.model);
    } catch (e) {
      notification["error"]({
        message: getErrorMessage(e),
      });
    }
  };


  const singleTaskType = useCallback(async () => {
    if (id === undefined) return;
    try {
      const { data } = await TaskTypeServices.getTaskTypeById(id);
      setTaskType(data);
      form.setFieldsValue({ ...data });
    } catch (e) {
      notification["error"]({
        message: getErrorMessage(e),
      });
    }
  }, [id]);


  useEffect(() => {
    (async () => {
      await singleTaskType();
    })();
  }, [singleTaskType])



  const onFinish = async (values) => {

    try {
      if (id) {
        await TaskTypeServices.updateTaskType(id, values)
      } else {
        let { data } = await TaskTypeServices.saveTaskType(values)

      }

      form.resetFields()
      navigate('/planning/task-type')
      notification["success"]({
        message: id ? "Successfully updated!" : "Successfully added!",
      });

    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }

  };



  const handleStatus = async (id, isActive) => {
    try {
      const { data } = await TaskTypeServices.toggleStatus(id, isActive);
      await getAllTaskTypes();
      notification["success"]({
        message: "Status changed successfully!",
      });
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };


  const onReset = () => {
    if (id) {
      form.setFieldsValue({ ...taskType });
    } else {
      form.resetFields();
    }
  }

  return {
    onFinish,
    onReset,
    id,
    isActive,
    setIsActive,
    taskType,
    form,
    getAllTaskTypes,
    allTaskTypes,
    handleStatus
  };
}
