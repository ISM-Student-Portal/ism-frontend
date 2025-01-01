import { resendVerification } from "@app/services/authServices";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";


const ResendMail = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get('id');
    console.log('id', id);
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
        <div className="container py-5 px-3">

            <div className="row-sm text-center">
                <div className='col-12-sm text-center mx-auto my-3'>
                    <img
                        src={"./img/logo1.png"}

                        alt="AdminLTELogo"
                        height={200}
                        width={180}
                        className="d-block mx-auto"
                    />
                </div>
                <div className="col-12-sm h3-sm h3 text-cyan">
                    An email has been sent to your email address. Please click on the link in the email to verify your email address.
                </div>
                <div className="col-12-sm text-center text-primary h3-sm mx-auto">
                    <button className="p-2 rounded btn btn-primary" onClick={resendNotification}>Resend verification</button>
                </div>
            </div>
        </div>


    );
};

export default ResendMail;
