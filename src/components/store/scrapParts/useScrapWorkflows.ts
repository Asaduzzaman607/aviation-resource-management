import {useCallback, useEffect, useState} from "react";
import ScrapPartsService from "../../../service/store/ScrapPartsService";
import subModules from "../../auth/sub_module";

export default function useScrapWorkflows(params = {}) {
  const [workflows, setWorkflows] = useState<any[]>([]);

  const initWorkflows = useCallback(async () => {
    const res = await ScrapPartsService.getWorkFlows(subModules.SCRAP_PART)
    setWorkflows([...res.data.model])
  }, [])

  return {
    workflows,
    setWorkflows,
    initWorkflows
  }
}