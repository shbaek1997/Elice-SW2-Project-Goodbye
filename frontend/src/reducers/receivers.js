import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    familyList: [],     // 가족 리스트 
    friendList: [],     // 친구 리스트 
    relativeList: [],     // 친척 리스트 
    acquaintanceList: [],     // 지인 리스트 
    allReceiverList: [],        
}


const receiverSlice = createSlice({
    name: 'receivers',
    initialState,
    reducers: {
        getReceivers(state, action) {
            const { lists } = action.payload;
            // 리스트 초기화
            state.familyList = [];
            state.friendList = [];
            state.relativeList = [];
            state.acquaintanceList = [];

            lists.forEach((list) => {
                // 전체 수신자 아이디 리스트 초기화
                state.allReceiverList = [...state.allReceiverList, list];

                const data = {
                    emailAddress: list.emailAddress,
                    name: list.fullName,
                    relation: list.relation,
                    receiverId: list._id
                }
                
                switch (list.relation) {
                    case '가족':
                        state.familyList = [...state.familyList, data];
                        break;
                    case '친구':
                        state.friendList = [...state.friendList, data];
                        break;
                    case '친척':
                        state.relativeList = [...state.relativeList, data];
                        break;
                    default:
                        state.acquaintanceList = [...state.acquaintanceList, data];
                        break;
                }
            })
        },
    }
})


export const RECEIVERACTIONS = {
    getReceivers: receiverSlice.actions.getReceivers,
};


export default receiverSlice.reducer;