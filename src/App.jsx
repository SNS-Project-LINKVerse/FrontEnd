import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Membership from './pages/Membership';
import SplashScreen from './pages/SplashScreen';

import SearchPage from './pages/SearchPage';
import MessagePage from './pages/MessagePage';
// import AlarmPage from './components/AlarmPage';  // 이 줄 삭제!
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading ? (
        <SplashScreen />
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/message" element={<MessagePage />} />
          <Route path="/alarm" element={<Home />} />  {/* 이렇게 수정! */}
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
