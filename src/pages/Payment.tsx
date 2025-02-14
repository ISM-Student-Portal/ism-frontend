import { fetchStudent, studentPay } from '@app/services/paymentServices';
import { Image } from '@profabric/react-components';
import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { usePaystackPayment } from 'react-paystack';
import CurrencyInput from 'react-currency-input-field'
import { ColorRing } from 'react-loader-spinner';



const Payment = () => {
    const [student, setStudent] = useState<any>();
    const [amount, setAmount] = useState<any>();
    const [plan, setPlan] = useState<any>();
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const config = {
        reference: (new Date()).getTime().toString(),
        email: student?.email,
        currency: student?.country === 'Nigeria' ? 'NGN' : 'USD',
        amount: amount * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
        publicKey: process.env.REACT_APP_PAYSTACK_KEY ?? '',
        subaccount: process.env.REACT_APP_SPLIT_ACCOUNT ?? ''
    };

    const initializePayment = usePaystackPayment(config);

    const getStudentInfo = async () => {
        try {
            setLoading(true);
            let res = await fetchStudent(id);
            console.log(res)
            setStudent(res.student);

        }
        catch (error) {
            toast.error("unable to complete")
        }
        finally {
            setLoading(false);
        }
    }

    // you can call this function anything
    const onSuccess = async (reference: any) => {
        // Implementation for whatever you want to do with reference and after success call.
        try {
            setLoading(true);

            const response = await studentPay({ reference, amount, plan, id });
            if (response.status === "success") {
                toast.success("Payment Successful");
                getStudentInfo();
                console.log(response);
            }

        } catch (error) {
            toast.error("Payment Failed", { autoClose: 10000 });
        }
        finally {
            setLoading(false);

        }
    }

    // you can call this function anything
    const onClose = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('closed')
    }

    const selectPlan = (e: any) => {
        setPlan(e.target.value);
        if (e.target.value === "basic") {
            if (student.is_alumni) {
                if (student.country !== 'Nigeria') { setAmount(150 / 2) }
                else setAmount(225000 / 2);
            }
            else {
                if (student.country !== 'Nigeria') { setAmount(150) }
                else setAmount(225000);
            }
        }
        else if (e.target.value === "premium") {
            if (student.is_alumni) {
                if (student.country !== 'Nigeria') { setAmount(250 / 2) }
                else setAmount(375000 / 2);
            }
            else {
                if (student.country !== 'Nigeria') { setAmount(250) }
                else setAmount(375000);
            }
        }
        else {
            setAmount(null)
        }
    }

    useEffect(() => {
        getStudentInfo();
    }, []);



    return (
        <div className='h-100'>
            {loading ? <div className='h-100 d-flex align-items-center justify-content-center'><ColorRing
                visible={true}
                height="150"
                width="150"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}

            />Loading... Please wait </div> : (
                <div className="container" style={{ color: '#2A2F54' }}>
                    {student.payment_complete ? (
                        <div>
                            <div className="card-header text-center">
                                <span className='px-1'> <Image
                                    src={"../img/logo1.png"}
                                    alt="ISM Logo"
                                    height={40}
                                    width={30}
                                /></span>
                                <Link to="/" className="h1">


                                    <b>ISM</b>
                                    <span> Portal</span>
                                </Link>
                            </div>
                            <div>
                                <div className="card">
                                    <div className="card-header">
                                        <h4>Payment Completed</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>First Name</label>
                                                    <input type="text" className="form-control" value={student?.first_name} disabled />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Last Name</label>
                                                    <input type="text" className="form-control" value={student?.last_name} disabled />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Email</label>
                                                    <input type="text" className="form-control" value={student?.email} disabled />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Phone Number</label>
                                                    <input type="text" className="form-control" value={student?.phone} disabled />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Plan</label>
                                                    <input type="text" className="form-control" value={student?.plan} disabled />
                                                </div>
                                            </div>

                                        </div>



                                    </div>
                                    <div className='card-footer' style={{ color: '#2A2F54' }}>
                                        Please check your email for further information.
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="card-header text-center">
                                <span className='px-1'> <Image
                                    src={"../img/logo1.png"}
                                    alt="ISM Logo"
                                    height={40}
                                    width={30}
                                /></span>
                                <Link to="/" className="h1">


                                    <b>ISM</b>
                                    <span> Portal</span>
                                </Link>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <h4>Payment Information</h4>
                                </div>
                                <div className="card-body">

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>First Name</label>
                                                <input type="text" className="form-control" value={student?.first_name} disabled />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Last Name</label>
                                                <input type="text" className="form-control" value={student?.last_name} disabled />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input type="text" className="form-control" value={student?.email} disabled />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Phone Number</label>
                                                <input type="text" className="form-control" value={student?.phone} disabled />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Plan</label>
                                                <select className="form-control" value={plan} onChange={selectPlan}>
                                                    <option value="">--plan--</option>
                                                    <option value="basic">Basic - $150/₦225,000: Three month training.</option>
                                                    <option value="premium">Premium - $250/375,000: Basic Training  plus weekly Mentorship Sessions with the Principal</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>{student.is_alumni ? "Discounted Amount (50%)" : "Amount"}</label>
                                                <CurrencyInput
                                                    id="input-example"
                                                    name="input-name"
                                                    prefix={student.country === 'Nigeria' ? '₦' : '$'}
                                                    placeholder=""
                                                    defaultValue={amount}
                                                    decimalsLimit={2}
                                                    value={amount}
                                                    disabled
                                                    className='form-control'
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <button className="btn btn-primary w-100" style={
                                                {
                                                    backgroundColor: '#C28E27',
                                                    borderColor: '#C28E27'
                                                }
                                            } disabled={!amount || !plan || loading} onClick={() => {
                                                initializePayment({ onSuccess, onClose })
                                            }}>Pay Now</button>
                                        </div>
                                    </div>
                                    {amount && (
                                        <div className='card-footer' style={{ color: '#2A2F54' }}>
                                            <p className='text-bold'>Please note that this payment is non-refundable</p>
                                            <p className=''>Regardless of the price being in Naira, you can make payment with your local currency card, the Naira equivalent will be deducted from your card. <br></br>

                                                For any difficulty in paying, please contact: <b>+234 903 464 6810,</b>  <b>+234 903 095 9735</b></p>
                                        </div>
                                    )}

                                </div>
                            </div></div>
                    )}

                </div>
            )}

        </div>

    );
};

export default Payment;
