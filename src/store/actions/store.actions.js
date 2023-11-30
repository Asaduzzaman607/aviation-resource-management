import { notification } from 'antd';
import { getErrorMessage } from '../../lib/common/helpers';
import { getStores } from '../../reducers/store.reducers';
import OfficeService from '../../service/OfficeService';

export const getStoreList = (size, values) => async (dispatch) => {
  try {
    const { data } = await OfficeService.getAllStores(size, values);
    dispatch(getStores(data));
  } catch (error) {
    notification['error']({ message: getErrorMessage(error) });
  }
};
