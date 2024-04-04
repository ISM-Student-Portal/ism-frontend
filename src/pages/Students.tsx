import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../components/data-table/DataTableBase'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddIcon from '@mui/icons-material/Add'
import UploadIcon from '@mui/icons-material/Upload'
import { toast } from 'react-toastify';


import { ChangeEvent, useState } from "react";
import { fetchAllStudents, createStudent } from '@app/services/admin/studentServices';


const Students = () => {

  const [open, setOpen] = React.useState(false);
  const [pending, setpending] = React.useState(true);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [filename, setFilename] = React.useState("");
  const [email, setEmail] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [rows, setRows] = React.useState([]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpenAdd = () => {
    setOpenAdd(true);
  }

  const handleCloseAdd = () => {
    setOpenAdd(false);
  }

  const getStudents = async () => {
    const students = await fetchAllStudents();
    setRows(students.students);
    setpending(false);
    console.log(students);
  }

  const createStudentAction = async () => {
    const data = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber
    }
    const student = await createStudent(data);
    console.log(student);
    toast.success('Student is Successful!');
    handleCloseAdd();
    getStudents();


  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const { name } = file;
    setFilename(name);
  };
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const columns = [
    { name: 'id', selector: (row: any) => row.id },

    { name: 'First Name', selector: (row: any) => row.profile.first_name },
    { name: 'Last Name', selector: (row: any) => row.profile.last_name },
    { name: 'Email', selector: (row: any) => row.email },
    { name: 'Phone', selector: (row: any) => row.profile.phone },
    { name: 'Subscription', selector: (row: any) => row.profile.subscription },

    { name: 'Gender', selector: (row: any) => row.profile.gender },
  ];
  const data = [
    {
      first_name: "Ommodamola",
      last_name: "Oladeji"
    },
    {
      name: "Gbemisola"
    }
  ];

  useEffect(() => {
    getStudents();
  }, [])
  return (
    <div>
      <ContentHeader title="Students" />
      <section className="content">

        <div className="container-fluid">
          <div className="d-grid gap-2 d-md-block py-2">
            <Button size='small' variant='outlined' startIcon={<UploadIcon />} onClick={handleOpen} className="btn btn-primary btn-sm float-right" type="button">Upload</Button>
            <Button size='small' variant='outlined' startIcon={<AddIcon />} onClick={handleOpenAdd} className="btn btn-primary btn-sm float-right mx-1" type="button">Add</Button>
          </div>
          <DataTable columns={columns} data={rows} progressPending={pending} responsive/>
        </div>
      </section>
      <Footer />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">
        <Box sx={{ ...style, width: '50%', borderRadius: '5px' }}>
          <h4 id="child-modal-title" className='text-center text-'>Upload sheet</h4>

          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileIcon />}
            sx={{ marginRight: "1rem" }}
          >
            Upload File
            <input
              type="file"
              hidden
              onChange={handleFileUpload}
            />
          </Button>
          <span>{filename}</span>
          <br />

          {/* <Button variant="outlined" onClick={handleClose}>Close Child Modal</Button> */}
          <div className='text-right my-2'>
            <Button variant='outlined' size='small' sx={{
              marginRight: ".2rem"
            }} onClick={handleClose}>Cancel</Button>
            <Button variant='contained' size='small'>Submit</Button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">
        <Container sx={{
          ...style, borderRadius: '5px', paddingY: '1.5rem'
        }} maxWidth="lg" component="form" noValidate>
          <h5 id="child-modal-title" className='text-center my-3'>Create Student Form</h5>
          <Container
            sx={{ marginTop: '1rem', marginBottom: '1rem', display: 'flex' }}>

            <TextField
              id="outlined-controlled"
              size='small'
              label="Email"
              value={email}
              sx={{ marginRight: '1rem' }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(event.target.value);
              }}
            />
            <TextField
              id="outlined-controlled"
              label="First Name"
              size='small'

              value={firstName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFirstName(event.target.value);
              }}
            />
          </Container>

          <Container
            sx={{ marginTop: '1rem', marginBottom: '1rem', display: 'flex' }}>

            <TextField
              id="outlined-controlled"
              label="Last Name"
              size='small'
              sx={{ marginRight: '1rem' }}


              value={lastName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setLastName(event.target.value);
              }}
            />
            <TextField
              id="outlined-controlled"
              label="Phone Number"
              size='small'

              value={phoneNumber}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPhoneNumber(event.target.value);
              }}
            />
          </Container>


          <br />
          <Box sx={{
            marginRight: "1rem",
            float: 'right'
          }}>
            <Button variant='outlined' size='small' sx={{
              marginRight: ".2rem"
            }} onClick={handleCloseAdd}>Cancel</Button>
            <Button variant='contained' size='small' onClick={createStudentAction}>Submit</Button>
          </Box>

          {/* <Button variant="outlined" onClick={handleClose}>Close Child Modal</Button> */}
        </Container>
      </Modal>
    </div>
  );
};

export default Students;
