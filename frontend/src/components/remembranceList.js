import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Card } from 'antd';
import 'antd/dist/antd.css';

const RemembranceList = () => {
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
											href={`http://kdt-sw2-seoul-team11.elicecoding.com/remembrance?remembranceId=${death._id}`}
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
    )
}

export default RemembranceList;

const BoxStyle = styled.div`
	width: 100%;
	//height: 100vh;
	margin-bottom: 10rem;
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
