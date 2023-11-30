
import {notification} from "antd";
import ExternalDepartmentService from "../../service/ExternalDepartmentService";
import {getExternalService} from "../../reducers/externalservice.reducers";

export const getExternalList = (isActive) => async (dispatch) => {

    ExternalDepartmentService.getAllExternal(isActive)
        .then((response) => {
            dispatch(getExternalService(response.data));
        })
        .catch((error) => {
            notification["error"]({
                message: error.message,
            });
            console.log("something went wrong", error);
        });
};