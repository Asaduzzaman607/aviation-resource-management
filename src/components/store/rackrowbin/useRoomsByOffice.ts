import {useCallback, useEffect, useState} from "react";
import {notifyResponseError} from "../../../lib/common/notifications";
import roomService from "../../../service/RoomService";

export default function useRoomsByOffice(officeId: number) {

  const [rooms, setRooms] = useState<any[]>([]);

  const getAllRooms = useCallback(async () => {

    if (!officeId) return;

    try {
      const {data} = await roomService.searchRoom(1000, {
        query: '',
        isActive: true,
        id:officeId
      });
      setRooms(data.model);

    } catch (er) {
      notifyResponseError(er);
    }

  }, [officeId]);


  useEffect(() => {
    (async () => {
      await getAllRooms();
    })();
  }, [getAllRooms])


  return {
    rooms, setRooms
  }
}