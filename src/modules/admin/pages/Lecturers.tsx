import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../../components/datatable-original/Datatable';
import React, { useEffect } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';

import { toast } from 'react-toastify';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


import { deactivateLecturer } from '@app/services/admin/studentServices';
import { ColorRing } from 'react-loader-spinner';
import { fetchAllLecturers, inviteLecturer } from '@app/services/admin/lecturerServices';
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';


const Lecturers = () => {
    const [open, setOpen] = React.useState(false);
    const [pending, setpending] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [openAdd, setOpenAdd] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [editStudentStatus, setEditStudentStatus] = React.useState(false);
    const [editStudentSub, setEditStudentSub] = React.useState(false);

    const [selectedStudent, setSelectedStudent] = React.useState<any>();

    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [regNo, setRegNo] = React.useState('');
    const [rows, setRows] = React.useState([]);

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

    const deactivateLecturerAction = async () => {
        setLoading(true);

        const student = await deactivateLecturer(selectedStudent.id);
        if (student.message === 'successful') {
            student.lecturer.is_active ? toast.success('Lecturer Activated Successfully!') : toast.success('Lecturer Deactivated Successfully!');
            handleCloseDelete();
            getLecturers();
            setLoading(false);
        }
        else {
            toast.error('Something went wrong!');
        }

    }


    const getLecturers = async () => {
        try {
            setLoading(true)
            const lecturers = await fetchAllLecturers();
            setRows(lecturers.lecturers);
        }
        catch (error) {

        }
        finally {
            setLoading(false)
        }

    }

    const createLecturer = async () => {
        try {
            setLoading(true);
            const data = {
                email: email,
                username: username,
                phone: phone,

            }
            const student = await inviteLecturer(data);
            if (student.message === 'successful') {
                toast.success('Invitation sent Successfully!');
                handleCloseAdd();
                getLecturers();
                setLoading(false);
            }
            else {
                toast.error('Something went wrong!');
            }

        } catch (error) {
            toast.error('Something went wrong!');
        }
        finally {
            setLoading(false);
        }


    }





    useEffect(() => {
        getLecturers();
    }, [])
    return (
        <div>
            <ContentHeader title="Lecturers" />
            <section className="content">

                <div className="container-fluid">
                    {!loading ? (
                        <div>
                            <div className="d-grid gap-2 d-md-block py-2 my-5">
                                <Button size='sm' variant='warning' onClick={handleOpenAdd} className="float-right mx-1" type="button">Invite Lecturer</Button>
                            </div>
                            <div></div>
                            <DataTable slots={{
                                3: (data: any, row: any) => (
                                    row.is_active ? (
                                        <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>Deactivate</Tooltip>}>
                                            <Button as="span" variant='outline-light' size='sm' onClick={() => handleButtonClick('delete', row)}><DeleteIcon className='text-danger mx-2 pointer' /></Button>

                                        </OverlayTrigger>
                                    ) : (
                                        <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>Activate</Tooltip>}>
                                            <Button as="span" variant='outline-light' size='sm' onClick={() => handleButtonClick('delete', row)}><AddCircleOutlineIcon className='text-success mx-2 pointer' /></Button>

                                        </OverlayTrigger>
                                    )

                                )
                            }} className='table table-striped table-bordered order-column dt-head-center' options={{
                                buttons: {
                                    buttons: ['copy', 'csv']
                                }
                            }} data={rows} columns={[{ data: 'email', title: 'Email' }, { data: 'username', title: 'Username' }, { data: 'phone_number', title: 'Phone' }, { title: 'Action' }]}>

                            </DataTable></div>
                    ) : (<div className='h-100 d-flex align-items-center justify-content-center'><ColorRing
                        visible={true}
                        height="150"
                        width="150"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}

                    />Loading... Please wait </div>)}


                </div>
            </section>
            <Footer />

            <Modal show={openAdd} onHide={handleCloseAdd} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Invite Lecturer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId='classform.title'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='text' required placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='classform.description'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control placeholder='username' required value={username} onChange={(e) => setUsername(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='classform.link'>
                            <Form.Label>Phone number</Form.Label>
                            <Form.Control type='text' placeholder='Phone' required value={phone} onChange={(e) => setPhone(e.target.value)}></Form.Control>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="warning" onClick={createLecturer} disabled={loading} >
                        Send
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={openDelete} onHide={handleCloseDelete} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedStudent?.is_active ? 'Confirm Deactivation' : 'Confirm Activation'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to {selectedStudent?.is_active ? 'deactivate' : 'activate'} {selectedStudent?.username}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deactivateLecturerAction} disabled={loading} >
                        Yes
                    </Button>
                </Modal.Footer>

            </Modal>

        </div>
    );
};

export default Lecturers;
