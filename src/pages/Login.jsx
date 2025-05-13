import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    const gotoRegister = () => {
        navigate("/membership")
    }

    const handleLogin = () => {
        if (email && password) {            
            navigate("/home");
        } else {
            alert("이메일과 비밀번호를 입력하세요.");
        }
    };


    return (
        <div className="login-page">
            {/*📱 스마트폰 UI 영역*/}
            <div className="phone-mockup">
                <img src="/SmartPhone.png" alt="Phone Mockup"/>
            </div>

            {/* 🔒 로그인 박스 */}
            <div className="login-box">
                <h1>Link<span style={{ fontWeight: "normal" }}>Verse</span></h1>
                <p>Let's Meeting New People Around</p>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>로그인</button>
                <button className="register-btn" onClick={gotoRegister}>회원가입</button>
                <p className="forgot-password">아이디 찾기 / 비밀번호 찾기</p>
            </div>
        </div>
    );
}

export default Login;