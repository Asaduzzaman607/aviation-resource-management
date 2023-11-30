import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedMenu: ['home']
}

export const menuSlice = createSlice({
	name: 'menu',
	initialState,
	reducers: {
		setMenu(state, action) {
			const { key } = action.payload;
			return {
				...state,
				selectedMenu: [ key ]
			}
		}
	}
})

export const { setMenu } = menuSlice.actions;

export default menuSlice.reducer;