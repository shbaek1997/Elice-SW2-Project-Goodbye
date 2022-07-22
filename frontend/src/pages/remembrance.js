import React, { useState, useEffect, useCallback, createContext, useRef } from "react";
import Router, { useRouter } from 'next/router';
import axios from 'axios';

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Comment, Form, Modal, Input } from "antd";
import 'antd/dist/antd.css';

import { BsFlower1 } from 'react-icons/bs';
import { TbRectangleVertical } from 'react-icons/tb';
import AppLayout from "../components/AppLayout";
import { Button } from "../util/common_styles";
import Flower from '../assets/lily.svg';



const CommentList = ({ comments }) => {
    const router = useRouter();
    const currentURL = router.pathname;
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteBtn, setDeleteBtn] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [currentComment, setCurrentComment] = useState({
        title: '',
        content: '',
        writer: ''
    });
    
    const handleCancel = () => {
        setModalVisible(false);
    }

    const deleteComment = async () => {
        const {commentId, remembranceId} = currentComment;
        try {
            const res = 
                    await axios.delete(`/api/remembrances/${remembranceId}/comments/${commentId}`, {
                        headers: {
                            password: inputValue
                        },
                    });
            
            // 리다이렉트 하기
            document.location.href = `${currentURL}?remembranceId=${remembranceId}`;
        } catch(err) {
            alert(err.response.data.reason);
        }
    }
    
    return (
        <IconGroup>
            <IconComments>
                {comments.map((comment, i) => {
                    return (
                        <FlowerIconDiv
                            key={`${i}+${comment.password}`}
                            onClick={() => {
                                setModalVisible(true);
                                setCurrentComment({...comment});
                            }}
                        >
                            <Flower />
                        </FlowerIconDiv>)
                })}
            </IconComments>
            <Modal
                title={currentComment.title}
                visible={modalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="modalCancel" onClick={handleCancel}>
                        취소
                    </Button>
                ]}
            >
                <p>{`작성자:  ${currentComment.writer}`}</p>
                <p>{`내용:  ${currentComment.content}`}</p>
                {!deleteBtn ?
                    <Button onClick={() => setDeleteBtn(true)}>제거하기</Button>:
                    <>
                        <Input 
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)} 
                            placeholder="제거하려면 비밀번호를 입력하세요."
                            type="password"
                        />
                        <Button onClick={deleteComment}>확인</Button>
                    </>
                }
            </Modal>
        </IconGroup>
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

    const getCommentData = async (remembranceId, comments) => {
        try {

            comments.forEach(async (comment) => {
                const res = await axios.get(`/api/remembrances/${remembranceId}/comments/${comment._id}`);
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
                comments,
                fullName,
                dateOfBirth,
                dateOfDeath,
            } = res.data;
            console.log(res);
            setUserData({
                fullName,
                dateOfBirth,
                dateOfDeath,
                remembranceId: _id,
                photo
            })
            getCommentData(_id, comments)
        } catch (error) {
            alert(error.response.data.reason);
            console.log(error.response.data.reason);
        }
    }


    // 댓글 서버에 등록하기
    const postComment = async (data) => {
        const { remembranceId } = userData;
        try {
            const response =
                await axios.post(`/api/remembrances/${remembranceId}/comments`, data);
            
            setComments((prev) => [
                ...prev,
                {
                    ...data,
                    commentId: response.data._id,
                    remembranceId
                }
            ]);
        } catch (error) {
            alert(error.response.data.reason);
            console.log(error.response.data.reason);
        }
    }

    const handleCommentSubmit = (e) => {
        const data = {
            writer: e.writer,
            title: e.title,
            content: e.content,
            password: e.password
        }

        setTimeout(() => {
            postComment(data);
            // 폼 양식 리셋하기
            handlerFormClear(formRef);
        }, 500);
    }


    useEffect(() => {
        if (!router.isReady) return;
        const { remembranceId } = router.query;

        if (remembranceId) {
            // setLocalRmId(remembranceId);
            getRemembranceData(remembranceId);
        }
    }, [router.isReady]);


    return (
        <>
            <AppLayout>
                <Introduction>
                    <div css={adBoxStyle}>
                        <div css={adContentStyle}>
                            <h1>개인 추모관</h1>
                        </div>
                    </div>
                </Introduction>
                <CommentTree>
                    <Portrait>
                        <Frame>
                            <FrameImages>
                                {/* <TbRectangleVertical className={'frame_svg'} /> */}
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
                    <TextWrapper>
                        <h2>{`${userData.fullName}`}</h2>
                        <p>{`${userData.dateOfBirth} ~ ${userData.dateOfDeath}`}</p>
                    </TextWrapper>
                    {comments.length > 0 &&
                        <ReachableContext.Provider value="Light">
                            <CommentList comments={comments} router={router.pathname} />
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

const TextWrapper = styled.div`
    position: relative;
    bottom: 75px;
   h2 {
    font-size: 2.5rem;
    text-align: center;
   }
   p {
    font-size: 1.5rem;
   }

`

const ImageWrapper = styled.div`

`

const adBoxStyle = css`
	display: flex;
	width: 100%;
	align-item: center;
    box-sizing: border-box;
    justify-content: flex-start;
	&:nth-of-type(even) {
		flex-direction: row-reverse;
	}
`;

const adContentStyle = css`
	width: 100%;
	display: flex;
	// flex-direction: column;
	// justify-content: center;
	align-items: center;
    h1 {
        display: inline-block;
        position: absolute;
        left: 5rem;
        margin: 0;
    }
`;

const imageStyle = css`
	position: relative;
	width: 50%;
	line-height: 10rem;
	background-color: silver;
`;


const Introduction = styled.div`
    height: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: center;
    background-color: #fafafa;
    border-bottom: 1px solid #dee2e6;
`

const CommentTree = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    // background-image: url('https://images.unsplash.com/photo-1560238786-aa5717f6ba63?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80');
    background-repeat: no-repeat;
    background-size: cover;
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
        width: 50rem;
        height: auto;
        // color: darkgrey;
        color: lightslategray;
        stroke-width: initial;
    }
`

const Decorator = styled.div`
    position: relative;
    display: inline-block;
    z-index: 2;
    bottom: 102px;
    color: whitesmoke;
    & > svg {
        width: 1.2rem;
        height: 1.5rem;
    }
`

const IconGroup = styled.div`
    padding: 1.5rem 0;
    display: block;
    position: relative;
    width: 50rem;
    min-height: 25rem;
    margin: auto;
    background-color: rgb(50, 35, 30);
    border-radius: 20px;
`

const IconComments = styled.div`
    display: inline-grid;
    grid-column-gap: 1.8rem;
    grid-row-gap: 1.5rem;
    place-content: center;
    grid-template-columns: repeat(8, minmax(auto, auto));
    position: absolute;
    left: 38px;
`

const CommentArea = styled.div`
    text-align: center;

    form .ant-form-item-control-input-content {
        flex: none;
    }

    form button {
        position: relative;
        left: 0;
        bottom: 1rem;
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
        color: black;
        font-size: medium;
    }
`

const Notice = styled.p`
    font-size: smaller;
    position: relative;
    right: 40px;
    color: black;
`

const FlowerIconDiv = styled.div`
    display: inline-block;
    width: fit-content;
    svg {
        width: 4rem;
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
        width: 28rem;
        height: 36rem;
        margin: 5rem;
        top: 116px;
        left: 175px;
        z-index: -1;
        border: 1.5rem solid black;
        border-radius: 10px;
    }
`