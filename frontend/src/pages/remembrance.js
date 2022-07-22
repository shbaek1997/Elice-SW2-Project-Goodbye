import React, { useState, useEffect, useCallback, createContext, useRef } from "react";
import Router, { useRouter } from 'next/router';
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
    
    const handleOk = () => {
        
    }
    
    const handleCancel = () => {
        console.log('확인')
        setIsModalVisible(false);
    }
    
    return (
        <IconGroup>
            <IconComments>
                {comments.map((comment, i) => {
                    // const [isModalVisible, setIsModalVisible] = useState(null);
                    const [inputVisible, setInputVisible] = useState(false);
                    const [inputValue, setInputValue] = useState('');
                    
                    return (
                        <FlowerIconDiv
                            key={`${i}+${comment.password}`}
                            onClick={() => {
                                const modalData = {
                                    title: comment.title,
                                    content: (
                                        <>
                                            <p>{`작성자: ${comment.writer}`}</p>
                                            <p>{`내용: ${comment.content}`}</p>
                                            {inputVisible ?
                                                <>
                                                    <Input 
                                                        placeholder="제거 하려면 비밀번호를 입력하세요."
                                                        value={inputValue}  
                                                        onChange={(e) => setInputValue(e.target.value)}      
                                                    />
                                                    <Button onClick={() => deleteComment(comment, inputValue)}>입력</Button>
                                                </> :
                                                <Button onClick={() => setInputVisible(true)}>댓글 제거하기</Button>
                                            }
                                        </>
                                    ),
                                }
                                // console.log(inputVisible);
                                // console.log(modalData, comment);       
                                modal.info(modalData);
                            }}
                        >
                            <Flower />
                        </FlowerIconDiv>)
                })}
            </IconComments>
        </IconGroup>
    )
}

const deleteComment = async (commentData, password) => {
    const {commentId, remembranceId} = commentData;
    console.log(commentData, password);
    try {
        const res = 
                await axios.delete(`/api/remembrances/${remembranceId}/comments/${commentId}`, {
                    data: { password: commentData.password }
                });
        console.log(res);
    } catch(err) {
        console.log(err.response.data.reason);
    }
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
        <Notice>추후에 추모글 수정, 삭제에 필요합니다. 원하는 비밀번호로 등록하세요</Notice>
        <Form.Item name={'password'} label="비밀번호 입력"
            rules={[{
                required: true,
                message: '비밀번호를 입력해주세요!',
            }]}>
            <Input.Password />
        </Form.Item>
        <Form.Item name={'content'}
            label="작성 내용: "
            rules={[{
                required: true,
                message: '내용을 입력해주세요!',
            }]}>
            <TextArea rows={4} id="writing" />
        </Form.Item>
        <Button htmlType="submit" form='submitComment'>
            댓글 등록
        </Button>
    </Form>
    )
};


