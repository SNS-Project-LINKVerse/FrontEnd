import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './SearchPage.css';

const mockUser = {
  username: '7o78_8',
  name: '나영',
};

const recommended = Array(4).fill(mockUser);
const initialHistory = ['abcd123', 'abcd123', 'abcd123', 'abcd123', 'abcd123'];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState(initialHistory);

  const handleRemove = (index) => {
    const newHistory = [...searchHistory];
    newHistory.splice(index, 1);
    setSearchHistory(newHistory);
  };

  const handleClearAll = () => {
    setSearchHistory([]);
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="search-page">
        <div className="search-left">
          <h2>검색</h2>
          <div className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색"
            />
            {searchTerm && <button className="clear-btn" onClick={() => setSearchTerm('')}>×</button>}
          </div>

          <div className="history-header">
            <span>최근 검색</span>
            {searchHistory.length > 0 && (
              <button className="clear-all" onClick={handleClearAll}>모두 지우기</button>
            )}
          </div>

          <ul className="search-history">
            {searchHistory.map((name, idx) => (
              <li key={idx} className="search-item">
                <div className="profile-circle" />
                <div className="search-info">
                  <span className="username">{name}</span>
                  <span className="realname">ABC</span>
                </div>
                <button className="delete-btn" onClick={() => handleRemove(idx)}>×</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="search-right">
          <div className="my-profile">
            <div className="profile-circle" />
            <span className="username">{mockUser.username}</span>
            <span className="realname">{mockUser.name}</span>
          </div>
          <h4 className="recommend-title">추천 친구</h4>
          {recommended.map((user, idx) => (
            <div className="recommend-user" key={idx}>
              <div className="profile-circle" />
              <div className="search-info">
                <span className="username">{user.username}</span>
                <span className="realname">{user.name}</span>
              </div>
              <span className="follow">팔로우</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
