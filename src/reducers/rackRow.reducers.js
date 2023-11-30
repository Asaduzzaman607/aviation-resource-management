import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    model:[],
    currentPage:'',
    totalElements:'',
    totalPages:''
}

export const rackRowSlice = createSlice({
    name: 'rackrow',
    initialState,
    reducers: {
        getRackRow: (state, action) => {
            const { model,totalPages,totalElements,currentPage  } = action.payload;

            return {
                ...state,
                model,
                totalPages,
                totalElements,
                currentPage

            }
        },

    }
})

export const { getRackRow } = rackRowSlice.actions;

export default rackRowSlice.reducer;