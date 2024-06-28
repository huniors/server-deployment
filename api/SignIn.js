import express from 'express';
import bcrypt from 'bcryptjs';          /* 비밀번호 해쉬화에 사용하는 라이브러리 */
import jwt from 'jsonwebtoken';         /* 유저의 로그인 세션을 토큰으로 관리하기 위해 사용하는 라이브러리 */
import User from '../model/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email });
        const pwMatch = await bcrypt.compare(password, user.password);

        if (!user || !pwMatch)
            return res.sendStatus(401);
        
        /**
         * 새로운 토큰을 생성하는 함수
         * @param {*} { userId: user._id } Payload 로, 쿠키의 내용이라고 보면 된다.
         * @param {*} process.env.JWT_ACCESS_SECRET 토큰은 비밀키에 의해 해시화되는데, 이 때의 비밀키.
         * @param {*} { expiresIn: '15m' } 토큰의 유효 기간
         * @returns {*} accessToken 비밀키에 의해 서명된 토큰
         */
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        /**
         * 클라이언트에 토큰을 넘겨주는 방식은 다양하며, 쿠키를 통해 토큰을 넘겨주기 위해 쿠키를 설정한다.
         * @param {string} 'token' 쿠키의 이름
         * @param {*} refreshToken 저장할 쿠키의 값
         * @param {*} httpOnly JavaScript 를 통한 XSS 공격으로부터 쿠키에 접근하는 것을 방지
         * @param {*} secure 쿠키가 HTTPS를 통해서만 전송되도록 설정
         * @param {*} sameSite 쿠키가 같은 사이트의 요청에서만 보내지도록 하여 CSRF 공격의 리스크 감소
         */
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        return res.status(200).json({ accessToken });

        } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
});
    

export default router;
