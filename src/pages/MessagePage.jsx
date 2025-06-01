import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './MessagePage.css';

const mockUser = {
  username: '7o78_8',
  name: '나영',
};

const mockFriends = [
  { id: 1, name: 'ABC' },
  { id: 2, name: 'qwer' },
  { id: 3, name: '민수' },
];

const recommended = Array(4).fill(mockUser);

const messagesByFriend = {
  1: [
    { from: 'friend', text: '안녕하세요?', read: true },
    { from: 'me', text: '누구시죠.', read: true },
    { from: 'friend', text: '선대 교수 장재석입니다.', read: false },
  ],
  2: [
    { from: 'friend', text: '배고파ㅠㅠ', read: false },
  ],
  3: [
    { from: 'me', text: '나: 오키', read: true },
  ],
};

const MessagePage = () => {
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState(messagesByFriend);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedFriendId) return;
    const updated = { ...chatMessages };
    if (!updated[selectedFriendId]) updated[selectedFriendId] = [];
    updated[selectedFriendId].push({ from: 'me', text: newMessage, read: true });
    setChatMessages(updated);
    setNewMessage('');
  };

  const getLastPreview = (msgs) => {
    if (!msgs || msgs.length === 0) return '';
    const last = msgs[msgs.length - 1];
    return last.from === 'me' ? `나: ${last.text}` : last.text;
  };

  const getUnreadCount = (msgs) => {
    return msgs.filter(msg => msg.from === 'friend' && !msg.read).length;
  };

  const selectedFriend = mockFriends.find((f) => f.id === selectedFriendId);
  const conversation = chatMessages[selectedFriendId] || [];

  return (
    <div className="page-container">
      <Sidebar />
      <div className="message-page">
        <div className="friend-list">
          <h3>메시지</h3>
          <ul>
            {mockFriends.map((friend) => {
              const messages = chatMessages[friend.id] || [];
              const lastPreview = getLastPreview(messages);
              const unread = getUnreadCount(messages);

              return (
                <li
                  key={friend.id}
                  className={selectedFriendId === friend.id ? 'selected' : ''}
                  onClick={() => setSelectedFriendId(friend.id)}
                >
                  <div className="friend-meta">
                    <span className="name">{friend.name}</span>
                    <span className="preview">{lastPreview}</span>
                  </div>
                  {unread > 0 && <span className="unread">{unread}</span>}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="chat-box">
          {selectedFriend ? (
            <>
              <div className="chat-header">{selectedFriend.name}</div>
              <div className="messages">
                <div className="timestamp">2025-05-24 오후 6:41</div>
                {conversation.map((msg, i) => (
                  <div key={i} className={`message ${msg.from}`}>{msg.text}</div>
                ))}
              </div>
              <div className="input-area">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="메시지 보내기"
                />
                <button onClick={handleSend}>전송</button>
              </div>
            </>
          ) : (
            <div className="placeholder">채팅할 친구를 선택해주세요</div>
          )}
        </div>

        <div className="recommend-section">
          <h4>추천 친구</h4>
          {recommended.map((friend, idx) => (
            <div key={idx} className="recommend-friend">
              <span className="username">{friend.username}</span>
              <span className="follow">팔로우</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
