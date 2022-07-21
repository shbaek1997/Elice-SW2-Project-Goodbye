import { useEffect } from 'react';
import Router from 'next/router';

const SignOut = () => {
	useEffect(() => {
		sessionStorage.removeItem('token');
		sessionStorage.removeItem('userId');

		Router.replace('/');
	}, []);
};

export default SignOut;
