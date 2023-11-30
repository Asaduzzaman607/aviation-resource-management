import { Form, notification } from "antd";
import { useParamsId } from "../../../lib/hooks/common";
import { useEffect, useState } from "react";
import useAircraftModelList from "../../../lib/hooks/planning/useAircraftsModelList";
import API from "../../../service/Api";
import { notifyError, notifyResponseError, notifySuccess } from "../../../lib/common/notifications";
import { useNavigate } from "react-router-dom";
import { prop } from "ramda";
import { useAircraftsList } from "../../../lib/hooks/planning/aircrafts";
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { getErrorMessage } from "../../../lib/common/helpers";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import AircraftService from "../../../service/AircraftService";

export type Task = {
  taskId: number,
  taskNo: string
}

export default function useACCheckIndexAdd() {
  const [form] = Form.useForm<any>();
  // const { checks, initChecks } = useChecksList();
  const [checks, setChecks] = useState([])
  const { aircraftModels, initAircraftModels } = useAircraftModelList();
  const id = useParamsId();
  const aircraftId = Form.useWatch("aircraftId", form);
  // const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();
  const checkedTasks = Form.useWatch("tasks", form) || [];
  const checkedTasksId = checkedTasks.map(prop("taskId"))
  // const { aircrafts, initAircrafts } = useAircraftsList();
  const [ aircrafts, setAircrafts ] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [isActive, setIsActive] = useState(true)

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ldndSelectedTasks, setLdndSelectedTasks] = useState<any[]>([])
  const [normalTasks, setNormalTasks] = useState<any[]>([])
  const [acCheckIds, setAcCheckIds] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [ldndTasks, setLdndTasks] = useState<any[]>([])
  const [allAcCheckIndex, setAllAcCheckIndex] = useState([])
  const [previousSelectedTasks, setPreviousSelectedTasks] = useState<any[]>([])
  const [ldndIds, setLdndIds] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState<any>(1)
  const [totalPages, setTotalPages] = useState<any>()
  const [acCheckIndex, setAcCheckIndex] = useState<any>();
  const [allTasks, setAllTasks] = useState<any>([])
  const [selectedLdndTasks, setSelectedLdndTasks] = useState<any>([])
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>();
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const getAllAircraftList =async () =>{
    const {data} = await AircraftService.getAllAircraftList();
    setAircrafts(data);

  }
  useEffect(()=>{
    (async()=>{
      await getAllAircraftList();
    })();
  },[])

  useEffect(() => {
    if (!id) {
      return;
    }
    (async () => {
      await getAcCheckIndexById();
    })();
  }, [id])

  const getAcCheckIndexById = async () => {
    const { data } = await API.get(`aircraft-check-index/get-by-id/${id}`)
    setAcCheckIndex(data)
  }

  const fetchWorkOrderAndChecksByAircraftId = async (aircraftId?: number) => {
    if (!aircraftId) {
      return;
    }

    try {
      const work = await API.get(`work-order/work-order-by-aircraft/${aircraftId}`)
      const check = await API.get(`aircraft-check/aircraft/${aircraftId}`)
      setWorkOrders(work.data)
      setChecks(check.data)
    } catch (error) {
      console.log(error)
    }
  }

  const onFinish = async (values: any) => {

    let data;

    if (!id) {
      data = { ldndIds, ...values, doneDate: DateTimeConverter.momentDateToString(values.doneDate) }
    }
    else {
      data = { ldndIds, ...values, aircraftTypeCheckIds: values?.aircraftTypeCheckIds?.map((s: { value: any; }) => s.value), doneDate: DateTimeConverter.momentDateToString(values.doneDate) }
    }

    if (ldndIds.length === 0) {
      notifyError("Task set can not be null")
      return;
    }

    try {
      if (id) {
        await API.put(`/aircraft-check-index/${id}`, data);
        notifySuccess("Check successfully updated")
      } else {
        await API.post("/aircraft-check-index", data);
        notifySuccess("Check index successfully created")
      }

      navigate("/planning/ac-check-index");
    } catch (er) {
      notifyResponseError(er);
    }
  };

  useEffect(() => {
    getAllAcCheckIndex();
  }, [isActive, currentPage])

  const getAllAcCheckIndex = async () => {
    const { data } = await API.post(`aircraft-check-index/search?page=${currentPage}&size=10`, { isActive: isActive })
    setAllAcCheckIndex(data.model);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
  }

  const fetchData = async (values: any) => {
    const { data } = await API.post(`aircraft-check-index/search?page=${currentPage}&size=10`, { ...values, isActive: isActive })
    setAllAcCheckIndex(data.model);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
  }

  useEffect(() => {
    if (!id) {
      return;
    }
    (async () => {
      await getSingleAcCheckIndex();
    })();

  }, [id])

  const handleStatus = async (id: any, isActive: any) => {
    try {
      await API.patch(`aircraft-check-index/${id}?active=${isActive}`);
      getAllAcCheckIndex();
      notification["success"]({
        message: "Status changed successfully!",
      });
    } catch (er) {
      notification["error"]({ message: getErrorMessage(er) });
    }
  };

  const getSingleAcCheckIndex = async () => {
    if (!id) {
      return
    }
    const { data } = await API.get(`aircraft-check-index/${id}`)

    let temp: { value: any; label: any; }[] = []
    data?.aircraftTypeCheckSet?.map((item: { acCheckId: any; checkTitle: any; }) => {
      temp.push({
        value: item.acCheckId,
        label: item.checkTitle
      })
    })

    form.setFieldsValue({ ...data, doneDate: DateTimeConverter.stringToMomentDate(data.doneDate), aircraftTypeCheckIds: temp })
    setTasks(data.ldndForTaskViewModelSet)

    for (let i = 0; i < data.aircraftTypeCheckSet.length; i++) {
      acCheckIds.push(data.aircraftTypeCheckSet[i].acCheckId)
    }

    for (let i = 0; i < data.ldndForTaskViewModelSet.length; i++) {
      previousSelectedTasks.push(data.ldndForTaskViewModelSet[i].ldndId)
      setLdndIds(previousSelectedTasks)
      form.setFieldValue('taskIds', previousSelectedTasks)
      form.setFieldValue('ldndIds', previousSelectedTasks)
    }

  }

  const onReset = () => {
    if (id) {
      getSingleAcCheckIndex()
      return
    }
    form.resetFields()
    setTasks([])
    setSelectedLdndTasks([])
  }

  useEffect(() => {
    (async () => {
      // await initChecks();
      await initAircraftModels();
     // await initAircrafts();
    })();
  }, [])

  useEffect(() => {
    if (!aircraftId) {
      form.setFieldsValue({ workWorderId: "" })
      return;
    }

    (async () => {
      // await fetchChecksAndTasksWithModelId(aircraftId);
      await fetchWorkOrderAndChecksByAircraftId(aircraftId);
    })();

  }, [aircraftId])

  const onAcCheckChange = (values: string[]) => {
    if (values.length === 0) {
      setTasks([])
      setAcCheckIds([])
      return;
    }
    setAcCheckIds(values)
  }

  const handleLoadTask = async () => {

   const loadTaskKeys = {
     acCheckIds,
     aircraftId
   }

    if (acCheckIds.length === 0) {
      notifyError("Please select AC Checks")
      // setNormalTasks([])
      return;
    }
    try {
      const { data } = await API.post(`/aircraft-check/ac-check-ids`, loadTaskKeys)
      console.log({acload : data})
      setTasks(data)
    } catch (error) {
      notification["error"]({
        message: getErrorMessage(error),
      });
      setTasks([]);
    }
  }

  const showModal = async () => {
    if (!aircraftId) {
      notifyError('Please select aircraft')
      return
    }
    const { data } = await API.get(`aircraft-check/ldnd-task/aircraft/${aircraftId}`)
    setLdndTasks(data);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onNormalTaskChange = (checkedValues: CheckboxValueType[]) => {
    setNormalTasks(checkedValues)
    const filteredTaskIds = tasks.filter(t => checkedValues.includes(t.ldndId)).map(({ ldndId }) => (ldndId))
    setNormalTasks([...filteredTaskIds])
    form.setFieldValue('ldndIds', checkedValues)
  };
  const onLdndTaskChange = (checkedValues: CheckboxValueType[]) => {
    setLdndSelectedTasks(checkedValues)
    const filteredLdndIDs = ldndTasks.filter(t => checkedValues.includes(t.ldndId)).map(({ ldndId, taskNo, partNo, serialNo, taskDescription }) => ({ ldndId, taskNo, partNo, serialNo, taskDescription }))
    setSelectedLdndTasks([...filteredLdndIDs])
    form.setFieldValue('taskIds', checkedValues)
  };

  useEffect(() => {
    setLdndIds(Array.from(new Set(normalTasks.concat(ldndSelectedTasks))))
  }, [normalTasks, ldndSelectedTasks])



  useEffect(() => {
    selectedLdndTasks.forEach((m: any) => {
      let item = tasks.find(n => n.ldndId === m.ldndId);
      if (item) { return Object.assign(item, m); }
      tasks.push(m);
    });
  }, [tasks, selectedLdndTasks])

  return {
    id,
    form,
    checks,
    aircraftModels,
    handleSubmit: onFinish,
    aircrafts,
    tasks,
    workOrders,
    onAcCheckChange,
    handleLoadTask,
    showModal,
    handleOk,
    handleCancel,
    onNormalTaskChange,
    onLdndTaskChange,
    isModalVisible,
    ldndTasks,
    isActive,
    setIsActive,
    allAcCheckIndex,
    onReset,
    previousSelectedTasks,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchData,
    acCheckIndex,
    handleStatus,
    allTasks
  }
}