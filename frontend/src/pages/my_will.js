import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';

import Image from 'next/image';
import Link from 'next/link';
import AppLayout from '../components/AppLayout';
import Pagination from "../components/Pagination";
import { Card } from "antd";


/* 
    로그인 한 상태에서만 유언장 페이지에 접근가능
    로그인 하지 않은 상태에서는 로그인, 회원가입 유도 화면 보여줌
*/



const MyWill = () => {
    const [isLogIn, setIsLogIn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { willList } = useSelector(state => state.will);


    // 임시 로그인 토글 설정
    const loginBtnHandler = useCallback(() => {
        setIsLogIn((prev) => !prev);
    }, []);

    const clickPagination = useCallback(setCurrentPage, []);

    return (
        <>
            <AppLayout>
                <div css={adBoxStyle}>
                    <div css={adContentStyle}>
                        <h2>나의 유언장</h2>
                        <p>유언장을 작성하거나 아래 항목에서 유언장을 확인하세요</p>
                        <Button>유언장 작성하기</Button>
                    </div>
                    <div css={imageStyle}>
                        <Image
                            src="https://media.istockphoto.com/photos/signing-last-will-testament-picture-id875284846?b=1&k=20&m=875284846&s=170667a&w=0&h=4kzW8N24YNRyhr8Hfoad9t9egggq0ZPGhPde2sR3DG0="
                            alt="유언장 작성"
                            layout='fill'
                            priority
                        />
                    </div>
                </div>
                {!isLogIn ?
                    <NoticeBox>
                        <p>유언장을 열람하시거나 작성하려면 로그인이나 회원가입을 해주세요!</p>
                        <NoticeBtnGroup>
                            <Button onClick={loginBtnHandler}>로그인하기</Button>
                            <Button>회원가입하기</Button>
                        </NoticeBtnGroup>
                    </NoticeBox>
                    :
                    <>
                        <CardGroup>
                            {willList.map((will, i) =>
                                <Card
                                    title={will.title}
                                    extra={
                                        <CardBtnGroup>
                                            <Link href="#"><a css={aTagStyle}>유언장 상세보기</a></Link>
                                        </CardBtnGroup>
                                    }
                                    style={{
                                        width: '20rem',
                                    }}
                                    key={`card-${i}`}
                                >{
                                    <ReceiverListWrap>
                                        <Button type="button" css={ListSpreadBtnStyle}>펼쳐보기</Button>
                                        <div>
                                            {will.receivers.map((content, i) =>
                                                <span key={content+`${i}`}>{content}</span>
                                            )}
                                        </div>
                                    </ReceiverListWrap>
                                }
                                </Card>)}
                        </CardGroup>
                        <Pagination
                            currPage={currentPage}
                            pageCount={3}
                            onClickPage={clickPagination}
                        />
                    </>}
            </AppLayout>
        </>
    )
}

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

//==========================

const Button = styled.button`
    color: #3E606F;           
    background-color: #D1DBBD;
    border: none;
`

const aTagStyle = css`
    color: #3E606F;           
    background-color: #D1DBBD;
`


const NoticeBox = styled.div`
    height: 5rem;
    display: flex;
    justify-content: space-evenly;
    p {
        line-height: 5rem;
        margin: 0;
        font-size: 1.2rem;
    }
`

const NoticeBtnGroup = styled.div`           
    display: flex;
    align-items: center;

    Button:first-of-type {
        margin-right: 1.5rem;
    }

`
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
`
const CardBtnGroup = styled.div`
    display: flex;
    flex-direction: column;
    button:first-of-type {
        margin-bottom: 10px;
    }
`

const ReceiverListWrap = styled.div`
    
`

const ListSpreadBtnStyle = css`
    position: relative;
    // left: 24px;
`