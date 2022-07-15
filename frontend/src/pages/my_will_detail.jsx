import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import AppLayout from '../components/AppLayout';
import { Form, Modal, Button, Input } from 'antd';
import 'antd/dist/antd.css';
import Image from 'next/image';
import axios from 'axios';
import useInput from '../hooks/useInput';
import Router, { useRouter } from 'next/router';

const MyWillDetail = () => {
	const router = useRouter();
	const { willList } = useSelector((state) => state.will);
	//const params = new URLSearchParams(window.location.search);
	//const id = params.get('id');

	const [title, onChangeTitle, setTitle] = useInput('');
	const [content, onChangeContent, setContent] = useInput('');
	const [name, onChangeName, setName] = useInput('');
	const [email, onChangeEmail, setEmail] = useInput('');
	const [relation, onChangeRelation, setRelation] = useInput('');

	const [receivers, setReceivers] = useState([]); //receiver Id 목록
	const [receiverList, setReceiverList] = useState([]); //To 목록

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

	useEffect(() => {
		const { id } = router.query;
		console.log(willList);
		if (willList.length > 0) {
			setTitle(willList[0][id].title);
			setContent(willList[0][id].content);
			setReceivers(willList[0][id].receivers);
		}
	}, []);

	//받는 사람 선택 팝업
	const addReceiver = useCallback(() => {
		const userId = sessionStorage.getItem('userId');
		const token = sessionStorage.getItem('token');
		const fullName = name;
		const emailAddress = email;
		const role = 'receiver';
		axios
			.post(
				`/api/auth/${userId}/receiver`,
				{
					fullName,
					emailAddress,
					relation,
					role,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				//To 항목에 보여줄 수신자 목록
				const receiver = `${res.data.fullName}(${res.data.relation}) <${res.data.emailAddress}>, `;
				setReceiverList([receiver, ...receiverList]);

				//수신자 id 목록
				const receiverId = res.data._id;
				setReceivers([receiverId, ...receivers]);

				//input 값 초기화
				setName('');
				setRelation('');
				setEmail('');
				alert('성공적으로 추가되었습니다.');
			})
			.catch((err) => alert(err.response.data.reason));
	});

	//유언장 등록
	const onSubmitForm = useCallback(() => {
		const userId = sessionStorage.getItem('userId');
		const token = sessionStorage.getItem('token');

		axios
			.post(
				`/api/auth/${userId}/will`,
				{ title, content, receivers },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				console.log(res);
				alert('성공적으로 유언장이 등록되었습니다.');
				Router.replace('/my_will');
			})
			.catch((err) => alert(err.response.data.reason));
	});

	return (
		<AppLayout>
			{/* <div css={adBoxStyle}>
				<div css={adContentStyle}>
					<h2>나의 유언장</h2>
				</div>
				<div css={imageStyle}>
					<Image
						src="https://images.unsplash.com/photo-1528752477378-485b46bedcde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dGVzdGFtZW50fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"
						alt="나의 유언장"
						layout="fill"
					/>
				</div>
			</div> */}
			<main css={mainWrapper}>
				<section css={willsectionWrapper}>
					{/* <div css={headerWrapper}>
						<div></div>
						<div>
							유언장을 보낼 사람 이메일{' '}
							<input type="button" value="선택" />
						</div>
						<div>
							유언장을 받을 사람{' '}
							<input type="button" value="선택" />
						</div>
					</div> */}
					{/* <ReceiverList /> */}
					<div>
						To <span>{receiverList}</span>
						<Button onClick={showModal}>받는 사람 선택</Button>
						<Modal
							title="받는 사람"
							visible={isModalVisible}
							onOk={handleOk}
							onCancel={handleCancel}
						>
							<Input
								placeholder="이름"
								style={{
									width: '15%',
								}}
								value={name}
								onChange={onChangeName}
							/>
							<Input
								placeholder="관계"
								style={{
									width: '15%',
								}}
								value={relation}
								onChange={onChangeRelation}
							/>
							<Input
								placeholder="이메일"
								style={{
									width: '50%',
								}}
								value={email}
								onChange={onChangeEmail}
							/>
							<Button
								type="button"
								style={{
									width: '20%',
								}}
								onClick={addReceiver}
							>
								추가
							</Button>
						</Modal>
					</div>
					<Form onFinish={onSubmitForm}>
						<div css={letterWrapper}>
							<div css={headerWrapper}>
								<input
									type="text"
									name="title"
									value={title}
									onChange={onChangeTitle}
									placeholder="제목을 입력해주세요."
								/>
							</div>
							<textarea
								name="content"
								value={content}
								onChange={onChangeContent}
								placeholder="유언장을 자유롭게 작성해주세요."
							/>
						</div>
						<div css={buttonWrapper}>
							{willList.length <= 0 && (
								<div>
									<input
										type="button"
										value="취소"
										style={{ cursor: 'pointer' }}
										onClick={() => {
											Router.replace('/my_will');
										}}
									/>
									<input
										type="submit"
										value="생성"
										style={{ cursor: 'pointer' }}
									/>
								</div>
							)}
							{willList.length > 0 && (
								<div>
									<input type="button" value="삭제" />
									<input type="submit" value="수정" />
								</div>
							)}
						</div>
					</Form>
				</section>
			</main>
		</AppLayout>
	);
};

const mainWrapper = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
	margin: 5rem auto;
`;
const willsectionWrapper = css`
	position: relative;
	min-width: 80vw;
	min-height: 150vh;
	border: 1px solid #d1dbb1;
	margin: 0 auto 5rem;
	padding: 5rem;
`;

const headerWrapper = css`
	width: 100%;

	& > input {
		display: block;
		margin: 0 auto 1.5rem;
		font-size: 1.3rem;
		background: transparent;
		border: none;
		border-bottom: solid 1px #193441;
		:focus {
			outline: none;
		}
	}
`;

const letterWrapper = css`
	display: inline-block;
	box-sizing: border-box;
	width: 100%;
	height: 100vh;
	border: 1px solid #d1dbb1;
	margin: 1rem auto;
	padding: 5rem;
	background-color: #d1dbbd;

	& > textarea {
		width: 100%;
		height: 100%;
		border: none;
		background: transparent;
		:focus {
			outline: none;
		}
	}
`;

const buttonWrapper = css`
	width: 100%;
	margin-top: 3rem;
	& > div > input[type='submit'] {
		margin-right: 2%;
		background-color: #3e606f;
	}

	& > div > input {
		float: right;
		background-color: #91aa9d;
		color: white;
		border: none;
		width: 5rem;
		padding: 10px;
		border-radius: 1rem;
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
export default MyWillDetail;
