import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    model:[],
    currentPage:'',
    totalElements:'',
    totalPages:''
}

export const roomSlice = createSlice({
    name: 'rackrowbin',
    initialState,
    reducers: {
        getrackRowBin: (state, action) => {
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

export const { getrackRowBin } = roomSlice.actions;

export default roomSlice.reducer;