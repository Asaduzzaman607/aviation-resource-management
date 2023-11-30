import { notification } from 'antd';
import { getErrorMessage } from '../../lib/common/helpers';
import { getAircrafts } from '../../reducers/aircraft.reducers';
import AircraftService from '../../service/AircraftService';

export const getAircraftList = (isActive) => async (dispatch) => {
    try {
        const { data } = await AircraftService.getAllAircraft(isActive);
        dispatch(getAircrafts(data));
    } catch (error) {
        notification['error']({ message: getErrorMessage(error) });
    }
};
