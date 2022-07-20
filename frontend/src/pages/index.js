import React, { useState, useEffect } from 'react';
import { css, jsx } from '@emotion/react';

import Image from 'next/image';
import AppLayout from '../components/AppLayout';



const Home = () => {

  return (
    <AppLayout>
      <div css={adBoxStyle}>
        <div css={adContentStyle}>
          <h2>온라인으로 보내는 유언장</h2>
          <p>소중한 추억을 전하세요</p>
        </div>
        <div css={imageStyle}>
          <Image
            src="https://images.unsplash.com/photo-1528752477378-485b46bedcde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dGVzdGFtZW50fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"
            alt="유언장 이미지"
            layout='fill'
          />
        </div>
      </div>
      <div css={adBoxStyle}>
        <div css={adContentStyle}>
          <h2>온라인 추모</h2>
          <p>함께 슬픔을 나누세요</p>
        </div>
        <div css={imageStyle}>
          <Image
            src="https://images.unsplash.com/photo-1595062584313-47018e0ee5cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZnVuZXJhbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60"
            alt="추모 이미지"
            layout='fill'
          />
        </div>
      </div>
      <div css={adBoxStyle}>
        <div css={adContentStyle}>
          <h2>온라인 부고 서비스</h2>
          <p>쉽게 부고를 작성하고 알리세요</p>
        </div>
        <div css={imageStyle}>
          <Image
            src="https://basicincomekorea.org/wp-content/uploads/2019/09/obituary-flower-600x246.png"
            alt="부고 이미지"
            layout='fill'
          />
        </div>
      </div>
      <div css={adBoxStyle}>
        <div css={currentProgress}>
          <h2>현재 진행중인 추모식</h2>
          <p>진행중인 추모</p>
          <div css={CardGroup}>
            {Array(8).fill('').map((x, i) => {
              return <div key={`progress-${i}`} css={progessCard} />
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Home;


// 중복 코드 수정 예정
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
`

const adContentStyle = css`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const imageStyle = css`
  position: relative;
  width: 50%;
  line-height: 10rem;
  background-color: silver;
`
const currentProgress = css`
  width: 100%;
  text-align: center;
  p {
    margin: 3rem 1rem;
  }
`

const progessCard = css`
  width: 5rem;
  height: 5rem;
  background-color: silver;
`

const CardGroup = css`
  display: grid;
  grid-template-columns: repeat(4, 5rem);
  grid-column-gap: 5rem;
  grid-row-gap: 3rem;
  place-content: center;
`