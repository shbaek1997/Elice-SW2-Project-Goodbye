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
			// console.log(action.payload)
			state.fullName = action.payload.fullName;
			state.userId = action.payload.userId;
			state.token = action.payload.token;
			// state.remembranceId = action.payload.remembranceId;
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
		setLoginState(state, action) {
			console.log('loginState: ' + action.payload);
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
