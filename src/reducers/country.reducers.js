import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    model: [],
    totalPages: '',
    currentPage: '',
    totalElements: ''
   
}

export const countrySlice = createSlice({
    name: 'country',
    initialState,
    reducers: {
        getCountries: (state, action) => {
            const { model,totalPages,currentPage,totalElements  } = action.payload;

            return {
                ...state,
                model,
                totalPages,
                currentPage,
                totalElements
            }
        },
    }
})

export const {getCountries} = countrySlice.actions;

export default countrySlice.reducer;