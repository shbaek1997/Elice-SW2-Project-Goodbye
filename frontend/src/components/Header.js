import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Router from 'next/router';

import { useDispatch } from 'react-redux';
import { USERACTIONS } from '../reducers/user';
import { useSelector } from 'react-redux';


import styled from '@emotion/styled';

import { Button } from '../util/common_styles';
import userLoginCheck from '../util/userLoginCheck';


const Header = () => {
	// const isLogIn = useMemo(userLoginCheck, []);
	const [isLogIn, setIsLogIn] = useState(null);
	const dispatch = useDispatch();
	const {logInState} = useSelector((state) => state.user);


	// 로그인 확인 부분
	useEffect(() => {
		// console.log(logInState);
		setLoginValue();
	}, [])


    const setLoginValue = async () => {
		const checkValue = await userLoginCheck();
		dispatch(USERACTIONS.setUserData(checkValue));
		console.log(checkValue, logInState);
		// 유저 데이터를 헤더에서 받아서 리듀서에 저장해야됨
		// dispatch(USERACTIONS.setLoginState(userData));
	}


	// 로그아웃 버튼 클릭
	const handleLogOut = useCallback(() => {
		sessionStorage.clear();
		dispatch(USERACTIONS.clearUserData());
		Router.replace('/');
	}, []);
	
	return (
		<>
			<Wrapper>
				<LoginHeader>
					{!logInState ? (
						<ButtonGroup>
							<Link href={'/sign_in'}>
								<Button type="button">로그인</Button>
							</Link>
							<Link href={'/sign_up'}>
								<Button type="button">회원가입</Button>
							</Link>
						</ButtonGroup>
					) : (
						<ButtonGroup>
							<Link href={'/my_page'}>
								<Button type="button">마이페이지</Button>
							</Link>
							<Button type="button" onClick={handleLogOut}>로그아웃</Button>
						</ButtonGroup>
					)}
				</LoginHeader>
				<NavBar>
					<Link href={'/'}>
						<h1>GoodBye</h1>
					</Link>
					<ul>
						<li>
							<Link href={'/my_will'}>
								<a>유언장 작성/확인</a>
							</Link>
						</li>
						<li>
							<Link href={'/make_remembrance'}>
								<a>나의 추모공간</a>
							</Link>
						</li>
						<li>
							<Link href={'#'}>
								<a>부고 작성</a>
							</Link>
						</li>
						<li>
							<Link href={'/receiver_management_page'}>
								<a>수신인 관리</a>
							</Link>
						</li>
					</ul>
				</NavBar>
			</Wrapper>
		</>
	);
};


export default Header;

const Wrapper = styled.header`
	h1 {
		width: 13rem;
		margin: 0;
		line-height: 30px;
		text-align: center;
	}
	h1:hover {
		cursor: pointer;
	}
`;

const LoginHeader = styled.div`
	text-align: right;
`;

const ButtonGroup = styled.div`
	padding: 1rem;
	& button:first-of-type {
		margin-right: 10px;
	}
`;

const NavBar = styled.section`
	display: flex;

	ul {
		margin: 0;
	}

	ul li {
		list-style: none;
		float: left;
		width: 130px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		a {
			display: block;
			width: 100%;
			height: 100%;
			color: #193441;
		}
		a:hover {
			color: #fcfff5;
			background-color: #3e606f;
		}
	}
`;
