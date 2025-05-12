import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import homeIcon from '../assets/home_bar.png';
import searchIcon from '../assets/search_bar.png';
import messageIcon from '../assets/message_bar.png';
import alarmIcon from '../assets/alarm_bar.png';
import uploadIcon from '../assets/upload_bar.png';
import profileIcon from '../assets/profile_bar.png';

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* LinkVerse 로고 */}
      <div className="logo">
        <h1>LinkVerse</h1>
      </div>

      {/* 메뉴 리스트 */}
      <ul className="menu">
        <li>
          <Link to="/">
            <img src={homeIcon} alt="Home" />
          </Link>
        </li>
        <li>
          <Link to="/search">
            <img src={searchIcon} alt="Search" />
          </Link>
        </li>
        <li>
          <Link to="/message">
            <img src={messageIcon} alt="Message" />
          </Link>
        </li>
        <li>
          <Link to="/alarm">
            <img src={alarmIcon} alt="Alarm" />
          </Link>
        </li>
        <li>
          <Link to="/upload">
            <img src={uploadIcon} alt="Upload" />
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <img src={profileIcon} alt="Profile" />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
