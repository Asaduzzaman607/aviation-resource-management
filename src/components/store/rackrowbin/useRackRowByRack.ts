import {useCallback, useEffect, useState} from "react";
import {notifyResponseError} from "../../../lib/common/notifications";
import rackRowService from "../../../service/RackRowService";

export default function useRackRowByRack(rackId: number) {

  const [rackRows, setRackRows] = useState<any[]>([]);

  const getAllRackRow = useCallback(async () => {

    if (!rackId) return;

    try {
      const {data} = await rackRowService.searchRackRow(1000, {
        query: '',
        isActive: true,
        id: rackId
      });
      setRackRows(data.model);

    } catch (er) {
      notifyResponseError(er);
    }

  }, [rackId]);


  useEffect(() => {
    (async () => {
      await getAllRackRow();
    })();
  }, [getAllRackRow])


  return {
    rackRows, setRackRows
  }
}