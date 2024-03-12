import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import PageHeading from '../helpers/PageHeading';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';

const AddEntry = () => {
  const [companyList, setCompanyList] = useState([]);
  const [buyer, setBuyer] = useState('');
  const [seller, setSeller] = useState('');

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

  useEffect(() => {
    getCompanyList();
  }, []);

  return (
    <div>
      <PageHeading heading={'Add Entry'} />

      <div className="d-flex align-items-center">
        <div style={{ width: '250px' }}>
          <label className='mb-1'>Buyer</label>
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
          <label className='mb-1'>Seller</label>
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
            <DateField format="DD-MM-YYYY" className="date fs--1 " />
          </DemoContainer>
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default AddEntry;
