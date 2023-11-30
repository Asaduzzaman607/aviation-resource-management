import {Form, FormInstance} from "antd";
import {useEffect, useState} from "react";
import {Options} from "../../../lib/types/form";
import useAircraftModelList, {AircraftModel} from "../../../lib/hooks/planning/useAircraftsModelList";
import API from "../../../service/Api";
import {notifyResponseError} from "../../../lib/common/notifications";
import {useParamsId} from "../../../lib/hooks/common";

export default function useCheckIndexAdd(): {
  id: number,
  form: FormInstance;
  checks: Options,
  setChecks: Function,
  aircraftModels: Array<AircraftModel>,
  fetchCheckById: (id: number) => void,
  onFinish: (values: any) => void,
  onReset: (event: any) => void
} {
  const id = useParamsId("acCheckId") as number;
  const [form] = Form.useForm<any>();
  const [checks, setChecks] = useState<Options>([]);
  const {aircraftModels, initAircraftModels} = useAircraftModelList();
  const modelId = Form.useWatch("aircraftModelId", form);

  const resetCheckIdAndTasks = () => {
    setChecks([])
    form.setFieldsValue({ checkId: null, tasks: []})
  }

  useEffect(() => {
    resetCheckIdAndTasks()

    if (!modelId) {
      return;
    }

    (async () => {
      await fetchChecksAndTasksWithModelId(modelId);
    })();

  }, [modelId])

  useEffect(() => {
    if (!id) return;

    (async () => {
      console.log({id})
      await fetchCheckById(id);
    })();

  }, [id])

  const fetchCheckById = async (id: number) => {
    try {
      const {data} = await API.get(`/aircraft-check/${id}`)
      console.log({data})
      form.setFieldsValue({...data})
    } catch (er) {
      notifyResponseError(er);
    }
  };

  const setTasksForForm = (tasks: Array<any>) => {
    form.setFieldsValue({
      tasks: tasks.map((v: any) => ({
        ...v,
        taskCardRef: ""
      }))
    })
  }

  const setCheckOptions = (checks: any[]) => {
    const checkOptions = checks.map(({checkTitle, acCheckId}: any) => ({
      value: acCheckId,
      label: checkTitle
    }))

    setChecks(checkOptions);
  }

  const fetchChecksAndTasksWithModelId = async (modelId?: number) => {
    if (!modelId) {
      setChecks([])
      form.setFieldsValue({ checkId: null})
      return;
    }

    try {
      const res = await API.get(`aircraft-check/ac-model/${modelId}`);
      let {checkAndAcCheckViewModelList, taskViewModelForAcCheckList} = res.data[0];
      setCheckOptions(checkAndAcCheckViewModelList);
      setTasksForForm(taskViewModelForAcCheckList)
    } catch (e) {
      console.log(e);
    }
  }



  const onFinish = async (values: any) => {

    console.log({values});

    // try {
    //   if (id) {
    //     await API.put(`/aircraft-check/${id}`, values);
    //     notifySuccess("Check successfully updated")
    //   } else {
    //     await API.post("/aircraft-check", values);
    //     notifySuccess("Check successfully created")
    //   }
    //
    //   navigate("/planning/ac-checks");
    // } catch (er) {
    //   notifyResponseError(er);
    // }
  };

  useEffect(() => {
    (async () => {
      await initAircraftModels();
    })();
  }, [])


  const onReset = async (event: any) => {
    if (id) {
      form.resetFields();
      await fetchCheckById(id);
    } else {
      form.resetFields();
    }
  };


  return {
    id,
    form,
    checks,
    setChecks,
    aircraftModels,
    fetchCheckById,
    onFinish,
    onReset
  }
}