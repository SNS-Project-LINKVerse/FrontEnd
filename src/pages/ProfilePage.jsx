import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = {
    id: '7o78_8',
    name: '나영',
    followers: 100,
    following: 100, 
    profileImage: '/assets/profile_default.png',
  };
  /* -> user을 useEffect 사용하여 로그인 유저 정보 연동
  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => setUser(data));
    }, []);
  */

  return (
    <div className="page-container"> {/* Flex 컨테이너로 전체 감싸기 */}
      <Sidebar /> {/*왼쪽 메뉴 */}
      
      <div className="profile-page">
        <div className="profile-info">
          <img src={user.profileImage} alt="Profile" className="profile-img" />
          <h2>{user.id} <span>{user.name}</span></h2>
          <p>팔로워 {user.followers} · 팔로잉 {user.following}</p>
          <div className="buttons">
            <button onClick={() => navigate('/profile/edit')}>프로필 편집</button>
            <button>로그아웃</button>
          </div>
        </div>

        <div className="post-list">
          {/* 게시글 컴포넌트 반복 렌더링 예정 */}
          <p>게시글은 여기</p>
        </div>

        {/* 모달 연결 */}
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h3>프로필 수정</h3>
          <p>이 페이지는 아직 준비 중이예요!</p>
          <button onClick={() => setIsModalOpen(false)}>확인</button>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;
