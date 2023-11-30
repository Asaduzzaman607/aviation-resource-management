import { useNavigate } from "react-router-dom";
import { Form } from "antd";
import api from "../../../service/Api";
import { useCallback, useEffect, useState } from "react";
import { Input, notification } from "antd";
import { useAircrafts } from "./aircrafts";
import { getErrorMessage } from "../../common/helpers";
import { includes } from "ramda";
import { notifyError } from "../../common/notifications";
import AircraftService from "../../../service/AircraftService";

const APPLICABLE = 1;
const NOT_APPLICABLE = 0;

export function useAircraftTasks() {
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState([]);
  const [aircraftId, setAircraftId] = useState();
  const [notApplicableIds, setNotApplicableIds] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const navigate = useNavigate()

  const [allAircrafts, setAircrafts] = useState([]);

  const getAllAircrafts = useCallback(async () => {
    const res = await AircraftService.getAllAircraftList();
    setAircrafts(
        res.data.map(({ aircraftId , aircraftName  }) => ({
          aircraftId,
          aircraftName,
        }))
    );
  }, []);

  useEffect(() => {
    (async () => {
      await getAllAircrafts();
    })();
  }, []);

  useEffect(() => {
    setTasks((prevState) => {
      return prevState.map((task) => {
        if (includes(task.taskId, notApplicableIds)) {
          return {
            ...task,
            aircraftId: aircraftId,
            effectivityType: NOT_APPLICABLE,
          };
        }

        return {
          ...task,
          aircraftId: aircraftId,
          effectivityType: APPLICABLE,
        };
      });
    });
  }, [aircraftId, notApplicableIds]);

  const getTaskByAircraftId = useCallback(
    async (aircraftId) => {
      const { data } = await api.get(`/task/aircraft/${aircraftId}`);
      setTasks(data);
      setNotApplicableIds(data.filter((task) => task.effectivityType === 0).map((task) => task.taskId));
      setAircraftId(aircraftId);
    },
    [setTasks, setAircraftId]
  );

  const onReset = () => {
    form.resetFields();
  };
  const handleChange = (taskId, ev) => {
    const remark = ev.target.value;
    setTasks((prevState) => {
      return prevState.map((task) => {
        if (task.taskId === taskId) {
          return {
            ...task,
            remark,
          };
        }

        return task;
      });
    });
  };

  const onScroll = (direction, e) => {};
  const onFinish = async (values) => {
    try {
      if(tasks.length === 0){
        notifyError("There are currently no task availabe in this Aircraft")
        return
      }
      await api.post(`/task/specific-task`, tasks);
      notification["success"]({
        message: "Aircraft task efffectivity changed successfully",
      });
      navigate("/planning")
    } catch (error) {
      notification["error"]({
        message: getErrorMessage(error),
      });
    }
  };

  const taskDataSource = tasks.map((task) => ({
    ...task,
    key: task.taskId,
    title: task.taskName,
    input: <Input name="remarks" value={task.remark} placeholder="Input Remarks" onChange={(e) => handleChange(task.taskId, e)} />,
  }));

  // change the task of transfer
  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setNotApplicableIds(nextTargetKeys);
  };

  // selected task
  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return {
    form,
    onFinish,
    allAircrafts,
    getTaskByAircraftId,
    taskDataSource,
    targetKeys: notApplicableIds,
    selectedKeys,
    onChange,
    onSelectChange,
    onScroll,
    onReset,
  };
}
