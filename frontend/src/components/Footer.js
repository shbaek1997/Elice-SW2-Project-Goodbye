import React, { useState } from 'react';

import { RiKakaoTalkFill } from 'react-icons/ri';
import {
    FaFacebookSquare,
    FaInstagram,
    FaTwitter,
} from 'react-icons/fa';

import styled from '@emotion/styled';



const Footer = () => {
    // 로그인 정보를 받아와서 isLogIn에 저장
    // 로그인 상태에서만 footer 부분 아이콘이 보이게 함
    // 아이콘 눌렀을 때 동작 => 부고나 추모링크를 sns에 공유하는 동작 중 선택(동시 선택가능)
    const [isLogIn, setIsLogIn] = useState(true);


    const menu = ['서비스 안내', '유언장 보내기', 'GoodBye', '온라인 부고', '추모 공간'];

    return (
        <Wrapper>
            <ItemWrapper>
                <FooterItems>
                    {menu.map((item, i) => <li key={`footer-menu-${i}`}><a href="#">{item}</a></li>)}
                </FooterItems>
            </ItemWrapper>
            {isLogIn &&
                <FooterIcons>
                    <FacebookIcon href="https://www.facebook.com/">
                        <FaFacebookSquare />
                    </FacebookIcon>
                    <TwitterIcon href="https://www.twitter.com/">
                        <FaTwitter />
                    </TwitterIcon>
                    <KakaoIcon href="#">
                        <RiKakaoTalkFill />
                    </KakaoIcon>
                    <InstagramIcon href="https://www.instagram.com/">
                        <FaInstagram />
                    </InstagramIcon>
                </FooterIcons>}
        </Wrapper>
    )
}


export default Footer;


const ItemWrapper = styled.div`
    width: 100%;
    height: 3rem;
    margin: 2rem 0;
`

const FooterItems = styled.ul`
    display: flex;
    margin: 0;
    padding: 0;
    height: 100%;
    border-bottom: 1px solid black;
    justify-content: space-evenly;
    list-style: none;
    li {
        float: left;
        align-self: center;
        a {
            text-decoration: none;
            color: #193441;
        }
    }

    li:nth-of-type(3) {
        font-size: 1.3rem;
        margin-bottom: 15px;
    }
    
`
const FooterIcons = styled.div`
    width: 15rem;
    height: 2rem;
    margin: auto;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    & > * {
        font-size: 1.5rem;
    }
`
const FacebookIcon = styled.a`
    color: #4968ad;
`
const InstagramIcon = styled.a`
    color: black;
`
const TwitterIcon = styled.a`
    color: #49a1eb;
`
const KakaoIcon = styled.a`
    color: #FCD411;
`

const Wrapper = styled.div`
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 1.5rem;
`