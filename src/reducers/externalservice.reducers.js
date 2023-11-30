import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    model:[],
    currentPage:'',
    totalElements:'',
    totalPages:''
}

export const externalServiceSlice = createSlice({
    name: 'externalservice',
    initialState,
    reducers: {
        getExternalService: (state, action) => {
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

export const { getExternalService } = externalServiceSlice.actions;

export default externalServiceSlice.reducer;