import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa"; // 아이콘 추가

function Membership() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleMembership = async () => {
        try {
            const response = await axios.post("/api/auth/register", {
                username,
                email,
                password,
                profileName: username,
                profileImage: "",
                bio: "",
            });
            console.log(response.data);
            alert("회원가입이 완료되었습니다!");
            navigate("/");
        } catch (error) {
            console.error("회원가입 오류:", error);
            alert("회원가입에 실패했습니다.");
        }
    };

    return (
        <div className="membership-container">
            <div className="membership-box">
                <h1>Link<span style={{ fontWeight: "bold" }}>Verse</span></h1>
                <button className="back-button" onClick={() => navigate(-1)}>←</button>
                <h2>가입하기</h2>

                <label>아이디</label>
                <div className="input-container">
                    <FaUser className="icon" />
                    <input
                        type="text"
                        placeholder="아이디를 입력해 주세요"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <label>이메일</label>
                <div className="input-container">
                    <FaEnvelope className="icon" />
                    <input
                        type="email"
                        placeholder="이메일을 입력해 주세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <label>비밀번호</label>
                <div className="input-container">
                    <FaLock className="icon" />
                    <input
                        type="password"
                        placeholder="비밀번호를 입력해 주세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button className="signup-button" onClick={handleMembership}>
                    회원가입
                </button>

                <p className="login-link">
                    이미 계정이 있으신가요? <span onClick={() => navigate("/login")}>로그인하기</span>
                </p>
            </div>
        </div>
    );
}

export default Membership;
