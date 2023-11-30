import RackService from "../../service/RackService";
import {getRacks} from "../../reducers/rack.reducers";
import {notification} from "antd";

export const getRackList = (isActive) => async (dispatch) => {

    RackService.getAllRack(isActive)
        .then((response) => {
            dispatch(getRacks(response.data));
        })
        .catch((error) => {
            notification["error"]({
                message: error.message,
            });
            console.log("something went wrong", error);
        });
};