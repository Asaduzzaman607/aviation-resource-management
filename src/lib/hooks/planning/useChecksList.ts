import {useCallback, useState} from "react";
import API from "../../../service/Api";
import {Check} from "../../../types/checks";

export type CheckOption = Pick<Check, "id" | "title">

export function useChecksList() {
  const [checks, setChecks] = useState<CheckOption[]>([])

  const initChecks = useCallback(async () => {
    const { data } = await API.get('check')
    setChecks(data.model.map(({id, title}: any) => ({id, title}) as CheckOption))
  }, [])

  return {
    checks,
    initChecks,
    setChecks
  }
}