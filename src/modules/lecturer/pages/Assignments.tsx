import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../../components/datatable-original/Datatable';
import React, { useEffect, useState } from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';


import { toast } from 'react-toastify';

import axios from '../../../utils/axios';

import { ColorRing } from 'react-loader-spinner';
import { fetchAllAssignments, fetchAllClasses } from '@app/services/admin/lecturerServices';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';


const Assignments = () => {

    const [openSubmission, setOpenSubmission] = useState(false)
    const [rows, setRows] = React.useState([]);
    const [selectedAssignment, setSelectedAssignment] = React.useState<any>();
    const [pending, setpending] = React.useState(true);
    const [loading, setLoading] = React.useState(false);



    const handleOpenSubmissions = (data: any) => {

        setSelectedAssignment(data);

        setOpenSubmission(true);
    }
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
    }, [])
    return (
        <div>
            <ContentHeader title="Assignments" />
            <section className="content">

                <div className="container-fluid">
                    {!loading ? (
                        <div>

                            <div></div>
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
                        }} data={selectedAssignment?.submissions} columns={[{ data: 'student.matric_no', title: 'Matric No' },
                        {
                            data: 'link', title: 'Link', render(data, type, row, meta) {
                                return data ? `<a href=${data} target='_blank'>View</a>` : 'No file'
                            }
                        }, { data: 'feedbacks', title: 'Feedback' }, {
                            data: 'created_at', title: 'Date Submitted', render(data, type, row, meta) {
                                return new Date(data).toLocaleString()
                            },
                        }]}>

                        </DataTable>
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
