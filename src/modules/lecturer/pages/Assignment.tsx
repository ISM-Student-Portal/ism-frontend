import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../../components/datatable-original/Datatable';

import { useState } from 'react';


import GradingIcon from '@mui/icons-material/Grading';


import { toast } from 'react-toastify';

import { ColorRing } from 'react-loader-spinner';


import { useLocation } from 'react-router-dom';
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from '../../../utils/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import BackButton from '@app/components/common/BackButton';

const Assignment = () => {
    const [openGrade, setOpenGrade] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedAssignment] = useState<any>();
    const [selectedSubmission, setSelectedSubmission] = useState<any>();

    const assignment = useLocation().state.assignment;
    const queryClient = useQueryClient();

    const submitGrade = async () => {
        if (selectedSubmission.grade === undefined || selectedSubmission.grade === null || selectedSubmission.grade === '' || selectedSubmission.grade < 0 || selectedSubmission.grade > 100) {
            toast.error('Please enter a valid grade between 0 and 100');
            return;
        } else {
            try {
                setLoading(true);
                let res = await axios.put('/submissions/' + selectedSubmission.id, {
                    grade: parseInt(selectedSubmission.grade)
                });
                if (res) {
                    toast.success('Grade submitted');
                    handleCloseGrade();
                }
                queryClient.invalidateQueries({ queryKey: ['assignmentData'] });
            } catch (error) {

            }
            finally {
                setLoading(false);
            }
        }

    }

    const getSubmissions = () => {
        return axios.get('/assignments/' + assignment.id)
    }
    const {
        isLoading,
        error,
        data: assignmentData
    } = useQuery({
        queryKey: ['assignmentData'],
        queryFn: getSubmissions
    })

    const handleOpenGrade = (data: any) => {
        setSelectedSubmission(data);

        setOpenGrade(true);
    }

    if (error) {
        toast.error('Error fetching assignment data');
        return <div className=''>Error fetching assignment data</div>;
    }



    const handleCloseGrade = () => { setOpenGrade(false); }

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center p-3 bg-light'>
                <BackButton />

            </div>
            <ContentHeader title="Assignment" />
            <section className="content-header">
                <div className="container-fluid h5">
                    Title: {assignment?.title} <br />
                    Description: {assignment?.description} <br />
                    Deadline: {new Date(assignment?.deadline).toDateString()} <br />
                </div>
            </section>
            <section className="content">

                <div className="container-fluid">
                    {!isLoading ? (
                        <div>

                            <div></div>
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
                            }} data={assignmentData?.data?.assignment?.submissions} columns={[{
                                data: 'student', title: 'Name', render(data, type, row, meta) {
                                    return `${data.first_name} ${data.last_name}`;
                                },
                            }, {
                                data: 'student', title: 'Reg No', render(data, type, row, meta) {
                                    return data.matric_no;
                                },
                            }, {
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
                        <Button variant='primary' onClick={submitGrade} disabled={loading}>Submit</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Assignment;
