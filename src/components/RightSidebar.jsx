import React from 'react';
import './RightSidebar.css';
import myProfileImage from '../assets/my_profile.png'; // 내 프로필 이미지
import friendImage from '../assets/friend_profile.png'; // 추천 친구 이미지

const RightSidebar = () => {
  return (
    <div className="right-sidebar">
      {/* 내 프로필 */}
      <div className="my-profile">
        <img src={myProfileImage} alt="내 프로필" className="profile-image" />
        <div className="profile-info">
          <span className="profile-name">내 이름</span>
          <span className="profile-id">@내아이디</span>
        </div>
      </div>

      <h3>추천 친구</h3>

      {/* 추천 친구 목록 */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className="friend">
          <img src={friendImage} alt={`친구 ${index + 1}`} className="friend-image" />
          <div className="friend-info">
            <span className="friend-name">친구 {index + 1}</span>
            <span className="follow-btn">팔로우</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RightSidebar;
