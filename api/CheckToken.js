import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/', (req, res) => {
    /**
     * authorization 은 요청 헤더에서 Authorization 값을 가져온다.
     * ? 연산자는 Optional Chaining 으로, authorization 헤더가 존재하지 않을 경우 에러를 발생시키지 않고 undefined 반환
     * split (' ') 는 문자열을 공백 기준으로 분리하여 배열을 생성한다. 예를 들어, Bearer token_value 는 ['Bearaer', 'token_value'] 로 분리된다.
     * [1] 은 배열의 두 번째 요소, 즉 토큰 값 자체를 참조한다.
     * @returns {*} token 토큰의 실제 값
     */
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.send.json({ isLoggedIn : false });
    }
    
    try {
        /**
         * jwt.verify 함수는 성공적으로 검증하면 토큰의 Payload 객체를 반환
         */
        const userId = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        if (userId)
            return res.send.json({ isLoggedIn : true });
        else
            return res.send.json({ isLoggedIn : false });
    } catch (err) {
        console.error(err);
    }
});

export default router;
