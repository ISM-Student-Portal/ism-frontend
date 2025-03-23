import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../../components/datatable-original/Datatable';


import React, { useEffect } from 'react';

import { fetchStudentById } from '@app/services/admin/studentServices';
import { ColorRing } from 'react-loader-spinner';
import { Card, Col, Container, ListGroup, Row, } from 'react-bootstrap';
import { useParams } from 'react-router-dom';




const Student = () => {
    const { id } = useParams();

    const [student, setStudent] = React.useState<any>();
    const [loading, setLoading] = React.useState(false);


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
