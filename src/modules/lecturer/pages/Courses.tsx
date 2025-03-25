import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../../components/datatable-original/Datatable';
import React, { useEffect } from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';

import { toast } from 'react-toastify';

import { createStudent, updateStudentStatus, deleteStudent } from '@app/services/admin/studentServices';
import { ColorRing } from 'react-loader-spinner';
import { fetchAllCourses } from '@app/services/admin/lecturerServices';
import { useNavigate } from 'react-router-dom';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';


const Courses = () => {

    const [pending, setPending] = React.useState<any>();
    const [loading, setLoading] = React.useState<any>(false);
    const [rows, setRows] = React.useState([]);
    const navigate = useNavigate();


    const getCourses = async () => {
        try {
            setLoading(true);
            const courses = await fetchAllCourses();
            setRows(courses.courses);
            setPending(false);
        } catch (error) {

        }
        finally {
            setLoading(false);
        }

    }








    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };




    useEffect(() => {
        getCourses();
    }, [])
    return (
        <div>
            <ContentHeader title="Courses" />
            <section className="content">

                <div className="container-fluid">
                    {!loading ? (
                        <div>

                            <div></div>
                            <DataTable slots={{
                                4: (data: any, row: any) => (
                                    <OverlayTrigger placement='top' overlay={<Tooltip id={row.id}>View Course</Tooltip>}>
                                        <Button as="span" variant='outline-light' size='sm' onClick={() => navigate('/lecturer/courses/' + row.id)}><VisibilityIcon className='text-success mx-2 pointer' /></Button>

                                    </OverlayTrigger>

                                )
                            }} className='table table-striped table-bordered order-column dt-head-center' options={{
                                buttons: {
                                    buttons: ['copy', 'csv']
                                }
                            }} data={rows} columns={[{ data: 'title', title: 'Title' }, { data: 'description', title: 'Description' }, {
                                data: 'classrooms', title: 'No. Classes', render(data, type, row, meta) {
                                    return data.length
                                },
                            }, {
                                data: 'assignments', title: 'No. assignments', render(data, type, row, meta) {
                                    return data.length
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
        </div>
    );
};

export default Courses;
