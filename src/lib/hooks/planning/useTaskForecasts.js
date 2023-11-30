import {Form, notification} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getErrorMessage} from "../../common/helpers";
import TaskDoneServices from "../../../service/TaskDoneServices";
import moment from "moment";
import DateTimeConverter from "../../../converters/DateTimeConverter";
import TaskForecastServices from "../../../service/TaskForecastServices";
import {remove, update} from "ramda";
import {notifyResponseError} from "../../common/notifications";
import {collect} from "collect.js";
import {DateFormat} from "../../../components/planning/report/Common";

export function useTaskForecasts() {
  const [form] = Form.useForm();
  const {id} = useParams()
  const navigate = useNavigate()
  const [taskForecastData, setTaskForecastData] = useState({});
  const [tasks, setTasks] = useState([])
  const [searchKey, setSearchKey] = useState(null)
  const [taskIds, setTaskIds] = useState([])
  const [taskDoneList, setDoneList] = useState([])
  const aircraftId = Form.useWatch("aircraftId", form);
  const forecastDtoList = Form.useWatch("forecastDtoList", form);



  const getTaskByAircraftId = (e) => {
    setSearchKey(e)
  }

  const onChangeTaskId = (checkedValues) => {
    setTaskIds(checkedValues);
  };


  const dateRange = Form.useWatch("date", form);

  const handleSearchTasks = async () => {

    const [fromDate, toDate] = dateRange || '';

    const searchArray = []
    searchArray.push(searchKey)


    const values = {
      aircraftIds: searchArray,
      fromDate: DateTimeConverter.momentDateToString(fromDate) || '',
      toDate: DateTimeConverter.momentDateToString(toDate) || ''
    }

    try {
      const {data} = await TaskDoneServices.searchTaskDoneByAirCrafts(values);

      setDoneList(data)
    } catch (er) {
      notifyResponseError(er)
      return Promise.reject("Message");
    }
  };

  const generateTaskForecast = async () => {


    const forecastRequestData = taskDoneList
      .filter(({ldndId}) => taskIds.includes(ldndId))
      .map(({ldndId, taskId, dueDate, partId}) => ({ldndId, taskId, dueDate, partId}))

    const forecastRequestedAircraft = taskDoneList
      .filter(({ldndId}) => taskIds.includes(ldndId))
      .map(({aircraftId}) => ({aircraftId}))


    try {
      const {data} = await TaskForecastServices.generateTaskForecast(forecastRequestedAircraft[0].aircraftId, {
        forecastRequestList: forecastRequestData
      });


      const taskForeCastListFlat = data?.forecastTaskDtoList;


      const forecastTaskDtoList = taskForeCastListFlat?.map(taskDone => ({
        ldndId: taskDone?.ldndId,
        aircraftId: data?.aircraftId,
        aircraftName: data?.aircraftName,
        aircraftSerial: data?.aircraftSerial,
        taskId: taskDone?.taskId,
        taskNo: taskDone?.taskNo,
        forecastTaskPartDtoList: taskDone?.forecastTaskPartDtoList?.map(({partId, partNo}) => ({partId, partNo})),
        quantity: taskDone?.forecastTaskPartDtoList?.map(({quantity}) => ({quantity})),
        comment: taskDone?.comment,
        description: taskDone?.forecastTaskPartDtoList?.map(({description}) => ({description})),
        ipcRef: taskDone?.forecastTaskPartDtoList?.map(({ipcRef}) => ({ipcRef})),
        dueDate: moment(taskDone?.dueDate)
      }))

      const values = form.getFieldsValue(true)


      const forecastTaskIndex = values.forecastDtoList
        .map(v => v[0])
        .findIndex(v => {
          return v.aircraftId === aircraftId;
        });


      if (forecastTaskIndex > -1) {
        const forecastDtoList = update(forecastTaskIndex, forecastTaskDtoList, values.forecastDtoList)
        form.setFieldsValue({forecastDtoList});
        return;
      }


      const forecastDtoList = [forecastTaskDtoList, ...values.forecastDtoList];


      form.setFieldsValue({forecastDtoList})
      setTasks(data);
    } catch (er) {
      notifyResponseError(er)
      return Promise.reject("Message");
    }
  };


  const removeGeneratedTask = (forecastIndex, taskIndex) => {

    const forecastFieldValue = form.getFieldValue("forecastDtoList")
    const currentForecast = forecastFieldValue[forecastIndex];

    if (currentForecast.length === 1) {
      form.setFieldsValue({forecastDtoList: remove(forecastIndex, 1, forecastFieldValue)})
      return;
    }

    const newForeCast = remove(taskIndex, 1, currentForecast);
    form.setFieldsValue({forecastDtoList: update(forecastIndex, newForeCast, forecastFieldValue)})
  }


  useEffect(() => {
    const flatForecastFieldValue = form.getFieldValue("forecastDtoList")?.flat()
    const filteredForecastTask = flatForecastFieldValue?.filter(v => v?.aircraftId === aircraftId)?.map(({ldndId}) => ldndId)
    setTaskIds(filteredForecastTask)

  }, [forecastDtoList, aircraftId])


// handle reset input fields
  const onReset = () => {
    if (id) {
      form.setFieldsValue({...taskForecastData})
    } else {
      form.resetFields()
    }
  };


// get Parts data by id
  useEffect(() => {
    if (!id) {
      return
    }
    getTaskForecastById().catch(console.error)

  }, [id])

  const [forecastEditedData, setForecastEditedData] = useState([])


  const getTaskForecastById = async () => {
    try {
      const {data} = await TaskForecastServices.getTaskForecastById(id)

      setForecastEditedData(data)


      const {
        forecastAircraftDtoList: forecastAircraftDtoList,
        dueDate,
        name,
        ...rest
      } = data;


      const dat = forecastAircraftDtoList
        ?.map(({id: aircraft, aircraftId, aircraftName, aircraftSerial, forecastTaskDtoList}) => (
          forecastTaskDtoList
            ?.map(({ldndId, comment, taskId, taskNo, dueDate, forecastTaskPartDtoList}) => ({
              ldndId, taskId, taskNo, comment, aircraftId, aircraftName,aircraftSerial, dueDate : moment(dueDate) || null, id: aircraft,
              forecastTaskPartDtoList: forecastTaskPartDtoList?.filter(({ldndId}) => !ldndId)
                ?.map(({
                         id,
                         partId,
                         partNo,
                       }) => (
                  {id, partId, partNo})),
              quantity: forecastTaskPartDtoList?.filter(({ldndId}) => !ldndId).map(({quantity}) => (
                {quantity})),
              ipcRef: forecastTaskPartDtoList?.filter(({ldndId}) => !ldndId).map(({ipcRef}) => (
                {ipcRef})),
              description: forecastTaskPartDtoList?.filter(({ldndId}) => !ldndId).map(({description}) => (
                {description})),
            }))
        )).flat()

      const forecastGroupByAircraftId = collect(dat).groupBy('aircraftId').toArray().map(v => v.items)


      const formData = {
        ...rest,
        name,
        forecastDtoList: forecastGroupByAircraftId
      }

      form.setFieldsValue(formData)
      setTaskForecastData({...data})

    } catch (er) {
      notification["error"]({message: getErrorMessage(er)});
    }
  }


// post api call using async await
  const onFinish = async () => {

    const values = form.getFieldsValue(true)



    const allTasks = forecastEditedData?.forecastAircraftDtoList?.map(({forecastTaskDtoList})=> forecastTaskDtoList)?.flat()
    const allParts = allTasks?.map(({forecastTaskPartDtoList})=> forecastTaskPartDtoList)?.flat()
    const allAircraft = forecastEditedData?.forecastAircraftDtoList




    const formattedForecastFormData3 = {
      id: !forecastEditedData.id ? null : forecastEditedData.id,
      name: values.name,
      forecastAircraftDtoList: values.forecastDtoList?.map(v => v.map(({
                                                                         aircraftId,

                                                                         id,
                                                                         taskId,
                                                                         taskNo,
                                                                         dueDate,
                                                                         comment,
                                                                         description,
                                                                         quantity,
                                                                         ipcRef,
                                                                         ldndId,
                                                                         forecastTaskPartDtoList
                                                                       }) => {
        return {
          id: !id ? null : id,
          aircraftId: aircraftId,
          forecastTaskDtoList:
            [{
              id: !id ? null : allTasks.find(task=> task.ldndId===ldndId)?.id,
              ldndId: ldndId,
              taskId: taskId,
              taskNo: taskNo,
              dueDate: DateTimeConverter.momentDateToString(dueDate),
              comment: comment,
              forecastTaskPartDtoList: forecastTaskPartDtoList?.map(({id, partId, partNo}, index) => {
                return {
                  id: !id ? null : id,
                  partId: partId,
                  partNo: partNo,
                  description: description[index].description,
                  quantity: quantity[index].quantity,
                  ipcRef: ipcRef[index].ipcRef

                }
              })
            }
            ]
        }
      })).flat()
    }


    const forecastFinalData = {
      id: !forecastEditedData.id ? null : forecastEditedData.id,
      name: values.name,
      forecastAircraftDtoList: values.forecastDtoList?.map(v => v.map(({
                                                                         aircraftId,
                                                                         id,
                                                                         taskId,
                                                                         taskNo,
                                                                         dueDate,
                                                                         comment,
                                                                         description,
                                                                         quantity,
                                                                         ipcRef,
                                                                         ldndId,
                                                                         forecastTaskPartDtoList
                                                                       }) => {
        return {
          id:   allAircraft?.find(aircraft=> aircraft.aircraftId===aircraftId)?.id || null,
          aircraftId: aircraftId,
          forecastTaskDtoList:
              [{
                id: allTasks?.find(task=> task.ldndId===ldndId)?.id || null,
                ldndId: ldndId,
                taskId: taskId,
                taskNo: taskNo,
                dueDate: DateTimeConverter.momentDateToString(dueDate),
                comment: comment,
                forecastTaskPartDtoList: forecastTaskPartDtoList?.map(({id, partId, partNo}, index) => {
                  return {
                    id: allParts?.find(task=> task.id===id)?.id || null,
                    partId: partId,
                    partNo: partNo,
                    description: description[index].description,
                    quantity: quantity[index].quantity,
                    ipcRef: ipcRef[index].ipcRef

                  }
                })
              }
              ]
        }
      })).flat()
    }



    const forecastAircraftData = forecastFinalData.forecastAircraftDtoList
    const a = {};

    for (let i = 0; i < forecastAircraftData.length; i++) {
      const { id, aircraftId,forecastTaskDtoList } = forecastAircraftData[i];
      if (!a.hasOwnProperty(aircraftId)) {
        a[aircraftId] = {
          id,
          aircraftId,
          forecastTaskDtoList
        }
      } else {
        a[aircraftId].forecastTaskDtoList.push(...forecastTaskDtoList);
      }
    }


    const formattedForecastFormData4 = {
      id: !forecastEditedData.id ? null : forecastEditedData.id,
      name: values.name,
      forecastAircraftDtoList: Object.values(a)
        }


    try {
      if (id) {
        await TaskForecastServices.updateTaskForecast(id, formattedForecastFormData4)
      } else {
        let {data} = await TaskForecastServices.saveTaskForecast(formattedForecastFormData4)

      }

      form.resetFields()
      navigate('/planning/task-forecasts')
      notification["success"]({
        message: id ? "Successfully updated!" : "Successfully added!",
      });

    } catch (er) {
      notification["error"]({message: getErrorMessage(er)});
    }

  };


//Title separating
  const TITLE = id ? 'Task Forecast Edit' : 'Task Forecast Add';


  return {
    id,
    form,
    onFinish,
    onReset,
    TITLE,
    getTaskByAircraftId,
    generateTaskForecast,
    taskDoneList,
    handleSearchTasks,
    onChangeTaskId,
    removeGeneratedTask,
    forecastDtoList,
    taskIds
  };
}
