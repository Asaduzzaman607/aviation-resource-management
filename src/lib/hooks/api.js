import { useState } from "react";
import { apiStatus } from "../constants/api";

export function useAsync(callback) {
	if (typeof callback !== "function") throw "useAsync accept function as parameters!"
	
	const [data, setData] = useState();
	const [status, setStatus] = useState(apiStatus.IDLE);
	
	const isIdle = () => status === apiStatus.IDLE;
	const isPending = () =>  status === apiStatus.PENDING;
	const isSuccess = () => status === apiStatus.SUCCESS;
	const isError = () => status === apiStatus.ERROR;
	
	const initFetch = async () => {
		try {
			setStatus(apiStatus.PENDING);
			const {data} = await callback();
			setData(data);
			setStatus(apiStatus.SUCCESS);
		} catch (e) {
			setStatus(apiStatus.ERROR);
		}
	}
	
	return {
		initFetch,
		isIdle: isIdle(),
		isPending: isPending(),
		isSuccess: isSuccess(),
		isError: isError(),
		data
	}
}