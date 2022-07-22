import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RECEIVERACTIONS } from '../reducers/receivers';
import Router, { useRouter } from 'next/router';

import 'antd/dist/antd.css';
import { Divider, List, Modal, Input } from 'antd';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import AppLayout from '../components/AppLayout';
import { Button } from '../util/common_styles';

const receiver_page = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { logInState } = useSelector((state) => state.user);

	/*
        리스트 등록하기와 각 리스트 별 정보수정 버튼을 눌렀을 때
        submit에 따른 API 통신을 분기해주기 위함
    */
	const [modalSubmitMode, setModalSubmitMode] = useState(null);

	const { familyList, friendList, relativeList, acquaintanceList } =
		useSelector((state) => state.receivers);
	const [registFormVisible, setRegistFormVisible] = useState(false);
	// const [relationValue, setRelationValue] = useState('');

	
	const [InputValues, setInputValues] = useState({
		name: '',
		email: '',
		relation: '',
		receiverId: '',
	});
	const inputEl = useRef(null);

	useEffect(() => {
		if (logInState === null) return;
		if (!logInState) {
			alert('서비스를 이용하려면 로그인을 먼저 해주세요!');
			Router.replace('/sign_in');
			return;
		}
		getReceiverList();
	}, [logInState]);

	const handleCancel = () => {
		setRegistFormVisible(false);
	};

	const handleSelect = (e) => {
		const selection = e.target.value;
		setInputValues((prev) => {
			if (selection === 'typing') {
				inputEl.current.focus();
				return {
					...prev,
					relation: '',
				};
			}
			return {
				...prev,
				relation: selection,
			};
		});
	};

	const handleInputValues = (e) => {
		setInputValues((prev) => {
			return {
				...prev,
				[e.target.name]: e.target.value,
			};
		});
	};

	// 리스트 불러오기
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
				dispatch(RECEIVERACTIONS.getReceivers({ lists: res.data }));
			})
			.catch((err) => console.log(err));
	};

	const onSubmitRegistForm = (e) => {
		e.preventDefault();
		if (modalSubmitMode === 'registerInfo') {
			registerReciver(e);
		} else {
			changeReciver();
		}
	};

	// 리스트 수정하기
	const changeReciver = (e) => {
		const token = sessionStorage.getItem('token');
		const userId = sessionStorage.getItem('userId');
		const { name, email, relation, receiverId } = InputValues;
		axios
			.patch(
				`/api/auth/${userId}/receivers/${receiverId}`,
				{
					fullName: name,
					emailAddress: email,
					userId,
					relation: relation,
					role: 'user',
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				alert('변경되었습니다!');
				getReceiverList();
				setRegistFormVisible(false);
			})
			.catch((err) => console.log(err));
	};

	// 리스트 등록하기
	const registerReciver = (e) => {
		const token = sessionStorage.getItem('token');
		const userId = sessionStorage.getItem('userId');
		const submitData = new FormData(e.target);
		const fullName = submitData.get('name');
		const emailAddress = submitData.get('email');
		const relation = submitData.get('relation');
		axios
			.post(
				`/api/auth/${userId}/receivers`,
				{
					fullName,
					emailAddress,
					userId,
					relation,
					role: 'user',
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				alert('등록되었습니다!');
				getReceiverList();
				setRegistFormVisible(false);
			})
			.catch((err) => console.log(err));
	};

	// 리스트 삭제하기
	const deleteReciver = (id) => {
		const token = sessionStorage.getItem('token');
		const userId = sessionStorage.getItem('userId');
		axios
			.delete(`/api/auth/${userId}/receivers/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				getReceiverList();
			})
			.catch((err) => console.log(err));
	};

	const handleRegisterInfo = () => {
		// 비우기
		setInputValues({
			name: '',
			email: '',
			relation: '',
			receiverId: '',
		});

		setRegistFormVisible(true);
		setModalSubmitMode('registerInfo');
	};

	const handleChangeInfo = (item) => {
		setRegistFormVisible(true);
		setModalSubmitMode('changeInfo');
		setInputValues(() => {
			return {
				name: item.name,
				email: item.emailAddress,
				relation: item.relation,
				receiverId: item.receiverId,
			};
		});
	};

	const handleDeleteInfo = (item) => {
		const check = confirm(`정말로 ${item.name}을 삭제하시겠습니까?`);
		if (!check) return;
		deleteReciver(item.receiverId);
	};

	return (
		<AppLayout>
			<ButtonWrapper>
				<Button type="button" onClick={handleRegisterInfo}>
					리스트 등록하기
				</Button>
			</ButtonWrapper>
			{registFormVisible && (
				<Modal
					title="registerForm"
					visible={registFormVisible}
					onCancel={handleCancel}
					footer={[
						<Button
							form="registerForm"
							key="submit"
							htmlType="submit"
						>
							저장
						</Button>,
						<Button key="modalCancel" onClick={handleCancel}>
							취소
						</Button>,
					]}
				>
					<form id="registerForm" onSubmit={onSubmitRegistForm}>
						<div>
							<label htmlFor="name">
								이름:
								<Input
									name="name"
									onChange={handleInputValues}
									value={InputValues.name}
								/>
							</label>
						</div>
						<div>
							<label htmlFor="email">
								이메일:
								<Input
									name="email"
									onChange={handleInputValues}
									value={InputValues.email}
								/>
							</label>
						</div>
						<div>
							<label htmlFor="relation">
								관계:
								<select onChange={(e) => handleSelect(e)}>
									<option value="">
										--관계를 선택하세요--
									</option>
									<option value="가족">가족</option>
									<option value="친척">친척</option>
									<option value="친구">친구</option>
									<option value="지인">지인</option>
									<option value="typing">직접입력</option>
								</select>
								<Input
									name="relation"
									ref={inputEl}
									onChange={handleInputValues}
									value={InputValues.relation}
								/>
							</label>
						</div>
					</form>
				</Modal>
			)}
			<Divider orientation="left">가족</Divider>
			<List
				bordered
				dataSource={familyList}
				css={listStyle}
				renderItem={(item) => (
					<List.Item css={listItemStyle}>
						<span>이름: {item.name}</span>
						<span>이메일: {item.emailAddress}</span>
						<ButtonGroup>
							<Button onClick={() => handleChangeInfo(item)}>
								정보 수정
							</Button>
							<Button onClick={() => handleDeleteInfo(item)}>
								삭제
							</Button>
						</ButtonGroup>
					</List.Item>
				)}
			/>
			<Divider orientation="left">친척</Divider>
			<List
				bordered
				dataSource={relativeList}
				css={listStyle}
				renderItem={(item) => (
					<List.Item css={listItemStyle}>
						<span>이름: {item.name}</span>
						<span>이메일: {item.emailAddress}</span>
						<ButtonGroup>
							<Button onClick={() => handleChangeInfo(item)}>
								정보 수정
							</Button>
							<Button onClick={() => handleDeleteInfo(item)}>
								삭제
							</Button>
						</ButtonGroup>
					</List.Item>
				)}
			/>
			<Divider orientation="left">친구</Divider>
			<List
				bordered
				dataSource={friendList}
				css={listStyle}
				renderItem={(item) => (
					<List.Item css={listItemStyle}>
						<span>이름: {item.name}</span>
						<span>이메일: {item.emailAddress}</span>
						<ButtonGroup>
							<Button onClick={() => handleChangeInfo(item)}>
								정보 수정
							</Button>
							<Button onClick={() => handleDeleteInfo(item)}>
								삭제
							</Button>
						</ButtonGroup>
					</List.Item>
				)}
			/>
			<Divider orientation="left">지인 및 그 외</Divider>
			<List
				bordered
				dataSource={acquaintanceList}
				css={listStyle}
				renderItem={(item) => (
					<List.Item css={listItemStyle}>
						<span>이름: {item.name}</span>
						<span>이메일: {item.emailAddress}</span>
						<ButtonGroup>
							<Button onClick={() => handleChangeInfo(item)}>
								정보 수정
							</Button>
							<Button onClick={() => handleDeleteInfo(item)}>
								삭제
							</Button>
						</ButtonGroup>
					</List.Item>
				)}
			/>
		</AppLayout>
	);
};

export default receiver_page;

const listStyle = css`
	width: 80%;
	margin: auto;
`;

const listItemStyle = css`
	position: relative;
	justify-content: start;
	span: first-of-type {
		margin-right: 10rem;
	}
`;

const ButtonGroup = styled.div`
	display: inline-block;
	position: absolute;
	right: 10px;
	& button:first-of-type {
		margin-right: 10px;
	}
`;

const ButtonWrapper = styled.div`
	position: relative;
	height: 70px;
	& > button {
		position: absolute;
		right: 85px;
		bottom: 0;
	}
`;
