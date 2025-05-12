import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import RightSidebar from './components/RightSidebar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MessagePage from './pages/MessagePage';
import AlarmPage from './pages/AlarmPage';
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <div className="content">
          <Sidebar />
          <Routes>
            /* 나중에 MainContent는 Homepage로 수정 */
            <Route path="/" element={<MainContent />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/message" element={<MessagePage />} />
            <Route path="/alarm" element={<AlarmPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          <RightSidebar />
        </div>
      </div>
    </Router>
  );
};

export default App;
