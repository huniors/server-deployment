import express from 'express';      /* HTTP 서버에 들어오는 요청을 처리해주는 핸들러/미들웨어 */
import cors from 'cors';            /* 클라이언트가 서버에 요청을 보내기 전 서버의 유효성을 검사하기 위해 CORS 라는 사전 요청을 보내는데, 이를 처리하는 미들웨어. */
import mongoose from 'mongoose';    /* MongoDB 에 저장할 데이터를 객체로 다루고, 데이터의 스키마를 설정하는 기능을 제공하는 라이브러리*/

const app = express();
app.use(express.json());
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.options('*', cors());
app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});

mongoose.connect("mongodb+srv://hmusk7:tJiuD3c7s4oeLeC6@developmentcluster.uhickvy.mongodb.net/?retryWrites=true&w=majority&appName=DevelopmentCluster/MyLittlePelican")
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

import checkTokenApi from './api/CheckToken.js';
import signInApi from './api/SignIn.js';
import signUpApi from './api/SignUp.js';

app.use('/api/checktoken', checkTokenApi);
app.use('/api/signin', signInApi);
app.use('/api/signup', signUpApi);