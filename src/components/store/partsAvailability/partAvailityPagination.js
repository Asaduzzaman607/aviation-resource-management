import {useDispatch, useSelector} from "react-redux";
import {Form} from "antd";
import {
  paginationObjectTemplate, setIsActive as setIsActivePagination, setPagination
} from "../../../reducers/paginate.reducers";
import {Status} from "../../../lib/constants/status-button";
import {useEffect} from "react";
import API from "../../../service/Api";

const paginationSelector = (key) => (state) => {
  if (state.pagination.hasOwnProperty(key)) {
    return state.pagination[key];
  }
  return paginationObjectTemplate;
};
export const fetchPagination = (key, url, params) => async (dispatch) => {
  try {
    const response = await API.post(url, params, {
      params: {
        page: params.page, size: params.size,
      },
    });
    dispatch(setPagination({key, data: {...params, ...response.data}}));
  } catch (e) {
    // dispatch(setPagination({ key, data: paginationObjectTemplate }));
  }
};

export function usePartAvailabilityPagination(key, url, values = {}) {
  const dispatch = useDispatch();
  const data = useSelector(paginationSelector(key));
  const [form] = Form.useForm();
  let collection = [];
  let partId;

  const {
    model: list, currentPage, totalPages, totalElements, page, isActive, size,
  } = data;
  list?.map((data) => {
    if (data.id === partId) {
      collection.push({
        id: null,
        partNo: '',
        demandQuantity: '',
        quantity: '',
        issuedQuantity: '',
        requisitionQuantity: '',
        officeCode: '',
        minStock:'',
        maxStock:'',
        uomWiseQuantity: data.uomWiseQuantity,
        uomCode: data.uomCode,
      })
    } else {
      collection.push({...data})
      partId = data.id;
    }
  })
  const setIsActive = (isActive) => {
    dispatch(setIsActivePagination({key, isActive}));
    const values = form.getFieldsValue();
    isActive === Status.REJECTED ? fetchData({
      isActive, type: 'REJECTED', ...values,
    }) : fetchData({
      isActive, page, ...values
    });
    form.resetFields()
  };

  const fetchData = (params = {}) => {
    const data = {
      page: 1, size: 10, isActive, ...params,
    };

    dispatch(fetchPagination(key, url, data));
  };

  const paginate = (page) => {
    const values = form.getFieldsValue();
    isActive === Status.REJECTED ? fetchData({isActive, page, type: 'REJECTED', ...values}) : fetchData({
      isActive,
      page, ...values
    });
  };
  const refreshPagination = (params = {}) => {
    const values = form.getFieldsValue();
    fetchData({isActive, page, ...values, ...params});
  };

  useEffect(() => {
    const {model, ...rest} = data;
    form.setFieldsValue({...rest});
    dispatch(fetchPagination(key, url, {...rest, ...values}));
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
    refreshPagination,
    setIsActive,
    size: Number(size),
  };
}
