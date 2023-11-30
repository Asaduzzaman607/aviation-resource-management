import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    model:[],
    totalPages:''
}

export const companySlice = createSlice({
	name: 'company',
	initialState,
	reducers: {
		getCompanies: (state, action) => {
			const { model,totalPages  } = action.payload;
			
			return {
				...state,
                model,
                totalPages
				
			}
		},
		
	}
})

export const { getCompanies } = companySlice.actions;

export default companySlice.reducer;