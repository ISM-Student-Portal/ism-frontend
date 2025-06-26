import Footer from '@app/modules/main/footer/Footer';
import DataTable from '../../../components/datatable-original/Datatable';

import React, { ChangeEvent, useEffect, useState } from 'react';

import GradingIcon from '@mui/icons-material/Grading';

import { toast } from 'react-toastify';
import axios from '../../../utils/axios';
import moment from 'moment';
import { useSelector } from 'react-redux';






import { ColorRing } from 'react-loader-spinner';
import { fetchCourseTranscript } from '@app/services/admin/lecturerServices';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { createClassroom } from '@app/services/admin/classServices';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';



const CourseTranscript = () => {

    const { id } = useParams();
    const [pending, setPending] = useState(false)
    const [resource, setResource] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [openAssignment, setOpenAssignment] = useState(false)
    const [openSubmission, setOpenSubmission] = useState(false)
    const [openGrade, setOpenGrade] = useState(false)
    const [openUploadGrade, setOpenUploadGrade] = useState(false)
    const [openAttendance, setOpenAttendance] = useState(false)

    const [title, setTitle] = React.useState<any>(null);
    const [errors, setErrors] = React.useState<any>('');
    const [link, setLink] = React.useState<any>(null);
    const [transcript, setTranscript] = React.useState<boolean>(false);
    const [description, setDescription] = React.useState<any>(null);
    const [file, setFile] = React.useState<any>();
    const [filename, setFilename] = React.useState("");
    const [selectedAssignment, setSelectedAssignment] = React.useState<any>();
    const [selectedSubmission, setSelectedSubmission] = React.useState<any>();
    const [selectedAttendance, setSelectedAttendance] = React.useState<any>();
    const [editMode, setEditMode] = React.useState(false);
    const [validated, setValidated] = React.useState(false);

    const [expiresOn, setExpiresOn] = React.useState<any>();


    const [course, setCourse] = React.useState<any>();
    const navigate = useNavigate();

    const profile = useSelector((state: any) => state.profile.profile);





    const handleClose = () => {
        setOpen(false);
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
        navigate(`${profile.is_admin ? '/admin' : '/lecturer'}/assignments/${data.id}`, { state: { assignment: data } });

        // setOpenSubmission(true);
        // setSelectedAssignment(data);
    }
    const handleCloseSubmissions = () => {
        setOpenSubmission(false);
    }
    const handleCloseAssignment = () => {
        setOpenAssignment(false);
    }


    const handleCloseAttendance = () => {
        setOpenAttendance(false);
    }

    const getCourse = async () => {
        const courses = await fetchCourseTranscript(id);
        console.log(courses);
        setCourse(courses.transcripts.exam_result);
        setPending(false);
    }

    const createClass = async (event: any) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
        let data = {
            title,
            description,
            link,
            resource,
            course_id: id,
            expires_on: expiresOn
        };
        if (!title || !description || !link) {
            toast.error('Fill required fields');

            return
        }
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
        setLoading(true);

        if (editMode) {
            try {
                let res = await axios.put('/classroom/' + selectedAssignment.id, data);
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
                await createClassroom(data)
                toast.success('Class created');
                handleClose();

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
        setSelectedSubmission(data);

        setOpenGrade(true);
    }










    const createAssignmentAction = async (event: any) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (!title || !description) {
            toast.error('Fill required fields');

            return
        }
        if (!file && !link) {
            toast.error('File or Link is required');
            return
        }
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
        setLoading(true);
        if (editMode) {
            try {
                setLoading(true);
                let formData = new FormData();

                let cloudName = 'dkft4gvoy';
                formData.append('upload_preset', 'ISM2025');
                //@ts-ignore
                formData.append("file", file);
                let url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
                fetch(url, {
                    method: 'POST',
                    body: formData
                }).then((response) => response.json()).then((data) => {
                    axios.put('/assignments/' + selectedAssignment.id, {
                        file_url: data.url,
                        title: title,
                        link: link,
                        description: description,
                        deadline: expiresOn,
                        course_id: id,
                        use_for_transcript: transcript
                    }).then((res: any) => {
                        if (res) {
                            toast.success('Assignment updated');
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
        else {
            try {
                setLoading(true);
                let formData = new FormData();

                let cloudName = 'dkft4gvoy';
                formData.append('upload_preset', 'ISM2025');
                //@ts-ignore
                formData.append("file", file);
                let url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
                fetch(url, {
                    method: 'POST',
                    body: formData
                }).then((response) => response.json()).then((data) => {
                    axios.post('/assignments', {
                        file_url: data.url,
                        title: title,
                        link: link,
                        description: description,
                        deadline: expiresOn,
                        course_id: id,
                        use_for_transcript: transcript
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

    }





    useEffect(() => {
        getCourse();
    }, [])
    return (
        <div>
            {course ? (
                <div>
                    <h3 className=''>{course.title}</h3>
                    <section className="content">
                        <p>{course.description}</p>
                    </section>

                    <section>
                        <DataTable className='table table-striped table-bordered order-column dt-head-center' options={{
                            buttons: {
                                buttons: ['copy', 'csv']
                            }
                        }} data={course.assignments[0]?.submissions} columns={[{
                            data: 'student', title: 'Reg No', render(data) {
                                return data ? data.matric_no : 'N/A'
                            }
                        }, {
                            data: 'student', title: 'Name', render(data) {
                                return data ? `${data.first_name} ${data.last_name}` : 'N/A'
                            }
                        }, {
                            data: 'grade', title: 'Exam Score', render(data) {
                                return data ? data : '0'
                            }
                        }]}>

                        </DataTable>
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

            <Modal show={open} onHide={handleClose} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Edit' : 'Create'} Class</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated >
                        <Form.Group controlId='classform.title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type='text' required placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='classform.description'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control required as='textarea' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                        </Form.Group>



                        <Form.Group controlId='classform.link'>
                            <Form.Label>Class Link</Form.Label>
                            <Form.Control required type='text' placeholder='Link' value={link} onChange={(e) => setLink(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='classform.link'>
                            <Form.Label>Resource Link</Form.Label>
                            <Form.Control type='text' placeholder='Resource' value={resource} onChange={(e) => setResource(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='classform.link'>
                            <Form.Label>Expiry</Form.Label>
                            <Form.Control required as={'input'} type="date" placeholder='Link' value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)}></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="warning" type='submit' disabled={loading} onClick={createClass} >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={openAssignment} onHide={handleCloseAssignment} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Edit' : 'Create'} Assignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated >
                        <Form.Group controlId='classform.title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type='text' placeholder='Title' required value={title} onChange={(e) => setTitle(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='classform.description'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as='textarea' required placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='classform.link'>
                            <Form.Label>Link</Form.Label>
                            <Form.Control type='text' placeholder='Link' value={link} onChange={(e) => setLink(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='classform.link'>
                            <Form.Label>Deadline</Form.Label>
                            <Form.Control required as={'input'} type="date" placeholder='Link' value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='classform.link'>
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                label="Use in transcript compute"
                                checked={transcript}
                                onChange={(e) => setTranscript(e.target.checked)}
                            />
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


                </Modal.Header>
                <Modal.Body>
                    <Modal.Title>Assignment Title: {selectedAssignment?.title}</Modal.Title>
                    <Modal.Title>Date Given: {new Date(selectedAssignment?.created_at).toDateString()}</Modal.Title>
                    <Modal.Title>Submissions</Modal.Title>
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
                    <Modal.Title>Class Title: {selectedAttendance?.title}</Modal.Title>
                    <Modal.Title>Date Held: {new Date(selectedAttendance?.created_at).toDateString()}</Modal.Title>
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










        </div>
    );
};

export default CourseTranscript;
