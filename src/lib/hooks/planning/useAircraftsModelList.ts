import ModelsService from "../../../service/ModelsService";
import {notifyResponseError} from "../../common/notifications";
import {useCallback, useState} from "react";

export type AircraftModel = {
  id: number,
  name: string
}

export default function useAircraftModelList() {

  const [aircraftModels, setAircraftModels] = useState<AircraftModel[]>([]);

  const initAircraftModels = useCallback(async () => {
    try {
      const {data} = await ModelsService.getAllAircraftModel();
      setAircraftModels(data.model.map(({id, aircraftModelName}: any) => ({id, name: aircraftModelName}) as AircraftModel));
    } catch (err) {
      notifyResponseError(err)
    }
  }, []);


  return {
    aircraftModels,
    initAircraftModels
  }
}