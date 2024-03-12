import React, { useState } from 'react';
import Logo from '../../assets/svg/logo1.svg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { login } from '../../authSlice';
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { data } = await axios.post(
        process.env.REACT_APP_BASE_URL + '/users/login',
        {
          email,
          password,
        },
        config
      );
      localStorage.setItem('userInfo', JSON.stringify(data || null));
      dispatch(login());
      navigate('/home');
      setError('');
      setLoading(false);
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };


  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div
        style={{
          padding: '3rem',
          borderRadius: '5px',
          width: '400px',
        }}
      >
        <Form>
          <div className="d-flex justify-content-center align-items-center">
            <img src={Logo} alt="CK" />
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <p
              className="mt-2"
              style={{ fontSize: '25px', textAlign: 'center' }}
            >
              Sign in to your account
            </p>
          </div>
          <Form.Group className="mb-4 mt-3" controlId="formBasicEmail">
            <Form.Label style={{ fontSize: '14px' }}>Email address</Form.Label>
            <Form.Control
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              style={{
                boxShadow: '1px 1px 1px 1px var(--primary-color)',
                border: 'none',
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label style={{ fontSize: '14px' }}>Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              style={{
                boxShadow: '1px 1px 1px 1px var(--primary-color)',
                border: 'none',
              }}
              autoComplete=""
            />
          </Form.Group>

          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Spinner
                className="mt-3"
                animation="border"
                style={{ color: 'var(--primary-color)' }}
              />
            </div>
          ) : (
            <Button
              type="submit"
              className="mt-3"
              onClick={submitHandler}
              style={{
                width: '100%',
                backgroundColor: 'var(--primary-color)',
                border: 'none',
              }}
            >
              Sign in
            </Button>
          )}
          <div className="d-flex justify-content-center align-items-center">
            {error && (
              <p className="fs--1 mt-2" style={{ color: 'red' }}>
                {error}
              </p>
            )}
          </div>
        </Form>
        <p className="mt-2 text-center">
          Don't have a account?
          <Link style={{ color: 'var(--primary-color)' }} to="signup">
            {' '}
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
