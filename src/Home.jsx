import React from 'react';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import './Home.css';


function Home() {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <Sidebar />
      <MainContent />
      <RightSidebar />
    </div>
  );
}

export default Home;
