import React, { useState } from 'react';
import Link from 'next/link';

import styled from '@emotion/styled';

import { Button } from '../util/common_styles';

const Header = () => {
    // 로그인 정보를 받을 예정
    const [isLogIn, setIsLogIn] = useState(false);

    return (
        <>
            <Wrapper>
                <LoginHeader>
                    {!isLogIn ?
                        <ButtonGroup>
                            <Button type='button'>로그인</Button>
                            <Button type='button'>회원가입</Button>
                        </ButtonGroup>
                        : <Button type='button'>로그아웃</Button>
                    }
                </LoginHeader>
                <NavBar>
                    <Link href={'/'}><h1>GoodBye</h1></Link>
                    <ul>
                        <li><Link href={'/my_will'}><a>유언장 작성/확인</a></Link></li>
                        <li><Link href={'#'}><a>나의 장례식</a></Link></li>
                        <li><Link href={'#'}><a>부고 작성</a></Link></li>
                    </ul>
                </NavBar>
            </Wrapper>
        </>
    )
}

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
`

const LoginHeader = styled.div`
    text-align: right;
`

const ButtonGroup = styled.div`
    padding: 1rem;          
    & button:first-of-type {
        margin-right: 10px;
    }
`

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
            color: #FCFFF5;
            background-color: #3E606F; 
        }        
    }
`
