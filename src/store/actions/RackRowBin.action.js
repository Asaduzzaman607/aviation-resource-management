
import {notification} from "antd";
import RackRowBinService from "../../service/RackRowBinService";
import {getrackRowBin} from "../../reducers/RackRowBin.reducers";

export const getRackRowBinList = (isActive) => async (dispatch) => {

    RackRowBinService.getAllRackRowBIn(isActive)
        .then((response) => {
            dispatch(getrackRowBin(response.data));
        })
        .catch((error) => {
            notification["error"]({
                message: error.message,
            });
            console.log("something went wrong", error);
        });
};