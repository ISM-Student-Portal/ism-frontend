import { resendVerification } from "@app/services/authServices";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";


const ResendMail = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    searchParams.get('id');
    const resendNotification = async () => {
        try {
            let res = await resendVerification();
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
        <div className="h-100vh py-5">

            <div className='d-flex flex-column w-100  px-5 justify-content-center align-items-center my-7 gap-5' >
                <div className='col-6 w-75 mx-auto'>
                    <img
                        src={"./img/logo1.png"}

                        alt="AdminLTELogo"
                        height={150}
                        width={120}
                        z-index-3
                        className="d-block mx-auto"
                    />
                </div>
                <div className="col-6 w-100 text-center">
                    An email has been sent to your email address. Please click on the link in the email to verify your email address.
                </div>
                <div className="col-6 w-100 text-center">
                    <button className="p-2 rounded" onClick={resendNotification}>Resend verification</button>
                </div>
            </div>
        </div>


    );
};

export default ResendMail;
