import React from 'react';
import './AlarmContent.css';

const todayNotifications = [
  { id: 1, user: 'abcd123', message: '님이 회원님의 게시글을 좋아합니다.', time: '5시간 전' },
  { id: 2, user: 'abcd123, qwert_854님 외 여러분이', message: ' 팔로우를 요청했습니다.', time: '2시간 전' },
  { id: 3, user: 'abcd123', message: '님이 회원님의 게시글을 좋아합니다.', time: '5시간 전' },
];

const weekNotifications = [
  { id: 4, user: 'abcd123', message: '님이 회원님의 게시글을 좋아합니다.', time: '1일 전' },
  { id: 5, user: 'abcd123, qwert_854님 외', message: ' 여러분이 회원님의 게시글을 좋아합니다.', time: '1일 전' },
  { id: 6, user: 'abcd123, qwert_854님 외', message: ' 여러분이 팔로우를 요청했습니다.', time: '3일 전' },
  { id: 7, user: 'abcd123', message: '님이 팔로우를 요청했습니다.', time: '4일 전' },
];

const AlarmContent = () => {
  return (
    <div className="alarm-content">
      <h2 className="alarm-title">알림</h2>
      
      <div className="alarm-section">
        <h3 className="alarm-section-title">오늘</h3>
        <ul className="alarm-list">
          {todayNotifications.map(notification => (
            <li key={notification.id} className="alarm-item">
              <div className="alarm-avatar"></div>
              <div className="alarm-details">
                <div className="alarm-text">
                  <span className="alarm-user">{notification.user}</span>
                  <span className="alarm-message">{notification.message}</span>
                </div>
                <div className="alarm-time">{notification.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="alarm-section">
        <h3 className="alarm-section-title">이번 주</h3>
        <ul className="alarm-list">
          {weekNotifications.map(notification => (
            <li key={notification.id} className="alarm-item">
              <div className="alarm-avatar"></div>
              <div className="alarm-details">
                <div className="alarm-text">
                  <span className="alarm-user">{notification.user}</span>
                  <span className="alarm-message">{notification.message}</span>
                </div>
                <div className="alarm-time">{notification.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AlarmContent;
