import React, { useState, useEffect, createContext, useRef } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';

import Image from 'next/image';
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Comment, Form, Modal, Input } from "antd";
import 'antd/dist/antd.css';

import { FcFrame } from 'react-icons/fc';
import { MdOutlineCropPortrait, MdOutlinePortrait, MdPortrait } from 'react-icons/md';
import { BsFlower1 } from 'react-icons/bs';
import { GiFlowerPot, GiGraveFlowers, GiPortrait } from 'react-icons/gi';

import getUserIdToken from '../util/getUserIdToken';
import { TbRectangleVertical } from 'react-icons/tb';
import useInput from './../hooks/useInput';
import AppLayout from "../components/AppLayout";
import { Button } from "../util/common_styles";
import Flower from '../assets/lily.svg';



const CommentList = ({ comments, modal }) => {
    return (
        <IconComments>
            {comments.map((comment, i) => {
                return (
                    <FlowerIconDiv
                        key={`${i}+${comment.password}`}
                        onClick={() => {
                            console.log('테스트', modal)
                            modal.info(comment);
                        }}
                    >
                        <Flower />
                    </FlowerIconDiv>)
            })}
        </IconComments>
    )
}


const handlerFormClear = (formRef) => {
    formRef.current.setFieldsValue({
        writer: '',
        title: '',
        content: '',
        password: '',
    });
}

const Editor = ({ onSubmit, formRef }) => {
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    return (<Form {...layout}
        name="nest-writing-box"
        id="submitComment"
        onFinish={onSubmit}
        ref={formRef}
    >
        <Form.Item name={'writer'} label="작성자"
            rules={[{
                required: true,
                message: '작성자를 입력해주세요!',
            },
            ]}>
            <Input />
        </Form.Item>
        <Form.Item name={'title'} label="제목"
            rules={[{
                required: true,
                message: '제목을 입력해주세요!',
            }]}>
            <Input />
        </Form.Item>
        <p>추후에 추모글 수정, 삭제에 필요합니다. 원하는 비밀번호로 등록하세요</p>
        <Form.Item name={'password'} label="비밀번호 입력"
            rules={[{
                required: true,
                message: '비밀번호를 입력해주세요!',
            }]}>
            <Input.Password />
        </Form.Item>
        {/* <Form.Item label="고인에게 전할 말을 남겨주세요:"></Form.Item> */}
        <Form.Item name={'content'}
            label="고인에게 전할 말을 남겨주세요:"
            rules={[{
                required: true,
                message: '내용을 입력해주세요!',
            }]}>
            <TextArea rows={4} id="writing" />
        </Form.Item>
        <Button htmlType="submit" form='submitComment'>
            댓글 등록
        </Button>
        <Form.Item>
        </Form.Item>
    </Form>
    )
};


