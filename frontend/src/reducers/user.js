import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
	fullName: '',
	userId: '',
	token: '',
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
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
	setFullName: userSlice.actions.setFullName,
	setUserId: userSlice.actions.setUserId,
	setToken: userSlice.actions.setToken,
};

export default userSlice.reducer;
