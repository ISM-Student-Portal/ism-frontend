import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../../components/datatable-original/Datatable';
import React, { useEffect } from 'react';

import { toast } from 'react-toastify';

import { ColorRing } from 'react-loader-spinner';
import { fetchAllLecturers } from '@app/services/admin/lecturerServices';
import { createCourse, deleteCourse, fetchAllCourses, updateCourse } from '@app/services/admin/courseServices';
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';


const Courses = () => {

    const [editMode, setEditMode] = React.useState(false);
    const [lecturers, setLecturers] = React.useState([]);
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [lecturerId, setLecturerId] = React.useState('');
    const [selectedCourse, setSelectedCourse] = React.useState<any>();
    const [rows, setRows] = React.useState([]);
    const [pending, setpending] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [openAdd, setOpenAdd] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);

    const navigate = useNavigate();



    const handleOpenAdd = () => {
        setOpenAdd(true);
    };

    const handleOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const handleCloseAdd = () => {
        setOpenAdd(false);
    };

    const handleButtonClick = (action: string, row: any) => {
        if (action === 'edit') {
            console.log(row);
            setTitle(row.title);
            setDescription(row.description);
            setLecturerId(row.lecturer_id);
            setSelectedCourse(row);
            setEditMode(true);
            handleOpenAdd();
        }
        else if (action === 'delete') {
            setSelectedCourse(row);

            handleOpenDelete()
        }
    }




    const getCourses = async () => {
        try {

            setLoading(true);
            const courses = await fetchAllCourses();
            setRows(courses.courses);
            setpending(false);
        } catch (error) {

        }
        finally {
            setLoading(false);
        }
    }

    const createCourseAction = async () => {
        setLoading(true);
        const data = {
            title,
            description,
            lecturer_id: lecturerId
        }
        if (editMode) {
            let res = await updateCourse(data, selectedCourse.id);
            if (res.message === 'successful') {
                toast.success('Course Updated Successfully!');
                handleCloseAdd();
                getCourses();
                setLoading(false);
            }
            else {
                toast.error('Something went wrong!');
            }
        } else {
            const student = await createCourse(data);
            if (student.message === 'successful') {
                toast.success('Student Created Successfully!');
                handleCloseAdd();
                getCourses();
                setLoading(false);
            }
            else {
                toast.error('Something went wrong!');
            }
        }
        setLoading(false);


    }

    const deleteCourseAction = async () => {
        setLoading(true);
        const res = await deleteCourse(selectedCourse.id);
        if (res.message === 'successful') {
            toast.success('Course Deleted Successfully!');
            handleCloseDelete();
            getCourses();
        }
        setLoading(false);
    }

    const getLecturers = async () => {
        const lecturers = await fetchAllLecturers();
        setLecturers(lecturers.lecturers);
        setpending(false);
    }













    useEffect(() => {
        getCourses();
        getLecturers();
    }, [])
    return (
        <div>
            <ContentHeader title="Courses" />
            <section className="content">

                <div className="container-fluid">
                    {!loading ? (
                        <div>
                            <div className="d-grid gap-2 d-md-block py-2 my-5">
                                <Button size='sm' variant='warning' onClick={handleOpenAdd} className="float-right mx-1" type="button">Create Course</Button>

                            </div>
                            <div></div>
                            <DataTable slots={{
                                3: (data: any, row: any) => (
                                    <div className='d-flex '>
                                        <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>View Course</Tooltip>}>
                                            <Button as="span" variant='outline-light' size='sm' onClick={() => navigate('/admin/courses/' + row.id)}><VisibilityIcon className='text-success mx-2 pointer' /></Button>

                                        </OverlayTrigger>
                                        <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>Edit</Tooltip>}>
                                            <Button disabled={row.attendance?.students.length < 1} as="span" variant='outline-light' size='sm' onClick={() => handleButtonClick('edit', row)}><EditIcon className='text-warning mx-2 pointer' /></Button>

                                        </OverlayTrigger>

                                        <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>Delete</Tooltip>}>
                                            <Button disabled={row.attendance?.students.length < 1} as="span" variant='outline-light' size='sm' onClick={() => handleButtonClick('delete', row)}><DeleteIcon className='text-danger mx-2 pointer' /></Button>

                                        </OverlayTrigger>



                                    </div>

                                )
                            }} className='table table-striped table-bordered order-column dt-head-center' options={{
                                buttons: {
                                    buttons: ['copy', 'csv']
                                }
                            }} data={rows} columns={[{ data: 'title', title: 'Title' }, { data: 'description', title: 'Description' }, { data: 'lecturer.username', title: 'Lecturer' }, { title: 'Action' }]}>

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
                    <Modal.Title>{editMode ? "Edit Course" : "Create Course"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId='classform.title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type='text' required placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='classform.description'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as={'textarea'} placeholder='username' required value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='classform.link'>
                            <Form.Label>Lecturer</Form.Label>
                            <Form.Control as={'select'} type='text' required value={lecturerId} onChange={(e) => setLecturerId(e.target.value)}>
                                <option value=''>Select Lecturer</option>
                                {lecturers.map((lecturer: any) => (
                                    <option key={lecturer.id} value={lecturer.id}>{lecturer.username}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAdd}>
                        Close
                    </Button>
                    <Button variant="warning" onClick={createCourseAction} disabled={loading} >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={openDelete} onHide={handleCloseDelete} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this course?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDelete}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={deleteCourseAction} disabled={loading} >
                        Delete
                    </Button>
                </Modal.Footer>

            </Modal>


        </div>
    );
};

export default Courses;
