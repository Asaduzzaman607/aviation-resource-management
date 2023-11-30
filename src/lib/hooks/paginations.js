import { Form } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteKey,
  paginationObjectTemplate,
  setIsActive as setIsActivePagination, setPagination
} from '../../reducers/paginate.reducers';
import API from '../../service/Api';
import { Status } from '../constants/status-button';

export const refreshPagination = (key, url) => async (dispatch, getState) => {
  const state = getState();
  const obj = paginationSelector(key)(state);
  const { model, ...params } = obj;
  dispatch(fetchPagination(key, url, params));
};

export const fetchPagination = (key, url, params) => async (dispatch) => {
  try {
    //dispatch(setLoadingStatus(true));
    const response = await API.post(url, params, {
      params: {
        page: params.page,
        size: params.size,
      },
    });
    dispatch(setPagination({ key, data: { ...params, ...response.data} }));
  } catch (e) {
      // dispatch(setPagination({ key, data: paginationObjectTemplate }));
  } finally {
    //dispatch(setLoadingStatus(false));
  }
};

const paginationSelector = (key) => (state) => {
  if (state.pagination.hasOwnProperty(key)) {
    return state.pagination[key];
  }
  return paginationObjectTemplate;
};

export function usePaginate(key, url, values = {}) {
  const dispatch = useDispatch();
  const data = useSelector(paginationSelector(key));
  const [form] = Form.useForm();

  const {
    model: collection,
    currentPage,
    totalPages,
    totalElements,
    page,
    isActive,
    size,
  } = data;

  const setIsActive = (isActive) => {
    dispatch(setIsActivePagination({ key, isActive }));
    const values = form.getFieldsValue();
    isActive === Status.REJECTED
      ? fetchData({
          isActive,
          type: 'REJECTED',
          ...values,
        })
      : fetchData({ isActive, page,
          ...values
      });
    form.resetFields()
  };

  const fetchData = (params = {}) => {
    const data = {
      page: 1,
      size: 10,
      isActive,
      ...params,
    };

    dispatch(fetchPagination(key, url, data));
  };

  const paginate = (page) => {
    const formValues = form.getFieldsValue();
    isActive === Status.REJECTED
      ? fetchData({ isActive, page, type: 'REJECTED', ...formValues, ...values })
      : fetchData({ isActive, page, ...formValues, ...values });
  };

  const refreshPagination = (params = {}) => {
    const values = form.getFieldsValue();
    fetchData({ isActive, page, ...values, ...params });
  };

  const deleteReduxKey = () => {
    dispatch(deleteKey({ key }))
  }

  const resetFilter = () => {
    form.resetFields();
    fetchData({
      isActive,
      page: 1,
    });
  };


  useEffect(() => {
    const { model, ...rest } = data;
    form.setFieldsValue({ ...rest });
    dispatch(fetchPagination(key, url, { ...rest, ...values }));
  }, []);


  return {
    form,
    paginate,
    page,
    fetchData,
    collection,
    currentPage,
    totalPages,
    totalElements,
    isActive,
    setIsActive,
    refreshPagination,
    resetFilter,
    deleteReduxKey,
    size: Number(size),
    //loading: data.loading,
  };
}
