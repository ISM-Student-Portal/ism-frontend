import { resendVerification } from "@app/services/authServices";
import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";


const ResendMail = () => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [timer, setTimer] = useState(60000);
    console.log('id', location.state);
    const resendNotification = async () => {
        try {
            let res = await resendVerification(id);
            if (res.status === 'success') {
                toast.success('Verification email sent successfully');
            }
            else {
                toast.error('An error occurred ');
            }


        }
        catch (error) {
            toast.error("unable to complete")
        }
    }

    return (
        <div className="container-fluid" style={{ color: '#2A2F54' }}>
            <div className="container my-5">
                <div className="h-100 pagination-centered card">
                    <div className='col-12-sm text-center mx-auto my-3 card-header'>
                        <img
                            src={"./img/logo1.png"}

                            alt="AdminLTELogo"
                            height={100}
                            width={80}
                            className="d-block mx-auto"
                        />
                    </div>
                    <div className="card-body text-center">
                        An email has been sent to your email address. Please click on the link in the email to verify your email address.
                    </div>
                    {location.state.wrong_email && <div className="card-body text-center text-danger">
                        {location.state.wrong_email}
                    </div>}
                    <div className="col-12-sm text-center text-primary h3-sm mx-auto card-footer">
                        <button className="p-2 rounded btn btn-primary" style={
                            {
                                backgroundColor: '#C28E27',
                                borderColor: '#C28E27'
                            }
                        } onClick={resendNotification}>Resend verification</button>
                    </div>
                </div>
            </div>


        </div>


    );
};

export default ResendMail;
