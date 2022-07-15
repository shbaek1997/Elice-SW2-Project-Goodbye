import React, {
	useEffect,
	useState,
	useCallback,
	useMemo,
	useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';

import Image from 'next/image';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import Pagination from '../components/Pagination';
import { Card } from 'antd';

import ReceiverList from '../components/ReceiverList';

import { WillACTIONS } from '../reducers/will';

/* 
    로그인 한 상태에서만 유언장 페이지에 접근가능
    로그인 하지 않은 상태에서는 로그인, 회원가입 유도 화면 보여줌
*/

const MyWill = () => {
	const [isLogIn, setIsLogIn] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const dispatch = useDispatch();
	const { willList } = useSelector((state) => state.will);

	const loginBtnHandler = useCallback(() => {
		setIsLogIn((prev) => !prev);
	}, []);

	const clickPagination = useCallback(setCurrentPage, []);

	// 로그인 예시 useEffect
	// useEffect(() => {
	//     // axios.post('/api/users/register', {
	//     //     email: 'test@email.com',
	//     //     fullName: '테스트',
	//     //     password: '1234',
	//     //     repeatPassword: '1234',
	//     //     dateOfBirth: '01.24'
	//     // }, {
	//     //     headers: {
	//     //         'Content-Type': 'application/json'
	//     //     }
	//     // })
	//     // .then(res => console.log(res))
	//     // .catch(err => console.log(err));

	//     axios.post('/api/users/login', {
	//         email: 'test@email.com',
	//         password: '1234'
	//     })
	//     .then(res => {
	//         console.log(res);
	//         sessionStorage.setItem('token', res.data.token);
	//         sessionStorage.setItem('userId', res.data.userId)
	//     })
	//     .catch(err => console.log(err));
	// }, [])

	// 유언장에 데이터 넣기 예시
	// useEffect(() => {
	//     const userId = sessionStorage.getItem('userId');
	//     const token = sessionStorage.getItem('token');
	//     axios.post(`/api/auth/${userId}/will`, {
	//         title: '유언장-21',
	//         content: '유언장-21 내용~',
	//         userId: userId,
	//         receivers: Array(50).fill('').map((item, i) => `친구 ${i + 1}`)
	//     }, {
	//         headers: {
	//             Authorization: `Bearer ${token}`
	//         }
	//     })
	//     .then(res => console.log(res))
	//     .catch(err => console.log(err));
	// }, [])

	useEffect(() => {
		console.log('렌더링a');
		getWillsList();
	}, []);

	console.log(willList, currentPage, willList.length);

	const pageListUpdate = () => {
		// 마지막 페이지를 삭제 했다면 현재 페이지 번호 앞으로 이동
		console.log('페이지업뎃 함수', currentPage);
		setCurrentPage((currentPageNum) => {
			const updatePageNum =
				willList[currentPageNum - 1] === undefined
					? currentPageNum - 2
					: currentPageNum - 1;
			if (updatePageNum < 1) return 1;
			return updatePageNum;
		});
	};

	const getWillsList = () => {
		console.log('겟윌함수');
		const token = sessionStorage.getItem('token');
		const userId = sessionStorage.getItem('userId');
		axios
			.get(`/api/auth/${userId}/wills`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				dispatch(WillACTIONS.getWills({ lists: res.data }));
				pageListUpdate();
			})
			.catch((err) => console.log(err));
	};

	const onClickDelete = (will) => {
		console.log(will);
		const token = sessionStorage.getItem('token');
		const userId = sessionStorage.getItem('userId');

		window.confirm('정말 제거하시겠습니까?');
		axios
			.delete(`/api/auth/${userId}/wills/${will._id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(() => {
				// dispatch(WillACTIONS.removeWill({ will }));
				console.log('확인3');
				getWillsList();
			})
			.catch((err) => console.log(err));
	};

	return (
		<>
			<AppLayout>
				<div css={adBoxStyle}>
					<div css={adContentStyle}>
						<h2>나의 유언장</h2>
						<p>
							유언장을 작성하거나 아래 항목에서 유언장을
							확인하세요
						</p>
						<Link href="/my_will_detail">
							<Button>유언장 작성하기</Button>
						</Link>
					</div>
					<div css={imageStyle}>
						<Image
							src="https://media.istockphoto.com/photos/signing-last-will-testament-picture-id875284846?b=1&k=20&m=875284846&s=170667a&w=0&h=4kzW8N24YNRyhr8Hfoad9t9egggq0ZPGhPde2sR3DG0="
							alt="유언장 작성"
							layout="fill"
							priority
						/>
					</div>
				</div>
				{!isLogIn ? (
					<NoticeBox>
						<p>
							유언장을 열람하시거나 작성하려면 로그인이나
							회원가입을 해주세요!
						</p>
						<NoticeBtnGroup>
							<Button onClick={loginBtnHandler}>
								로그인하기
							</Button>
							<Button>회원가입하기</Button>
						</NoticeBtnGroup>
					</NoticeBox>
				) : (
					<>
						<CardGroup>
							{willList.length > 0
								? willList[currentPage - 1].map((will, i) => (
										<Card
											title={will.title}
											extra={
												<CardBtnGroup>
													<Link
														href={{
															pathname:
																'/my_will_detail',
															query: `id=${i}`,
														}}
													>
														<a css={aTagStyle}>
															유언장 상세보기
														</a>
													</Link>
													<Button
														type="button"
														onClick={() =>
															onClickDelete(will)
														}
													>
														유언장 제거하기
													</Button>
												</CardBtnGroup>
											}
											style={{
												width: '20rem',
											}}
											key={`card-${i}`}
										>
											<ReceiverList will={will} />
										</Card>
								  ))
								: '유언장 정보가 없습니다..'}
						</CardGroup>
						<Pagination
							currPage={currentPage}
							pageCount={willList.length}
							onClickPage={clickPagination}
						/>
					</>
				)}
			</AppLayout>
		</>
	);
};

export default MyWill;

// 아래 중복되는 파일이라 assets style파일로 뺄 예정

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

//==========================

const Button = styled.button`
	color: #3e606f;
	background-color: #d1dbbd;
	border: none;
`;

const aTagStyle = css`
	color: #3e606f;
	background-color: #d1dbbd;
	text-align: center;
`;

const NoticeBox = styled.div`
	height: 5rem;
	display: flex;
	justify-content: space-evenly;
	p {
		line-height: 5rem;
		margin: 0;
		font-size: 1.2rem;
	}
`;

const NoticeBtnGroup = styled.div`
	display: flex;
	align-items: center;

	Button:first-of-type {
		margin-right: 1.5rem;
	}
`;
// 페이지 가로 크기에 따라 정렬될 카드 개수 유동적으로 만들기
const CardGroup = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 20rem);
	grid-row-gap: 3rem;
	grid-column-gap: 3rem;
	justify-content: center;

	@media (max-width: 70rem) {
		grid-template-columns: repeat(2, 20rem);
	}
`;
const CardBtnGroup = styled.div`
	display: flex;
	flex-direction: column;
	& :first-of-type {
		margin-bottom: 10px;
	}
`;
