import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../authSlice';
import { useNavigate } from 'react-router-dom';
import PageHeading from '../helpers/PageHeading';
import { FaArrowDownLong } from 'react-icons/fa6';
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div>
      <PageHeading heading={'Home'} />
      <div className="text-end">
        <button
          className="px-4 py-2"
          onClick={() => {
            dispatch(logout());
            localStorage.clear();
            navigate('/');
          }}
          style={{
            backgroundColor: 'lightskyblue',
            border: '0.5px solid black',
          }}
        >
          Logout
        </button>
      </div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ marginTop: '8rem' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p style={{ margin: '0' }}>Add Company</p>
          <FaArrowDownLong className="my-3" />
          <p style={{ margin: '0' }}>Add Product</p>
          <FaArrowDownLong className="my-3" />
          <p style={{ margin: '0' }}>Add Entry</p>
          <FaArrowDownLong className="my-3" />
          <p style={{ margin: '0' }}>Create Invoice</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
