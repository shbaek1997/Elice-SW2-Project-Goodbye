import 'dotenv/config';
import { app } from './app.js';
//우선 임시로 mongoose와 connect를 마지막 index에서 실행.
import mongoose from 'mongoose';
const DB_URL =
    process.env.MONGODB_URL ||
    'MongoDB 서버 주소가 설정되지 않았습니다.\n./db/index.ts 파일을 확인해 주세요. \n.env 파일도 필요합니다.\n';

// .env 파일에 예를 들어 SERVER_PORT="3000" 을 작성하면, process.env.SERVER_PORT가 3000이 됨
const PORT = process.env.SERVER_PORT || 5000;
mongoose.connect(DB_URL);
app.listen(PORT, () => {
    console.log(`정상적으로 서버를 시작하였습니다.  http://localhost:${PORT}`);
});
