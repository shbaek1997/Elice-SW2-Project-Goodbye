import React, { useState, useEffect } from "react";
import axios from 'axios';

import { useSelector, useDispatch } from "react-redux";
import { RECEIVERACTIONS } from '../reducers/receivers';

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Modal, List, Skeleton, Avatar } from "antd";
import VirtualList from 'rc-virtual-list';
import { Button } from '../util/common_styles';




function showCoverList(people) {
    const arr = [];
    for (let i = 0; i < 3; i++) {
        arr.push(people[i]);
    }
    return arr;
}

const ReceiverList = ({ will }) => {
    const dispatch = useDispatch();
    const [showList, setShowList] = useState(false);
    const { allReceiverList } = useSelector(state => state.receivers);
    const [receiverData, setReceiverData] = useState([]);
    const receiverIdList = will.receivers;

    const ContainerHeight = 400;
    

    // receiverIdList에서 수신자 정보를 받아온다.
    useEffect(() => {
        matchReceiverData();
    }, [allReceiverList]);



    const matchReceiverData = () => {
        const newData = [];

        // my_will에서 전달받은 id값에 해당되는 수신자를
        // 모든 수신목록에서 찾아서 receiverData에 저장한다. 
        receiverIdList.forEach(Id =>{ 
            const value = allReceiverList.find(data => data._id === Id);
            if (value) {
                newData.push(value);
            }
        });
        // console.log(receiverIdList, allReceiverList, newData);
        setReceiverData([...newData]);
    }

    // 유언장의 특정 수신인 삭제

    const deleteReciver = (receiverId) => {
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userId');
        console.log(receiverId);
        const receivers = will.receivers.filter( id => id !== receiverId );
        axios.patch(`/api/auth/${userId}/wills/${will._id}`,{
            receivers: [...receivers]
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            // dispatch allReceiverList 하는 부분(서버에서 정보 받아와 수정)
            // getReceiverList();
            // setReceiverData 하는 부분
            setReceiverData((prev) => {
                const result = prev.filter(item => {
                    const check = receivers.find(id => id === item._id)
                                ? true : false;
                    return check;
                })
                return result;
            });
        }).catch(err => console.log(err));
    }




    // 끝까지 스크롤 할 때 어떤 동작이 필요할까..
    // const appendData = () => {
    //     setData(...will.receivers);
    // }

    const onScroll = (e) => {
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight) {
            // appendData();
        }
    };


    // VirtualList에 itemKey도 유니크하게 수정해야됨
    return (
        <ListWrapper>
            <HumanList>
                {
                    <>
                        <ul>
                            {receiverData.map((receiver, i) =>
                            (
                                <ListContent key={receiver._id}>{receiver.fullName}</ListContent>
                            ))}
                        </ul>
                        <ListContent>...</ListContent>
                    </>
                }
                <Modal title="ReceiverList Modal" visible={showList} onCancel={() => setShowList(false)}>
                    <List>
                        <VirtualList
                            data={receiverData}
                            height={ContainerHeight}
                            itemHeight={47}
                            itemKey="email"
                            onScroll={onScroll}
                        >
                            {(item) => {
                                console.log(item._id);
                                return (
                                <List.Item key={item._id}>
                                    <List.Item.Meta
                                        title={<a href="#">{item.fullName}</a>}
                                        description={item.emailAddress}
                                    />
                                    <Button type='button' onClick={() => deleteReciver(item._id)}>목록에서 삭제</Button>
                                </List.Item>
                            )}}
                        </VirtualList>
                    </List>
                </Modal>
            </HumanList>
            <Button type="button"
                css={ListSpreadBtnStyle}
                onClick={() => setShowList(true)}>
                더보기
            </Button>
        </ListWrapper>
    )
}

export default ReceiverList;

const ListWrapper = styled.div`
    display: flex;
`


const ListSpreadBtnStyle = css`
    float: right;
    margin-bottom: 0.5rem;
`

const HumanList = styled.div`
    clear: both;
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
`
const ListContent = styled.li`
    float: left;
    border-radius: 5px;
    color: #FCFFF5;
    background-color: #91AA9D;
    width: 5rem;
    height: 1.5rem;  
    text-align: center;    
    margin: 0 0.5rem 0.5rem 0;           
`