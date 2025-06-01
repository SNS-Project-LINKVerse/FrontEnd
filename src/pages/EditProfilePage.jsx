import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './EditProfilePage.css';

const EditProfilePage = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (type) => {
    alert(`${type} 변경: 완료!`);
  };

  return (
    <div className="page-container">
      <Sidebar />

      <div className="edit-profile-page">
        <h2>프로필 편집</h2>

        {/* 프로필 사진 업로드 */}
        <section className="edit-section">
          <h3>프로필 사진 변경</h3>
          <button className="upload-btn">사진 업로드하기</button>
        </section>

        {/* 아이디 변경 */}
        <section className="edit-section">
          <h3>아이디 변경</h3>
          <p>변경할 아이디를 입력하세요</p>
          <div className="input-row">
            <input value={id} onChange={(e) => setId(e.target.value)} placeholder="변경할 아이디 입력" />
            <button onClick={() => handleSubmit('아이디')}>확인</button>
          </div>
        </section>

        {/* 이름 변경 */}
        <section className="edit-section">
          <h3>이름 변경</h3>
          <p>변경할 이름을 입력하세요.</p>
          <div className="input-row">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="변경할 이름 입력" />
            <button onClick={() => handleSubmit('이름')}>확인</button>
          </div>
        </section>

        {/* 비밀번호 변경 */}
        <section className="edit-section">
          <h3>비밀번호 변경</h3>
          <p>변경할 비밀번호를 입력하세요.</p>
          <div className="input-row">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="변경할 비밀번호 입력"/>
            <button onClick={() => handleSubmit('비밀번호')}>확인</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditProfilePage;