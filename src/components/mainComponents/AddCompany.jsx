import React, { useState, useEffect, useRef } from 'react';
import PageHeading from '../helpers/PageHeading';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { Button, Modal, CloseButton } from 'react-bootstrap';
import { IoMdAddCircle } from 'react-icons/io';
import { MdDelete, MdEdit } from 'react-icons/md';
import { ImCross } from 'react-icons/im';
import { FaCheck } from 'react-icons/fa';
import { FcDocument } from 'react-icons/fc';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const AddCompany = () => {
  const [companyList, setCompanyList] = useState([]);
  const [inputFields, setInputFields] = useState({});
  const [editInputFields, setEditInputFields] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [excelUploadLoader, setExcelUploadLoader] = useState(false);
  const [editItemId, setEditItemId] = useState('');
  const [excelModalShow, setExcelModalShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelData, setExcelData] = useState([]);

  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const convertToJson = (data) => {
    const rows = [];
    data.forEach((row) => {
      let rowData = {};
      rowData['company_name'] = row[0];
      rowData['location'] = row[1] === 'N' ? '' : row[1];
      rows.push(rowData);
    });
    return rows;
  };

  const importExcel = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => {
      const bstr = event.target.result;
      const workBook = XLSX.read(bstr, { type: 'binary' });
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      const headers = fileData[0];
      if (headers.length !== 2) {
        toast.warn('Wrong file selected!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          theme: 'dark',
        });
        e.target.value = '';
      } else {
        if (
          headers[0].trim() !== 'Company Name' ||
          headers[1].trim() !== 'Location'
        ) {
          toast.warn('Invalid file format!', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            theme: 'dark',
          });
          e.target.value = '';
        } else {
          if (fileData.length > 1) {
            fileData.splice(0, 1);
            setExcelData(convertToJson(fileData));
          }
        }
      }
    };
  };

  const uploadExcel = async () => {
    if (excelData.length > 0) {
      try {
        setExcelUploadLoader(true);
        const config = {
          headers: {
            'Content-type': 'application/json',
          },
        };
        const res = await axios.post(
          process.env.REACT_APP_BASE_URL + '/company/uploadCompanyExcel',
          { list: excelData },
          config
        );
        console.log(res);
        toast.success(res.data.message, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          theme: 'light',
        });
        setExcelUploadLoader(false);
        setExcelModalShow(false);
        setExcelData([]);
        setSelectedFile(null);
        getCompanyList();
      } catch (err) {
        setExcelUploadLoader(false);
        console.log(err);
        toast.warn(err?.response?.data?.message, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          theme: 'dark',
        });
      }
    } else {
      toast.warn('No Data Found in the Excel', {
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
      setShowLoader(true);
      const res = await axios.get(
        process.env.REACT_APP_BASE_URL + '/company/getCompanyList'
      );
      const list = res?.data?.data?.companyList;
      setCompanyList(list);
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

  const onChangeCompanyInput = (e) => {
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
      inputFields?.company_name === '' ||
      inputFields?.company_name === undefined
    ) {
      toast.warn('Company Name Required', {
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

  const handleAddCompany = async () => {
    if (validateFields(inputFields)) {
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
          },
        };
        await axios.post(
          process.env.REACT_APP_BASE_URL + '/company/addCompany',
          inputFields,
          config
        );
        getCompanyList();
        setInputFields({});
      } catch (err) {
        console.log(err);
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

  const handleDeleteCompany = async (id) => {
    try {
      setShowLoader(true);
      await axios.delete(
        process.env.REACT_APP_BASE_URL + `/company/deleteCompany/${id}`
      );
      await getCompanyList();
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
          process.env.REACT_APP_BASE_URL + `/company/editCompany/${id}`,
          editInputFields,
          config
        );
        await getCompanyList();
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
    getCompanyList();
  }, []);
  return (
    <div className="scroll-page">
      <PageHeading heading="Company" />
      <div className="d-flex align-items-center mb-3">
        <p style={{ fontWeight: 'bolder', margin: '0 0.7rem 0 0' }}>
          Add Company
        </p>
        <FcDocument
          size={25}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setExcelModalShow(true);
          }}
        />
      </div>

      <Table striped bordered>
        <tbody>
          <tr>
            <td>
              <Form.Control
                type="text"
                name="company_name"
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '1px',
                }}
                placeholder="Company Name"
                value={inputFields?.company_name || ''}
                onChange={onChangeCompanyInput}
              />
            </td>
            <td>
              <Form.Control
                type="text"
                name="location"
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '1px',
                }}
                placeholder="Location"
                value={inputFields?.location || ''}
                onChange={onChangeCompanyInput}
              />
            </td>

            <td
              className="text-center"
              style={{ verticalAlign: 'middle', cursor: 'pointer' }}
            >
              <IoMdAddCircle size={26} onClick={handleAddCompany} />
            </td>
          </tr>
        </tbody>
      </Table>
      <div className="d-flex">
        <p style={{ fontWeight: 'bolder' }}>Company List</p>
        <span className='mx-1'>({companyList?.length} Companies)</span>
      </div>
      <div className="table-container">
        {!showLoader ? (
          <div className="action-col-small">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {companyList?.map((item) =>
                  item?._id !== editItemId ? (
                    <tr key={item?._id}>
                      <td>{item?.company_name}</td>
                      <td>{item?.location}</td>
                      <td>
                        <div className="d-flex justify-content-between  align-items-center">
                          <MdDelete
                            size={20}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleDeleteCompany(item?._id)}
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
                          name="company_name"
                          style={{
                            width: '100%',
                            border: 'none',
                            borderRadius: '1px',
                          }}
                          placeholder="Name"
                          defaultValue={editInputFields?.company_name || ''}
                          onChange={onChangeProductEditInput}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          name="location"
                          style={{
                            width: '100%',
                            border: 'none',
                            borderRadius: '1px',
                          }}
                          placeholder="Location"
                          defaultValue={editInputFields?.location || ''}
                          onChange={onChangeProductEditInput}
                        />
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <div className="d-flex justify-content-between  align-items-center">
                          <FaCheck
                            size={16}
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

        {companyList?.length <= 0 || !companyList ? (
          <p className="mt-4 text-center ">No Products Found!</p>
        ) : (
          <></>
        )}
      </div>
      <div>
        <Modal
          show={excelModalShow}
          onHide={() => {
            setExcelModalShow(false);
            setSelectedFile(null);
          }}
          size="md"
          aria-labelledby="Excelmodal"
          centered
          backdrop="static"
          keyboard={false}
        >
          <div className="text-end">
            <CloseButton
              className="shadow-none mt-2 me-2"
              onClick={() => {
                setExcelModalShow(false);
                setSelectedFile(null);
              }}
            />
          </div>
          <Modal.Title id="Templatemodal"></Modal.Title>
          <Modal.Body id="Excelmodal">
            <div className="mt-1 text-center">
              <Form.Control
                style={{ display: 'none' }}
                type="file"
                ref={hiddenFileInput}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={(e) => importExcel(e)}
              />
              <p
                style={{
                  cursor: 'pointer',
                  padding: '2.5rem',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  margin: '0 2rem 1rem 2rem',
                  border: '1px dotted black',
                }}
                onClick={handleClick}
              >
                Choose a file to upload
              </p>
            </div>
            <div className="text-center mt-2">
              <span id="selected_Name">{selectedFile?.name}</span>
            </div>
            <div className="mb-2 border-0 m-0 p-0 gap-2 mt-4 d-flex justify-content-center">
              {excelUploadLoader ? (
                'Uploading...'
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    uploadExcel();
                  }}
                  style={{
                    backgroundColor: 'lightskyblue',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '0.4rem 1rem',
                  }}
                >
                  UPLOAD
                </Button>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default AddCompany;
