import React from 'react';
import {  useDispatch } from 'react-redux';
import { logout } from '../../authSlice';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  return (
    <div>
      <button
        onClick={() => {
          dispatch(logout());
          localStorage.clear();
          navigate("/")
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
