import React from 'react';
import './MainContent.css';
import post from '../assets/main_post_screen.png';

const MainContent = () => {
  return (
    <div className="main-content">
      {/* 게시글 이미지 삽입 */}
      <div className="post">
        <img src={post} alt="게시글 화면" className="post-image" />
      </div>
    </div>
  );
};

export default MainContent;
