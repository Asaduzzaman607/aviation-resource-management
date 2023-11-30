import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    model: [],
    currentPage: '',
    totalElements: '',
    totalPages: '',
};

export const storeSlice = createSlice({
    name: 'stores',
    initialState,
    reducers: {
        getStores: (state, action) => {
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

export const { getStores } = storeSlice.actions;

export default storeSlice.reducer;
