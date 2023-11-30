import { createSlice } from "@reduxjs/toolkit";

export const initialUser = {
	username: '',
	isLoggedIn: false,
	token: '',
	defaultAccessRight: [],
	userAccessPermissions: {},
	userId: null,
	roleId: null,
	features: {
		moduleIds: [],
		subModuleIds: [],
		subModuleItemIds: []
	}
}

export const userSlice = createSlice({
	name: 'user',
	initialState: initialUser,
	reducers: {
		setUser: (state, action) => {
			const { defaultAccessRight, token, userAccessPermissions, username, roles, featureRoleViewModel, id  } = action.payload;
			return {
				...state,
				isLoggedIn: !!id,
				defaultAccessRight,
				token,
				userAccessPermissions,
				username,
				userId: id ? Number(id) : null,
				roleId: roles ? Number(roles[0]) : null,
				features: featureRoleViewModel
			}
		},

		removeUser: () => {
			return initialUser;
		}
	}
})

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;