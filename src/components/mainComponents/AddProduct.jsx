import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
import axios from 'axios';
import { IoMdAddCircle } from 'react-icons/io';
import { MdDelete, MdEdit } from 'react-icons/md';
import { ImCross } from 'react-icons/im';
import { FaCheck } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import PageHeading from '../helpers/PageHeading';

const AddProduct = () => {
  const userData = JSON.parse(localStorage.getItem('userInfo'));
  const [productList, setProductList] = useState([]);
  const [inputFields, setInputFields] = useState({});
  const [editInputFields, setEditInputFields] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [editItemId, setEditItemId] = useState('');

  const getProductList = async () => {
    try {
      setShowLoader(true);
      const res = await axios.get(
        process.env.REACT_APP_BASE_URL +
          `/api/product/getProductList/${userData?.userId}`
      );
      const list = res?.data?.data?.productList;
      setProductList(list);
      setShowLoader(false);
    } catch (err) {
      console.log(err);
      toast.error('Something Went Wrong!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
      setShowLoader(false);
    }
  };

  const onChangeProductInput = (e) => {
    setInputFields((prev) => {
      let obj = { ...prev };
      obj[e.target.name] = e.target.value;
      return obj;
    });
  };
  const onChangeProductEditInput = (e) => {
    setEditInputFields((prev) => {
      let obj = { ...prev };
      obj[e.target.name] = e.target.value;
      return obj;
    });
  };

  const validateFields = (inputFields) => {
    if (
      inputFields?.product_name === '' ||
      inputFields?.product_name === undefined
    ) {
      toast.warn('Product Name Required', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
      return false;
    } else if (
      inputFields?.buyer_percentage < 0 ||
      inputFields?.seller_percentage < 0
    ) {
      toast.warn('Percentage cannot be less than 0', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
      return false;
    } else {
      return true;
    }
  };

  const handleAddProduct = async () => {
    if (validateFields(inputFields)) {
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
          },
        };
        await axios.post(
          process.env.REACT_APP_BASE_URL +
            `/api/product/addProduct/${userData?.userId}`,
          inputFields,
          config
        );
        getProductList();
        setInputFields({});
      } catch (err) {
        toast.warn(err?.response?.data?.message, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          theme: 'dark',
        });
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      setShowLoader(true);
      await axios.delete(
        process.env.REACT_APP_BASE_URL +
          `/api/product/deleteProduct/${id}/${userData?.userId}`
      );
      await getProductList();
      setShowLoader(false);
    } catch (err) {
      toast.warn(err?.response?.data?.message, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
      setShowLoader(false);
    }
  };

  const handleEditProduct = async (id) => {
    if (validateFields(editInputFields)) {
      setShowLoader(true);
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
          },
        };
        await axios.put(
          process.env.REACT_APP_BASE_URL +
            `/api/product/editProduct/${id}/${userData?.userId}`,
          editInputFields,
          config
        );
        await getProductList();
        setEditInputFields({});
        setShowLoader(false);
        setEditItemId('');
      } catch (err) {
        toast.warn(err?.response?.data?.message, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          theme: 'dark',
        });
        setShowLoader(false);
      }
    }
  };

  useEffect(() => {
    getProductList();
  }, []);

  return (
    <div className="scroll-page">
      <PageHeading heading={'Product'} />
      <p style={{ fontWeight: 'bolder' }}>Add Product</p>
      <Table striped bordered>
        <tbody>
          <tr>
            <td>
              <Form.Control
                type="text"
                name="product_name"
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '1px',
                }}
                placeholder="Name"
                value={inputFields?.product_name || ''}
                onChange={onChangeProductInput}
              />
            </td>
            <td>
              <Form.Control
                type="number"
                name="buyer_percentage"
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '1px',
                }}
                placeholder="Buyer Rate"
                value={inputFields?.buyer_percentage || ''}
                onChange={onChangeProductInput}
              />
            </td>
            <td>
              <Form.Control
                name="seller_percentage"
                type="number"
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '1px',
                }}
                placeholder="Seller Rate"
                value={inputFields?.seller_percentage || ''}
                onChange={onChangeProductInput}
              />
            </td>
            <td>
              <Form.Control
                name="unit"
                type="text"
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '1px',
                }}
                placeholder="Unit"
                value={inputFields?.unit || ''}
                onChange={onChangeProductInput}
              />
            </td>
            <td
              className="text-center"
              style={{ verticalAlign: 'middle', cursor: 'pointer' }}
            >
              <IoMdAddCircle size={26} onClick={handleAddProduct} />
            </td>
          </tr>
        </tbody>
      </Table>
      <p style={{ fontWeight: 'bolder' }}>Product List</p>
      <div className="table-container">
        {!showLoader ? (
          <div className="action-col-small">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Buyer Brokerage</th>
                  <th>Seller Brokerage</th>
                  <th>Unit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {productList?.map((item) =>
                  item?._id !== editItemId ? (
                    <tr key={item?._id}>
                      <td>{item?.product_name}</td>
                      <td>{item?.buyer_percentage}</td>
                      <td>{item?.seller_percentage}</td>
                      <td style={{ width: '10%' }}>{item?.unit}</td>
                      <td>
                        <div className="d-flex justify-content-between  align-items-center">
                          <MdDelete
                            size={20}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleDeleteProduct(item?._id)}
                          />
                          <MdEdit
                            size={20}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setEditItemId(item?._id);
                              setEditInputFields(item);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={item?._id}>
                      <td>
                        <Form.Control
                          type="text"
                          name="product_name"
                          style={{
                            width: '100%',
                            border: 'none',
                            borderRadius: '1px',
                          }}
                          placeholder="Name"
                          defaultValue={editInputFields?.product_name || ''}
                          onChange={onChangeProductEditInput}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          name="buyer_percentage"
                          style={{
                            width: '100%',
                            border: 'none',
                            borderRadius: '1px',
                          }}
                          placeholder="Buyer Rate"
                          defaultValue={editInputFields?.buyer_percentage || ''}
                          onChange={onChangeProductEditInput}
                        />
                      </td>
                      <td>
                        <Form.Control
                          name="seller_percentage"
                          type="number"
                          style={{
                            width: '100%',
                            border: 'none',
                            borderRadius: '1px',
                          }}
                          placeholder="Seller Rate"
                          defaultValue={
                            editInputFields?.seller_percentage || ''
                          }
                          onChange={onChangeProductEditInput}
                        />
                      </td>
                      <td>
                        <Form.Control
                          name="unit"
                          type="text"
                          style={{
                            width: '100%',
                            border: 'none',
                            borderRadius: '1px',
                          }}
                          placeholder="Unit"
                          defaultValue={editInputFields?.unit || ''}
                          onChange={onChangeProductEditInput}
                        />
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <div className="d-flex justify-content-between  align-items-center">
                          <FaCheck
                            size={18}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleEditProduct(item?._id)}
                          />
                          <ImCross
                            size={14}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setEditItemId('')}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </div>
        ) : (
          <Spinner animation="border" variant="dark" />
        )}

        {productList?.length <= 0 || !productList ? (
          <p className="mt-4 text-center ">No Products Found!</p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
