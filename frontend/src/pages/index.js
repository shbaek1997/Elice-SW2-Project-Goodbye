import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Card } from 'antd';
import 'antd/dist/antd.css';

import Image from 'next/image';
import willAd from '../assets/will_ad.jpg';
import AppLayout from '../components/AppLayout';

const Home = () => {
	const [currentRB, setCurrentRB] = useState([]);


  const getRecentRBData = async () => {
    try {
      const res = await axios.get(`/api/remembrances/recent?count=6`);
      setCurrentRB([...res.data])
    } catch (error) {
      console.log(error);
    }
    
  } 
  
  useEffect(() => {
      getRecentRBData();
  }, [])

	return (
		<AppLayout>
			<div css={adBoxStyle}>
				<WillDiv>
					<h1>
						온라인으로 보내는
						<br />
						유언장
					</h1>
					{/* <h1>유언장</h1> */}
					<p>소중한 추억을 전하세요</p>
				</WillDiv>
				<WillImg alt="유언장 소개 이미지" />
				{/* <div css={imageStyle}>
          <Image
            src={willAd}
            alt="유언장 이미지"
            layout='fill'
          />
        </div> */}
			</div>
			<RmBox>
				<RbDiv>
					<h1>
						온라인
						<br />
						추모
					</h1>
					<p>함께 슬픔을 나누세요</p>
				</RbDiv>
				{/* <div css={imageStyle}>
          <Image
            src="https://images.unsplash.com/photo-1595062584313-47018e0ee5cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZnVuZXJhbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60"
            alt="추모 이미지"
            layout='fill'
          />
        </div> */}
				<RbImg alt="추모 소개 이미지" />
			</RmBox>
			{/* <ObituaryBox>
        <ObituaryDiv>
          <h1>온라인<br/>부고<br/>서비스</h1>
          <p>쉽게 부고를 작성하고 알리세요</p>
        </ObituaryDiv>
        <ObituaryImg /> 
      </ObituaryBox> */}
			<BoxStyle>
				<div css={currentProgress}>
					<h1>현재 진행중인 추모식</h1>
					<p>진행중인 추모</p>
					<div css={CardGroup}>
						{currentRB.map((death, i) => {
							return (
								death.dateOfDeath && (
									<div
										key={`${death._id} + ${i}`}
										css={progessCard}
									>
										<a
											href={`http://kdt-sw2-seoul-team11.elicecoding.com:5001/remembrance?remembranceId=${death._id}`}
										>
											<Card
												title={death.fullName}
												bordered={true}
											>
												<p>{`${death.dateOfBirth} \n~`}</p>
												<p>{`${death.dateOfDeath}`}</p>
											</Card>
										</a>
									</div>
								)
							);
						})}
					</div>
				</div>
			</BoxStyle>
		</AppLayout>
	);
};

export default Home;

const WillDiv = styled.div`
	width: 250px;
	height: fit-content;
	position: relative;
	top: 50%;
	transform: translateY(-50%);
	h1 {
		font-size: 50px;
		text-align: center;
		margin: 0;
	}
	p {
		margin: 40px 0 0 0;
		text-align: center;
	}
`;

const WillImg = styled.div`
	width: 28%;
	background-image: url('${willAd.src}');
	background-size: cover;
`;

const RbDiv = styled.div`
	width: 250px;
	height: fit-content;

	h1 {
		font-size: 50px;
		text-align: center;
		margin: 0;
	}
	p {
		margin: 40px 0;
		text-align: center;
	}
`;

const RbImg = styled.div`
	width: 600px;
	height: 400px;
	background-image: url('https://images.unsplash.com/photo-1595062584313-47018e0ee5cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZnVuZXJhbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60');
`;

const RmBox = styled.div`
	display: flex;
	height: 100vh;
	flex-direction: column;
	align-items: center;
`;

const ObituaryBox = styled.div`
	display: flex;
	width: 100%;
	height: 23rem;
	margin: 10rem 0;
	padding: 2rem;
	justify-content: space-evenly;
`;

const ObituaryDiv = styled.div`
	width: 250px;
	height: fit-content;
	position: relative;
	top: 50%;
	transform: translateY(-50%);
	h1 {
		font-size: 50px;
		text-align: center;
		margin: 0;
	}
	p {
		margin: 40px 0 0 0;
		text-align: center;
	}
`;

const ObituaryImg = styled.div`
	width: 430px;
	height: 300px;
	background-image: url('https://basicincomekorea.org/wp-content/uploads/2019/09/obituary-flower-600x246.png');
	background-size: 450px 300px;
`;

const adBoxStyle = css`
	display: flex;
	width: 100%;
	height: 100vh;
	margin: 10rem 0;
	padding: 2rem;
	align-item: center;
	justify-content: space-evenly;
	&:nth-of-type(even) {
		flex-direction: row-reverse;
	}
`;
const BoxStyle = styled.div`
	width: 100%;
	height: 100vh;
	margin: 10rem 0;
	padding: 2rem;
`;

const currentProgress = css`
	width: 100%;
	text-align: center;
`;

const progessCard = css`
	width: 10rem;
	height: auto;
	background-color: silver;
	border-radius: 30px;
	& > div {
		border-radius: 30px;
	}
`;

const CardGroup = css`
	display: grid;
	grid-template-columns: repeat(4, 10rem);
	grid-column-gap: 3rem;
	grid-row-gap: 3rem;
	place-content: center;
	margin-top: 5rem;
`;
