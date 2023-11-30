import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    model:[],
    currentPage:'',
    totalElements:'',
    totalPages:''
}

export const rackSlice = createSlice({
	name: 'rack',
	initialState,
	reducers: {
		getRacks: (state, action) => {
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

export const { getRacks } = rackSlice.actions;

export default rackSlice.reducer;