import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../../components/datatable-original/Datatable';
import React, { ChangeEvent, useEffect, useState } from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';
import GradingIcon from '@mui/icons-material/Grading';



import { toast } from 'react-toastify';

import axios from '../../../utils/axios';

import { ColorRing } from 'react-loader-spinner';
import { fetchAllAssignments, fetchAllClasses, fetchAllCourses } from '@app/services/admin/lecturerServices';
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DatePicker from 'react-date-picker';


const Assignments = () => {

    const [openSubmission, setOpenSubmission] = useState(false)
    const [rows, setRows] = React.useState([]);
    const [selectedAssignment, setSelectedAssignment] = React.useState<any>();
    const [pending, setpending] = React.useState(true);
    const [openAssignment, setOpenAssignment] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [expiresOn, setExpiresOn] = useState<any>(new Date());
    const [file, setFile] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [filename, setFilename] = useState('');
    const [courseId, setCourseId] = React.useState('');
    const [courses, setCourses] = useState([]);
    const [openGrade, setOpenGrade] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);





    const handleOpenSubmissions = (data: any) => {

        setSelectedAssignment(data);

        setOpenSubmission(true);
    }

    const handleOpenGrade = (data: any) => {
        setSelectedSubmission(data);
        setOpenGrade(true);
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
    const handleOpenAssignment = () => {
        setEditMode(false);
        setTitle('');
        setDescription('');
        setLink('');
        setExpiresOn('');
        setOpenAssignment(true);
    }
    const handleCloseAssignment = () => {
        setOpenAssignment(false);
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
    const submitGrade = async () => {
        try {
            setLoading(true);
            let res = await axios.put('/submissions/' + selectedSubmission.id, {
                grade: selectedSubmission.grade
            });
            if (res) {
                console.log(res);
                toast.success('Grade submitted');

                handleCloseGrade();
                handleCloseSubmissions();
                const courses = await fetchAllAssignments();

                let updatedAssignment = courses.assignments.find((item: any) => {
                    return item.id === selectedAssignment.id
                });
                console.log(updatedAssignment);
                handleOpenSubmissions(updatedAssignment);

                // setOpenSubmission(true);

            }
        } catch (error) {

        }
        finally {
            setLoading(false);
        }
    }


    const handleCloseGrade = () => { setOpenGrade(false); }

    const downloadAttendance = async () => {
        setLoading(true)
        axios.get('/attendance-export/' + selectedAssignment.id, { responseType: 'blob' }).then((res: any) => {
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
                    course_id: courseId
                }).then((res: any) => {
                    if (res) {
                        toast.success('Assignment created');
                    }
                    setLoading(false);
                    handleCloseAssignment();
                    getClasses();

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
    const getClasses = async () => {
        try {
            setLoading(true);
            const courses = await fetchAllAssignments();
            setRows(courses.assignments);
        }
        catch (error) { }
        finally {
            setLoading(false);
        }

    }
    const handleCloseSubmissions = () => {
        setOpenSubmission(false);
    }

    useEffect(() => {
        getClasses();
        getCourses();
    }, [])
    return (
        <div>
            <ContentHeader title="Assignments" />
            <section className="content">

                <div className="container-fluid">
                    {!loading ? (
                        <div>

                            <div></div>
                            <Button variant='warning' className='float-right d-inline-block my-3' onClick={() => handleOpenAssignment()}>Create Assignment</Button>

                            <DataTable slots={{
                                7: (data: any, row: any) => (
                                    <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>View Submissions</Tooltip>}>
                                        <Button disabled={row.attendance?.students.length < 1} as="span" variant='outline-light' size='sm' onClick={() => handleOpenSubmissions(row)}><VisibilityIcon className='text-success mx-2 pointer' /></Button>

                                    </OverlayTrigger>

                                )
                            }} className='table table-striped table-bordered order-column dt-head-center' options={{
                                buttons: {
                                    buttons: ['copy', 'csv']
                                }
                            }} data={rows} columns={[{ data: 'title', title: 'Title' }, { data: 'link', title: 'Link' }, { data: 'course.title', title: 'Course' }, { data: 'description', title: 'Description' }, { data: 'deadline', title: 'Expiry' }, {
                                data: 'file_url', title: 'file', render(data, type, row, meta) {
                                    return data ? `<a href=${data} target='_blank'>View</a>` : 'No file'
                                },
                            }, {
                                data: 'submissions', title: 'No. Submissions', render(data, type, row, meta) {
                                    return data ? data.length : 0
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
                <Modal show={openSubmission} onHide={handleCloseSubmissions} size='lg' centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Submissions</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <DataTable className='table table-striped table-bordered order-column dt-head-center' options={{
                            buttons: {
                                buttons: ['copy', 'csv']
                            }
                        }} slots={{
                            5: (data: any, row: any) => (
                                <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>Grade</Tooltip>}>
                                    <Button as="span" variant='outline-light' size='sm' onClick={() => handleOpenGrade(row)}><GradingIcon className='text-success mx-2 pointer' /></Button>

                                </OverlayTrigger>

                            )
                        }} data={selectedAssignment?.submissions} columns={[{ data: 'student.matric_no', title: 'Registration No' },
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

                <Modal show={openAssignment} onHide={handleCloseAssignment} size='lg' centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Assignment</Modal.Title>
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


                <Modal show={openGrade} onHide={handleCloseGrade} size='lg' centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedSubmission?.student.first_name} {selectedSubmission?.student.last_name} Grade</Modal.Title>
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

            </section>
            <Footer />
        </div>
    );
};

export default Assignments;
