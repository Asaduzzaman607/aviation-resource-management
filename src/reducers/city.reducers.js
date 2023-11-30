import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    model: [],
    currentPage: '',
    totalElements: '',
    totalPages: '',
};

export const citySlice = createSlice({
    name: 'cities',
    initialState,
    reducers: {
        getCities: (state, action) => {
            const { model, totalPages, totalElements, currentPage } =
                action.payload;

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

export const { getCities } = citySlice.actions;

export default citySlice.reducer;
