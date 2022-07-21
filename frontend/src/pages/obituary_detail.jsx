import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { OBITUARYACTIONS } from '../reducers/obituary'
import Link from 'next/link';
import axios from 'axios';

import AppLayout from '../components/AppLayout';
import { Button as CommonButton } from './../util/common_styles';
import useInput from '../hooks/useInput';

import { css } from '@emotion/react';
import { Form, Divider, Select, Input, Button } from 'antd';
const { Search, TextArea } = Input;
import 'antd/dist/antd.css';

const SelectFamily = (props) => {
	const dispatch = useDispatch();
	const { flag } = useSelector((state) => state.obituary)
	const [fullName, onChangeFullName, setFullName] = useInput('');
	const [relation, setRelation] = useState('');
	const [directRelation, onChangeDirectRelation, setDirectRelation] = useInput('');
	const [showDirectRelation, setShowDirectRelation] = useState(false);

	useEffect(() => {
		console.log('flag: ' + flag)
		console.log('fullName' + fullName)
		if(flag && fullName && (relation || directRelation)) {
			dispatch(OBITUARYACTIONS.setFamily({relation, fullName, directRelation}))
		}
		// return () => {
		// 	dispatch(OBITUARYACTIONS.getFamily)
		// }
	},[flag])
	//고인간의 관계 Select 직접입력 toggle
	const onChangeRelation = useCallback((e) => {
		setRelation(e)
		setShowDirectRelation(false);
		if(e === '직접입력') {
			setShowDirectRelation(true);
		}
	},[showDirectRelation])

	return (
		<Form.Item label="고인간의 관계 | 상주명" required>
			<Select style={{width: '20vw', marginRight: '0.5vw'}} name="relation" onChange={onChangeRelation} >
				<Select.Option value="배우자">배우자</Select.Option>
				<Select.Option value="아들">아들</Select.Option>
				<Select.Option value="딸">딸</Select.Option>
				<Select.Option value="며느리">며느리</Select.Option>
				<Select.Option value="사위">사위</Select.Option>
				<Select.Option value="손자">손자</Select.Option>
				<Select.Option value="손녀">손녀</Select.Option>
				<Select.Option value="외손자">외손자</Select.Option>
				<Select.Option value="외손녀">외손녀</Select.Option>
				<Select.Option value="직접입력">
					직접입력
				</Select.Option>
			</Select>
			<Input placeholder="상주명" name="fullName" value={fullName} onChange={onChangeFullName} style={{width: '20vw'}}  />
			{showDirectRelation && <Input placeholder="고인간의 관계" name="directRelation" value={directRelation} onChange={onChangeDirectRelation} style={{width: '20vw', marginTop: '1vh'}} />}
		</Form.Item>
	)
}


