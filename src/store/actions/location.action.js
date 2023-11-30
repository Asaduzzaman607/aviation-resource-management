import { notification } from 'antd';
import { getErrorMessage } from '../../lib/common/helpers';
import { getLocations } from '../../reducers/location.reducers';
import LocationService from '../../service/LocationService';

export const getLocationList = (size, values) => async (dispatch) => {
  try {
    const { data } = await LocationService.getAllLocations(size, values);
    dispatch(getLocations(data));
  } catch (error) {
    notification['error']({ message: getErrorMessage(error) });
  }
};
