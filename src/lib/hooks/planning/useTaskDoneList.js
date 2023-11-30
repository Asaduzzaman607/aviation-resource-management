import {Form, notification} from "antd";
import {useNavigate} from "react-router-dom";
import {useCallback, useEffect, useMemo, useState} from "react";
import TaskDoneServices from "../../../service/TaskDoneServices";
import moment from "moment";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import {notifyResponseError, notifyWarning} from "../../common/notifications";
import {useParamsId} from "../common";
import {useTranslation} from "react-i18next";


const taskStatus = [
  {
    id: 0,
    taskStatus: 'OPEN'
  },
  {
    id: 1,
    taskStatus: 'CLOSED'
  },
  {
    id: 2,
    taskStatus: 'REP'
  }

]
export function useTaskDoneList() {
  const id = useParamsId('taskDoneId')
  const [form] = Form.useForm();
  const [taskDoneData, setTaskDoneData] = useState({});
  const [allTasksByAircraft, setallTasksByAircraft] = useState([]);
  const [isApuControl, setIsApuControl] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState();
  const [aircraftId, setAircraftId] = useState(null)
  const [taskId, setTaskId] = useState(null)
  const [serialNumbers, setSerialNumbers] = useState([])
  const aircraftIdInput = Form.useWatch("aircraftId", form);
  const taskIdInput = Form.useWatch("taskId", form);
  const selectedPartId = Form.useWatch("partId", form);
  const selectedSerialId = Form.useWatch("serialId", form);
  const [isActive, setIsActive] = useState(true);
  const [allTaskStatus, setAllTaskStatus] = useState(taskStatus);
  const {t} = useTranslation();

  const [rType, setRType] = useState(0)

   useEffect(()=> {
     const repetitiveByTask = allTasksByAircraft?.filter(({taskId})=>taskId===taskIdInput)?.map(({repetitiveType})=> ({repetitiveType}))
     setRType(repetitiveByTask[0]?.repetitiveType)
   }, [taskId])


  const onChange = (e) => {
    if(rType===0){
      setRType(1);
    }
    else {
      setRType(e.target.value);
    }
  };


  const onChangeInitial = () => {

      if (rType === 0) {
        form.setFieldsValue({
          intervalType: 0
        });
      }
      if (rType === 1) {
        form.setFieldsValue({
          intervalType: 1
        });
      }
  };


  const onReset = async() => {
    if (id) {
      form.setFieldsValue({
        ...taskDoneData,
        doneDate:taskDoneData.doneDate
          ? moment(taskDoneData.doneDate) : null,
        nextDueDate: taskDoneData.nextDueDate
          ? moment(taskDoneData.nextDueDate)
          : null,
        estimatedDueDate: taskDoneData.estimatedDueDate
          ? moment(taskDoneData.estimatedDueDate)
          : null,
      });
    } else {
      form.resetFields();
    }
  };

  // get Parts data by id
  useEffect(() => {
    if (!id) {
      return;
    }
    getTaskDoneById().catch(console.error);
  }, [id]);

  const getTaskDoneById = async () => {
    try {
      const {data} = await TaskDoneServices.getTaskDoneById(id);

      const {taskId, taskNo, positionId, position} = data

      const newTask = {taskId, taskNo}

      setallTasksByAircraft((prevState) => [newTask, ...prevState]);
      setRType(data.intervalType)

      const newPositions= {positionId, position}

      setPositions([newPositions]);


      form.setFieldsValue({
        ...data,
        doneDate: moment(data.doneDate),
        taskId,
        positionId: positionId,
        position : position,
        dueHour: data?.nextDueHour?.toFixed(2).replace(".", ":"),
        dueCycle : data.nextDueCycle,
        dueDate : data.nextDueDate? moment(data.nextDueDate) : null,
        remainingHour: data?.remainHour?.toFixed(2).replace(".", ":"),
        remainingCycle : data.remainCycle,
        remainingDay : data.remainDay,
        estimatedDueDate :data.estimatedDueDate? moment(data.estimatedDueDate) : null,
        intervalType : data.intervalType,
        taskStatus : data.taskStatus

      });
      setTaskDoneData({...data});
      setIsApuControl(data.isApuControl)

    } catch (er) {
      notifyResponseError(er)
    }
  };


  const getAircraftId = (e) => {
    setAircraftId(e);
  };

  const getTaskId = (e) => {
    setTaskId(e);
  };

  const getAllTaskByAircraftId = useCallback(async () => {
    if (!aircraftIdInput) return;
    try {
      const {data} = await TaskDoneServices.getTaskByAircraftId(
        aircraftIdInput
      );


      setallTasksByAircraft(data);

    } catch (er) {
    }
  }, [aircraftIdInput])



 useEffect(()=> {
   const taskStatusByTaskId =  allTasksByAircraft?.find(v => v.taskId === taskIdInput)?.taskStatus || null;

   if (taskStatusByTaskId === 'OPEN') {
     form.setFieldsValue({
       id: 0,
       taskStatus: 'OPEN',
     });
   }
   if (taskStatusByTaskId === 'REP') {
     form.setFieldsValue({
       id: 2,
       taskStatus: 'REP',
     });
   }
   if(taskStatusByTaskId === 'CLOSED') {
     form.setFieldsValue({
       id: 1,
       taskStatus: 'CLOSED',
     })
   }


 },[taskIdInput] )





  const modelId = allTasksByAircraft?.find(v => v.taskId === taskIdInput)?.modelId || null;

  const [partSerials, setPartSerials] = useState([])

  const fetchPart = !!modelId && !!aircraftIdInput;



  const getAllPartSerials = useCallback(async () => {
    if (!fetchPart) return;

    try {
      const {data} = await TaskDoneServices.getPartSerialList(
        aircraftIdInput, modelId
      );
      setPartSerials(data);
    } catch (er) {
    }

  }, [aircraftIdInput, modelId, fetchPart])



  useEffect(() => {
    (async () => {
      await getAllPartSerials();
    })();

  }, [getAllPartSerials])



  const serials = useMemo(
    () => partSerials?.filter(({partId}) => partId === selectedPartId)?.map(({serialNo,serialId}) => ({
      label: serialNo,
      value: serialId
    })),
    [selectedPartId, partSerials]
  )

  




  const getAllSerialNumbers = useCallback(async () => {
    if (!selectedPartId) return;

    try {
      const serialNumbersList = partSerials
        ?.filter(({partId}) => partId === selectedPartId)
        ?.map(({serialNo}) => serialNo)

      setSerialNumbers(serialNumbersList)
    } catch (er) {
    }
  }, [selectedPartId, partSerials])


  useEffect(() => {
    (async () => {
      await getAllSerialNumbers();
    })();

  }, [getAllSerialNumbers])




  const [positions, setPositions] = useState([])


  useEffect(() => {

    if(id)
      return

    const positionsInfo = partSerials
      ?.filter(({serialId}) => serialId === selectedSerialId)
      ?.map(({positionId, position}) => ({positionId, position}))

    const positionId = positionsInfo[0]?.positionId || null
    const newPosition = {
      positionId,
      position: positionsInfo[0]?.position,
    }

    setPositions([newPosition]);

    form.setFieldsValue({positionId: positionId})


  }, [selectedSerialId])



  useEffect(() => {
    (async () => {
      await getAllTaskByAircraftId();
    })();
  }, [getAllTaskByAircraftId])


  const handleTaskChange = (taskId) => {
    const data = allTasksByAircraft.find((tasks) => tasks.taskId === taskId);
    setIsApuControl(data.isApuControl);
  };


  // post api call using async await
  const onFinish = async (values) => {


    const specialRegex = `^[0-9.:]+$|^$`;
    if (values?.doneHour && !values?.doneHour?.toString().match(specialRegex)) {
      notifyWarning("Invalid due hour! Only number is allowed");
      return;
    }
    if (values?.initialHour && !values?.initialHour?.toString().match(specialRegex)) {
      notifyWarning("Invalid initial hour! Only number is allowed");
      return;
    }
    const dHour = values?.doneHour;
    const convertedDoneHour = dHour?.toString().replace(":", ".");

    const inHour = values?.initialHour;
    const convertedInHour = inHour?.toString().replace(":", ".");

    const convertedValues = {
      ...values,
      doneDate: DateTimeConverter.momentDateToString(values.doneDate),
      dueDate: DateTimeConverter.momentDateToString(values.dueDate),
      estimatedDueDate: DateTimeConverter.momentDateToString(values.estimatedDueDate),
      isApuControl: isApuControl === null ? false : isApuControl,
      doneHour: convertedDoneHour,
      initialHour: convertedInHour,
      intervalType: rType,
      taskStatus : values.taskStatus === 'OPEN'? 0 : values.taskStatus === 'REP'? 2 : values.taskStatus === 'CLOSED'? 1 : values.taskStatus
    };

    try {
      if (id) {
        await TaskDoneServices.updateTaskDone(id, convertedValues);
        navigate("/planning/task-done-list");
      } else {
        let {data} = await TaskDoneServices.saveTaskDone(convertedValues);
        navigate("/planning/task-done-list");
      }

      notification["success"]({
        message: id ? "Successfully updated!" : "Successfully added!",
      });
    } catch (er) {
      notifyResponseError(er)
    }
  };

  const doneDateInput = Form.useWatch("doneDate", form);
  const doneHour = Form.useWatch("doneHour", form);
  const doneCycle = Form.useWatch("doneCycle", form);
  const initialHour = Form.useWatch("initialHour", form);
  const initialCycle = Form.useWatch("initialCycle", form);


  // calculate

  const calculateLDND = async () => {

    const dHour = doneHour;
    const convertedDoneHour = dHour?.toString().replace(":", ".");

    const inHour = initialHour;
    const convertedInHour = inHour?.toString().replace(":", ".");

    const values = {
      aircraftId :aircraftIdInput,
      taskId : taskIdInput,
      partId: selectedPartId,
      serialId : selectedSerialId,
      doneDate : DateTimeConverter.momentDateToString(doneDateInput),
      doneCycle : doneCycle,
      initialHour: convertedInHour,
      initialCycle : initialCycle,
      doneHour: convertedDoneHour,
      intervalType: rType,
      isApuControl : isApuControl

    }

    console.log({values})

    try {

      let {data} =   await TaskDoneServices.calculateLDND(values);
      form.setFieldsValue({
        ...data,
        dueHour: data.dueHour,
        dueCycle : data.dueCycle,
        dueDate : data.dueDate? moment(data.dueDate) : null,
        remainingHour: data.remainingHour,
        remainingCycle : data.remainingCycle,
        remainingDay : data.remainingDay,
        estimatedDueDate :data.estimatedDueDate? moment(data.estimatedDueDate) : null,
      })

    } catch (er) {
      notifyResponseError(er)
    }
  };


  //Title separating
  const TITLE = id ? `${t("planning.Task Done.Task Done")} ${t("common.Edit")}` : `${t("planning.Task Done.Task Done")} ${t("common.Add")}`;

  return {
    id,
    form,
    onFinish,
    onReset,
    TITLE,
    setTaskDoneData,
    allTasksByAircraft,
    isApuControl,
    isActive,
    setIsActive,
    currentPage,
    setCurrentPage,
    getAircraftId,
    getTaskId,
    handleTaskChange,
    partSerials,
    serialNumbers,
    positions,
    onChangeInitial,
    rType,
    calculateLDND,
    onChange,
    serials,
    allTaskStatus

  };
}