const ObituaryDetail = () => {
	const dispatch = useDispatch();
	const { family } = useSelector((state) => state.obituary)

	const [deceased, onChangeDeceased, setDeceased] = useInput('');
	const [dateOfBirth, onChangeDateOfBirth, setDateOfBirth] = useInput('');
	const [dateOfDeath, onChangeDateOfDeath, setDateOfDeath] = useInput('');
	const [sex, setSex] = useState('');
	const [funeral, onChangeFuneral, setFuneral] = useInput('');
	const [dateOfCremate, onChangeDateOfCremate, setDateOfCremate] = useInput('');
	const [comment, onChangeComment, setComment] = useInput('');
	const [password, onChangePassword, setPassword] = useInput('');


	//성별 Select
	const onChangeSex = useCallback((e) => {
		setSex(e)
	})

	//주소검색
	const onSearch = (value) => console.log(value);


	//부고 생성
	const registerObituary = useCallback(async () => {
		//family 값 가져오기
		//dispatch(OBITUARYACTIONS.getFamily)
		dispatch(OBITUARYACTIONS.setFlag({ flag: true }))
		console.log('family Before ==========================: ' + family.length)
		
		//dispatch(OBITUARYACTIONS.clearFamily)
		//dispatch(OBITUARYACTIONS.setFlag({ flag: false }))
		console.log('family After ========================== : ' + family.length)
		//console.log('test')
		//console.log(sex)
		
		//console.log(relation)
		// if(relation === '직접입력') {
		// 	console.log(directRelation)
		// }
		//console.log(fullName)
		//setFamily({relation, fullName})
		dispatch(OBITUARYACTIONS.getFamily)
		console.log(family)
		// const data = { deceased,
		// 				dateOfBirth,
		// 				dateOfDeath,
		// 				sex,
		// 				family,
		// 				funeral,
		// 				dateOfCremate,
		// 				comment,
		// 				password }
		// axios.post(`/api/obituaries`, data)
		// 	.then((res) => {
		// 		console.log(res)
		// 	})
		// 	.catch((err) => alert(err.response.data.reason))
	})

	return (
		<AppLayout>
			<div css={titleImageStyle}>
				<p>부고 작성</p>
			</div>
			<Form
				labelCol={{
					span: 10,
				}}
				wrapperCol={{
					span: 50,
				}}
				onFinish={registerObituary}
			>
				<h1 css={headerWrapper}>부고 작성</h1>
				<Divider orientation="left">상주</Divider>
				<section css={sectionWrapper}>
					<SelectFamily index="0"  />
					<SelectFamily index="1" />
				</section>
				<section css={sectionWrapper}>
					<div css={ButtonWrapper}>
						<Button onClick={() => {
							
						}} style={{marginRight: '0.5vw'}}>추가</Button>
						<Button>삭제</Button>
					</div>
				</section>
				<Divider orientation="left">고인 정보</Divider>
				<section css={sectionWrapper}>
					<Form.Item label="고인명" required>
						<Input placeholder="고인명" name="deceased" value={deceased} onChange={onChangeDeceased} />
					</Form.Item>
					<Form.Item label="탄생일" required>
						<Input placeholder="탄생일" name="dateOfBirth" value={dateOfBirth} onChange={onChangeDateOfBirth} />
					</Form.Item>

					<Form.Item label="성별" required>
						<Select name="sex" onChange={onChangeSex}>
							<Select.Option value="남자">남자</Select.Option>
							<Select.Option value="여자">여자</Select.Option>
						</Select>
					</Form.Item>
				</section>
				<Divider orientation="left">장례 정보</Divider>
				<section css={sectionWrapper}>
					<Form.Item label="장례식장 주소" required>
						<Search
							placeholder="장례식장 주소"
							onSearch={onSearch}
							name="funeral" value={funeral} onChange={onChangeFuneral} 
						/>
					</Form.Item>
					<Form.Item label="임종일">
						<Input placeholder="임종일" name="dateOfDeath" value={dateOfDeath} onChange={onChangeDateOfDeath} />
					</Form.Item>
					<Form.Item label="발인일">
						<Input placeholder="발인일" name="dateOfCremate" value={dateOfCremate} onChange={onChangeDateOfCremate}  />
					</Form.Item>
					</section>
				<Divider orientation="left">전하는 말</Divider>
				
				<section css={sectionWrapper}>
					<Form.Item label="전하는 말">
						{/* <Input placeholder="전할말" /> */}
						<TextArea
							placeholder="전하는 말"
							showCount
							maxLength={1000}
							style={{
							height: 120,
							}}
							name="comment" value={comment} onChange={onChangeComment} 
							// onChange={onChange}
						/>
					</Form.Item>
					<Form.Item label="비밀번호">
						<Input placeholder="비밀번호" type="password"  name="password" value={password} onChange={onChangePassword} />
					</Form.Item>
				</section>

				<Divider orientation="left"></Divider>
				<section css={sectionWrapper}>
					<div css={ButtonWrapper}>
						<CommonButton className="register" type="submit">등록하기</CommonButton>
						<Link href={'/obituary_list'}>
							<CommonButton>목록</CommonButton>
						</Link>
					</div>
				</section>
			</Form>
		</AppLayout>
	);
};

export default ObituaryDetail;

const headerWrapper = css`
	margin: 2rem;
`;
const sectionWrapper = css`
	width: 70vw;
	margin: 2rem;

	&:last-child {
		margin-bottom: 20vh;
	}
`;

const ButtonWrapper = css`
	float: right;
	font-size: 1.1em;
	font-weight: bold;

	& > Button {
		padding: 0.3rem 0.8rem;
	}

	& > .register {
		margin-right: 1rem;
	}
`;
const titleImageStyle = css`
	position: relative;
	width: 100%;
	height: 300px;
	margin: 2rem 0;
	background-image: url('https://images.unsplash.com/photo-1528564031703-bf3181c2294e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80');
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
