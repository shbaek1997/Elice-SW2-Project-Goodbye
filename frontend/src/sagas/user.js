import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';

import {
	LOG_IN_FAILURE,
	LOG_IN_REQUEST,
	LOG_IN_SUCCESS,
	LOG_OUT_FAILURE,
	LOG_OUT_REQUEST,
	LOG_OUT_SUCCESS,
	SIGN_UP_FAILURE,
	SIGN_UP_REQUEST,
	SIGN_UP_SUCCESS,
} from '../reducers/user';

function logInAPI(data) {
	return axios.post('/api/users/login', data);
}

function* logIn(action) {
	try {
		const result = yield call(logInAPI, action.data);
		yield put({
			type: LOG_IN_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: LOG_IN_FAILURE,
			error: err.response.data,
		});
	}
}

function logOutAPI() {
	return axios.post('/api/users/logout');
}

function* logOut() {
	try {
		yield call(logOutAPI);
		yield put({
			type: LOG_OUT_SUCCESS,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: LOG_OUT_FAILURE,
			error: err.response.data,
		});
	}
}

async function signUpAPI(data) {
	return axios.post('/api/users/register', data);
}

function* signUp(action) {
	try {
		const result = yield call(signUpAPI, action.data);
		console.log(result);
		yield put({
			type: SIGN_UP_SUCCESS,
		});
	} catch (err) {
		console.error(`Error : ${err}`);
		//alert(err.response.data.message);
		//res.status(500).json({ message: error.message });
		yield put({
			type: SIGN_UP_FAILURE,
			error: err.response.data,
		});
	}
}

function* watchLogIn() {
	yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
	yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
	yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
	yield all([fork(watchLogIn), fork(watchLogOut), fork(watchSignUp)]);
}
