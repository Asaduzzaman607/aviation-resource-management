import { createSlice } from '@reduxjs/toolkit';
import { Status } from '../lib/constants/status-button';

export const paginationObjectTemplate = {
  model: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  page: 1,
  size: 10,
  isActive: Status.ACTIVE,
  //loading: false,
  //hasError: false,
  //errorMessage: '',
};

export const paginationSlice = createSlice({
  name: 'pagination',

  initialState: {
    demo: paginationObjectTemplate,
  },

  reducers: {
    setPagination: (state, action) => {
      const { key, data } = action.payload;
      state[key] = data;
    },

    setIsActive(state, action) {
      const { key, isActive } = action.payload;
      state[key].isActive = isActive;
    },

    resetState() {
      return {
        demo: paginationObjectTemplate,
      };
    },

    deleteKey(state, action) {
      const { key } = action.payload;
      delete state[key];
    }

    // setLoadingStatus(state, action) {
    // 	state.loading = action.payload;
    // },

    // changeErrorStatus(state, action) {
    // 	const {hasError, errorMessage} = action.payload;
    // 	state.hasError = hasError;
    // 	state.errorMessage = errorMessage;
    // }
  },
});

const { reducer: paginationReducer, actions } = paginationSlice;
export const {
  setPagination,
  setIsActive,
  setLoadingStatus,
  changeErrorStatus,
  resetState,
  deleteKey
} = actions;
export default paginationReducer;
