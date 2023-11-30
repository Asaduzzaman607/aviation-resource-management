import { notification } from 'antd';
import { getErrorMessage } from '../../lib/common/helpers';
import { getCities } from '../../reducers/city.reducers';
import CityService from '../../service/CityService';

export const getCityList = (size, values) => async (dispatch) => {
  try {
    const { data } = await CityService.getAllCity(size, values);
    dispatch(getCities(data));
  } catch (error) {
    notification['error']({ message: getErrorMessage(error) });
  }
};
