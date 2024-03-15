import React, { useState, useEffect } from 'react';
import Select, { createFilter } from 'react-select';
import PageHeading from '../helpers/PageHeading';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { IoMdAddCircle } from 'react-icons/io';
import { toast } from 'react-toastify';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { MdDelete } from 'react-icons/md';
import dayjs from 'dayjs';

const AddEntry = () => {
  const [productList, setProductList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [buyer, setBuyer] = useState('');
  const [seller, setSeller] = useState('');
  const [buyerDropdown, setBuyerDropdown] = useState(null);
  const [sellerDropdown, setSellerDropdown] = useState(null);
  const [date, setDate] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  // Entry States
  const [product, setProduct] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [buyerBrokerage, setBuyerBrokerage] = useState('');
  const [sellerBrokerage, setSellerBrokerage] = useState('');
  const [addItemsData, setAddItemsData] = useState([]);

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

  const filterConfig = {
    matchFrom: 'start',
  };

  const onChangeBuyer = (selectedVal) => {
    setBuyerDropdown(selectedVal);
    setBuyer(selectedVal?.value);
  };

  const onChangeSeller = (selectedVal) => {
    setSellerDropdown(selectedVal);
    setSeller(selectedVal?.value);
  };

  const onChangeDate = (e) => {
    const dateObj = new Date(e);
    setDate(dateObj);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const formattedDateString = `${year}-${month}-${day}`;
    setFormattedDate(dayjs(formattedDateString));
  };

  const handleAddEntry = () => {
    if (productName === '' || productName === undefined) {
      toast.warn('Please Select A Product', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
    } else if (
      quantity === '' ||
      quantity === undefined ||
      parseInt(quantity) < 0
    ) {
      toast.warn('Enter Quantity', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
    } else if (price === '' || price === undefined || parseInt(price) < 0) {
      toast.warn('Enter Price', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
    } else if (parseInt(buyerBrokerage) < 0) {
      toast.warn('Buyer Brokerage cannot be less than 0', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
    } else if (parseInt(sellerBrokerage) < 0) {
      toast.warn('Seller Brokerage cannot be less than 0', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
    } else {
      setAddItemsData((prev) => {
        let obj = {
          id: uuidv4(),
          productName,
          quantity,
          price,
          buyer_percentage: buyerBrokerage,
          buyerBrokerage: parseInt(buyerBrokerage) * parseInt(quantity),
          sellerBrokerage: parseInt(sellerBrokerage) * parseInt(quantity),
          seller_percentage: sellerBrokerage,
          amount: parseInt(price) * parseInt(quantity),
        };
        return [...prev, obj];
      });
      setProduct('');
      setProductName('');
      setQuantity('');
      setPrice('');
      setBuyerBrokerage('');
      setSellerBrokerage('');
    }
  };

  const handleDeleteEntry = (id) => {
    const filteredArray = addItemsData?.filter((item) => item?.id !== id);
    setAddItemsData(filteredArray);
  };

  const postEntries = async () => {
    if (buyer === '' || buyer === undefined) {
      toast.warn('Please Select A Buyer', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
    } else if (seller === '' || seller === undefined) {
      toast.warn('Please Select A Buyer', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
    } else if (date === null || date === undefined) {
      toast.warn('Please Select A Date', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
    } else if (addItemsData.length <= 0) {
      toast.warn('No Entries Found', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
    } else {
      try {
        let obj = {
          buyer_name: buyer,
          seller_name: seller,
          entryDate: date,
          entries: addItemsData,
        };
        const config = {
          headers: {
            'Content-type': 'application/json',
          },
        };
        const res = await axios.post(
          process.env.REACT_APP_BASE_URL + '/entry/addEntry',
          obj,
          config
        );
        console.log(res);
        if (res.data.data.message === 'Success') {
          toast.success('Entry Added Successfully', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            theme: 'light',
          });
          setBuyerDropdown(null);
          setSellerDropdown(null);
          setBuyer('');
          setSeller('');
          setProduct('');
          setProductName('');
          setQuantity('');
          setPrice('');
          setBuyerBrokerage('');
          setSellerBrokerage('');
          setAddItemsData([]);
        } else {
          toast.warn('Something went wrong!', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            theme: 'dark',
          });
        }
      } catch (err) {
        console.log(err);
        toast.warn('Something went wrong!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          theme: 'dark',
        });
      }
    }
  };

  const getLastEntryDate = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_BASE_URL + '/entry/getLastEntryDate'
      );
      const originalDateString = res?.data?.data?.date;
      const originalDate = new Date(originalDateString);
      setDate(originalDate);
      const year = originalDate.getFullYear();
      const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
      const day = originalDate.getDate().toString().padStart(2, '0');
      const formattedDateString = `${year}-${month}-${day}`;
      setFormattedDate(dayjs(formattedDateString));
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
  
  useEffect(() => {
    getCompanyList();
    getProductList();
    getLastEntryDate();
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
            value={buyerDropdown}
            isSearchable={true}
            filterOption={createFilter(filterConfig)}
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
            value={sellerDropdown}
            isSearchable={true}
            filterOption={createFilter(filterConfig)}
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
      <div style={{ marginTop: '1rem' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              onChange={onChangeDate}
              value={formattedDate}
              format="DD-MM-YYYY"
              placeholder="Enter Date"
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>

      <div className="mt-4">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Buyer Brokerage</th>
              <th>Seller Brokerage</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {addItemsData?.length > 0 &&
              addItemsData.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>
                      <Form.Control
                        type="text"
                        name="product"
                        style={{
                          borderRadius: '1px',
                        }}
                        value={item?.productName}
                        disabled={true}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        name="quantity"
                        style={{
                          borderRadius: '1px',
                        }}
                        value={item?.quantity}
                        disabled={true}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        name="price"
                        style={{
                          borderRadius: '1px',
                        }}
                        value={item?.price}
                        disabled={true}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        name="buyer_percentage"
                        style={{
                          borderRadius: '1px',
                        }}
                        value={item?.buyer_percentage}
                        disabled={true}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        name="seller_percentage"
                        style={{
                          borderRadius: '1px',
                        }}
                        value={item?.seller_percentage}
                        disabled={true}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        name="amount"
                        style={{
                          borderRadius: '1px',
                        }}
                        value={item?.amount}
                        disabled={true}
                      />
                    </td>
                    <td
                      className="text-center"
                      style={{ verticalAlign: 'middle', cursor: 'pointer' }}
                    >
                      <MdDelete
                        size={26}
                        onClick={() => handleDeleteEntry(item?.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            <tr>
              <td>
                <Select
                  className="fs--1"
                  name="product"
                  style={{ width: '200px !important' }}
                  isSearchable={true}
                  value={product}
                  onChange={(data) => {
                    setProduct(data);
                    setProductName(data?.value);
                    setBuyerBrokerage(data?.buyer_percentage === 0 ? "" : data?.buyer_percentage);
                    setSellerBrokerage(data?.seller_percentage === 0 ? "" : data?.seller_percentage);
                  }}
                  options={productList?.map((option, index) => ({
                    value: option?.product_name,
                    label: option?.product_name,
                    buyer_percentage: option?.buyer_percentage,
                    seller_percentage: option?.seller_percentage,
                    index: index + 1,
                  }))}
                  placeholder="Select Product"
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  name="quantity"
                  onChange={(e) => setQuantity(e.target.value)}
                  value={quantity}
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
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
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
                  onChange={(e) => setBuyerBrokerage(e.target.value)}
                  value={buyerBrokerage}
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
                  onChange={(e) => setSellerBrokerage(e.target.value)}
                  value={sellerBrokerage}
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
                  value={
                    quantity && price && parseInt(quantity) * parseInt(price)
                  }
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
        <div className="text-end">
          <button
            className="px-5 py-2 mt-3"
            style={{
              backgroundColor: 'lightskyblue',
              border: '0.5px solid black',
            }}
            onClick={postEntries}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEntry;
