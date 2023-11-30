import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  model: [],
  currentPage: '',
  totalElements: '',
  totalPages: '',
};

export const locationSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    getLocations: (state, action) => {
      const { model, totalPages, totalElements, currentPage } = action.payload;

      return {
        ...state,
        model,
        totalPages,
        totalElements,
        currentPage,
      };
    },
  },
});

export const { getLocations } = locationSlice.actions;

export default locationSlice.reducer;
