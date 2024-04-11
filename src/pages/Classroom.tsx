import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../components/data-table/DataTableBase'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'react-toastify';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import memoize from 'memoize-one';

import { fetchAllClassrooms, createClassroom, getAttendance } from '@app/services/admin/classServices';


const Classroom = () => {

  const [open, setOpen] = React.useState(false);
  const [pending, setpending] = React.useState(true);
  const [pending2, setpending2] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [selectedClassroom, setSelectedClassroom] = React.useState<any>();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [link, setLink] = React.useState('');
  const [expiresOn, setExpiresOn] = React.useState();
  const [rows, setRows] = React.useState([]);
  const [attendance, setAttendance] = React.useState([]);



  const handleOpenAdd = () => {
    setOpenAdd(true);
  }

  const handleCloseAdd = () => {
    setOpenAdd(false);
  }
  const handleOpenEdit = async(id:any) => {
    setpending2(true);
    let attendance = await getAttendance(id);
    console.log(attendance);
    setAttendance(attendance.data);
    setpending2(false);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleButtonClick = (type: any, classroom: any) => {
    setSelectedClassroom(classroom);
    if (type === 'edit') {
      handleOpenEdit(classroom.id);
    } else {
      handleOpenDelete();
    }
  }

  const getClassrooms = async () => {
    const classrooms = await fetchAllClassrooms();
    setRows(classrooms.data);
    setpending(false);
    console.log(classrooms);
  }

  const createClassroomAction = async () => {
    setLoading(true);
    const data = {
      title: title,
      description: description,
      link: link,
      expires_on: expiresOn
    }
    console.log(data)
    const student = await createClassroom(data);
    console.log(student);
    toast.success('Student Created Successfully!');
    handleCloseAdd();
    getClassrooms();
    setLoading(false);



  }
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

  const style2 = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const columns = memoize(clickHandler => [
    { name: 'Title', selector: (row: any) => row.title },
    { name: 'Description', selector: (row: any) => row.description },
    { name: 'Link', selector: (row: any) => row.link },
    { name: 'Expiry', selector: (row: any) => row.expires_on },
    {

      cell: (row: any) => (<div><button className='btn btn-primary btn-sm' onClick={() => { clickHandler('edit', row) }}>View</button> </div>),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ])

  const columns2 = [
    { name: 'First Name', selector: (row: any) => row.profile.first_name },
    { name: 'Last Name', selector: (row: any) => row.profile.last_name },
    { name: 'Email', selector: (row: any) => row.email },
   
  ];


  useEffect(() => {
    getClassrooms();
  }, [])
  return (
    <div>
      <ContentHeader title="Classrooms" />
      <section className="content">

        <div className="container-fluid">
          <div className="d-grid gap-2 d-md-block py-2">
            <Button size='small' variant='outlined' startIcon={<AddIcon />} onClick={handleOpenAdd} className="btn btn-primary btn-sm float-right mx-1" type="button">Add</Button>
          </div>
          <DataTable columns={columns(handleButtonClick)} data={rows} progressPending={pending} responsive keyField='id' striped />
        </div>
      </section>
      <Footer />

      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">
        <Container sx={{
          ...style, borderRadius: '5px', paddingY: '1.5rem'
        }} maxWidth="lg" component="form" noValidate>
          <h5 id="child-modal-title" className='text-center my-3'>Create a Class</h5>
          <Container
            sx={{ marginTop: '1rem', marginBottom: '1rem', }}>

            <TextField
              id="outlined-controlled"
              size='small'
              label="Title"
              value={title}
              sx={{ marginRight: '1rem', marginY: '.5rem', width: '100%' }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(event.target.value);
              }}
            />
            <TextField
              id="outlined-controlled"
              label="Description"
              size='small'
              sx={{ marginRight: '1rem', marginY: '.5rem', width: '100%' }}


              value={description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDescription(event.target.value);
              }}
            />
          </Container>

          <Container
            sx={{ marginTop: '.5rem', marginBottom: '.5rem', }}>

            <TextField
              id="outlined-controlled"
              label="link"
              size='small'
              sx={{ marginRight: '1rem', marginY: '.5rem', width: '100%' }}



              value={link}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setLink(event.target.value);
              }}
            />
            <DateTimePicker
              sx={{ marginRight: '1rem', marginY: '.5rem', width: '100%', }}
              value={expiresOn}
              autoFocus
              // @ts-ignore
              onChange={(newValue) => setExpiresOn(newValue)}
              label="Link Expiry Date" />
          </Container>


          <br />
          <Box sx={{
            marginRight: "1rem",
            float: 'right'
          }}>
            <Button variant='outlined' size='small' sx={{
              marginRight: ".2rem"
            }} onClick={handleCloseAdd}>Cancel</Button>
            <Button variant='contained' size='small' onClick={createClassroomAction} disabled={loading}>Submit</Button>
          </Box>

          {/* <Button variant="outlined" onClick={handleClose}>Close Child Modal</Button> */}
        </Container>
      </Modal>


      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">
        <Container sx={{
          ...style2, borderRadius: '5px', paddingY: '1.5rem'
        }} maxWidth="lg" component="form" noValidate>
          <h5 id="child-modal-title" className='text-center my-3'>View Attendance</h5>
         

          <DataTable columns={columns2} data={attendance} progressPending={pending2} responsive keyField='id' striped />


          <Box sx={{
            marginRight: "1rem",
            float: 'right'
          }}>
            <Button variant='outlined' size='small' sx={{
              marginRight: ".2rem"
            }} onClick={handleCloseEdit}>Cancel</Button>
            <Button variant='contained' size='small' onClick={createClassroomAction} disabled={loading}>Submit</Button>
          </Box>

          {/* <Button variant="outlined" onClick={handleClose}>Close Child Modal</Button> */}
        </Container>
      </Modal>
    </div>
  );
};

export default Classroom;
