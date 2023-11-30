import { notification } from 'antd';
import { getErrorMessage } from '../../lib/common/helpers';
import { getAircraftModelFamilies } from '../../reducers/aircraftModelFamily.reducers';
import AircraftModelFamilyService from '../../service/AircraftModelFamilyService';

export const getAircraftModelFamilyList = (isActive) => async (dispatch) => {
    try {
        const { data } = await AircraftModelFamilyService.getAllAircraftModels(
            isActive
        );
        dispatch(getAircraftModelFamilies(data));
    } catch (error) {
        notification['error']({ message: getErrorMessage(error) });
    }
};
