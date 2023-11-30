import {Form, notification} from "antd";
import { useChecksList } from "../../../lib/hooks/planning/useChecksList";
import { useParamsId } from "../../../lib/hooks/common";
import { useEffect, useMemo, useState } from "react";
import API from "../../../service/Api";
import {notifyResponseError, notifySuccess, notifyWarning} from "../../../lib/common/notifications";
import { useNavigate } from "react-router-dom";
import { includes, prop } from "ramda";
import { useChecksAdd } from "../checks/useChecksAdd";
import AircraftModelFamilyService from "../../../service/AircraftModelFamilyService";
import {getErrorMessage} from "../../../lib/common/helpers";
import {useAircraftModelList} from "../../../lib/hooks/planning/aircrafts";

type Task = {
  taskId: number,
  taskNo: string
}

interface RecordType {
  key: string;
  title: string;
  description?: string;
}

export default function useACCheckAdd() {
  const [form] = Form.useForm<any>();
  const { checks, initChecks, setChecks } = useChecksList();
  const id = useParamsId("acCheckId") as number;
  const modelId = Form.useWatch("aircraftModelId", form);
  const thresholdHour = Form.useWatch("flyingHour", form);
  const thresholdDay = Form.useWatch("flyingDay", form);
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();
  const [taskRecords, setTaskRecords] = useState<RecordType[]>([]);
  const { form: checkForm, handleReset: handleCheckReset } = useChecksAdd()
  const [showCheckModal, setShowCheckModal] = useState(false)
  const { aircraftModelFamilies, setAircraftModelFamilies } = useAircraftModelList();
  const [showModal, setShowModal] = useState(false);

  const fetchChecksAndTasksWithModelId = async () => {
    if (!modelId) {
      return;
    }

    try {
      const res = await API.post('aircraft-check/ac-model', {
        acModelId: modelId,
        thresholdDay: thresholdDay || null,
        thresholdHour: thresholdHour || null
      });
      let { taskViewModelForAcCheckList } = res.data;
      setTaskRecords([...taskViewModelForAcCheckList].map((task: { taskId: number, taskNo: string }) => ({
        key: String(task.taskId),
        title: task.taskNo,
        description: task.taskNo
      }) as RecordType))

      setTasks([...taskViewModelForAcCheckList])
    } catch (e) {
      console.log(e);
    }
  }

  const onFinish = async (values: any) => {
    try {
      if (id) {
        await API.put(`/aircraft-check/${id}`, values);
        notifySuccess("Check successfully updated")
      } else {
        await API.post("/aircraft-check", values);
        notifySuccess("Check successfully created")
      }

      navigate("/planning/ac-checks");
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const handleCheckSubmit = async (values: any) => {
    try {
      const { data } = await API.post("/aircraft-check", values);
      notifySuccess("Check successfully created")

      const id = data.id;

      const newCheck = {
        id,
        title: values.title
      }



      setShowCheckModal(false)
    } catch (er) {
      notifyResponseError(er);
    }
  }

  useEffect(() => {
    (async () => {
      await initChecks();
    })();
  }, [])

  const fetchCheckById = async (id: number) => {
    try {
      const { data } = await API.get(`/aircraft-check/${id}`)
      const { aircraftCheckTasks: tasks, ...rest } = data;
      const taskIds = tasks.map(prop("taskId")).map(String);
      form.setFieldsValue({ ...rest, taskIds });
    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    if (!id) return;

    (async () => {
      await fetchCheckById(id);
    })();

  }, [id])

  const handleReset = async () => {
    if (id) {
      form.resetFields();
      await fetchCheckById(id);
    } else {
      form.resetFields();
    }
  };

  const handleModelSubmit = async (values : any) => {
    const specialRegex = `^[0-9.:]+$|^$`;
    if (values.aircraftCheckHour && !values.aircraftCheckHour.match(specialRegex)) {
      notifyWarning("Invalid check hour! Only number is allowed");
      return;
    }
    const ach = values?.aircraftCheckHour;
    const convertHour = ach?.toString().replace(":", ".");
    const value = {
      ...values,
      aircraftCheckHour: convertHour ? convertHour : null,
    };

    try {
      const { data } = await AircraftModelFamilyService.saveAircraftModelName(
          value
      );

      notification["success"]({
        message: "Model Family successfully created",
      });

      const id = data.id;

      const newModel = {
        aircraftModelName: values.aircraftModelName,
        id,
      };

      // @ts-ignore
      setAircraftModelFamilies((prevState) => [newModel, ...prevState]);
      form.setFieldsValue({ aircraftModelId: id });
      setShowModal(false);
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };


  return {
    aircraftModelFamilies,
    handleModelSubmit,
    showModal,
    setShowModal,
    id,
    form,
    checks,
    tasks,
    setTasks,
    handleSubmit: onFinish,
    handleReset,
    taskRecords,
    showCheckModal,
    setShowCheckModal,
    handleCheckSubmit,
    handleCheckReset,
    setChecks,
    fetchChecksAndTasksWithModelId
  }
}