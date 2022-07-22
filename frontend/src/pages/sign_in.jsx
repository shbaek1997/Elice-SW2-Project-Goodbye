import React, { useCallback, useState, useEffect } from 'react';
import { Form } from 'antd';
import { css } from '@emotion/react';
import useInput from '../hooks/useInput';
import AppLayout from '../components/AppLayout';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { USERACTIONS } from '../reducers/user';
import Router, { useRouter } from 'next/router';

import userLoginCheck from '../util/userLoginCheck';

const SignIn = () => {
	const router = useRouter();
	const [redirectUrl, setRedirectUrl] = useState('/');
	const dispatch = useDispatch();
	const [email, onChangeEmail] = useInput('');
	const [password, onChangePassword] = useInput('');

	const preventUserAccess = async () => {
		const isLogIn = await userLoginCheck();
		//console.log(isLogIn);
		if (isLogIn) {
			alert('이미 로그인 되어있습니다..');
			Router.replace('/');
		}
	};

	const onSubmitForm = useCallback(() => {
		const data = { email, password };
		axios
			.post('/api/users/login', data)
			.then((res) => {
				if (res.data.token) {
					sessionStorage.setItem('token', res.data.token);
					sessionStorage.setItem('userId', res.data.userId);
					sessionStorage.setItem(
						'remembranceId',
						res.data.remembranceId,
					);
					// const { token, userId } = res.data;
					// console.log(res, res.data, fullName);
					Router.replace(redirectUrl);
				}
			})
			.catch((error) => {
				console.log(error);
				if (error.response.data.reason) {
					alert(error.response.data.reason);
				}
			});
	}, [email, password]);

	useEffect(() => {
		// 로그인한 유저가 접속하지 못하게 하는 부분
		preventUserAccess();

		if (!router.isReady) return;
		if (router.query.redirectUrl) {
			setRedirectUrl(router.query.redirectUrl);
		}
		//console.log('query : ' + redirectUrl);
	}, [router.isReady]);

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
						{/* <div css={forgetWrapper}>비밀번호 찾기</div> */}
						<div css={buttonWrapper}>
							<input type="submit" value="로그인" />
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

	& > input {
		background-color: #3e606f;
		color: white;
		border: none;
		width: 100%;
		padding: 10px;
		cursor: pointer;
	}
`;

export default SignIn;
