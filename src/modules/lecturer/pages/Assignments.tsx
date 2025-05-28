import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../../components/datatable-original/Datatable';
import React, { ChangeEvent, useState } from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';
import GradingIcon from '@mui/icons-material/Grading';
import EditIcon from '@mui/icons-material/Edit';




import { toast } from 'react-toastify';

import axios from '../../../utils/axios';

import { ColorRing } from 'react-loader-spinner';
import { fetchAllAssignments, fetchAllCourses } from '@app/services/admin/lecturerServices';
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';


const Assignments = () => {

    const [openSubmission, setOpenSubmission] = useState(false)
    const [rows, setRows] = React.useState([]);
    const [selectedAssignment, setSelectedAssignment] = React.useState<any>();
    const [openAssignment, setOpenAssignment] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [expiresOn, setExpiresOn] = useState<any>(new Date());
    const [transcript, setTranscript] = React.useState<boolean>(false);

    const [file, setFile] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [filename, setFilename] = useState('');
    const [courseId, setCourseId] = React.useState('');
    const [openGrade, setOpenGrade] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);


    const navigate = useNavigate();

    const profile = useSelector((state: any) => state.profile.profile);

    const { isLoading, data: assignments } = useQuery({
        queryKey: ['assignments'],
        queryFn: fetchAllAssignments
    })

    const queryClient = useQueryClient();


    const courses = useQuery({
        queryKey: ['courses'],
        queryFn: fetchAllCourses
    })



    const handleOpenSubmissions = (data: any) => {
        navigate(`${profile.is_admin ? '/admin' : '/lecturer'}/assignments/${data.id}`, { state: { assignment: data } });
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
        setCourseId('');
        setDescription('');
        setLink('');
        setExpiresOn('');
        setOpenAssignment(true);
    }
    const handleCloseAssignment = () => {
        setOpenAssignment(false);
    }

    const handleButtonClick = (action: string, row: any) => {
        if (action === 'edit') {
            setTitle(row.title);
            setDescription(row.description);
            setLink(row.link);
            setCourseId(row.course_id);
            setExpiresOn(moment(row.expires_on).format('YYYY-MM-DD'));
            setSelectedAssignment(row);
            setEditMode(true);
            setOpenAssignment(true);

        }

    }
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

    const createAssignmentAction = async () => {
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
                        course_id: courseId,
                        use_for_transcript: transcript

                    }).then((res: any) => {
                        if (res) {
                            toast.success('Assignment updated');
                        }
                        setLoading(false);
                        handleCloseAssignment();

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
                        course_id: courseId,
                        use_for_transcript: transcript

                    }).then((res: any) => {
                        if (res) {
                            toast.success('Assignment created');
                        }
                        queryClient.invalidateQueries({ queryKey: ['assignments'] });

                        setLoading(false);
                        handleCloseAssignment();
                        // getClasses();

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



    const handleCloseSubmissions = () => {
        setOpenSubmission(false);
    }


    return (
        <div>
            <ContentHeader title="Assignments" />
            <section className="content">

                <div className="container-fluid">
                    {!isLoading ? (
                        <div>

                            <div></div>
                            <Button variant='warning' className='float-right d-inline-block my-3' onClick={() => handleOpenAssignment()}>Create Assignment</Button>

                            <DataTable slots={{
                                7: (data: any, row: any) => (
                                    <div className='d-flex'>
                                        <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>View Submissions</Tooltip>}>
                                            <Button disabled={row.attendance?.students.length < 1} as="span" variant='outline-light' size='sm' onClick={() => handleOpenSubmissions(row)}><VisibilityIcon className='text-success mx-2 pointer' /></Button>

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
                            }} data={assignments?.assignments} columns={[{ data: 'title', title: 'Title' }, {
                                data: 'link', title: 'Link', render(data, type, row, meta) {
                                    return data ? `<a href=${data} target='_blank'>${data}</a>` : 'No Link'
                                },
                            }, { data: 'course.title', title: 'Course' }, { data: 'description', title: 'Description' }, { data: 'deadline', title: 'Expiry' }, {
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
                        <Modal.Title>{editMode ? 'Edit' : 'Create'} Assignment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId='classform.course'>
                                <Form.Label>Course</Form.Label>
                                <Form.Control as={'select'} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                                    <option value=''>Select Course</option>
                                    {courses?.data?.courses.map((course: any) => (
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
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Use in transcript compute"
                                    checked={transcript}
                                    onChange={(e) => setTranscript(e.target.checked)}
                                />
                            </Form.Group>
                            <Form.Group controlId='classform.link'>
                                <Form.Label>Deadline</Form.Label>
                                <Form.Control required as={'input'} type="date" placeholder='Link' value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)}></Form.Control>
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
                                <Form.Control type='number' placeholder='Grade' value={selectedSubmission?.grade} max={100} min={0} onChange={(e) => setSelectedSubmission({ ...selectedSubmission, grade: e.target.value })}></Form.Control>
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