const make_remembrance = () => {
    const [modal, contextHolder] = Modal.useModal();
    const ReachableContext = createContext(null);

    const { userId, token } = useSelector(state => {
        console.log(state.user);
        return state.user;
    });
    const [userData, setUserData] = useState(null);
    const [comments, setComments] = useState([]);
    const [visibleCommentArea, setCommentArea] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef(null);
    // const [value, valueHandler, setValue] = useInput('');


    useEffect(() => {
        // 추모 데이터 서버에서 받아오기
        if (userId && token) {
            getRemembranceData();
        }
    }, [userId, token])


    console.log(userId, token);

    const getRemembranceData = async () => {

        // const {userId, token} = getUserIdToken();
        console.log(userId, token);
        try {
            console.log(userId, token);
            const res = await axios.get(`/api/auth/${userId}/remembrances`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const {
                userId,
                dateOfBirth,
                dateOfDeath,
                photo
            } = res.data;
            setUserData({
                remembranceId: res.data._id,
                photo
            })
            setComments([...res.data.comments])
        } catch (error) {
            console.log(error);
        }
    }


    // 댓글 서버에 등록하기
    const postComment = async (data) => {
        const { remembranceId } = userData;
        try {
            const response =
                axios.post(`/api/remembrances/${remembranceId}/comments`,
                    data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCommentSubmit = (e) => {
        console.log(e);
        const data = {
            writer: e.writer,
            title: e.title,
            content: e.content,
            password: e.password
        }

        setTimeout(() => {
            console.log('확인')
            setComments((prev) => [
                ...prev,
                data
            ]);
            postComment(data);
            // 폼 양식 리셋하기
            handlerFormClear(formRef);
        }, 500);
    }


    return (
        <>
            <AppLayout>
                <Introduction>
                    <div css={adBoxStyle}>
                        <div css={adContentStyle}>
                            <h1>따뜻한 말을 남겨주세요..</h1>
                            <h2>-추모 공간입니다-</h2>
                        </div>
                        <div css={imageStyle}>
                            <Image
                                src="https://images.unsplash.com/photo-1516967124798-10656f7dca28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d2FybSUyMGhlYXJ0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"
                                alt="소개 사진"
                                layout="fill"
                                priority
                            />
                        </div>
                    </div>
                </Introduction>
                <CommentTree>
                    <Portrait>
                        <Frame>
                            {comments.length > 0 &&
                                <ReachableContext.Provider value="Light">
                                    <CommentList comments={comments} modal={modal} />
                                    {contextHolder}
                                </ReachableContext.Provider>
                            }
                            <FrameImages>
                                <Image
                                    src="https://images.unsplash.com/photo-1516967124798-10656f7dca28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d2FybSUyMGhlYXJ0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"
                                    alt="테스트 사진"
                                    width={150}
                                    height={150}
                                    priority
                                />
                                <TbRectangleVertical className={'frame_svg'} />
                            </FrameImages>
                        </Frame>
                        <Decorator>
                            <BsFlower1 />
                        </Decorator>
                        <Decorator>
                            <BsFlower1 />
                        </Decorator>
                        <Decorator>
                            <BsFlower1 />
                        </Decorator>
                        <Decorator>
                            <BsFlower1 />
                        </Decorator>
                    </Portrait>

                    <Button className={'visible_btn'} onClick={() => setCommentArea(prev => !prev)}>
                        {visibleCommentArea ? '댓글 양식 가리기' : '댓글 작성하기'}
                    </Button>
                    {visibleCommentArea &&
                        <CommentArea>
                            <Editor
                                onSubmit={handleCommentSubmit}
                                submitting={submitting}
                                formRef={formRef}
                            />
                        </CommentArea>}
                </CommentTree>
                {/* <Button onClick={createRemembranceData}>추모글 등록하기</Button> */}
            </AppLayout>
        </>
    )
}

{/* <FcFrame />
<MdOutlineCropPortrait />
<MdPortrait />
<BsFlower1 />
<GiFlowerPot />
<GiGraveFlowers /> */}

export default make_remembrance;


const adBoxStyle = css`
	display: flex;
	width: 100%;
	height: 30rem;
	//margin: 10rem 0;
	padding: 2rem;
	align-item: center;
    box-sizing: border-box;

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


const Introduction = styled.div`
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: center;
    background-color: thistle;
`

const CommentTree = styled.div`
    .visible_btn {
        position: relative;
        left: 6rem;
        margin-bottom: 3rem;        
    }
`

const Portrait = styled.div`
    text-align: center;
    
`

const Frame = styled.div`
    position: relative;
    color: dimgray;
    z-index: 1;
    svg.frame_svg {
        width: 300px;
        height: auto;
        opacity: 0.5;
    }
`

const Decorator = styled.div`
    position: relative;
    display: inline-block;
    z-index: 2;
    bottom: 50px;
    color: lightgoldenrodyellow;
`

const IconComments = styled.div`
    display: inline-grid;
    grid-column-gap: 1rem;
    place-content: center;
    grid-template-columns: repeat(5, minmax(50px,auto));
    position: absolute;
    left: 10px;
`

const CommentArea = styled.div`
    text-align: center;

    form .ant-form-item-control-input-content {
        flex: none;
    }

    form button {
        position: absolute;
        right: 5rem;
    }
    
    label, textarea {
        font-size: .8rem;
        letter-spacing: 1px;
    }

    textarea {
        padding: 10px;
        min-width: 300px;
        line-height: 1.5;
        border-radius: 5px;
        border: 1px solid #ccc;
        box-shadow: 1px 1px 1px #999;
        resize: none;
    }
    
    label {
        display: block;
        margin-bottom: 10px;
    }
`

const FlowerIconDiv = styled.div`
    display: inline-block;
    width: fit-content;
    svg {
        width: 50px;
        cursor: pointer;
    }
`

const TextArea = styled.textarea`

` 

const FrameImages = styled.div`
    display: grid;
    grid-template-areas: "overlay";
    justify-items: center;
    & > svg {
        grid-area: overlay;
    }
    & > span {
        grid-area: overlay;
    }
`