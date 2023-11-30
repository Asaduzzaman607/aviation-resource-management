import CountryService from '../../service/CountryService';
import { getCountries } from '../../reducers/country.reducers';
import { notification } from 'antd';
import { getErrorMessage } from '../../lib/common/helpers';

export const getCountryList = (size, values) => async (dispatch) => {
  try {
    let { data } = await CountryService.getAllCountry(size, values);
    dispatch(getCountries(data));
  } catch (error) {
    console.log(error);
    notification['error']({ message: getErrorMessage(error) });
  }
};
