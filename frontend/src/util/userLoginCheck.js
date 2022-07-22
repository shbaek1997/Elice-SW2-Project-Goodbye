import axios from 'axios';
import getUserIdToken from './getUserIdToken';


// 0일 때 토큰이나 아이디가 없는 것
// 1일 때 정상 로그인
// 2일 때 로그인 실패


const userLoginCheck = async () => {

    const { userId, token } = getUserIdToken();
    // console.log('테스트3', token);
    // console.log('테스트4', userId);
    if (!userId || !token) return false;


    // 서버에서 로그인 인증 
    try {
        const res = await axios.get(`/api/auth/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
        const data = {
            fullName: res.data.user.fullName,
            userId,
            token,
            logInState: true
        }
        return data;
    } catch (error) {
        // alert('로그인 상태가 아니거나 유효하지 않은 접근입니다.');
        console.log(error);
        alert(error);
        sessionStorage.clear(); 
        return false;
    }

}

export default userLoginCheck;
