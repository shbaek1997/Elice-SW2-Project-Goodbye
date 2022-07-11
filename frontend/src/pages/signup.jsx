import React, { useCallback, useState } from 'react';
import { Form } from 'antd';
import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { SIGN_UP_REQUEST } from '../reducers/user';
import useInput from '../hooks/useInput';

const SignUp = () => {
	const dispatch = useDispatch();
	const [email, onChangeEmail] = useInput('');
	const [fullName, onChangeFullName] = useInput('');
	const [dateOfBirth, onChangeDateOfBirth] = useInput('');
	const [password, onChangePassword] = useInput('');
	const [repeatPassword, onChangeRepeatPassword] = useInput('');
	const [term, onChangeTerm] = useState(false);

	const onSubmitForm = useCallback(() => {
		return dispatch({
			type: SIGN_UP_REQUEST,
			data: {
				email,
				fullName,
				dateOfBirth,
				password,
				repeatPassword,
			},
		});
	}, [email, fullName, dateOfBirth, password, repeatPassword, term]);

	return (
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
							/>
							약관에 동의합니다.
						</span>
					</div>
					<div css={buttonWrapper}>
						<input type="submit" value="회원가입" />
						<input type="button" value="취소" />
					</div>
				</Form>
			</section>
		</main>
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
	}
`;

export default SignUp;
