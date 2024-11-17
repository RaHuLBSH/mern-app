import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import EmployeeList from './EmployeeList';
import Employee from './Employee';

function App() {
  const isLoggedIn = !!localStorage.getItem('username');
  console.log("Is Logged In:", isLoggedIn);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={ isLoggedIn ? ( <Navigate to="/" />) : ( <Login />)}/>
        <Route path="/" element={ isLoggedIn ? ( <Home />) : ( <Navigate to="/login" />)}/>
        <Route path="/employee-list" element={<EmployeeList />} />
        <Route path="/employee" element={<Employee />} />
      </Routes>
    </Router>
  );
}


export default App;

