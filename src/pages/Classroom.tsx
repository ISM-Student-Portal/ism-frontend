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

import { fetchAllClassrooms, createClassroom, getAttendance, deleteClassroom } from '@app/services/admin/classServices';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import moment from 'moment';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';



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
  const [expiresOn, setExpiresOn] = React.useState<any>();
  const [rows, setRows] = React.useState([]);
  const [attendance, setAttendance] = React.useState([]);


  const profile = useSelector((state: any) => state.profile.profile);

  const handleOpenAdd = () => {
    setOpenAdd(true);
  }

  const handleCloseAdd = () => {
    setOpenAdd(false);
  }
  const handleOpenEdit = async (id: any) => {
    setpending2(true);
    let attendance = await getAttendance(id);
    setAttendance(attendance.data);
    setpending2(false);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const downloadAttendance = async () => {
    setLoading(true)
    axios.get('/attendance-export/' + selectedClassroom.id, { responseType: 'blob' }).then((res: any) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Attendance.xlsx'); //or any other extension
      document.body.appendChild(link);
      link.click();
      toast.success("Request was successful");

    }).finally(() => {
      setLoading(false);
    })
  }

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
  }
  const performActionDelete = async () => {
    setLoading(true);
    const res = await deleteClassroom(selectedClassroom?.id);
    if (res.status === 'Success') {
      toast.success('Class Deleted Successfully!');
      handleCloseDelete();
      getClassrooms();

    }
    setLoading(false);
  }


  const createClassroomAction = async () => {
    setLoading(true);
    const data = {
      title: title,
      description: description,
      link: link,
      expires_on: expiresOn
    }
    const student = await createClassroom(data);
    toast.success('Class Created Successfully!');
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
    { name: 'Link', selector: (row: any) => (<a target='_blank' href={row.link}>{row.link}</a>) },
    {
      name: 'Action',

      cell: (row: any) => (<div><button className='btn btn-primary btn-sm p-1' title='View Attendance' onClick={() => { clickHandler('edit', row) }}>View</button> {profile.is_superadmin ? (<button className='btn p-1 btn-danger btn-sm' onClick={() => { clickHandler('delete', row) }} title='Delete Class'>Delete</button>) : (<span></span>)}</div>),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ])

  const columns2 = [
    { name: 'First Name', selector: (row: any) => row.profile?.first_name },
    { name: 'Last Name', selector: (row: any) => row.profile?.last_name },
    { name: 'Email', selector: (row: any) => row.email },
    { name: 'Matric No', selector: (row: any) => row.reg_no },

    { name: 'Clock-in Time', selector: (row: any) => moment(row.attendance_user?.created_at).toString() }

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
            sx={{ marginTop: '.5rem', marginBottom: '.5rem', }}>

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

            <DateTimePicker label="Attendance Deadline"
              value={expiresOn}
              onChange={(newValue) => setExpiresOn(newValue)}></DateTimePicker>

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
            <Button variant='contained' size='small' onClick={downloadAttendance} disabled={loading}>Download Attendance</Button>
          </Box>

          {/* <Button variant="outlined" onClick={handleClose}>Close Child Modal</Button> */}
        </Container>
      </Modal>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">

        <DialogTitle align='center' variant='h5'>Delete Class</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to <b>delete</b> {selectedClassroom?.title}</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button variant='outlined' size='small' sx={{
            marginRight: ".2rem"
          }} onClick={handleCloseDelete}>Cancel</Button>
          <Button variant='contained' size='small' color='error' onClick={performActionDelete} disabled={loading}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Classroom;
