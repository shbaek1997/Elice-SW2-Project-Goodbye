import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { TbRectangleVertical } from 'react-icons/tb';
import { Form, Switch, Modal, Button, Input, DatePicker } from 'antd';
import styled from '@emotion/styled';
import 'antd/dist/antd.css';
const { confirm } = Modal;

import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import Image from 'next/image';
import axios from 'axios';
import Router from 'next/router';

let dateDeathString = '2022-01-01';
const MyPage = () => {
	const { logInState } = useSelector((state) => state.user);

	const [password, onChangePassword, setPassword] = useInput('');
	const [currentPassword, onChangeCurrentPassword, setCurrentPassword] =
		useInput('');
	const [email, onChangeEmail, setEmail] = useInput('');
	const [confirmPassword, onChangeConfirmPassword, setConfirmPassword] =
		useInput('');
	const [trustedUser, setTrustedUser] = useState('');
	const [managedUsers, setManagedUsers] = useState([]);
	const [dateOfDeath, setDateOfDeath] = useState('2022-01-01');
	const [imageSrc, setImageSrc] = useState('');

	useEffect(() => {
		if (logInState === null) return;
		if (!logInState) {
			alert('서비스를 이용하려면 로그인을 먼저 해주세요!');
			Router.replace('/sign_in');
		}

		const userId = sessionStorage.getItem('userId');
		const token = sessionStorage.getItem('token');
		axios
			.get(`/api/auth/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				//console.log(res);
				if (res.data.user.trustedUser) {
					setTrustedUser(res.data.user.trustedUser.email);
				}
				//console.log(res.data.user.managedUsers);
				//console.log(res.data.user.managedUsers[0].email);
				if (res.data.user.managedUsers) {
					setManagedUsers(res.data.user.managedUsers);

					// res.data.user.managedUsers.map((item) => {
					// 	console.log(item.userId);

					//const date = getDeathOrNot(item.userId);
					//console.log(date);
					//});
				}
			})
			.catch((err) => console.log(err.response.data.reason));

		axios
			.get(`/api/auth/${userId}/remembrances`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				//console.log(res);
				const photo = res.data.photo;
				if (!(typeof photo === 'undefined' || photo === '')) {
					setImageSrc(res.data.photo);
				}
			})
			.catch((err) => console.log(err.response.data.reason));
	}, [logInState]);

	// const getDeathOrNot = useCallback((userId) => {
	// 	const token = sessionStorage.getItem('token');
	// 	axios
	// 		.get(`/api/auth/${userId}/remembrances`, {
	// 			headers: {
	// 				Authorization: `Bearer ${token}`,
	// 			},
	// 		})
	// 		.then((res) => {
	// 			console.log(res.data);
	// 			return res.data;
	// 		})
	// 		.catch((err) => console.log(err.response.data.reason));
	// }, []);
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

	//이미지 등록
	const fileChange = (e) => {
		const userId = sessionStorage.getItem('userId');
		const token = sessionStorage.getItem('token');
		console.log(e.target.files[0]);

		const formData = new FormData();
		formData.append('photo', e.target.files[0]);
		axios
			.post(`/api/auth/${userId}/image`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				console.log(res.data.photo);
				alert('성공적으로 등록되었습니다.');
				setImageSrc(res.data.photo);
			})
			.catch((err) => console.log(err));
	};

	//팝업 띄우기 관련
	const [isModalVisible, setIsModalVisible] = useState(false);
	const showModal = () => {
		setIsModalVisible(true);
	};
	const handleOk = () => {
		setIsModalVisible(false);
	};
	const handleCancel = () => {
		setIsModalVisible(false);
	};

	//자신의 유언장을 전송, 생사여부를 변경 가능 권한을 주고싶은 사람 등록
	const addTruseUser = async () => {
		const userId = sessionStorage.getItem('userId');
		const token = sessionStorage.getItem('token');
		const currentPassword = confirmPassword;
		await axios
			.patch(
				`/api/auth/${userId}/trustedUser`,
				{ email, currentPassword },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				console.log(res);
				alert('성공적으로 신뢰할 수 있는 사람을 등록했습니다.');
				setIsModalVisible(false);
			})
			.catch((err) => alert(err.response.data.reason));
	};

	//const [dateDeathString, setDateDeathString] = useState('2022-01-01');
	const onChangeDeathDate = useCallback(
		(date, dateString) => {
			//console.log(date, dateString);
			console.log(typeof dateString);
			setDateOfDeath(dateString);
			dateDeathString = dateString;
		},
		[dateOfDeath],
	);

	const setDeathDate = useCallback(
		(managedUserId) => {
			confirm({
				title: `사망일자를 입력해주세요.`, //${managedUserId}님의
				icon: <ExclamationCircleOutlined />,
				content: <DatePicker onChange={onChangeDeathDate} />,

				onOk() {
					console.log(dateOfDeath);
					changeLifeDeath(managedUserId);
				},

				onCancel() {
					console.log(dateDeathString);
					//console.log('Cancel');
				},
			});
		},
		[dateOfDeath],
	);

	const changeLifeDeath = useCallback(
		(managedUserId) => {
			//console.log('생사변경: 유언장, 추모 링크 발송되고 추모 공개로 전환');
			//console.log(managedUserId);
			console.log(dateOfDeath);
			console.log(dateDeathString);
			const userId = sessionStorage.getItem('userId');
			const token = sessionStorage.getItem('token');
			axios
				.post(
					`/api/auth/${userId}/managedUsers/${managedUserId}`,
					{ dateOfDeath: dateDeathString },
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				)
				.then((res) => {
					console.log(res);
					alert('성공적으로 유언장을 발송했습니다.');
					//setIsModalVisible(false);
				})
				.catch((err) => alert(err.response.data.reason));
		},
		[dateOfDeath],
	);

	return (
		<AppLayout>
			<div css={titleImageStyle}>
				<p>마이페이지</p>
			</div>
			<div css={adBoxStyle}>
				<div css={adContentStyle}>
					<h1>나의 영정 사진</h1>
					<p>밝은 표정이 담긴 사진을 업로드해주세요</p>
					<input
						type="file"
						accept="image/*"
						name="photo"
						onChange={fileChange}
					/>
				</div>
				{/* <div css={imageStyle}>
					<Image src={imageSrc} alt="나의 영정 사진" layout="fill" />
				</div> */}
				<Frame>
					<FrameImages>
						<TbRectangleVertical className={'frame_svg'} />
						<img src={imageSrc} />
					</FrameImages>
				</Frame>
			</div>
			{/* <div css={adBoxStyle}>
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
			</div> */}

			<div css={mainWrapper}>
				<section css={sectionWrapper}>
					<h1>비밀번호 수정</h1>
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
				{/* <section css={sectionWrapper}>
					<h2>
						자신의 추모 공개 여부
						<Switch defaultChecked onChange={onChange} />
					</h2>
				</section> */}
			</div>
			<div css={mainWrapper}>
				<section>
					<div>
						<h1>
							자신의 유언장을 전송, 생사여부를 변경 가능 권한을
							주고 싶은 사람
						</h1>
						{trustedUser && (
							<div style={{ left: '40%', marginTop: '2em' }}>
								등록된 이메일: {trustedUser}
							</div>
						)}
						<div>
							<Button
								onClick={showModal}
								style={{ left: '40%', marginTop: '2em' }}
							>
								등록하기
							</Button>
						</div>
						<Modal
							title="등록하기"
							visible={isModalVisible}
							onOk={handleOk}
							onCancel={handleCancel}
						>
							<Input
								placeholder="신뢰하는 사람의 이메일"
								style={{
									width: '100%',
									marginBottom: '1em',
								}}
								value={email}
								onChange={onChangeEmail}
							/>
							<Input
								placeholder="나의 현재 비밀번호"
								style={{
									width: '100%',
									marginBottom: '1em',
								}}
								type="password"
								value={confirmPassword}
								onChange={onChangeConfirmPassword}
							/>
							<Button
								type="button"
								style={{
									width: '20%',
									left: '40%',
								}}
								onClick={addTruseUser}
							>
								등록
							</Button>
						</Modal>
					</div>
				</section>
			</div>
			<div css={mainWrapper}>
				<section>
					<div>
						<h1>내가 생사여부 변경 권한이 있는 사용자 목록</h1>
						{managedUsers && (
							<div style={{ left: '40%', marginTop: '2em' }}>
								{managedUsers.map((user, index) => {
									return (
										user.confirmed && (
											<div key={index}>
												{user.email}
												<Button
													onClick={() => {
														setDeathDate(
															user.userId,
														);
													}}
													style={{
														left: '30%',
													}}
												>
													생사여부 변경
												</Button>
											</div>
										)
									);
								})}
							</div>
						)}
						{!managedUsers && (
							<div style={{ left: '40%', marginTop: '2em' }}>
								등록되어있지 않습니다..
							</div>
						)}
					</div>
				</section>
			</div>
		</AppLayout>
	);
};

// const onChange = (checked) => {
// 	console.log(`switch to ${checked}`);
// };

const titleImageStyle = css`
	position: relative;
	width: 100%;
	height: 300px;
	margin: 2rem 0;
	background-image: url('https://images.unsplash.com/photo-1601479604588-68d9e6d386b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1413&q=80');
	background-repeat: no-repeat;
	background-size: cover;
	text-align: center;

	& > p {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #fff;
		font-size: 1.5rem;
	}
`;

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
	// &:nth-of-type(even) {
	// 	flex-direction: row-reverse;
	// }
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
		cursor: pointer;
	}
`;

const Frame = styled.div`
	position: relative;
	color: dimgray;
	z-index: 1;
	svg.frame_svg {
		width: 300px;
		height: auto;
		color: darkgrey;
	}
	left: 10%;
`;

const FrameImages = styled.div`
	position: relative;
	display: inline-block;

	& > img {
		position: absolute;
		width: 150px;
		height: 215px;
		top: 35px;
		left: 75px;
		z-index: -1;
	}
`;
export default MyPage;
