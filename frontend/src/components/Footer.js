import React, { useState } from 'react';

import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled'


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
        font-size: 1.5rem;
        margin-bottom: 15px;
    }
    
`
const FooterIcons = styled.div`

`

const Wrapper = styled.div`
    padding: 1.5rem;
`

const Footer = () => {

    const menu = ['서비스 안내', '유언장 보내기', 'GoodBye' , '온라인 부고', '추모 공간' ];

    return (
        <Wrapper>
            <ItemWrapper>
                <FooterItems>
                    {menu.map((item) => <li><a href="#">{item}</a></li>)}
                </FooterItems>
            </ItemWrapper>
            <FooterIcons>
            </FooterIcons>
        </Wrapper>
    )
}


export default Footer;