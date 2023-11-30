import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  previousRoute: ''
}

export const routeLocationSlice = createSlice({
  name: 'routeLocation',
  initialState,
  reducers: {
    setLocation(state, action) {
      const { value } = action.payload;
      return {
        ...state,
        previousRoute: value
      }
    }
  }
})

export const { setLocation } = routeLocationSlice.actions;

export default routeLocationSlice.reducer;