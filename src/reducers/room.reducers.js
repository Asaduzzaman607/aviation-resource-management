import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    model:[],
    currentPage:'',
    totalElements:'',
    totalPages:''
}

export const roomSlice = createSlice({
	name: 'room',
	initialState,
	reducers: {
		getRooms: (state, action) => {
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

export const { getRooms } = roomSlice.actions;

export default roomSlice.reducer;