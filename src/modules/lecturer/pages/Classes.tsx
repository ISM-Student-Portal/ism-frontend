import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../../components/datatable-original/Datatable';
import React, { useEffect, useState } from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';


import { toast } from 'react-toastify';

import axios from '../../../utils/axios';
import EditIcon from '@mui/icons-material/Edit';


import { ColorRing } from 'react-loader-spinner';
import { fetchAllClasses, fetchAllCourses } from '@app/services/admin/lecturerServices';
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';
import { createClassroom } from '@app/services/admin/classServices';


const Classes = () => {

    const [openAttendance, setOpenAttendance] = useState(false)
    const [courses, setCourses] = useState([]);
    const [rows, setRows] = React.useState([]);
    const [selectedAttendance, setSelectedAttendance] = React.useState<any>();
    const [pending, setpending] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [courseId, setCourseId] = React.useState('');
    const [link, setLink] = React.useState('');
    const [expiresOn, setExpiresOn] = React.useState('');
    const [selectedClass, setSelectedClass] = React.useState<any>();



    const handleOpenAttendance = (data: any) => {

        setSelectedAttendance(data);

        setOpenAttendance(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setEditMode(false);
        setTitle('');
        setDescription('');
        setLink('');
        setExpiresOn('');
        setCourseId('');
        setOpen(true);
    }
    const downloadAttendance = async () => {
        setLoading(true)
        axios.get('/attendance-export/' + selectedAttendance.id, { responseType: 'blob' }).then((res: any) => {
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
    const getClasses = async () => {
        try {
            setLoading(true);
            const courses = await fetchAllClasses();
            setRows(courses.classrooms);
        } catch (error) {

        }
        finally {
            setLoading(false);
        }

        setpending(false);
    }
    const getCourses = async () => {
        try {
            setLoading(true);
            const courses = await fetchAllCourses();
            setCourses(courses.courses);
        } catch (error) {

        }
        finally {
            setLoading(false);
        }

    }

    const handleButtonClick = (action: string, row: any) => {
        if (action === 'edit') {
            console.log(row);
            setTitle(row.title);
            setDescription(row.description);
            setLink(row.link);
            setCourseId(row.course_id);
            setExpiresOn(moment(row.expires_on).format('YYYY-MM-DD'));
            console.log(moment(row.expires_on).format('YYYY-MM-DD'));
            setSelectedClass(row);
            setEditMode(true);
            setOpen(true);

        }

    }
    const handleCloseAttendance = () => {
        setOpenAttendance(false);
    }
    const createClass = async () => {
        setLoading(true);
        let data = {
            title,
            description,
            link,
            course_id: courseId,
            expires_on: expiresOn
        };
        if (link && !link.startsWith('http')) {
            toast.error('Link must start with http or https');
            setLoading(false);
            return;
        }
        if (expiresOn && !moment(expiresOn).isValid()) {
            toast.error('Invalid date');
            setLoading(false);
            return;
        }
        if (editMode) {
            try {
                let res = await axios.put('/classroom/' + selectedClass.id, data);
                if (res) {
                    toast.success('Class updated');
                    handleClose();
                    getClasses();
                }
            } catch (error) {

            }
            finally {
                setLoading(false);
            }
        } else {
            try {
                let classroom = await createClassroom(data)
                console.log(classroom)
                toast.success('Class created');
                handleClose();

                getClasses();
            } catch (error) {

            }
            finally {
                setLoading(false)
            }
        }

    }

    useEffect(() => {
        getCourses();
        getClasses();
    }, [])
    return (
        <div>
            <ContentHeader title="Classrooms" />
            <section className="content">

                <div className="container-fluid">
                    {!loading ? (
                        <div>

                            <div></div>
                            <div className=''>
                                <Button variant='warning' className='float-right d-inline-block my-3' onClick={() => handleOpen()}>Create Class</Button>
                            </div><br />
                            <DataTable slots={{
                                6: (data: any, row: any) => (
                                    <div className='d-flex '>
                                        <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>View Attendance</Tooltip>}>
                                            <Button disabled={row.attendance?.students.length < 1} as="span" variant='outline-light' size='sm' onClick={() => handleOpenAttendance(row)}><VisibilityIcon className='text-success mx-2 pointer' /></Button>

                                        </OverlayTrigger>
                                        <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>Edit</Tooltip>}>
                                            <Button disabled={row.attendance?.students.length < 1} as="span" variant='outline-light' size='sm' onClick={() => handleButtonClick('edit', row)}><EditIcon className='text-warning mx-2 pointer' /></Button>

                                        </OverlayTrigger>
                                    </div>

                                )
                            }} className='table table-striped table-bordered order-column dt-head-center' options={{
                                buttons: {
                                    buttons: ['copy', 'csv']
                                }
                            }} data={rows} columns={[{ data: 'title', title: 'Title' }, { data: 'course.title', title: 'Course' }, { data: 'description', title: 'Description' }, {
                                data: 'link', title: 'Link', render(data, type, row, meta) {
                                    return data ? `<a href=${data} target='_blank'>View</a>` : 'No file'
                                },
                            }, {
                                data: 'created_at', title: 'Date', render(data, type, row, meta) {
                                    return new Date(data).toLocaleString()
                                },
                            }, {
                                data: 'attendance', title: 'No. Attendances', render(data, type, row, meta) {
                                    return data ? data?.students.length : 0
                                },
                            }, { title: 'Action' }]}>

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
                <Modal show={openAttendance} onHide={handleCloseAttendance} size='lg' centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Attendance</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className=''>
                            <Button variant='warning' className='float-right d-inline-block my-3' disabled={selectedAttendance?.attendance?.students.length < 1} onClick={() => downloadAttendance()}>Download</Button>
                        </div><br />
                        <DataTable className='table table-striped table-bordered order-column dt-head-center' options={{
                            buttons: {
                                buttons: ['copy', 'csv']
                            }
                        }} data={selectedAttendance?.attendance?.students} columns={[{ data: 'matric_no', title: 'Registration No' }, {
                            data: 'first_name', title: 'Name', render(data, type, row, meta) {
                                return `${row.first_name} ${row.last_name}`
                            },
                        }, {
                            data: 'created_at', title: 'Time Clocked', render(data, type, row, meta) {
                                return new Date(data).toLocaleString()
                            },
                        }]}>

                        </DataTable>
                    </Modal.Body>
                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>

                <Modal show={open} onHide={handleClose} size='lg' centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{editMode ? 'Edit' : 'Create'} Class</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId='classform.course'>
                                <Form.Label>Course</Form.Label>
                                <Form.Control as={'select'} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                                    <option value=''>Select Course</option>
                                    {courses.map((course: any) => (
                                        <option key={course.id} value={course.id}>{course.title}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='classform.title'>
                                <Form.Label>Title</Form.Label>
                                <Form.Control type='text' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='classform.description'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control as='textarea' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='classform.link'>
                                <Form.Label>Link</Form.Label>
                                <Form.Control type='text' placeholder='Link' value={link} onChange={(e) => setLink(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='classform.link'>
                                <Form.Label>Expiry</Form.Label>
                                <Form.Control as={'input'} type="date" placeholder='Link' value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)}></Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="warning" onClick={createClass} disabled={loading} >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </section>
            <Footer />
        </div>
    );
};

export default Classes;
