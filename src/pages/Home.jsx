import React from 'react';
import MainContent from '../components/MainContent';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import AlarmContent from '../components/AlarmContent';
import { useLocation } from 'react-router-dom';
import './Home.css';

function Home() {
  const location = useLocation();
  const isAlarm = location.pathname === '/alarm';

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <Sidebar />
      {isAlarm ? <AlarmContent /> : <MainContent />}
      <RightSidebar />
    </div>
  );
}

export default Home;
