import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import Router, { useRouter } from 'next/router';
import VirtualList from 'rc-virtual-list';
import axios from 'axios';

import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import userLoginCheck from '../util/userLoginCheck';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Form, Modal, Button, List, Checkbox } from 'antd';
import 'antd/dist/antd.css';

let checkedIndex = [];
const MyWillDetail = () => {
	const router = useRouter();
	//const { willList } = useSelector((state) => state.will);
	const { logInState } = useSelector((state) => state.user);

	const [title, onChangeTitle, setTitle] = useInput('');
	const [content, onChangeContent, setContent] = useInput('');

	const [receivers, setReceivers] = useState([]); //To 목록
	const [receiverList, setReceiverList] = useState([]); //receiver Id 목록

	const [willId, setWillId] = useState('');
	const [idParam, setIdParam] = useState('');

	const ContainerHeight = 400;
	const [receiverData, setReceiverData] = useState([]);

	//팝업 띄우기 관련
	const [isModalVisible, setIsModalVisible] = useState(false);
	const showModal = () => {
		setIsModalVisible(true);
	};
	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const getReceiverList = () => {
		const token = sessionStorage.getItem('token');
		const userId = sessionStorage.getItem('userId');
		axios
			.get(`/api/auth/${userId}/receivers`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				// dispatch(RECEIVERACTIONS.getReceivers({ lists: res.data }));
				console.log(res.data.length);
				setReceiverData([...res.data]);
				if (res.data.length === 0) {
					alert('수신자 목록을 먼저 등록해주세요!');
					Router.replace('/receiver_management_page');
				}
			})
			.catch((err) => console.log(err));
	};

	//API 사용을 위한 공통 데이터
	const getData = () => {
		const userId = sessionStorage.getItem('userId');
		const token = sessionStorage.getItem('token');
		const headerAuth = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		return { userId, headerAuth };
	};

	const getWillData = () => {
		const { willId } = router.query;
		if (willId) {
			setIdParam(willId);

			const { userId, headerAuth } = getData();
			const url = `/api/auth/${userId}/wills/${willId}`;

			axios
				.get(url, headerAuth)
				.then((res) => {
					//console.log(res.data);
					const { title, content, receivers, _id } = res.data;
					setTitle(title);
					setContent(content);
					setReceiverList(receivers);
					setWillId(_id);

					let receivers_forShow = '';
					receivers.map((item) => {
						const receiverId = item.receiverId;
						axios
							.get(
								`/api/auth/${userId}/receivers/${receiverId}`,
								headerAuth,
							)
							.then((res) => {
								receivers_forShow += `${res.data.fullName}(${res.data.relation}) <${res.data.emailAddress}>, `;
							})
							.catch((err) => console.log(err))
							.finally(() =>
								setReceivers(receivers_forShow.slice(0, -2)),
							);
					});
				})
				.catch((err) => alert(err.response.data.reason));
		}
	};

	useEffect(() => {
		if (!router.isReady) return;
		//console.log(logInState);
		if (logInState === null) return;
		if (!logInState) {
			alert('서비스를 이용하려면 로그인을 먼저 해주세요!');
			Router.replace('/sign_in');
		}

		getReceiverList();
		getWillData();
	}, [logInState, router.isReady]);

	//유언장 등록
	const RegisterForm = useCallback(() => {
		const { userId, headerAuth } = getData();
		const url = `/api/auth/${userId}/will`;
		console.log({ receivers: receiverList });
		const data = { title, content, receivers: receiverList };

		axios
			.post(url, data, headerAuth)
			.then(() => {
				alert('성공적으로 유언장이 등록되었습니다.');
				Router.replace('/my_will');
			})
			.catch((err) => alert(err.response.data.reason));
	});

	const onChangeCheckBox = useCallback((e) => {
		const index = e.target.index;

		if (checkedIndex.indexOf(index) > -1) {
			checkedIndex = checkedIndex.filter((item) => item != index);
		} else {
			checkedIndex.push(index);
		}
	}, []);

	// 수신인 선택완료 클릭
	const onOkReceiverList = useCallback(
		(e) => {
			let receivers_forShow = '';
			let receivers_forSend = [];

			receiverData.map((item, i) => {
				if (checkedIndex.indexOf(i) > -1) {
					console.log('here');
					receivers_forShow += `${receiverData[i].fullName}(${receiverData[i].relation}) <${receiverData[i].emailAddress}>, `;
					receivers_forSend.push({
						email: receiverData[i].emailAddress,
						receiverId: receiverData[i]._id,
					});
				}
			});
			//console.log(receivers_forSend);
			setReceivers(receivers_forShow.slice(0, -2));
			setReceiverList(receivers_forSend);
			checkedIndex = [];
			setIsModalVisible(false);
		},
		[receiverData],
	);

	//유언장 수정
	const ChangeForm = useCallback(() => {
		const { userId, headerAuth } = getData();
		const data = { title, content, receivers: receiverList };
		const url = `/api/auth/${userId}/wills/${willId}`;

		axios
			.patch(url, data, headerAuth)
			.then(() => {
				alert('성공적으로 유언장이 수정되었습니다.');
				Router.replace('/my_will');
			})
			.catch((err) => alert(err.response.data.reason));
	});

	//유언장 삭제
	const DeleteForm = useCallback(() => {
		const { userId, headerAuth } = getData();
		const url = `/api/auth/${userId}/wills/${willId}`;

		axios
			.delete(url, headerAuth)
			.then(() => {
				alert('성공적으로 유언장이 삭제되었습니다.');
				Router.replace('/my_will');
			})
			.catch((err) => alert(err.response.data.reason));
	});

	return (
		<AppLayout>
			<Wrapper>
				<Content>
					{/* <main css={mainWrapper}>
						<section css={willsectionWrapper}> */}
					<div>
						<div>
							<Button onClick={showModal}>받는 사람 선택</Button>
						</div>
						To <span>{receivers}</span>
						<Modal
							title="ReceiverList Modal"
							visible={isModalVisible}
							onOk={onOkReceiverList}
							onCancel={handleCancel}
						>
							<List>
								<Checkbox.Group>
									<VirtualList
										data={receiverData}
										height={ContainerHeight}
										itemHeight={47}
										itemKey="receiver_list"
									>
										{(item, i) => {
											//console.log(item);
											const receiverInfo = {
												fullName: item.fullName,
												relation: item.relation,
												email: item.emailAddress,
												receiverId: item.receiverId,
											};
											return (
												<Checkbox
													key={`${item._id}+${i}`}
													value={receiverInfo}
													onChange={onChangeCheckBox}
													index={i}
												>
													<p>{`이름: ${item.fullName}`}</p>
													<p>{`이메일: ${item.emailAddress}`}</p>
												</Checkbox>
											);
										}}
									</VirtualList>
								</Checkbox.Group>
							</List>
						</Modal>
					</div>
					<Form>
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
							{!idParam && (
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
										onClick={RegisterForm}
									/>
								</div>
							)}
							{idParam && (
								<div>
									<input
										type="button"
										value="삭제"
										onClick={DeleteForm}
									/>
									<input
										type="submit"
										value="수정"
										onClick={ChangeForm}
									/>
								</div>
							)}
						</div>
					</Form>
					{/* </section>
					</main> */}
				</Content>
			</Wrapper>
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
	//border: 1px solid #d1dbb1;
	margin: 1rem;
	padding: 1rem;
	//background-color: #d1dbbd;

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
	padding: 3rem;
	& > div > input[type='submit'] {
		margin-right: 0.5em;
		background-color: #3e606f;
	}

	& > div > input {
		float: right;
		background-color: #91aa9d;
		color: white;
		border: none;
		width: 5rem;
		padding: 10px;
		border-radius: 0.2rem;
		cursor: pointer;
	}
`;

const Wrapper = styled.div`
	max-width: 650px;
	min-height: inherit;
	margin: 5em auto;
	font-family: helvetica, arial;
	background: url(https://images.unsplash.com/photo-1618635245221-a1974f59cb02?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTAwfHxsZXR0ZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60);
	padding: 40px 50px 15px 50px;
	border-radius: 50px;
`;

const Content = styled.div`
	.title {
		font-size: 2em;
	}

	p {
		position: relative;
		top: 2rem;
		font-family: 'Cinzel', serif;
		font-size: 18px;
	}

	width: 80%;
	min-height: inherit;
	padding: 5%;
	margin: auto;
	background: rgb(254, 254, 254, 0.65);
	border-radius: 50px;
	border: none;
	font-size: 1.15em;
	font-family: book antiqua;
`;

export default MyWillDetail;
