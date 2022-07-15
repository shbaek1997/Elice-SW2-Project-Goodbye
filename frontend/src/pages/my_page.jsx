import React, { useCallback } from 'react';
import { css } from '@emotion/react';
import { Form, Switch } from 'antd';
import 'antd/dist/antd.css';
import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import Image from 'next/image';
import axios from 'axios';
import Router from 'next/router';

const MyPage = () => {
	const [password, onChangePassword, setPassword] = useInput('');
	const [currentPassword, onChangeCurrentPassword, setCurrentPassword] =
		useInput('');

	const onUpdateUser = useCallback(async () => {
		const userId = sessionStorage.getItem('userId');
		const token = sessionStorage.getItem('token');

		await axios
			.patch(
				`/api/auth/${userId}`,
				{ currentPassword, password },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				console.log(res);
				alert('성공적으로 수정되었습니다.');
				setPassword('');
				setCurrentPassword('');
			})
			.catch((err) => alert(err.response.data.reason));
	}, [currentPassword, password]);

	const onDeleteUser = useCallback(async () => {
		const userId = sessionStorage.getItem('userId');
		const token = sessionStorage.getItem('token');

		await axios
			.delete(`/api/auth/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
				data: { currentPassword: currentPassword },
			})
			.then((res) => {
				console.log(res);
				alert('성공적으로 회원 탈퇴 되었습니다.');
				sessionStorage.removeItem('userId');
				sessionStorage.removeItem('token');
				Router.replace('/');
			})
			.catch((err) => alert(err.response.data.reason));
	}, [currentPassword]);

	return (
		<AppLayout>
			<div css={adBoxStyle}>
				<div css={adContentStyle}>
					<h2>나의 영정 사진</h2>
					<p>밝은 표정이 담긴 사진을 업로드해주세요</p>
					<p>11x14인치 (28x35cm)</p>
					<input type="file" name="file" />
				</div>
				<div css={imageStyle}>
					<Image
						src="https://images.unsplash.com/photo-1528752477378-485b46bedcde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dGVzdGFtZW50fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"
						alt="나의 영정 사진"
						layout="fill"
					/>
				</div>
			</div>
			<div css={adBoxStyle}>
				<div css={adContentStyle}>
					<h2>추억할 영상 업로드</h2>
					<p>유언장과 함께 추억을 전하세요</p>
					<input type="file" name="file" />
				</div>
				<div css={imageStyle}>
					<Image
						src="https://images.unsplash.com/photo-1528752477378-485b46bedcde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dGVzdGFtZW50fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"
						alt="추억할 영상"
						layout="fill"
					/>
				</div>
			</div>

			<div css={mainWrapper}>
				<section css={sectionWrapper}>
					<h2>개인정보 수정</h2>
					<Form onFinish={onUpdateUser}>
						<div css={inputWrapper}>
							<input
								type="password"
								placeholder="현재 비밀번호"
								name="currentPassword"
								value={currentPassword}
								onChange={onChangeCurrentPassword}
								required
							/>
							<input
								type="password"
								placeholder="새 비밀번호"
								name="password"
								value={password}
								onChange={onChangePassword}
								required
							/>
							<div css={buttonWrapper}>
								<input type="submit" value="수정완료" />
								<input
									type="button"
									value="회원탈퇴"
									onClick={onDeleteUser}
								/>
							</div>
						</div>
					</Form>
				</section>
				<section css={sectionWrapper}>
					<h2>
						자신의 추모 공개 여부
						<Switch defaultChecked onChange={onChange} />
					</h2>
				</section>
			</div>
		</AppLayout>
	);
};

const onChange = (checked) => {
	console.log(`switch to ${checked}`);
};

const mainWrapper = css`
	display: flex;
	justify-content: center;
	width: 100%;
	// height: 85vh;
	margin-bottom: 10rem; //추가
`;

const sectionWrapper = css`
	width: 25em; //longer than signin
	margin: auto;
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

const adBoxStyle = css`
	display: flex;
	width: 100%;
	height: 30rem;
	margin: 10rem 0;
	padding: 2rem;
	align-item: center;
	&:nth-of-type(even) {
		flex-direction: row-reverse;
	}
`;

const adContentStyle = css`
	width: 50%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const imageStyle = css`
	position: relative;
	width: 50%;
	line-height: 10rem;
	background-color: silver;
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
export default MyPage;
