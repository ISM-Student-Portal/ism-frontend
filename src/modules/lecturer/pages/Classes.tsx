import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../../components/datatable-original/Datatable';
import React, { useEffect, useState } from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';


import { toast } from 'react-toastify';

import axios from '../../../utils/axios';

import { ColorRing } from 'react-loader-spinner';
import { fetchAllClasses } from '@app/services/admin/lecturerServices';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';


const Classes = () => {

    const [openAttendance, setOpenAttendance] = useState(false)
    const [rows, setRows] = React.useState([]);
    const [selectedAttendance, setSelectedAttendance] = React.useState<any>();
    const [pending, setpending] = React.useState(true);
    const [loading, setLoading] = React.useState(false);



    const handleOpenAttendance = (data: any) => {

        setSelectedAttendance(data);

        setOpenAttendance(true);
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
    const handleCloseAttendance = () => {
        setOpenAttendance(false);
    }

    useEffect(() => {
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
                            <DataTable slots={{
                                6: (data: any, row: any) => (
                                    <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>View Attendance</Tooltip>}>
                                        <Button disabled={row.attendance?.students.length < 1} as="span" variant='outline-light' size='sm' onClick={() => handleOpenAttendance(row)}><VisibilityIcon className='text-success mx-2 pointer' /></Button>

                                    </OverlayTrigger>

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
            </section>
            <Footer />
        </div>
    );
};

export default Classes;
