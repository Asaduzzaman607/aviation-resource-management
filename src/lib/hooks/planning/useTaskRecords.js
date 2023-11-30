import {Form, Input, notification} from "antd";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useCallback, useEffect, useState} from "react";
import TaskRecordServices from "../../../service/TaskRecordServices";
import {getErrorMessage} from "../../common/helpers";
import {refreshPagination} from "../paginations";
import {useBoolean} from "react-use";
import {useAircraftsList} from "./aircrafts";
import ModelTreeService from "../../../service/ModelTreeService";
import ModelsService from "../../../service/ModelsService";
import PositionsService from "../../../service/planning/configurations/PositionsService";
import {union, difference} from "lodash";
import {notifyError, notifyResponseError, notifySuccess, notifyWarning} from "../../common/notifications";
import {useParamsId} from "../common";
import {useTranslation} from "react-i18next";
import moment from "moment";
import PartsServices from "../../../service/PartsServices";
import TaskTypeServices from "../../../service/TaskTypeServices";


let unitTypes = [
  {
    id: 1,
    name: 'FH'
  },
  {
    id: 2,
    name: ' FC'
  },
  {
    id: 5,
    name: ' YR'
  },
  {
    id: 6,
    name: ' MO'
  }
  ,
  {
    id: 7,
    name: ' WY'
  },
  {
    id: 8,
    name: ' DY'
  }
]


const INSPECTION_TYPE = [
  {
    id: 0,
    name: 'GVI'
  },
  {
    id: 1,
    name: ' GV'
  },
  {
    id: 2,
    name: ' OPT'
  },
  {
    id: 3,
    name: ' CHK'
  },
  {
    id: 4,
    name: ' INSP'
  },
  {
    id: 5,
    name: ' DIS'
  },
  {
    id: 6,
    name: ' SVC',
  },
  {
    id: 7,
    name: ' FUT'
  },
  {
    id: 8,
    name: ' FNC'
  },
  {
    id: 9,
    name: ' OPS'
  },
  {
    id: 10,
    name: ' DET'
  },
  {
    id: 11,
    name: ' NDT'
  },
  {
    id: 12,
    name: ' UTI'
  }
]

const taskStatus = [
  {
    id: 0,
    status: 'OPEN'
  },
  {
    id: 1,
    status: 'CLOSED'
  },
  {
    id: 2,
    status: 'REP'
  }

]

const taskStatusForAMP = [
  {
    id: 0,
    status: 'OPEN'
  },
  {
    id: 2,
    status: 'REP'
  }

]

const taskTypes = [
  {
    id: 0,
    status: 'AD'
  },
  {
    id: 1,
    status: 'SB'
  },
  {
    id: 2,
    status: 'AMP'
  },
  {
    id: 3,
    status: 'Others'
  },
]


const trades = [
  {
    id: 0,
    name: 'B1'
  },
  {
    id: 1,
    name: 'B2'
  }
]

const MAX_LENGTH = 2;

const REMARK_LENGTH = 100;

const INTERVAL_TYPE = {
  ONE_TIME: 0,
  REPETITIVE: 1,
}


