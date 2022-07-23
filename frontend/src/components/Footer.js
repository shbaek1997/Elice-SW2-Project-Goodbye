import React, { useState } from 'react';

import { RiKakaoTalkFill } from 'react-icons/ri';
import {
    FaFacebookSquare,
    FaInstagram,
    FaTwitter,
} from 'react-icons/fa';
import { Button, Modal } from 'antd';
import styled from '@emotion/styled';
import RemembranceList from '../components/remembranceList'

const Footer = () => {
    const [modal2Visible, setModal2Visible] = useState(false);
    const showRemembranceList = () => {
        console.log('test')
    }

    const menu = [ 
    <a href="/info">서비스 안내</a>, 
    <a href="/my_will_detail">유언장 보내기</a>, 
    <a href="/receiver_management_page">수신인 관리</a>, 
    <span onClick={() => setModal2Visible(true)}>추모 공간</span>,
    <a href="/my_page">마이페이지</a>,
    ];

    return (
        <Wrapper>
            <ItemWrapper>
                <FooterItems>
                    {menu.map((item, i) => <li key={`footer-menu-${i}`}>{item}</li>)}
                </FooterItems>
            </ItemWrapper>
            <Modal
                title="추모 공간"
                centered
                visible={modal2Visible}
                onOk={() => setModal2Visible(false)}
                onCancel={() => setModal2Visible(false)}
                width={900}
            >
			    <RemembranceList />
            </Modal>
        </Wrapper>
    )
}


export default Footer;


const ItemWrapper = styled.div`
    width: 100%;
    margin: 2rem 0 0 0;
    border-top: 1px solid black;
`

const FooterItems = styled.ul`
    display: inline-flex;
    flex-direction: column;
    position: relative;
    left: 5rem;
    margin: 0;
    padding: 0;
    height: 10rem;
    justify-content: space-evenly;
    list-style: none;
    li {
        float: left;
        align-self: center;
        a {
            text-decoration: none;
            color: #193441;
            cursor: pointer;
        }
        span {
            cursor: pointer;
        }
    }    
    li:first-of-type {
        font-weight: bold;
        font-size: larger;
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
`