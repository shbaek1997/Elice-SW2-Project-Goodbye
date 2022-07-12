import produce from '../util/produce';


export const initialState = {
    willList: [
        {
            title: '유언장-1',
            content: '내용-1',
            userId: '1',
            receivers: Array(30).fill('').map((item, i) => `${i+1}번째 사람`),
        }
    ],     // 유언장 리스트 
    loadWillsLoading: false, // 유언장 리스트 요청
    loadWillsDone: false,
    loadWillsError: null,
    addWillLoading: false,  // 유언장 추가 요청
    addWillDone: false,
    addWillError: null,
    removeWillLoading: false,  // 유언장 삭제 요청
    removeWillDone: false,
    removeWillError: null,
}

// 테스트 값입니다.
const dummyWills = {
    title: '유언장-2',
    content: '내용-2',
    userId: '2',
    receivers: ['한 명', '두 명']
}


export const LOAD_WILLs_REQUEST = 'LOAD_WILL_REQUEST';
export const LOAD_WILLs_SUCCESS = 'LOAD_WILL_SUCCESS';
export const LOAD_WILLs_FAILURE = 'LOAD_WILL_FAILURE';

export const ADD_WILL_REQUEST = 'ADD_WILL_REQUEST';
export const ADD_WILL_SUCCESS = 'ADD_WILL_SUCCESS';
export const ADD_WILL_FAILURE = 'ADD_WILL_FAILURE';

export const REMOVE_WILL_REQUEST = 'REMOVE_WILL_REQUEST';
export const REMOVE_WILL_SUCCESS = 'REMOVE_WILL_SUCCESS';
export const REMOVE_WILL_FAILURE = 'REMOVE_WILL_FAILURE';


export const addWillRequestAction = (data) => {
    type: ADD_WILL_REQUEST,
        data
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_WILLs_REQUEST:
            return {
                ...state,
            }
        default:
            return state;
    }
}

export default reducer;