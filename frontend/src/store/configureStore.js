import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import rootReducer from '../reducers';


const store = () =>
	configureStore({
		reducer: rootReducer,
		devTools: process.env.NODE_ENV !== 'production',
	});


const wrapper = createWrapper(store, {
	debug: process.env.NODE_ENV === 'development',
});

export default wrapper;




