import { fetchStudent, studentPay } from '@app/services/paymentServices';
import { Image } from '@profabric/react-components';
import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { usePaystackPayment } from 'react-paystack';
import CurrencyInput from 'react-currency-input-field'
import { ColorRing } from 'react-loader-spinner';

interface Config {
    [key: string]: any
}

const Payment = () => {
    const [student, setStudent] = useState<any>();
    const [amount, setAmount] = useState<any>();
    const [plan, setPlan] = useState<any>(null);
    const [paymentPlan, setPaymentPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const config: Config = {
        reference: (new Date()).getTime().toString(),
        email: student?.email,
        currency: student?.country === 'Nigeria' ? 'NGN' : 'USD',
        amount: amount * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
        publicKey: process.env.REACT_APP_PAYSTACK_KEY ?? '',
    };

    if (student?.country === 'Nigeria') {
        config.subaccount = process.env.REACT_APP_SPLIT_ACCOUNT ?? ''
    }

    //@ts-ignore
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
        setAmount(null);
        setPaymentPlan(0);
    }

    const selectPaymentPlan = (e: any) => {
        console.log(e.target.value);
        setPaymentPlan(e.target.value);
        if (e.target.value === 'part') {
            if (plan === "basic") {
                if (student.is_alumni) {
                    if (student.country !== 'Nigeria') { setAmount(150 / 4) }
                    else setAmount(225000 / 4);
                }
                else {
                    if (student.country !== 'Nigeria') { setAmount(150 / 2) }
                    else setAmount(225000 / 2);
                }
            }
            else if (plan === "premium") {
                if (student.is_alumni) {
                    if (student.country !== 'Nigeria') { setAmount(250 / 4) }
                    else setAmount(375000 / 4);
                }
                else {
                    if (student.country !== 'Nigeria') { setAmount(250 / 2) }
                    else setAmount(375000 / 2);
                }
            }
        }
        else {
            if (plan === "basic") {
                if (student.is_alumni) {
                    if (student.country !== 'Nigeria') { setAmount(150 / 2) }
                    else setAmount(225000 / 2);
                }
                else {
                    if (student.country !== 'Nigeria') { setAmount(150) }
                    else setAmount(225000);
                }
            }
            else if (plan === "premium") {
                if (student.is_alumni) {
                    if (student.country !== 'Nigeria') { setAmount(250 / 2) }
                    else setAmount(375000 / 2);
                }
                else {
                    if (student.country !== 'Nigeria') { setAmount(250) }
                    else setAmount(375000);
                }
            }
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
                                                    <option value="premium">Premium - $250/₦375,000: Basic Training  plus weekly Mentorship Sessions with the Principal</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Payment Plan</label>
                                                <select className="form-control" value={paymentPlan} onChange={selectPaymentPlan} disabled={plan === null}>
                                                    <option value="">--Payment-Plan--</option>
                                                    <option value="full">Full Payment</option>
                                                    <option value="part">50% Initial Deposit Installment Plan - Balance MUST be made on or before 5th of May, 2025 to avoid removal from the school.</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
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

                                    <div className='card-footer' style={{ color: '#2A2F54' }}>
                                        <p className=''>
                                            Kindly disregard the currency as this payment is compatible with your county local currency card, the payment supports all kinds of Mastercard, Visa, Verve, and American Express (Amex) card.

                                            <br></br>The equivalent fee will be deducted in your local currency.<br></br>
                                            <br></br>
                                            <br></br>
                                            For any difficulty in using the payment method above, kindly make a transfer to any of these account details below.<br></br> <span className='text-danger'>
                                                Please send your name, email, phone number, plan and payment receipt used for registration to this email address femilazarusschoolofministry@gmail.com<br></br>
                                                You will receive a payment confirmation email within three (3) working days.
                                            </span>

                                            <ul>
                                                <li>
                                                    Naira Account <br></br>
                                                    Femi Lazarus Ministries:<br></br> <b>1917548968</b><br></br> Access Bank
                                                </li>
                                                <li>
                                                    Dollar Account<br></br>
                                                    Femi Lazarus Ministries <br></br><b>2324428894</b><br></br> Swift Code - UNAFNGLA UBA
                                                </li>
                                                <li>
                                                    Cedis Account<br></br>
                                                    Sphere of Light, Church<br></br> <b>6013101078</b> <br></br>Zenith Bank
                                                </li>
                                                <li>
                                                    PayPal Account <br></br>
                                                    Email Address - <b>FLAME@FEMILAZARUS.COM</b><br></br> Name - Femi Lazarus Ministries
                                                </li>
                                            </ul>
                                            <br></br>
                                            For payment in installment, only 50% payment is allowed, and the balance must be paid on or before the 5th of May, 2025. Any amount paid outside this will not be accepted and it is non-refundable.
                                            <br></br>
                                            For any other difficulty in paying or for further enquiries please contact: <b>+234 903 464 6810, +234 903 095 9735</b>
                                        </p>
                                    </div>

                                </div>
                            </div></div>
                    )}

                </div>
            )}

        </div>

    );
};

export default Payment;
