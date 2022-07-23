import axios from 'axios';
import getUserIdToken from './getUserIdToken';



const userLoginCheck = async () => {

    const { userId, token } = getUserIdToken();
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
        console.log(error);
        alert(error);
        sessionStorage.clear(); 
        return false;
    }

}

export default userLoginCheck;
