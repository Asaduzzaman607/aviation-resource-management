import API from "../../../service/Api";
import { useCallback, useState } from "react";

export default function useAmlOptions() {
	
	const [amls, setAmls] = useState([])
	
	const initAmls = useCallback(async () => {
		const res = await API.get('aircraft-maintenance-log/all');
		setAmls([...res.data].map(({ amlId: id, pageNo: name, alphabet }) => ({ id, name: (name + alphabet).toString() })))
	}, [])
	
	return {
		initAmls,
		setAmls,
		amls
	}
}