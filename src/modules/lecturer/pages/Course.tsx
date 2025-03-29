import Footer from '@app/modules/main/footer/Footer';
import DataTable from '../../../components/datatable-original/Datatable';

import React, { ChangeEvent, useEffect, useState } from 'react';

import GradingIcon from '@mui/icons-material/Grading';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { toast } from 'react-toastify';
import axios from '../../../utils/axios';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';





import { ColorRing } from 'react-loader-spinner';
import { fetchAllAssignments, fetchCourseById } from '@app/services/admin/lecturerServices';
import { useParams } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { createClassroom } from '@app/services/admin/classServices';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';



const Course = () => {

    const { id } = useParams();
    const [pending, setPending] = useState(false)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [openAssignment, setOpenAssignment] = useState(false)
    const [openSubmission, setOpenSubmission] = useState(false)
    const [openGrade, setOpenGrade] = useState(false)
    const [openUploadGrade, setOpenUploadGrade] = useState(false)
    const [openAttendance, setOpenAttendance] = useState(false)

    const [title, setTitle] = React.useState('');
    const [errors, setErrors] = React.useState<any>('');
    const [link, setLink] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [file, setFile] = React.useState<any>();
    const [gradeFile, setGradeFile] = React.useState<any>();
    const [filename, setFilename] = React.useState("");
    const [selectedAssignment, setSelectedAssignment] = React.useState<any>();
    const [selectedSubmission, setSelectedSubmission] = React.useState<any>();
    const [selectedAttendance, setSelectedAttendance] = React.useState<any>();
    const [editMode, setEditMode] = React.useState(false);

    const [expiresOn, setExpiresOn] = React.useState<any>();


    const [course, setCourse] = React.useState<any>();




    const handleOpen = () => {
        setEditMode(false);
        setTitle('');
        setDescription('');
        setLink('');
        setExpiresOn('');
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleOpenAssignment = () => {
        setOpenAssignment(true);
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

    const handleOpenSubmissions = (data: any) => {
        console.log(data, 'here')

        setOpenSubmission(true);
        setSelectedAssignment(data);
    }
    const handleCloseSubmissions = () => {
        setOpenSubmission(false);
    }
    const handleCloseAssignment = () => {
        setOpenAssignment(false);
    }

    const handleOpenAttendance = (data: any) => {

        setSelectedAttendance(data);

        setOpenAttendance(true);
    }
    const handleCloseAttendance = () => {
        setOpenAttendance(false);
    }

    const getCourse = async () => {
        const courses = await fetchCourseById(id);
        setCourse(courses.course);
        setPending(false);
    }

    const createClass = async () => {
        setLoading(true);
        let data = {
            title,
            description,
            link,
            course_id: id,
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
                let res = await axios.put('/classrooms/' + selectedAssignment.id, data);
                if (res) {
                    toast.success('Class updated');
                    handleClose();
                    getCourse();
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

                getCourse();
            } catch (error) {

            }
            finally {
                setLoading(false)
            }
        }

    }
    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
        const file: any = e.target.files[0];
        setFile(file);
        const { name } = file;

        setFilename(name);
    }

    const handleOpenGrade = (data: any) => {
        console.log(data);
        setSelectedSubmission(data);

        setOpenGrade(true);
    }

    const handleCloseGrade = () => { setOpenGrade(false); }
    const handleOpenUploadGrade = () => {

        setOpenUploadGrade(true);
    }

    const handleCloseUploadGrade = () => { setOpenUploadGrade(false); }

    const submitGrade = async () => {
        try {
            setLoading(true);
            let res = await axios.put('/submissions/' + selectedSubmission.id, {
                grade: selectedSubmission.grade
            });
            if (res) {
                toast.success('Grade submitted');
                handleCloseGrade();
                handleCloseSubmissions();
                const courses = await fetchAllAssignments();

                let updatedAssignment = courses.assignments.find((item: any) => {
                    return item.id === selectedAssignment.id
                });
                console.log(updatedAssignment);
                handleOpenSubmissions(updatedAssignment);
                getCourse();
            }
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
            setExpiresOn(moment(row.expires_on).format('YYYY-MM-DD'));
            console.log(moment(row.expires_on).format('YYYY-MM-DD'));
            setSelectedAssignment(row);
            setEditMode(true);
            setOpen(true);

        }

    }


    const uploadGrade = async () => {
        try {
            setLoading(true);
            let res = await axios.put('/submissions/' + selectedSubmission.id, {
                grade: selectedSubmission.grade
            });
            if (res) {
                toast.success('Grade submitted');
                handleCloseGrade();
                getCourse();
            }
        } catch (error) {

        }
        finally {
            setLoading(false);
        }
    }

    const createAssignmentAction = async () => {
        setLoading(true);
        try {
            setLoading(true);
            let formData = new FormData();

            let cloudName = 'ded69cslb';
            formData.append('upload_preset', 'ml_default');
            //@ts-ignore
            formData.append("file", file);
            let url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
            fetch(url, {
                method: 'POST',
                body: formData
            }).then((response) => response.json()).then((data) => {
                let res = axios.post('/assignments', {
                    file_url: data.url,
                    title: title,
                    link: link,
                    description: description,
                    deadline: expiresOn,
                    course_id: id
                }).then((res: any) => {
                    if (res) {
                        toast.success('Assignment created');
                    }
                    setLoading(false);
                    handleCloseAssignment();
                    getCourse();

                }).catch((error) => {
                    toast.error('An error occured')
                })



            }).catch((error) => {
                toast.error('Error uploading Document')
            })
        } catch (error) {

        }
        finally {
            setLoading(false)
        }
    }





    useEffect(() => {
        getCourse();
    }, [])
    return (
        <div>
            {course ? (
                <div>
                    <h3 className='text-center'>{course.title}</h3>
                    <section className="content text-center">
                        <p>{course.description}</p>
                    </section>
                    <Tabs>
                        <TabList >
                            <Tab>Classes</Tab>
                            <Tab>Assignments</Tab>

                        </TabList>



                        <TabPanel >
                            <div className=''>
                                <Button variant='warning' className='float-right d-inline-block my-3' onClick={() => handleOpen()}>Create Class</Button>
                            </div><br />

                            <DataTable slots={{
                                5: (data: any, row: any) => (
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
                            }} data={course.classrooms} columns={[{ data: 'title', title: 'Title' }, { data: 'link', title: 'Link' }, { data: 'description', title: 'Description' }, {
                                data: 'attendance', title: 'No. Attendances', render(data, type, row, meta) {
                                    return data ? data?.students.length : 0
                                },
                            }, { data: 'expires_on', title: 'Expiry' }, { title: 'Action' }]}>

                            </DataTable>

                        </TabPanel>




                        <TabPanel >
                            <div className=''>
                                <Button variant='warning' className='float-right d-inline-block my-3' onClick={() => handleOpenAssignment()}>Create Assignment</Button>

                            </div><br />

                            <DataTable slots={{
                                6: (data: any, row: any) => (
                                    <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>View Submissions</Tooltip>}>
                                        <Button as="span" variant='outline-light' size='sm' onClick={() => handleOpenSubmissions(row)}><VisibilityIcon className='text-success mx-2 pointer' /></Button>

                                    </OverlayTrigger>

                                )
                            }} className='table table-striped table-bordered order-column dt-head-center' options={{
                                buttons: {
                                    buttons: ['copy', 'csv']
                                }
                            }} data={course.assignments} columns={[{ data: 'title', title: 'Title' }, {
                                data: 'link', title: 'Link', render(data, type, row, meta) {
                                    return data ? `<a href=${data} target='_blank'>View</a>` : 'No file'
                                },
                            }, { data: 'description', title: 'Description' }, { data: 'deadline', title: 'Expiry' }, {
                                data: 'file_url', title: 'file', render(data, type, row, meta) {
                                    return data ? `<a href=${data} target='_blank'>View</a>` : 'No file'
                                },
                            }, {
                                data: 'submissions', title: 'No. Submissions', render(data, type, row, meta) {
                                    return data ? data.length : 0
                                },
                            }, { title: 'Action' }]}>

                            </DataTable>

                        </TabPanel>


                    </Tabs>
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

            <Modal show={open} onHide={handleClose} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Edit' : 'Create'} Class</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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

            <Modal show={openAssignment} onHide={handleCloseAssignment} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Assignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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
                        <Form.Group controlId='classform.deadline'>
                            <Form.Label>Deadline</Form.Label><br></br>

                            <DatePicker
                                format='y-MM-dd'
                                yearPlaceholder='yyyy'
                                monthPlaceholder='mm'
                                dayPlaceholder='dd'
                                value={expiresOn}
                                onChange={(newValue) => setExpiresOn(newValue)}></DatePicker>
                        </Form.Group>

                        <Form.Group controlId='classform.link'>
                            <Form.File
                                className="position-relative"
                                required
                                name="file"
                                label="File"
                                onChange={handleFileUpload}
                                isInvalid={!!errors.file}
                                feedback={errors.file}
                                id="validationFormik107"
                                feedbackTooltip
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAssignment}>
                        Close
                    </Button>
                    <Button variant="warning" onClick={createAssignmentAction} disabled={loading} >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={openSubmission} onHide={handleCloseSubmissions} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Submissions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <div className=''>
                        <Button variant='warning' className='float-right d-inline-block my-3' onClick={() => handleOpenUploadGrade()}>Upload Grades</Button>
                    </div><br /> */}
                    <DataTable slots={{
                        6: (data: any, row: any) => (
                            <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>Grade</Tooltip>}>
                                <Button as="span" variant='outline-light' size='sm' onClick={() => handleOpenGrade(row)}><GradingIcon className='text-success mx-2 pointer' /></Button>

                            </OverlayTrigger>

                        )
                    }} className='table table-striped table-bordered order-column dt-head-center' options={{
                        buttons: {
                            buttons: ['copy', 'csv']
                        }
                    }} data={selectedAssignment?.submissions} columns={[{ data: 'student.matric_no', title: 'Registration No' },
                    {
                        data: 'student.first_name', title: 'Name', render(data, type, row, meta) {
                            return `${row.student.first_name} ${row.student.last_name}`
                        }
                    },

                    {
                        data: 'link', title: 'Link', render(data, type, row, meta) {
                            return data ? `<a href=${data} target='_blank'>View</a>` : 'No file'
                        }
                    }, { data: 'feedbacks', title: 'Feedback' }, {
                        data: 'created_at', title: 'Date Submitted', render(data, type, row, meta) {
                            return new Date(data).toLocaleString()
                        },

                    }, {
                        data: 'grade', title: 'Grade', render(data, type, row, meta) {
                            return data ? data : 'Not Graded'
                        },

                    }, { title: 'Action' }]}>

                    </DataTable>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>

            <Modal show={openAttendance} onHide={handleCloseAttendance} size='xl' centered>
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


            <Modal show={openGrade} onHide={handleCloseGrade} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedSubmission?.student.first_name} Grade</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div><h6>{selectedAssignment?.title}</h6></div>
                    <Form>
                        <Form.Group controlId='gradeform.grade'>
                            <Form.Label>Grade %</Form.Label>
                            <Form.Control type='number' placeholder='Grade' value={selectedSubmission?.grade} onChange={(e) => setSelectedSubmission({ ...selectedSubmission, grade: e.target.value })}></Form.Control>
                        </Form.Group>
                        <Button variant='primary' onClick={submitGrade}>Submit</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>

            <Modal show={openUploadGrade} onHide={handleCloseUploadGrade} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedAssignment?.title} Grade Upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId='gradeform.grade'>
                            <Form.Label>Select File</Form.Label>
                            <Form.File type='number' placeholder='Select File' value={selectedSubmission?.grade} onChange={(e) => setSelectedSubmission({ ...selectedSubmission, grade: e.target.value })}></Form.File>
                        </Form.Group>
                        <Button variant='primary' onClick={uploadGrade}>Submit</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>





        </div>
    );
};

export default Course;
