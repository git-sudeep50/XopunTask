import React, { useState } from 'react';
import SideBar from '../Components/SideBar';
import { Outlet } from 'react-router-dom';

const Homepage: React.FC = () => {
  

  return (
    <div className="flex flex-row h-screen w-screen bg-gray-100">
      <SideBar />
      <main className='w-full'>
        <Outlet/>
      </main>
    </div>
  );
};

export default Homepage;
