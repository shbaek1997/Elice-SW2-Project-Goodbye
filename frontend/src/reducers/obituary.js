import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
	family: [{
        relation: '친구',
        fullName: '이영민',
    }],
    flag: false,
};

const obituarySlice = createSlice({
	name: 'obituary',
	initialState,
	reducers: {
        //부고 생성시 SelectFamily 컴포넌트에 setFamily 요청
        setFlag(state, action) {
            //console.log(action.payload)
            const { flag } = action.payload;
            state.flag = flag;
        },
        setFamily(state, action) {
			const { fullName, directRelation } = action.payload;
            let { relation } = action.payload;
           // console.log('setFamily 1 : ' + relation)
            
            //직접입력의 경우 예외처리
            if(relation === '직접입력') {
                relation = directRelation;
            }
            //console.log('setFamily 2 : ' + relation)

            const newPerson = { relation, fullName };
            //console.log(newPerson)
			state.family = [...state.family, newPerson];
            //console.log(state.family)
        },
        clearFamily(state, action) {
            state.family = [];
        },
        //각각의 SelectFamily에서 relation, fullName, directRelation 받기
		getFamily(state, action) {
			const { relation, fullName, directRelation } = action.payload;
			
		},
	},
});

export const OBITUARYACTIONS = {
    setFlag: obituarySlice.actions.setFlag,
    setFamily: obituarySlice.actions.setFamily,
    clearFamily: obituarySlice.actions.clearFamily,
	getFamily: obituarySlice.actions.getFamily,
};

export default obituarySlice.reducer;
