import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
	fullName: '',
	userId: '',
	token: '',
	logInState: false
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
			console.log('fullName: ' + action.payload);
			state.fullName = action.payload;
		},
		setUserId(state, action) {
			console.log('userId: ' + action.payload);
			state.userId = action.payload;
		},
		setToken(state, action) {
			console.log('token: ' + action.payload);
			state.token = action.payload;
		},
	},
});

export const USERACTIONS = {
	setUserData: userSlice.actions.setUserData,
	clearUserData: userSlice.actions.clearUserData,
	setFullName: userSlice.actions.setFullName,
	setUserId: userSlice.actions.setUserId,
	setToken: userSlice.actions.setToken,
};

export default userSlice.reducer;
