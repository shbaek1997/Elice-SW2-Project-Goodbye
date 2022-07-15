import React from "react";

import { Modal } from "antd";

// 추후에 빼서 쓸 예정 너무 복잡해질 것 같다..
const ReceiverListModal = () => {

    const dispatch = useDispatch();
    const {
        familyList,
        friendList,
        relativeList,
        acquaintanceList
    } = useSelector(state => state.receivers);
    const [registFormVisible, setRegistFormVisible] = useState(false);
    const [relationValue, setRelationValue] = useState('');
    const inputEl = useRef(null);


    useEffect(() => {
        getReceiverList();
    }, [])

    const handleCancel = () => {
        setRegistFormVisible(false);
    }

    const onChangeRelation = (e) => {
        console.log(e.target.textContent);
        const selection = e.target.value;
        setRelationValue(() => {
            if (selection === 'typing') {
                inputEl.current.focus();
                return '';
            }
            return selection;
        })
    }

    const onChangeInput = (e) => {
        setRelationValue(e.target.value);
    }


    // 리스트 불러오기
    const getReceiverList = () => {
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userId');
        axios.get(`/api/auth/${userId}/receivers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            dispatch(RECEIVERACTIONS.getReceivers({ lists: res.data }));
        }).catch(err => console.log(err));
    }

    // 리스트 등록하기
    const onSubmitRegistForm = (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userId');
        const submitData = new FormData(e.target);
        const fullName = submitData.get('name');
        const emailAddress = submitData.get('email');
        const relation = submitData.get('input_relation');
        // console.log(data.get('name'), data.get('input_relation'));
        axios.post(`/api/auth/${userId}/receiver`, {
            fullName,
            emailAddress,
            userId,
            relation,
            role: 'user'
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            alert('등록되었습니다!');
            getReceiverList();
            setRegistFormVisible(false);
        }).catch(err => console.log(err));
    }


    return (
        <>
            <Modal
                title="registerForm"
                visible={registFormVisible}
                onCancel={handleCancel}
                footer={[
                        <Button form="registerForm" 
                        key="submit" 
                        htmlType="submit"
                        >
                            저장
                        </Button>,
                        <Button key="modalCancel" onClick={handleCancel}>취소</Button>
                ]}
            >
                <form id='registerForm' onSubmit={onSubmitRegistForm}>
                    <div>
                        <label htmlFor='name'>이름:
                            <input name='name'></input>
                        </label>
                    </div>
                    <div>
                        <label htmlFor='email'>이메일:
                            <input name='email'></input>
                        </label>
                        <Button type='button'>이메일 중복 확인</Button>
                    </div>
                    <div>
                        <label htmlFor='relation'>관계:
                            <select onChange={(e) => onChangeRelation(e)}>
                                <option value="">--관계를 선택하세요--</option>
                                <option value="가족">가족</option>
                                <option value="친척">친척</option>
                                <option value="친구">친구</option>
                                <option value="지인">지인</option>
                                <option value="typing">직접입력</option>
                            </select>
                            <input name='input_relation' ref={inputEl} onChange={onChangeInput} value={relationValue}/>
                        </label>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default ReceiverListModal;