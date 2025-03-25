import Footer from '@app/modules/main/footer/Footer';
import { ContentHeader } from '@components';
import DataTable from '../../../components/datatable-original/Datatable';
import React, { useEffect } from 'react';

import { toast } from 'react-toastify';

import { fetchAllPayments } from '@app/services/admin/studentServices';

import { ColorRing } from 'react-loader-spinner';

import { Button } from 'react-bootstrap';
import axios from '../../../utils/axios';



const Payments = () => {
    const [pending, setpending] = React.useState(true);
    const [loading, setLoading] = React.useState(false);


    const [rows, setRows] = React.useState([]);





    const getPayments = async () => {
        const payments = await fetchAllPayments();
        setRows(payments.payments);
        setpending(false);
    }

    const downloadPayments = async () => {
        setLoading(true)
        await axios.get('/admin/payments-export', { responseType: 'blob' }).then((res: any) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Payments.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
            toast.success("Request was successful");

        }).finally(() => {
            setLoading(false);
        })

    }






    useEffect(() => {
        getPayments();
    }, [])
    return (
        <div>
            <ContentHeader title="Payments" />
            <section className="content">

                <div className="container-fluid">
                    {rows.length > 0 ? (
                        <div>
                            <div className="d-grid gap-2 d-md-block py-2 my-5">
                                <Button size='sm' variant='warning' onClick={downloadPayments} className="float-right mx-1" type="button">Download CSV</Button>

                            </div>
                            <div></div>
                            <DataTable className='table table-striped table-bordered order-column dt-head-center' options={{
                                buttons: {
                                    buttons: ['copy', 'csv']
                                }
                            }} data={rows} columns={[{ data: 'student.first_name', title: 'First Name' }, { data: 'student.last_name', title: 'Last Name' }, { data: 'student.email', title: 'Email' }, {
                                data: 'amount', title: 'Amount', render: function (data, type, row) {
                                    return data < 500 ? '$' + Intl.NumberFormat('USD').format(data) : '₦' + Intl.NumberFormat('NGN').format(data);
                                },
                            }, { data: 'reference', title: 'Reference' }, { data: 'status', title: 'Status' }, {
                                data: 'created_at', title: 'Date', render(data, type, row, meta) {
                                    return new Date(data).toLocaleDateString()
                                },
                            }]}>

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

export default Payments;
