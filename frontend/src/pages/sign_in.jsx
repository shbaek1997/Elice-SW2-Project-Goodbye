import React, { useCallback, useEffect } from 'react';
import { Form } from 'antd';
import { css } from '@emotion/react';
import useInput from '../hooks/useInput';
import AppLayout from '../components/AppLayout';
import Router from 'next/router';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { USERACTIONS } from '../reducers/user';

const SignIn = () => {
	const dispatch = useDispatch();
	const [email, onChangeEmail] = useInput('');
	const [password, onChangePassword] = useInput('');
	const userToken = useSelector((state) => state.user.token);

	useEffect(() => {
		const token = sessionStorage.getItem('token');
		if (token) {
			Router.replace('/');
		}
	}, []);

	const onSubmitForm = useCallback(() => {
		const data = { email, password };
		try {
			const result = axios.post('/api/users/login', data);

			if (result.data.token) {
				sessionStorage.setItem('token', result.data.token);
				sessionStorage.setItem('userId', result.data.userId);
				dispatch(USERACTIONS.setToken(result.data.token));

				Router.replace('/');
			}
		} catch (error) {
			alert(error.response.data.reason);
		}
	}, [email, password]);

	return (
		<AppLayout>
			<main css={mainWrapper}>
				<section css={sectionWrapper}>
					<div css={headerWrapper}>
						<h2>로그인</h2>
					</div>
					<Form onFinish={onSubmitForm}>
						<div css={inputWrapper}>
							<input
								type="text"
								placeholder="이메일"
								name="email"
								value={email}
								onChange={onChangeEmail}
								required
							/>
							<input
								type="password"
								placeholder="비밀번호"
								name="password"
								value={password}
								onChange={onChangePassword}
								required
							/>
						</div>
						<div css={forgetWrapper}>비밀번호 찾기</div>
						<div css={buttonWrapper}>
							<input type="submit" value="로그인" />
							<input type="button" value="구글로그인" />
						</div>
					</Form>
				</section>
			</main>
		</AppLayout>
	);
};

const mainWrapper = css`
	display: flex;
	justify-content: center;
	width: 100%;
	height: 85vh;
`;

const sectionWrapper = css`
	width: 20em;
	margin: auto;
`;

const headerWrapper = css`
	width: 30%;
	margin: 0 auto;
`;

const inputWrapper = css`
    display: flex;
    flex-direction: column;
    width: 100%
    line-height: 3rem;

    & > input {
        background: transparent;
        border: none;
        border-bottom: solid 1px #193441;
        line-height: 1.5rem;
        margin: 10px 0;
        
    }
`;

const forgetWrapper = css`
	text-align: right;
	color: #91aa9d;
	margin: 10px 0px 50px;
`;

const buttonWrapper = css`
	width: 100%;

	& > input[type='submit'] {
		margin-right: 2%;
		background-color: #3e606f;
	}

	& > input {
		background-color: #91aa9d;
		color: white;
		border: none;
		width: 49%;
		padding: 10px;
	}
`;

export default SignIn;
