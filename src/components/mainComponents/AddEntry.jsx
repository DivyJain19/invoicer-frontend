import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import PageHeading from '../helpers/PageHeading';
import axios from 'axios';
import { IoMdAddCircle } from 'react-icons/io';
import { toast } from 'react-toastify';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

const AddEntry = () => {
  const [productList, setProductList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [buyer, setBuyer] = useState('');
  const [seller, setSeller] = useState('');

  const getProductList = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_BASE_URL + '/product/getProductList'
      );
      const list = res?.data?.data?.productList;
      setProductList(list);
    } catch (err) {
      console.log(err);
      toast.error('Something Went Wrong!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
    }
  };

  const getCompanyList = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_BASE_URL + '/company/getCompanyList'
      );
      const list = res?.data?.data?.companyList;
      setCompanyList(list);
    } catch (err) {
      console.log(err);
      toast.error('Something Went Wrong!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
    }
  };

  const onChangeBuyer = (selectedVal) => {
    setBuyer(selectedVal?.value);
  };

  const onChangeSeller = (selectedVal) => {
    setSeller(selectedVal?.value);
  };

  const handleAddEntry = () => {};

  useEffect(() => {
    getCompanyList();
    getProductList();
  }, []);

  return (
    <div>
      <PageHeading heading={'Add Entry'} />

      <div className="d-flex align-items-center">
        <div style={{ width: '250px' }}>
          <label className="mb-1">Buyer</label>
          <Select
            className="fs--1"
            name="buyer"
            style={{ width: '180px !important' }}
            onChange={(data) => onChangeBuyer(data)}
            isSearchable={true}
            options={companyList
              .filter((option) => {
                return option?.company_name !== seller;
              })
              .map((option, index) => ({
                value: option.company_name,
                label: option.company_name,
                index: index + 1,
              }))}
            placeholder="Select Buyer"
          />
        </div>
        <div style={{ width: '250px', marginLeft: '2rem' }}>
          <label className="mb-1">Seller</label>
          <Select
            className="fs--1"
            name="seller"
            style={{ width: '180px !important' }}
            onChange={(data) => onChangeSeller(data)}
            isSearchable={true}
            options={companyList
              .filter((option) => {
                return option?.company_name !== buyer;
              })
              .map((option, index) => ({
                value: option.company_name,
                label: option.company_name,
                index: index + 1,
              }))}
            placeholder="Select Seller"
          />
        </div>
      </div>
      <div style={{ width: '160px', marginTop: '1rem' }} className="widthLow">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateField']}>
            <DateField format="DD-MM-YYYY" className="date fs--1" />
          </DemoContainer>
        </LocalizationProvider>
      </div>

      <div className="mt-4">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Buyer Brokerage</th>
              <th>Seller Brokerage</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Select
                  className="fs--1"
                  name="product"
                  style={{ width: '180px !important' }}
                  isSearchable={true}
                  options={productList.map((option, index) => ({
                    value: option?.product_name,
                    label: option?.product_name,
                    buyer_percentage: option?.buyer_percentage,
                    seller_percentage: option?.seller_percentage,
                    index: index + 1,
                  }))}
                  placeholder="Select Item"
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  name="quantity"
                  style={{
                    borderRadius: '1px',
                  }}
                  placeholder="Quantity"
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  name="price"
                  style={{
                    borderRadius: '1px',
                  }}
                  placeholder="Price"
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  name="buyer_percentage"
                  style={{
                    borderRadius: '1px',
                  }}
                  placeholder="Buyer Rate"
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  name="seller_percentage"
                  style={{
                    borderRadius: '1px',
                  }}
                  placeholder="Seller Rate"
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  name="amount"
                  style={{
                    borderRadius: '1px',
                  }}
                  disabled={true}
                />
              </td>
              <td
                className="text-center"
                style={{ verticalAlign: 'middle', cursor: 'pointer' }}
              >
                <IoMdAddCircle size={26} onClick={handleAddEntry} />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AddEntry;
