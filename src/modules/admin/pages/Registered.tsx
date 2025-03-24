import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
// import DataTable from '../../../components/datatable-original/Datatable';

import DataTable from '../../../components/data-table/DataTableBase';


import { toast } from 'react-toastify';
import axios from '../../../utils/axios';
import React, { useEffect, useMemo } from 'react';

import { fetchAllStudents, createStudent, updateStudentStatus, deleteStudent, deactivateStudent, fetchAllRegistrants } from '@app/services/admin/studentServices';
import FilterComponent from '@app/components/data-table/FilterComponent';
import { ColorRing } from 'react-loader-spinner';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';



const Registered = () => {
    const [open, setOpen] = React.useState(false);
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
    const [stats, setStats] = React.useState<any>();
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

    const filteredItems = rows.filter(
        (item: any) =>
            JSON.stringify(item)
                .toLowerCase()
                .indexOf(filterText.toLowerCase()) !== -1
    );

    const subHeaderComponent = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText("");
            }
        };

        return (
            <FilterComponent
                onFilter={(e: any) => setFilterText(e.target.value)}
                onClear={handleClear}
                filterText={filterText}
            />
        );
    }, [filterText, resetPaginationToggle]);

    const handleOpenDelete = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const handleOpenAdd = () => {
        setOpenAdd(true);
    }

    const handleCloseAdd = () => {
        setOpenAdd(false);
    }
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




    const getStudents = async () => {
        const students = await fetchAllRegistrants();
        setRows(students.students);
        setStats(students.stats);
        setpending(false);
    }

    const deactivateStudentAction = async () => {
        setLoading(true);

        const student = await deactivateStudent(selectedStudent.id);
        if (student.message === 'successful') {
            student.lecturer.is_active ? toast.success('Student Activated Successfully!') : toast.success('Student Deactivated Successfully!');
            handleCloseDelete();
            getStudents();
            setLoading(false);
        }
        else {
            toast.error('Something went wrong!');
        }
        setLoading(false);

    }
    const columns = [
        { name: 'Email', selector: (row: any) => row.email },

        { name: 'First Name', selector: (row: any) => row.first_name },
        { name: 'Last Name', selector: (row: any) => row.last_name },
        { name: 'Plan', selector: (row: any) => row.plan },
        { name: 'Payment Status', selector: (row: any) => row.payment_complete ? 'Paid Full' : row.balance ? 'Partially Paid' : 'Not Paid' },


    ];


    const downloadStudents = async () => {
        setLoading(true)
        await axios.get('/admin/students/export', { responseType: 'blob' }).then((res: any) => {
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









    useEffect(() => {
        getStudents();
    }, [])
    return (
        <div>
            <ContentHeader title="All Registered" />
            <section className="content">


                <div className="container-fluid">
                    <div>
                        <h6>No of Students Paid: {stats?.total_paid}</h6>
                        <h6>No of Students Paid Full: {stats?.total_paid_full}</h6>
                        <h6>No of Students Not Paid: {stats?.total_unpaid}</h6>
                    </div>
                    {rows.length > 0 ? (
                        <div>
                            <div className="d-grid gap-2 d-md-block py-2">
                            </div>
                            <div className="d-grid gap-2 d-md-block py-2 my-5">
                                <Button size='sm' variant='warning' onClick={downloadStudents} className="float-right mx-1" type="button">Download CSV</Button>

                            </div>
                            <DataTable className='table table-striped table-bordered order-column' data={rows} columns={columns} progressPending={pending} responsive keyField='id' striped selectableRows selectableRowsSingle >

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

            <Modal show={openDelete} onHide={handleCloseDelete} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedStudent?.is_active ? 'Confirm Deactivation' : 'Confirm Activation'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to {selectedStudent?.is_active ? 'deactivate' : 'activate'} {selectedStudent?.first_name} {selectedStudent?.last_name}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deactivateStudentAction} disabled={loading} >
                        Yes
                    </Button>
                </Modal.Footer>

            </Modal>

        </div>
    );
};

export default Registered;
