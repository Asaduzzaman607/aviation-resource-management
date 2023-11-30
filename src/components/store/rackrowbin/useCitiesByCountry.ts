import cityService from "../../../service/CityService";
import {notifyResponseError} from "../../../lib/common/notifications";
import {useCallback, useEffect, useState} from "react";

export default function useCitiesByCountry(countryId: Number) {

  const [cities, setCities] = useState<any[]>([]);

  const getAllCity = useCallback(async () => {

    if (!countryId) return;

    try {
      const {data} = await cityService.getAllCity(1000, {
        query: '',
        isActive: true,
        id: countryId
      });
      setCities(data.model);

    } catch (er) {
      notifyResponseError(er);
    }

  }, [countryId]);


  useEffect(() => {
    (async () => {
      await getAllCity();
    })();
  }, [countryId])


  return {
    cities, setCities
  }
}