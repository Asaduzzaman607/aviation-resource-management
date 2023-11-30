import {useCallback, useEffect, useState} from "react";
import {notifyResponseError} from "../../../lib/common/notifications";
import rackService from "../../../service/RackService";

export default function useRacksByRoom(roomId: number) {

  const [racks, setRacks] = useState<any[]>([]);

  const getAllRacks = useCallback(async () => {

    if (!roomId) return;

    try {
      const {data} = await rackService.searchRack(1000, {
        query: '',
        isActive: true,
        id:roomId
      });
      setRacks(data.model);

    } catch (er) {
      notifyResponseError(er);
    }

  }, [roomId]);


  useEffect(() => {
    (async () => {
      await getAllRacks();
    })();
  }, [getAllRacks])


  return {
    racks, setRacks
  }
}