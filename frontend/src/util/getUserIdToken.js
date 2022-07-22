

// useEffect 함수 내부에 써야 불러올 수 있음. useEffect는 클라이언트에서 동작함으로.. 

export default function getUserIdToken() {
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');
    return { userId, token };
} 