import API from "../../service/Api";
import {notifyResponseError, notifySuccess} from "./notifications";

export  const refreshTaskData = async () => {
    try {
        await API.get(`task-done/update_ldnd`);
        notifySuccess('Updated LDND Data Successfully')
    } catch (er) {
        notifyResponseError(er);
    }
};