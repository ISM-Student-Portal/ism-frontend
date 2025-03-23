import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../../components/datatable-original/Datatable';

import { toast } from 'react-toastify';
import axios from '../../../utils/axios';
import React, { useEffect, useMemo } from 'react';

import { fetchAllStudents, createStudent, updateStudentStatus, deleteStudent, deactivateStudent, fetchStudentById } from '@app/services/admin/studentServices';
import FilterComponent from '@app/components/data-table/FilterComponent';
import { ColorRing } from 'react-loader-spinner';
import { Button, Card, Col, Container, ListGroup, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';



const Student = () => {
    const { id } = useParams();

    const [open, setOpen] = React.useState(false);
    const [student, setStudent] = React.useState<any>();
    const [pending, setpending] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [openAdd, setOpenAdd] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [editStudentStatus, setEditStudentStatus] = React.useState(false);
    const [editStudentSub, setEditStudentSub] = React.useState(false);
    const [filterText, setFilterText] = React.useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
        false
    );
    const [selectedStudent, setSelectedStudent] = React.useState<any>();
    const [filename, setFilename] = React.useState("");
    const [file, setFile] = React.useState(null);
    const [email, setEmail] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [regNo, setRegNo] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');

    const [rows, setRows] = React.useState([]);
    const navigate = useNavigate();


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

    const handleButtonClick = (type: any, student: any) => {
        setSelectedStudent(student);
        if (type === 'edit') {
            // await changeStudentPass(student.id);
            // toast.success('Student updated Successfully!');

            setEditStudentStatus(student.is_admin);
            setEditStudentSub(student.profile.subscription === 'premium')
            handleOpenEdit();
        } else if (type === 'delete') {
            setSelectedStudent(student);
            handleOpenDelete();
        }
    }









    const downloadStudents = async () => {
        setLoading(true)
        await axios.get('/admin/students-export', { responseType: 'blob' }).then((res: any) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Students.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
            toast.success("Request was successful");

        }).finally(() => {
            setLoading(false);
        })

    }

    const getStudent = async () => {
        try {
            setLoading(true);
            const student = await fetchStudentById(id);
            setStudent(student.student);
        } catch (error) {

        }
        finally {
            setLoading(false);
        }
    }










    useEffect(() => {
        getStudent();
    }, [])
    return (
        <div>
            {loading ? (
                <div className='h-100 d-flex align-items-center justify-content-center'><ColorRing
                    visible={true}
                    height="150"
                    width="150"
                    ariaLabel="color-ring-loading"
                    wrapperClass="color-ring-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}

                />Loading... Please wait </div>
            ) : (
                <div>
                    <ContentHeader title="Student Information" />
                    <section className="content">
                        <Container fluid>
                            <Row>
                                <Col md={3}>
                                    <Card style={{ width: '25rem' }}>
                                        <div className='w-50 mx-auto my-3'>
                                            <Card.Img variant="top" src={student?.profile_pix_url ?? "/img/default-profile.png"} width={40}
                                                height={160} />
                                        </div>

                                        <Card.Body>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item>First Name: {student?.first_name}</ListGroup.Item>
                                                <ListGroup.Item>Last Name: {student?.last_name}</ListGroup.Item>
                                                <ListGroup.Item>Email: {student?.email}</ListGroup.Item>
                                                <ListGroup.Item>Phone Number: {student?.phone}</ListGroup.Item>
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={9}>
                                    <Card style={{ width: '100%' }}>
                                        <Card.Body>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item>Subscription Plan: {student?.plan}</ListGroup.Item>
                                                <ListGroup.Item>Payment Status: {student?.payment_complete ? "Paid Full" : student?.balance ? "Paid Half" : "Not Paid"}</ListGroup.Item>

                                            </ListGroup>
                                        </Card.Body>
                                        <Card.Body>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item>Registration Number: {student?.reg_no}</ListGroup.Item>
                                                <ListGroup.Item>Country: {student?.country}</ListGroup.Item>
                                                <ListGroup.Item>City: {student?.city}</ListGroup.Item>
                                            </ListGroup>
                                        </Card.Body>

                                    </Card>
                                </Col>

                            </Row>
                        </Container>

                        <div className="container-fluid">
                            {!loading ? (
                                <div>
                                    <div className="d-grid gap-2 d-md-block py-2">
                                        <h3>Payments</h3>
                                    </div>

                                    <DataTable className='table table-striped table-bordered order-column' options={{
                                        buttons: {
                                            buttons: ['copy', 'csv']
                                        }
                                    }} data={student?.payments} columns={[{
                                        data: 'created_at', title: 'Payment Date', render(data, type, row, meta) {
                                            return new Date(data).toLocaleDateString();
                                        },
                                    }, { data: 'reference', title: 'Reference' }, {
                                        data: 'amount', title: 'Amount', render: function (data, type, row) {
                                            return data < 100 ? Intl.NumberFormat('USD').format(data) : '₦' + Intl.NumberFormat('NGN').format(data);
                                        },
                                    }, { data: 'status', title: 'Status' }, { data: 'payment_method', title: 'Payment Method' }]}>

                                    </DataTable></div>
                            ) : (<div className='h-100 d-flex align-items-center justify-content-center'><ColorRing
                                visible={true}
                                height="150"
                                width="150"
                                ariaLabel="color-ring-loading"
                                wrapperClass="color-ring-wrapper"
                                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}

                            />Loading... Please wait </div>)}


                        </div>
                    </section>
                </div>
            )}

            <Footer />


        </div>
    );
};

export default Student;
