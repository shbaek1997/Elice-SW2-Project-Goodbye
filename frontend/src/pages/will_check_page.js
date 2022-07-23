import React, { useEffect, useState } from "react";
import Router, { useRouter } from 'next/router';
import axios from 'axios';  

import styled from "@emotion/styled";

import useInput from "../hooks/useInput";
import AppLayout from '../components/AppLayout';
import { Button } from '../util/common_styles';

const will_check_page = () => {
    const router = useRouter();
    const [localWillId, setLocalWillId] = useState(null);
    const [willData, setWillData] = useState(null);
    const [emailValue, onChangeEmail, setEmailValue] = useInput('');

    const getWillData = async () => {
        try {
            const res = await axios.post(`/api/users/${localWillId}`, {
                email: emailValue   
            });
            setWillData({
                title: res.data.will.title,
                content: res.data.will.content
            })
        } catch (error) {
            alert(error);
            console.log(error);
        }
    }

    useEffect(() => {
        if (!router.isReady) return;
        const { willId } = router.query;
        if (willId) {
            setLocalWillId(willId);
        }
    }, [router.isReady]);



    return (
        <>
            <AppLayout>
                <Wrapper>
                    {willData ?
                        <Content>
                            <div className="title">
                                <center>
                                    <tt>{willData?.title}</tt>
                                </center>
                            </div>
                            <p>{willData?.content}</p>
                        </Content>
                        : <EmailInputBox>
                            <p>이메일 주소를 입력하고 유언장을 확인하세요!</p>
                            <EmailInput onChange={onChangeEmail} value={emailValue}/>
                            <Button onClick={getWillData}>확인</Button>
                        </EmailInputBox>
                    }
                </Wrapper>
            </AppLayout>
        </>
    )
}

export default will_check_page;

const Wrapper = styled.div`
    max-width: 650px;
    min-height: inherit;
    margin: 0 auto;
    font-family: helvetica,arial;
    background: url(https://images.unsplash.com/photo-1618635245221-a1974f59cb02?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTAwfHxsZXR0ZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60);
    padding:40px 50px 15px 50px;
    border-radius:50px;
`

const Content = styled.div`  
    .title {
        font-size: 2em;
    }

    p {
        position: relative;
        top: 2rem;
        font-family: 'Cinzel', serif;
        font-size: 18px;  
    }

    width: 80%;
    min-height: inherit;
    padding: 5%;
    margin: auto;
    background: rgb(254,254,254,0.65);
    border-radius:50px;
    border: none;
    font-size: 1.15em;
    font-family: book antiqua;
`

const EmailInputBox = styled.div`

`

const EmailInput = styled.input`

`