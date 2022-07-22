import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
	fullName: '',
	userId: '',
	token: '',
	dateOfBirth: '',
	logInState: null
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserData(state, action) {
			state.fullName = action.payload.fullName;
			state.userId = action.payload.userId;
			state.token = action.payload.token;
			state.logInState = action.payload.logInState;
		},
		clearUserData(state) {
			state.fullName = '',
			state.userId = '',
			state.token = '',
			state.logInState = false
		},
		setFullName(state, action) {
			state.fullName = action.payload;
		},
		setUserId(state, action) {
			state.userId = action.payload;
		},
		setToken(state, action) {
			state.token = action.payload;
		},
		setLoginState(state, action) {
			state.logInState = action.payload;
		},
	},
});

export const USERACTIONS = {
	setUserData: userSlice.actions.setUserData,
	clearUserData: userSlice.actions.clearUserData,
	setFullName: userSlice.actions.setFullName,
	setUserId: userSlice.actions.setUserId,
	setToken: userSlice.actions.setToken,
	setLoginState: userSlice.actions.setLoginState,
};

export default userSlice.reducer;
