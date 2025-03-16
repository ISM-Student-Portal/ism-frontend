import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../../components/datatable-original/Datatable';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { toast } from 'react-toastify';

import { createStudent, updateStudentStatus, deleteStudent } from '@app/services/admin/studentServices';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, Switch } from '@mui/material';
import { ColorRing } from 'react-loader-spinner';
import { fetchCourseById } from '@app/services/admin/lecturerServices';
import { useParams } from 'react-router-dom';


const Course = () => {
    const [open, setOpen] = React.useState(false);
    const [pending, setpending] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [openAdd, setOpenAdd] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [editStudentStatus, setEditStudentStatus] = React.useState(false);
    const [editStudentSub, setEditStudentSub] = React.useState(false);
    const { id } = useParams();

    const [selectedStudent, setSelectedStudent] = React.useState<any>();
    const [filename, setFilename] = React.useState("");
    const [file, setFile] = React.useState(null);
    const [email, setEmail] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [regNo, setRegNo] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [course, setCourse] = React.useState<any>();

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenEdit = () => {
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
    const handleOpenAdd = () => {
        setOpenAdd(true);
    }

    const handleCloseAdd = () => {
        setOpenAdd(false);
    }
    const handleButtonClick = (type: any, student: any) => {
        setSelectedStudent(student);
        if (type === 'edit') {
            // await changeStudentPass(student.id);
            // toast.success('Student updated Successfully!');

            setEditStudentStatus(student.is_admin);
            setEditStudentSub(student.profile.subscription === 'premium')
            handleOpenEdit();
        } else {
            handleOpenDelete();
        }
    }

    const performActionEdit = async () => {
        setLoading(true);
        const res = await updateStudentStatus(selectedStudent?.id, { is_admin: editStudentStatus, subscription: editStudentSub ? 'premium' : 'basic' });
        if (res.status === 'success') {
            toast.success('Student updated Successfully!');
            handleCloseEdit();
            getCourse();
        }
        setLoading(false);
    }

    const performActionDelete = async () => {
        setLoading(true);
        const res = await deleteStudent(selectedStudent?.id, selectedStudent?.is_active);
        if (res.status === 'success') {
            toast.success('Student Deleted Successfully!');
            handleCloseDelete();
            getCourse();
        }
        setLoading(false);
    }

    const getCourse = async () => {
        const courses = await fetchCourseById(id);
        console.log(courses);
        setCourse(courses.course);
        setpending(false);
    }

    const createStudentAction = async () => {
        setLoading(true);
        const data = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phoneNumber,
            reg_no: regNo
        }
        const student = await createStudent(data);
        if (student.message === 'successful') {
            toast.success('Student Created Successfully!');
            handleCloseAdd();
            getCourse();
            setLoading(false);
        }
        else {
            toast.error('Something went wrong!');
        }

    }


    const handleChangeSub = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditStudentSub(event.target.checked);
    };




    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };




    useEffect(() => {
        getCourse();
    }, [])
    return (
        <div>
            {course ? (
                <div>
                    <h1 className='text-center'>{course.title}</h1>
                    <section className="content">
                        <h3>Description</h3>
                        <p>{course.description}</p>
                    </section>
                    <section className="content">

                        <div className="container-fluid card">

                            <h3 className='card-header'>Classrooms</h3>
                            <DataTable slots={{
                                4: (data: any, row: any) => (
                                    <div className='d-flex justify-content-center'>
                                        <span onClick={() => handleButtonClick('edit', row)} ><VisibilityIcon className='text-success mx-2 cursor-pointer' /></span>

                                    </div>

                                )
                            }} className='table table-striped table-bordered order-column dt-head-center' options={{
                                buttons: {
                                    buttons: ['copy', 'csv']
                                }
                            }} data={course.classrooms} columns={[{ data: 'title', title: 'Title' }, { data: 'link', title: 'Link' }, { data: 'description', title: 'Description' }, { data: 'expires_on', title: 'Expiry' }, { title: 'Action' }]}>

                            </DataTable>

                        </div>

                        <br /><br />


                        <div className="container-fluid card">

                            <h3 className='card-header'>Assignments</h3>
                            <DataTable slots={{
                                4: (data: any, row: any) => (
                                    <div className='d-flex justify-content-center'>
                                        <span onClick={() => handleButtonClick('edit', row)} ><VisibilityIcon className='text-success mx-2 cursor-pointer' /></span>

                                    </div>

                                )
                            }} className='table table-striped table-bordered order-column dt-head-center' options={{
                                buttons: {
                                    buttons: ['copy', 'csv']
                                }
                            }} data={course.assignments} columns={[{ data: 'title', title: 'Title' }, { data: 'link', title: 'Link' }, { data: 'description', title: 'Description' }, { data: 'expires_on', title: 'Expiry' }, { title: 'Action' }]}>

                            </DataTable>

                        </div>
                    </section>
                    <Footer />

                </div>
            ) : (<div className='h-100 d-flex align-items-center justify-content-center'><ColorRing
                visible={true}
                height="150"
                width="150"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}

            />Loading... Please wait </div>)}



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

                    <Container
                        sx={{ marginTop: '1rem', marginBottom: '1rem', display: 'flex' }}>

                        <TextField
                            id="outlined-controlled"
                            label="Reg No"
                            size='small'
                            sx={{ marginRight: '1rem' }}


                            value={regNo}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setRegNo(event.target.value);
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
                        <Button variant='contained' size='small' onClick={createStudentAction} disabled={loading}>Submit</Button>
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
                    ...style, borderRadius: '5px', paddingY: '1.5rem'
                }} maxWidth="lg" component="form" noValidate>
                    <h5 id="child-modal-title" className='text-center my-3'>Edit Student Status</h5>
                    <Container
                        sx={{ marginTop: '1rem', marginBottom: '1rem', display: 'flex' }}>

                        <TextField
                            id="outlined-controlled"
                            size='small'
                            label="Email"
                            value={selectedStudent?.email}
                            sx={{ marginRight: '1rem' }}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setEmail(event.target.value);
                            }}
                            disabled
                        />

                    </Container>

                    <Container
                        sx={{ marginTop: '1rem', marginBottom: '1rem', display: 'flex' }}>

                        <FormGroup>
                            {/* <FormControlLabel control={<Switch inputProps={{ 'aria-label': 'controlled' }} onChange={handleChangeStat} checked={editStudentStatus} />} label="Admin Status" /> */}
                            <FormControlLabel control={<Switch inputProps={{ 'aria-label': 'controlled' }} onChange={handleChangeSub} checked={editStudentSub} />} label="Premium Subscription" />
                        </FormGroup>
                    </Container>


                    <br />
                    <Box sx={{
                        marginRight: "1rem",
                        float: 'right'
                    }}>
                        <Button variant='outlined' size='small' sx={{
                            marginRight: ".2rem"
                        }} onClick={handleCloseEdit}>Cancel</Button>
                        <Button variant='contained' size='small' onClick={performActionEdit} disabled={loading}>Submit</Button>
                    </Box>

                    {/* <Button variant="outlined" onClick={handleClose}>Close Child Modal</Button> */}
                </Container>
            </Modal>




            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description">

                <DialogTitle align='center' variant='h5'>Set Student Inactive</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to <b>{selectedStudent?.is_active ? 'deactivate' : 'reactivate'}</b> student <b>{selectedStudent?.profile?.first_name}</b>?</DialogContentText>
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

export default Course;
