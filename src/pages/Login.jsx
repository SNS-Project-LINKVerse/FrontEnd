import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const gotoRegister = () => {
        navigate("/membership");
    };

    // 폼 검증 함수
    const validateForm = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = '이메일을 입력해주세요.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = '올바른 이메일 형식을 입력해주세요.';
        }

        if (!password.trim()) {
            newErrors.password = '비밀번호를 입력해주세요.';
        } else if (password.length < 6) {
            newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 입력값 변경 시 해당 에러 메시지 제거
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: '' }));
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: '' }));
        }
    };

    const handleLogin = async () => {
        // 폼 검증
        if (!validateForm()) return;

        setIsLoading(true);
        
        try {
            // AuthContext의 login 함수 사용
            const result = await login({ 
                email: email.trim(), 
                password: password,
                remembeMe: true
            });
            console.log(result)
            if (result.success) {
                // 로그인 성공 시 홈으로 이동
                navigate("/home");
            } else {
                // 로그인 실패 시 에러 메시지 표시
                setErrors({ submit: result.message });
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({ 
                submit: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Enter 키 처리
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
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
                
                {/* 이메일 입력 */}
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                        onKeyPress={handleKeyPress}
                        className={errors.email ? 'error' : ''}
                        disabled={isLoading}
                    />
                    {errors.email && (
                        <span className="error-message">{errors.email}</span>
                    )}
                </div>

                {/* 비밀번호 입력 */}
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        onKeyPress={handleKeyPress}
                        className={errors.password ? 'error' : ''}
                        disabled={isLoading}
                    />
                    {errors.password && (
                        <span className="error-message">{errors.password}</span>
                    )}
                </div>

                {/* 서버 에러 메시지 */}
                {errors.submit && (
                    <div className="submit-error">{errors.submit}</div>
                )}

                {/* 로그인 버튼 */}
                <button 
                    onClick={handleLogin}
                    disabled={isLoading}
                    className={isLoading ? 'loading' : ''}
                >
                    {isLoading ? '로그인 중...' : '로그인'}
                </button>
                
                {/* 회원가입 버튼 */}
                <button 
                    className="register-btn" 
                    onClick={gotoRegister}
                    disabled={isLoading}
                >
                    회원가입
                </button>
                
                <p className="forgot-password">아이디 찾기 / 비밀번호 찾기</p>
            </div>
        </div>
    );
}

export default Login;