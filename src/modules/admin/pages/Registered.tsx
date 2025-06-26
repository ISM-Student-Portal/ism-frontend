import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
// import DataTable from '../../../components/datatable-original/Datatable';

import DataTable from '../../../components/datatable-original/Datatable';



import { toast } from 'react-toastify';
import axios from '../../../utils/axios';
import React, { useMemo } from 'react';

import { deactivateStudent, fetchAllRegistrants } from '@app/services/admin/studentServices';
import FilterComponent from '@app/components/data-table/FilterComponent';
import { ColorRing } from 'react-loader-spinner';
import { Button, Modal } from 'react-bootstrap';

import { useQuery } from '@tanstack/react-query';



const Registered = () => {
    const [pending, setpending] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const [openDelete, setOpenDelete] = React.useState(false);

    const [filterText, setFilterText] = React.useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
        false
    );
    const [selectedStudent, setSelectedStudent] = React.useState<any>();
    // const { isLoading, error, data: students } = useQuery({
    //     queryKey: ['students'],
    //     queryFn: fetchAllRegistrants,
    // });
    // console.log('students', students);

    const [rows, setRows] = React.useState([]);





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

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };






    const deactivateStudentAction = async () => {
        setLoading(true);

        const student = await deactivateStudent(selectedStudent.id);
        if (student.message === 'successful') {
            student.lecturer.is_active ? toast.success('Student Activated Successfully!') : toast.success('Student Deactivated Successfully!');
            handleCloseDelete();
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
        { name: 'Country', selector: (row: any) => row.country },
        { name: 'City', selector: (row: any) => row.city },
        { name: 'Phone', selector: (row: any) => row.phone },
        { name: 'Participation Mode', selector: (row: any) => row.participation_mode },


        { name: 'Plan', selector: (row: any) => row.plan },
        { name: 'Payment Status', selector: (row: any) => row.payment_complete ? 'Paid Full' : row.balance ? 'Partially Paid' : 'Not Paid' },
        { name: 'Alumni Status', selector: (row: any) => row.is_alumni ? 'Yes' : 'No' },



    ];


    const downloadStudents = async () => {
        setLoading(true)
        await axios.get('/admin/registered/export', { responseType: 'blob' }).then((res: any) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Registered.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
            toast.success("Request was successful");

        }).finally(() => {
            setLoading(false);
        })

    }

    return (
        <div>
            <ContentHeader title="All Registered" />
            <section className="content">


                <div className="container-fluid">
                    {/* <div>
                        <h6>No of Students Paid: {students?.stats?.total_paid}</h6>
                        <h6>No of Students Paid Full: {students?.stats?.total_paid_full}</h6>
                        <h6>No of Students Not Paid: {students?.stats?.total_unpaid}</h6>
                    </div> */}
                    {true ? (
                        <div>
                            <div className="d-grid gap-2 d-md-block py-2">
                            </div>
                            <div className="d-grid gap-2 d-md-block py-2 my-5">
                                <Button size='sm' variant='warning' onClick={downloadStudents} className="float-right mx-1" type="button">Download CSV</Button>

                            </div>
                            <DataTable className='table table-striped table-bordered order-column' ajax={'http://127.0.0.1:8000/api/admin/registered'} columns={[{ data: 'email', title: 'Email' }, { data: 'first_name', title: 'First Name' }, { data: 'last_name', title: 'Last Name' }, { data: 'country', title: 'Country' }, { data: 'city', title: 'City' }, { data: 'phone', title: 'Phone' }, { data: 'participation_mode', title: 'Participation Mode' }, { data: 'plan', title: 'Plan' }, {
                                data: 'is_alumni', title: 'Is Alumni', render(data, type, row, meta) {
                                    return data ? 'yes' : 'no';
                                },

                            }, {
                                data: 'payment_complete', title: 'Payment Status', render(data, type, row, meta) {
                                    return data ? 'full' : 'part'
                                },
                            }]} >

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
