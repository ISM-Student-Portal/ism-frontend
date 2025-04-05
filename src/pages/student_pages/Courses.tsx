import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../components/datatable-original/Datatable';
import React, { useEffect } from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';

import { toast } from 'react-toastify';

import { createStudent, updateStudentStatus, deleteStudent } from '@app/services/admin/studentServices';
import { ColorRing } from 'react-loader-spinner';
import { fetchAllCourses } from '@app/services/admin/courseServices';
import { useNavigate } from 'react-router-dom';
import { OverlayTrigger, Tooltip, Button, Card } from 'react-bootstrap';


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
                <div>
                    <button className='btn float-right' style={{ backgroundColor: '#2a2f54' }}><a className='text-white' href={'https://res.cloudinary.com/ded69cslb/image/upload/v1743768792/ISM_time_table_p_hixx1t.pdf'} target='_blank' rel='noreferrer'>Get Course Schedule</a></button>
                </div>
                <div className='clearfix'></div>

                <div className="container-fluid">
                    {!loading ? (
                        <div>

                            <div className='row gap-2'>
                                {rows.length > 0 && rows.map((item: any) => (
                                    <Card className='col-2 mx-2'>
                                        <Card.Img variant="top" src={item?.lecturer.profile_pix_url ? item?.lecturer.profile_pix_url : "/img/default-profile.png"} />
                                        <Card.Body>
                                            <Card.Title><b>Title: </b>{item.title}</Card.Title>
                                            <Card.Text>
                                                <b>Description: </b>{item.description}
                                            </Card.Text>
                                            <Card.Text>
                                                <b>Lecturer: </b>{item.lecturer.username}
                                            </Card.Text>

                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
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


                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Courses;