export function useTaskRecords(positionForm, consumablePartsForm) {
  const [form] = Form.useForm();
  const id = useParamsId("taskId");
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [tasksData, setTasksData] = useState({});
  const [taskValue, setTaskValue] = useState('');
  const [isOneTime, setIsOneTime] = useBoolean(false)
  const [showModal, setShowModal] = useBoolean(false);
  const [notApplicable, setNotApplicable] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [aircraftModelFamilies, setAircraftModelFamilies] = useState([]);
  const [allTaskTypes, setAllTaskTypes] = useState([]);
  const [model, setModel] = useState([]);
  const [jobProcedures, setJobProcedures] = useState(null)
  const [consumableParts, setConsumableParts] = useState(null)
  const [aircraftModelId, setAircraftModelId] = useState(null);
  const [aircraftByModel, setAircraftByModel] = useState([]);
  const [consumablePartsIndex, setConsumablePartsIndex] = useState(null)
  const [showPositionModal, setShowPositionModal] = useBoolean(false);
  const [position, setPosition] = useState([]);
  const [allConsumableParts, setAllConsumableParts] = useState([]);
  const [allTaskStatus, setAllTaskStatus] = useState(taskStatus);
  const [showConsumablePartsModal, setConsumablePartsShowModal] = useState(false);
  const [positionIndex, setPositionIndex] = useState(null)
  const aircraftModelIdInput = Form.useWatch('aircraftModelId', form);
  const modelIdInput = Form.useWatch('modelId', form);
  const taskSource = Form.useWatch('taskSource', form) || '';
  const {aircrafts, initAircrafts} = useAircraftsList()
  const [showTaskModal, setShowTaskModal] = useBoolean(false)

  const {t} = useTranslation();
  const oneTime = Form.useWatch('repeatType', form);

  useEffect(() => {
    if (taskSource === 'AMP') {
      setAllTaskStatus(taskStatusForAMP)
    } else {
      setAllTaskStatus(taskStatus)
    }
  }, [taskSource])


  const convertType = (typeId) => {
    switch (typeId) {
      case 1:
        return 'FH'

      case 2:
        return 'FC'

      case 3:
        return 'AC'

      case 4:
        return 'AH'
      case 5:
        return 'YR'
      case 6:
        return 'MO'
      case 7:
        return 'WY'
      case 8:
        return 'DY'

      default:
        return null
    }


  }


  const onChangeStatus = () => {
    if (oneTime === 0) {
      form.setFieldsValue({
        status: 2,
      });
    }
    if (oneTime === 1) {
      form.setFieldsValue({
        status: 0,
      });
    }
  }

  const onChangeIntervalType = () => {
    setIsOneTime(!isOneTime)
  }


  const taskIntervalDtoList = Form.useWatch('taskIntervalDtoList', form);
  const taskIntervalDtoList1 = Form.useWatch('taskIntervalDtoList1', form);

  const threshold = taskIntervalDtoList ?? []
  const thresholdValueInput = threshold[0]?.intervalValue
  const interval = taskIntervalDtoList1 ?? []
  const intervalValueInput = interval[0]?.intervalValue


//Title separating
  const TITLE = id ? `${t('planning.Task Records.Task Record')} ${t("common.Edit")}` : `${t('planning.Task Records.Task Record')} ${t("common.Add")}`;


  const [types, setTypes] = useState(unitTypes)
  const [isAPU, setIsAPU] = useState(false)


  const onChangeCheckbox = (e) => {
    if (e.target.checked) {
      setIsAPU(true)
    }

    if (!e.target.checked) {
      setIsAPU(false)
    }
  };


  const onReset = () => {
    if (id) {
      getTaskById()
      // form.setFieldsValue({...tasksData})
    } else {
      form.resetFields()
    }
  };


  useEffect(() => {
    (async () => {
      await initAircrafts();
    })();
  }, [])


// get Task data by id
  useEffect(() => {
    if (!id) {
      return
    }
    getTaskById().catch(console.error)

  }, [id])


  const getTaskById = async () => {
    try {
      const {data} = await TaskRecordServices.getTaskById(id)


      const notApplicableAirCraftsId = data.effectiveAircraftViewModels
        .filter(({effectivityType}) => effectivityType === 0)
        .map(({aircraftId}) => aircraftId)

      setNotApplicable([...notApplicableAirCraftsId]);


      const {
        taskProcedureViewModels: taskProcedureDtoList,
        taskConsumablePartViewModels: taskConsumablePartDtoList,
        remarkViewModels: remarkDtoList,
        effectiveAircraftViewModels: effectiveAircraftDtoList,
        isApuControl,
        taskIntervalViewModels,
        status,
        taskTypeId,
        modelId,
        checkId,
        checkTitle,
        effectiveDate,
        taskSource,
        taskValue,
        issueDate,
        revisionNumber,
        ...rest
      } = data;

      await getAllModelByAircraftModelId(rest.aircraftModelId);

      setAircraftByModel([...data.effectiveAircraftViewModels])
      setPositionByModel([...data.taskProcedureViewModels])
      setIsAPU(isApuControl)

      const formData = {
        ...rest,
        taskProcedureDtoList : taskProcedureDtoList.length === 0 ? [{jobProcedure : '', positionId : null}] : taskProcedureDtoList ,
        taskConsumablePartDtoList,
        remarkDtoList: remarkDtoList?.map(({remark, remarkId, remarkAircraftViewModels}) => ({
          remark,
          remarkId,
          aircraftIds: remarkAircraftViewModels.map(v => v.aircraftId)
        })),
        effectiveAircraftDtoList:
          effectiveAircraftDtoList?.filter(({effectivityType}) => !effectivityType).map(({aircraftId}) => ({aircraftId})),
        isApuControl: !!isApuControl,
        taskIntervalDtoList: taskIntervalViewModels?.filter(({intervalType}) => !intervalType),
        taskIntervalDtoList1: taskIntervalViewModels?.filter(({intervalType}) => intervalType),
        status,
        taskTypeId,
        modelId,
        date: effectiveDate ? moment(effectiveDate) : null,
        issueDate: issueDate ? moment(issueDate) : null,
        revisionNumber,
        taskSource: ['AD', 'SB', 'AMP'].includes(taskSource) ? taskSource : "others",
        other: taskSource !== 'AD' || 'SB' || 'AMP' ? taskSource : null,
        thresholdHour: data?.thresholdHour?.toFixed(2).replace(".", ":"),
        intervalHour: data?.intervalHour?.toFixed(2).replace(".", ":"),
      };


      form.setFieldsValue(formData)

      setTasksData({...data})

    } catch (er) {
      notification["error"]({message: getErrorMessage(er)});
    }
  }


// post api call using async await
  const onFinish = async (taskRecordValues) => {


    let otherValue = taskRecordValues.other;


    const mergedEffectivity = aircraftByModel?.map(({aircraftId, effectiveAircraftId, remark}) => ({
      effectivityType: notApplicable.includes(aircraftId) ? 0 : 1,
      aircraftId,
      effectiveAircraftId,
      remark: remark === undefined ? null : remark
    }))



    const specialRegex = `^[0-9.:]+$|^$`;
    if (taskRecordValues?.thresholdHour && !taskRecordValues?.thresholdHour?.toString().match(specialRegex)) {
      notifyWarning("Invalid threshold hour! Only number is allowed");
      return;
    }
    if (taskRecordValues?.intervalHour && !taskRecordValues?.intervalHour?.toString().match(specialRegex)) {
      notifyWarning("Invalid interval hour! Only number is allowed");
      return;
    }

    const thHr = taskRecordValues?.thresholdHour;
    const convertedThresholdHour = thHr?.toString().replace(":", ".");
    const intervalHr = taskRecordValues?.intervalHour;
    const convertedIntervalHour = intervalHr?.toString().replace(":", ".");

    const allValues = {
      ...taskRecordValues,
      effectiveAircraftDtoList: mergedEffectivity,
      taskSource: taskRecordValues.taskSource === 'others' ? otherValue : taskRecordValues.taskSource,
      other: id ? otherValue : tasksData.taskSource,
      effectiveDate: taskRecordValues['date']?.format('YYYY-MM-DD'),
      issueDate: taskRecordValues['issueDate']?.format('YYYY-MM-DD'),
      thresholdHour: convertedThresholdHour,
      intervalHour: convertedIntervalHour
    }

    try {
      if (id) {
        await TaskRecordServices.updateTask(id, allValues)
      } else {
        let {data} = await TaskRecordServices.saveTask(allValues)

      }

      form.resetFields()
      dispatch(refreshPagination("taskRecords", "task/search"));
      navigate('/planning/task-records')
      notification["success"]({
        message: id ? "Successfully updated!" : "Successfully added!",
      });

    } catch (er) {
      notification["error"]({message: getErrorMessage(er)});
    }

  };

  const handleAircraftChange = (aircraftId, ev) => {
    const remark = ev.target.value;
    setAircraftByModel((prevState) => {
      return prevState.map((air) => {
        if (air.aircraftId === aircraftId) {
          return {
            ...air,
            remark,
          };
        }

        return air;
      });
    });
  };

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setNotApplicable(nextTargetKeys);
  };

  const aircraftByModelForEffectivity = aircraftByModel?.map((air) => ({
    ...air,
    key: air.aircraftId,
    title: air.aircraftName,
    input: <Input name="remarks" value={air.remark} placeholder="Input Remarks"
                  onChange={(e) => handleAircraftChange(air.aircraftId, e)}/>,
  }));


  const aircraftForRemarks = aircraftByModel.map(a => a.aircraftId)


  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll = (direction, e) => {
  };


  const getAircraftModelId = (e) => {
    setAircraftModelId(e);
  };

  const [modelId, setModelId] = useState(null)

  const getModelId = (e) => {
    setModelId(e);
  };

  const getAllModelByAircraftModelId = async (aircraftModelId) => {
    try {
      const {data} = await ModelTreeService.getAllModelByAircraftModelId(
        aircraftModelId
      );

      setModel(data);
    } catch (er) {
    }
  };

  const getAircraftByModelId = async (aircraftModelId) => {
    try {
      const {data} = await TaskRecordServices.getAllAircraftByAircraftModelId(
        aircraftModelId
      );
      setAircraftByModel(data);
    } catch (er) {
    }
  };

  const [positionByModel, setPositionByModel] = useState([])


  const getAllPositionsByModel = async (modelId) => {
    try {
      const {data} = await TaskRecordServices.getAllPositionsByModel(
        modelId
      );

      const taskProcedureDtoList = data?.map(p => ({
        positionId: p.positionId,
        jobProcedure: ''
      }))

      if (taskProcedureDtoList?.length === 0) {
        form.setFieldsValue({
          taskProcedureDtoList: [{
            positionId: null,
            jobProcedure: ''
          }]
        })
      } else {
        form.setFieldsValue({taskProcedureDtoList})
      }
      setPositionByModel(data);
    } catch (er) {
    }
  };


  useEffect(() => {

    if (!modelId) return;

    (async () => {
      await getAllPositionsByModel(modelId);

    })();

  }, [modelIdInput]);


  useEffect(() => {

    if (!aircraftModelId) return;

    (async () => {
      await getAllModelByAircraftModelId(aircraftModelId);
      await getAircraftByModelId(aircraftModelId)
    })();

  }, [aircraftModelIdInput]);


  const getAllAircraftModels = async () => {
    try {
      const {data} = await ModelsService.getAllAircraftModel();
      setAircraftModelFamilies(data.model);
    } catch (err) {
      notifyResponseError(err)
    }
  };

  const getAllTaskTypes = async () => {
    try {
      const {data} = await TaskRecordServices.getAllTaskTypes();
      setAllTaskTypes(data.model);
    } catch (err) {
      notifyResponseError(err)
    }
  };

  const initTaskRecords = useCallback(async () => {
    await getAllPosition();
    await getAllAircraftModels();
    await getAllConsumableParts();
    await getAllTaskTypes();
  }, [])


  const onChangeTaskType = (e) => {
    setTaskValue(e.target.value);
  };


  const remarkedAircraft = Form.useWatch('remarkDtoList', form) || [];


  const totalSelectedRemarkedAircraft = remarkedAircraft
    .filter(v => !!v)
    .map(v => v.aircraftIds)
    .flat();


  const totalSelected = (...args) => {
    return [...new Set(args.flat())]

  }

  const getOptions = (options, totalSelected, rowSelected) => {
    return union(difference(options, totalSelected), rowSelected)
  }

  const totalSelectedOptions = (index) => {
    const airCraftIds = getOptions(aircraftForRemarks, totalSelected(totalSelectedRemarkedAircraft), remarkedAircraft[index]?.aircraftIds)
    return aircrafts.filter(airCraft => airCraftIds?.includes(airCraft.id));
  }


  const handleModelSubmitAtTask = async (values) => {
    try {
      const {data} = await ModelsService.saveModels(values);

      notification["success"]({
        message: "Models successfully created",
      });

      const modelId = data.id;

      const newModel = {
        modelName: values.modelName,
        modelId,
      };

      setModel((prevState) => [newModel, ...prevState]);
      form.setFieldsValue({modelId: modelId});
      setShowModal(false);

      return Promise.resolve(data.id);
    } catch (er) {
      notifyResponseError(er)
      return Promise.reject("Message");
    }
  };


  const getAllPosition = async () => {
    try {
      const {data} = await ModelTreeService.getAllPosition();
      setPosition(data.model);
    } catch (er) {
      notification["error"]({message: getErrorMessage(er)});
    }
  };


  const getAllConsumableParts = async () => {
    try {
      const {data} = await PartsServices.getAllConsumableParts();
      setAllConsumableParts(data);
    } catch (er) {
      notifyResponseError(er)
    }
  };


  const handlePositionSubmitAtTask = async (values) => {

    try {
      const {data} = await PositionsService.savePosition(values);
      positionForm.resetFields();


      notification["success"]({
        message: "Position successfully created",
      });

      const positionId = data.id;

      const newPosition = {
        name: values.name,
        positionId,
      };

      setPosition((prevState) => [newPosition, ...prevState]);

      const positions = form.getFieldValue('taskProcedureDtoList')
      const jobPosition = positions?.map((p, index) => {

        if (index === positionIndex) {
          return {
            ...p,
            positionId
          }
        }
        return p

      })


      form.setFieldsValue({taskProcedureDtoList: jobPosition});
      setShowPositionModal(false);
    } catch (er) {
      notifyResponseError(er)
    }
  };


  const handleConsumablePartsSubmitAttask = async (values) => {


    let ids = values?.alternatePartIds?.map((part) => {
      return part.value;
    });

    let modifiedValues = {...values, alternatePartIds: ids};

    try {
      const {data} = await PartsServices.savePart(modifiedValues)

      consumablePartsForm.resetFields();

      notifySuccess("Consumable parts successfully created");

      const consumablePartId = data.id;

      const newConsumableParts = {
        partNo: values.partNo,
        id: consumablePartId,
      };

      setAllConsumableParts((prevState) => [newConsumableParts, ...prevState]);

      const parts = form.getFieldValue('taskConsumablePartDtoList')


      const taskConsumableParts = parts?.map((p, index) => {

        if (index === consumablePartsIndex) {
          return {
            ...p,
            consumablePartId
          }
        }

        return p
      })


      form.setFieldsValue({taskConsumablePartDtoList: taskConsumableParts});
      setConsumablePartsShowModal(false);
    } catch (er) {
      notifyResponseError(er)
    }
  };

  const handleTaskTypeSubmit = async (values) => {
    try {
      const {data} = await TaskTypeServices.saveTaskType(values)
      const id = data.id;
      const newTaskType = {id, name: values.name}
      setAllTaskTypes((prevState) => [newTaskType, ...prevState])
      form.setFieldsValue({taskTypeId: id});
      setShowTaskModal(false);
      notifySuccess("Task type successfully added!")
    } catch (error) {
      notifyError(error)
    }
  }


  return {
    id,
    form,
    onFinish,
    onReset,
    TITLE,
    types,
    onScroll,
    onSelectChange,
    INTERVAL_TYPE,
    onChangeIntervalType,
    selectedKeys,
    setNotApplicable,
    MAX_LENGTH,
    REMARK_LENGTH,
    model,
    aircraftModelFamilies,
    aircrafts,
    getOptions,
    onChangeTaskType,
    taskValue,
    taskTypes,
    getAircraftModelId,
    handleModelSubmitAtTask,
    showModal,
    setShowModal,
    showPositionModal,
    setShowPositionModal,
    handlePositionSubmitAtTask,
    position,
    totalSelected,
    totalSelectedOptions,
    setPositionIndex,
    intervalValueInput,
    jobProcedures,
    setJobProcedures,
    consumableParts,
    setConsumableParts,
    onChangeCheckbox,
    thresholdValueInput,
    onChangeStatus,
    aircraftByModelForEffectivity,
    oneTime,
    convertType,
    notApplicable,
    setConsumablePartsShowModal,
    showConsumablePartsModal,
    handleConsumablePartsSubmitAttask,
    consumablePartsIndex,
    setConsumablePartsIndex,
    allConsumableParts,
    initTaskRecords,
    isAPU,
    positionByModel,
    getModelId,
    setModelId,
    INSPECTION_TYPE,
    trades,
    allTaskTypes,
    onChange,
    taskSource,
    allTaskStatus,
    showTaskModal,
    setShowTaskModal,
    handleTaskTypeSubmit
  };
}