const remembrance = () => {
    const [modal, contextHolder] = Modal.useModal();
    const ReachableContext = createContext(null);
    const router = useRouter();

    const [userData, setUserData] = useState({
        remembranceId: '',
        photo: ''
    });
    const [comments, setComments] = useState([]);
    const [visibleCommentArea, setCommentArea] = useState(false);
    const formRef = useRef(null);

    const getCommentData = (remembranceId, comments) => {
        try {

            comments.forEach(async (comment) => {
                const res = await axios.get(`/api/remembrances/${remembranceId}/comments/${comment._id}`);
                console.log(res);
                const data = {
                    writer: comment.writer,
                    title: comment.title,
                    content: comment.content,
                    password: comment.password,
                    commentId: comment._id,
                    remembranceId
                }
                setComments((prev) => [...prev, data]);
            })
        } catch (error) {
            alert(error.response.data.reason);
            console.log(error.response.data.reason);
        }
    }
    
    // remembranceId예시 62d7b9e42f66fc6992fe82e1
    
    
    const getRemembranceData = async (remembranceId) => {
        try {
            const res = await axios.get(`/api/remembrances/${remembranceId}`);
            const {
                _id,
                photo,
                comments
            } = res.data;

            console.log(res.data);
            setUserData({
                remembranceId: _id,
                photo
            })
            getCommentData(_id, comments)
        } catch (error) {
            alert(error.response.data.reason);
            console.log(error.response.data.reason);
        }
    }

    // console.log(userData);

    // 댓글 서버에 등록하기
    const postComment = async (data) => {
        const { remembranceId } = userData;
        try {
            const response =
                await axios.post(`/api/remembrances/${remembranceId}/comments`, data);

            setComments((prev) => [
                ...prev,
                data
            ]);
            console.log(response);
        } catch (error) {
            alert(error.response.data.reason);
            console.log(error.response.data.reason);
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
            // setComments((prev) => [
            //     ...prev,
            //     data
            // ]);
            postComment(data);
            // 폼 양식 리셋하기
            handlerFormClear(formRef);
        }, 500);
    }

    // useEffect(() => {
    //     getRemembranceData();
    // }, [])

    useEffect(() => {
        if (!router.isReady) return;
        const { remembranceId } = router.query;

        if (remembranceId) {
            // setLocalRmId(remembranceId);
            getRemembranceData(remembranceId);
        }
        console.log(remembranceId);
    }, [router.isReady]);

    console.log(userData, userData.photo)

    return (
        <>
            <AppLayout>
                <Introduction>
                    <div css={adBoxStyle}>
                        <div css={adContentStyle}>
                            <h1>따뜻한 말을 남겨주세요..</h1>
                            <h2>-추모 공간입니다-</h2>
                        </div>
                        {/* <div css={imageStyle}> */}
                        <img
                            src="https://images.unsplash.com/photo-1516967124798-10656f7dca28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d2FybSUyMGhlYXJ0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"
                            alt="소개 사진"
                            width={200}
                        // layout="fill"
                        // priority
                        />
                        {/* </div> */}
                    </div>
                </Introduction>
                <CommentTree>
                    <Portrait>
                        <Frame>
                            <FrameImages>
                                <TbRectangleVertical className={'frame_svg'} />
                                <img src={userData.photo} />
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
                    {comments.length > 0 &&
                        // <CommentList comments={comments} />
                        // <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                        //     <p>{`작성자: ${comment.writer}`}</p>
                        //     <p>{`내용: ${comment.content}`}</p>
                        // </Modal>
                        <ReachableContext.Provider value="Light">
                            <CommentList comments={comments} modal={modal} />
                            {contextHolder}
                        </ReachableContext.Provider>
                    }   
                    <Button className={'visible_btn'} onClick={() => setCommentArea(prev => !prev)}>
                        {visibleCommentArea ? '댓글 양식 가리기' : '댓글 작성하기'}
                    </Button>
                    {visibleCommentArea &&
                        <CommentArea>
                            <Editor
                                onSubmit={handleCommentSubmit}
                                formRef={formRef}
                            />
                        </CommentArea>}
                </CommentTree>
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

export default remembrance;


const adBoxStyle = css`
	display: flex;
	width: 100%;
	height: 30rem;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    .visible_btn {
        width: 8rem;
        margin: 3rem 0;       
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
        color: darkgrey;
    }
`

const Decorator = styled.div`
    position: relative;
    display: inline-block;
    z-index: 2;
    bottom: 50px;
    color: lightgoldenrodyellow;
`

const IconGroup = styled.div`
    display: block;
    position: relative;
    width: 30rem;
    min-height: 15rem;
    margin: auto;
    background-color: gainsboro;
    border-radius: 20px;
`

const IconComments = styled.div`
    display: inline-grid;
    grid-column-gap: 0.5rem;
    place-content: center;
    grid-template-columns: repeat(8, minmax(auto, auto));
    position: absolute;
    left: 10px;
`

const CommentArea = styled.div`
    text-align: center;

    form .ant-form-item-control-input-content {
        flex: none;
    }

    form button {
        position: relative;
        left: 14rem;
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

const Notice = styled.p`
    font-size: x-small;
    position: relative;
    right: 40px;
`

const FlowerIconDiv = styled.div`
    display: inline-block;
    width: fit-content;
    svg {
        width: 50px;
        cursor: pointer;
    }
    &:hover {
        border-radius: 15px;
        background-color: ghostwhite;
    }
`

const TextArea = styled.textarea`

`

const FrameImages = styled.div`
    position: relative;
    display: inline-block;

    & > img {
        position: absolute;
        width: 150px;
        height: 215px;
        top: 35px;
        left: 75px;
        z-index: -1;
    }
`