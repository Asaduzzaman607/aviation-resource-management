import { notification } from "antd";
import { getErrorMessage } from "./helpers";
import { AxiosError } from "axios";

export function notifySuccess(message) {
	notification['success']({ message })
}

export function notifyError(message) {
	notification['error']({ message })
}

export function notifyResponseError(error) {
	// if (!error instanceof AxiosError) {
	// 	notifyError('Something Went Wrong!');
	// 	return;
	// }
	
	notifyError(getErrorMessage(error))
}

export function notifyWarning(message) {
	notification['warning']({ message })
}

export function notifyInfo(message) {
	notification['info']({ message })
}