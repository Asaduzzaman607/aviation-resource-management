import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    model: [],
    currentPage: '',
    totalElements: '',
    totalPages: '',
};

export const aircraftModelFamilySlice = createSlice({
    name: 'aircraftModelFamilies',
    initialState,
    reducers: {
        getAircraftModelFamilies: (state, action) => {
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

export const { getAircraftModelFamilies } = aircraftModelFamilySlice.actions;

export default aircraftModelFamilySlice.reducer;
