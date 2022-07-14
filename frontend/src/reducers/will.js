import { createSlice } from '@reduxjs/toolkit';


export const initialState = {
    willList: [],     // 유언장 리스트 
}


// createSlice에는 내부적으로  createAction and createReducer 를 사용한다.
// 따라서 자동으로 action과 리듀서를 생성한다.

const willSlice = createSlice({
    name: 'wills',
    initialState,
    reducers: {
        getWills(state, action) {
            const { lists } = action.payload;
            const listLength = lists.length;
            const quotient = parseInt(listLength / 6);  // 몫
            const remainder = listLength % 6;           // 나머지
            const newList = [];
            console.log(quotient, remainder);
            for (let i = 0; i < quotient; i++) {
                newList.push(lists.slice(i*quotient, i*quotient + 6));                
            }
            if (remainder !== 0) {
                newList.push(lists.slice(6*quotient, 6*quotient + remainder));
            }
            state.willList = [...newList];
        },
        removeWill(state, action) {
            const newList = state.willList.filter(will =>
                will._id !== action.payload.will._Id
            );
            state.willList = [...newList];
        }
    }
})


export const WillACTIONS = {
    getWills: willSlice.actions.getWills,
    removeWill: willSlice.actions.removeWill,
};


export default willSlice.reducer;