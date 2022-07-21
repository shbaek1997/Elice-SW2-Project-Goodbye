import React, { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { Form } from 'antd';
import { css } from '@emotion/react';
import useInput from '../hooks/useInput';
import AppLayout from '../components/AppLayout';
import axios from 'axios';
import Router, { useRouter } from 'next/router';

import userLoginCheck from '../util/userLoginCheck';

const SignUp = () => {
	const router = useRouter();
	const [redirectUrl, setRedirectUrl] = useState('/sign_in');
	// const [isLogIn, setIsLogIn] = useState(null);

	const [email, onChangeEmail] = useInput('');
	const [fullName, onChangeFullName] = useInput('');
	const [dateOfBirth, onChangeDateOfBirth] = useInput('');
	const [password, onChangePassword] = useInput('');
	const [repeatPassword, onChangeRepeatPassword] = useInput('');
	const [term, onChangeTerm] = useState(false);

	const preventUserAccess = async () => {
		const isLogIn = await userLoginCheck();
		if (isLogIn) {
			alert('이미 로그인 되어있습니다..');
			Router.replace('/');
		}
	};

	const onSubmitForm = useCallback(() => {
		const data = { email, fullName, dateOfBirth, password, repeatPassword };
		axios
			.post('/api/users/register', data)
			.then((res) => {
				if (res.data._id) {
					alert(
						`${res.data.fullName}님 회원가입을 축하합니다. 로그인을 먼저 해주세요.`,
					);
					Router.replace(redirectUrl);
				}
			})
			.catch((error) => {
				//if (error.response.data.reason) {
				alert(error.response.data.reason);
				//}
			});
	}, [email, fullName, dateOfBirth, password, repeatPassword, term]);

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
						<h2>회원가입</h2>
					</div>
					<Form onFinish={onSubmitForm}>
						<div css={inputWrapper}>
							<input
								type="text"
								placeholder="이메일"
								name="email"
								value={email}
								required
								onChange={onChangeEmail}
							/>
							<input
								type="text"
								placeholder="이름"
								name="fullName"
								value={fullName}
								required
								onChange={onChangeFullName}
							/>
							<input
								type="text"
								placeholder="생년월일"
								name="dateOfBirth"
								value={dateOfBirth}
								required
								onChange={onChangeDateOfBirth}
							/>
							<input
								type="password"
								placeholder="비밀번호"
								name="password"
								value={password}
								required
								onChange={onChangePassword}
							/>
							<input
								type="password"
								placeholder="비밀번호 확인"
								name="repeatPassword"
								value={repeatPassword}
								required
								onChange={onChangeRepeatPassword}
							/>

							<span>
								<input
									type="checkbox"
									name="term"
									value={term}
									onChange={onChangeTerm}
									required
								/>
								약관에 동의합니다.
							</span>
						</div>
						<div css={buttonWrapper}>
							<input type="submit" value="회원가입" />
							<Link href={'/'}>
								<input type="button" value="취소" />
							</Link>
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

    & > span {
        margin: 10px 0 30px 0;
        float: left;
    }
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
		cursor: pointer;
	}
`;

export default SignUp;
