import axios from 'axios';
import getUserIdToken from './getUserIdToken';

const userLoginCheck = async () => {

    const { userId, token, remembranceId } = getUserIdToken();

    if (!userId || !token) return false;


    // 서버에서 로그인 인증 
    try {
        const res = await axios.get(`/api/auth/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
        // res를 수정해서 userData를 반환해야함
        // userData = { fullName:~~ }
        console.log(res);
        const data = {
            fullName: res.data.fullName,
            userId,
            token,
            remembranceId,
            logInState: true
        }
        return data;
    } catch (error) {
        // alert('로그인 상태가 아니거나 유효하지 않은 접근입니다.');
        console.log(error);
        sessionStorage.clear(); 
        return false;
    }

}

export default userLoginCheck;
