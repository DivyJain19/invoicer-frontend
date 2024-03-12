import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/authentication/Login';
import SignUp from './components/authentication/SignUp';
import Error from './components/helpers/Error';
import { useSelector } from 'react-redux';
// import ProtectedRoute from './components/helpers/ProtectedRoute';
import Home from './components/mainComponents/Home';
import AddCompany from './components/mainComponents/AddCompany';
import AddProduct from './components/mainComponents/AddProduct';
import AddEntry from './components/mainComponents/AddEntry';
import Invoice from './components/mainComponents/Invoice';
import Sidebar from './components/mainComponents/Sidebar';
import { useDispatch } from 'react-redux';
import { login } from './authSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
function App() {
  const { isAuthenticated } = useSelector((state) => state.authentication);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      dispatch(login());
    }
  }, [dispatch, navigate]);
  return (
    <div className="h-full flex flex-col justify-center">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {isAuthenticated && <Route
          path="/*"
          element={
            // <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Sidebar>
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/addCompany" element={<AddCompany />} />
                  <Route path="/addProduct" element={<AddProduct />} />
                  <Route path="/addEntry" element={<AddEntry />} />
                  <Route path="/invoice" element={<Invoice />} />
                  <Route path="*" element={<Error />} />
                </Routes>
              </Sidebar>
            // </ProtectedRoute>
          }
        />}
        <Route path="*" element={<Error />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
