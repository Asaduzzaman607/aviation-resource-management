import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    model: [],
    currentPage: '',
    totalElements: '',
    totalPages: '',
};

export const aircraftSlice = createSlice({
    name: 'aircrafts',
    initialState,
    reducers: {
        getAircrafts: (state, action) => {
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

export const { getAircrafts } = aircraftSlice.actions;

export default aircraftSlice.reducer;
