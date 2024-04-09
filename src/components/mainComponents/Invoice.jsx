import React, { useState, useEffect } from 'react';
import Select, { createFilter } from 'react-select';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
import axios from 'axios';
import PageHeading from '../helpers/PageHeading';
import Spinner from 'react-bootstrap/Spinner';
import { MdDelete } from 'react-icons/md';
import { MdSimCardDownload } from 'react-icons/md';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Invoice = () => {
  const [companyList, setCompanyList] = useState([]);
  const [noOfEntries, setNoOfEntries] = useState(null);
  const [entryList, setEntryList] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showNotFoundMessage, setShowNotFoundMessage] = useState(false);
  const [company, setCompany] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const onChangeBuyer = (selectedVal) => {
    setCompany(selectedVal?.value);
    getEntries(selectedVal?.value);
  };
  const getCompanyList = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_BASE_URL + '/api/company/getCompanyList'
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
  const getEntries = async (company) => {
    try {
      setShowLoader(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      let endPoint = '/api/entry/getEntryByCompanyName';
      let postData = { company };
      if (fromDate && toDate && fromDate !== '' && toDate !== '') {
        if (fromDate > toDate) {
          toast.warn('Invalid Date, Showing All Entries', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            theme: 'dark',
          });
        } else {
          endPoint = `/api/entry/getEntryByCompanyNameAndDate`;
          postData = { company, fromDate, toDate };
        }
      }
      const res = await axios.post(
        process.env.REACT_APP_BASE_URL + endPoint,
        postData,
        config
      );
      setEntryList(res?.data?.data?.entryList);
      if (res?.data?.data?.entryList.length > 0) {
        setShowNotFoundMessage(false);
      } else {
        setShowNotFoundMessage(true);
      }
      setShowLoader(false);
    } catch (err) {
      setShowLoader(false);
      console.log(err);
    }
  };
  const getAllEntries = async () => {
    try {
      setShowLoader(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      if (fromDate && toDate && fromDate !== '' && toDate !== '') {
        if (fromDate > toDate) {
          toast.warn('Invalid Date, Showing All Entries', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            theme: 'dark',
          });
        } else {
          const res = await axios.post(
            process.env.REACT_APP_BASE_URL + `/api/entry/getAllEntriesByDate`,
            { fromDate, toDate },
            config
          );
          setEntryList(res?.data?.data?.entryList);
          if (res?.data?.data?.entryList.length > 0) {
            setShowNotFoundMessage(false);
          } else {
            setShowNotFoundMessage(true);
          }
          setShowLoader(false);
         
        }
      }else{
        setShowLoader(false);
      }
    } catch (err) {
      setShowLoader(false);
      console.log(err);
    }
  };
  const formatDate = (date) => {
    const dateObj = new Date(date);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-GB', options);
    return formattedDate;
  };
  const deleteEntry = async (id, entryId) => {
    try {
      setShowLoader(true);
      await axios.delete(
        process.env.REACT_APP_BASE_URL +
          `/api/entry/deleteEntry/${id}/${entryId}`
      );
      getEntries(company);
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
  const generateInvoice = async () => {
    try {
      var linkToDownload = document.createElement('a');
      if (fromDate && toDate) {
        if (fromDate > toDate) {
          throw new Error('Invalid Date');
        }
        linkToDownload.href =
          process.env.REACT_APP_BASE_URL +
          `/api/entry/generateInvoice/${company}/${fromDate}/${toDate}`;
        linkToDownload.click();
      } else {
        linkToDownload.href =
          process.env.REACT_APP_BASE_URL +
          `/api/entry/generateInvoice/${company}`;
        linkToDownload.click();
      }
    } catch (err) {
      console.log(err);
      toast.warn(err.message, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: 'dark',
      });
    }
  };
  const getTotalEntries = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_BASE_URL + '/api/entry/getTotalEntries'
      );
      const num = res?.data?.data?.noOfEntries;
      setNoOfEntries(num);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCompanyList();
    getTotalEntries();
  }, []);

  useEffect(() => {
    if (company) {
      getEntries(company);
    } else {
      getAllEntries();
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    getTotalEntries();
  }, [company]);

  return (
    <div className="scroll-page">
      <PageHeading heading={'Invoice'} />
      {noOfEntries > 0 && (
        <p>
          <b>Total Entries :</b> {noOfEntries}
        </p>
      )}
      <label className="mb-1">Company</label>
      <div className="d-flex align-items-center justify-content-between ">
        <div className="d-flex align-items-center">
          <div style={{ width: '250px' }}>
            <Select
              className="fs--1"
              name="buyer"
              style={{ width: '180px !important' }}
              onChange={(data) => onChangeBuyer(data)}
              isSearchable={true}
              filterOption={createFilter(filterConfig)}
              options={companyList.map((option, index) => ({
                value: option.company_name,
                label: option.company_name,
                index: index + 1,
              }))}
              placeholder="Select Company"
            />
          </div>
          <div style={{ marginLeft: '0.7rem' }}>
            {entryList && entryList.length > 0 && (
              <MdSimCardDownload onClick={generateInvoice} size={35} />
            )}
          </div>
        </div>
        <div className="d-flex align-items-center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
              <DatePicker
                value={fromDate}
                onChange={(date) => setFromDate(date)}
                format="DD-MM-YYYY"
                label="From Date"
              />
            </DemoContainer>
          </LocalizationProvider>
          <div style={{ marginLeft: '2rem' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker', 'DatePicker']}>
                <DatePicker
                  value={toDate}
                  onChange={(date) => setToDate(date)}
                  format="DD-MM-YYYY"
                  label="To Date"
                  minDate={fromDate}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
      </div>
      <div className="table-container">
        {!showLoader ? (
          entryList &&
          entryList.length > 0 && (
            <div className="action-col-small mt-4">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Buyer Name</th>
                    <th>Seller Name</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Amount</th>
                    <th>Brokerage</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {entryList.map((item) => {
                    return (
                      <tr key={item?.id}>
                        <td>{formatDate(item?.date)}</td>
                        <td>{item?.buyer_name}</td>
                        <td>{item?.seller_name}</td>
                        <td>{item?.product}</td>
                        <td>{item?.quantity}</td>
                        <td>{item?.price}</td>
                        <td>{item?.amount}</td>
                        <td>{item?.brokerage}</td>
                        <td>
                          <MdDelete
                            onClick={() => {
                              deleteEntry(item?.id, item?.entryId);
                            }}
                            size={22}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )
        ) : (
          <Spinner animation="border" variant="dark" />
        )}
      </div>
      {showNotFoundMessage && !showLoader && (
        <div
          className="d-flex justify-content-center mt-4"
          style={{ position: 'absolute', top: '45%', left: '47%' }}
        >
          <p>No Items Found</p>
        </div>
      )}
    </div>
  );
};

export default Invoice;
