// Header.js
import React from 'react';

function Header() {
  const username = localStorage.getItem('username');
  const handleLogout = () => {
    localStorage.removeItem('username');
    window.location.href = '/login';
  };
  return (
    <div className="header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
      <a href ='/' style={{ margin: '0 20px' }}>Home</a>
      <a href='/employee-list' style={{ margin: '0 20px' }}>Employee List</a>
      <h3 style={{ margin: '0 20px' }}>{username}</h3>
      <button onClick={handleLogout} style={{ marginLeft: '20px' }}>
        Logout
      </button>
    </div>
  );
}

export default Header;
