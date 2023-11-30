import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    model:[],
    currentPage:'',
    totalElements:'',
    totalPages:''
}

export const workflowSlice = createSlice({
    name: 'workflow',
    initialState,
    reducers: {
        getWorkflow: (state, action) => {
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

export const { getWorkflow } = workflowSlice.actions;

export default workflowSlice.reducer;