import React, { useMemo, useRef, useState } from "react";
import "react-form-wizard-component/dist/style.css";
import 'react-phone-number-input/style.css';
import countryList from "react-select-country-list";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "@profabric/react-components";
import { registerStudent } from "@app/utils/oidc-providers";
import { toast } from 'react-toastify';





const Register = () => {
    const [firstName, setFirstName] = React.useState<string>("");
    const [lastName, setLastName] = React.useState<string>("");
    const [phone, setPhone] = React.useState<string>('');
    const [isAlumni, setIsAlumni] = React.useState<string>('');
    const [alumniMatric, setAlumniMatric] = React.useState<string>('');

    const [email, setEmail] = React.useState<string>("");
    const [country, setCountry] = React.useState<{ label: string, value: string }>();
    const [city, setCity] = React.useState<string>("");
    const [gender, setGender] = React.useState<string>("");
    const [education, setEducation] = React.useState<string>("");
    const [baptized, setBaptized] = React.useState<string>("");
    const [attended, setAttended] = React.useState<string>("");
    const [whereAttended, setWhereAttended] = React.useState<string>("");
    const [participationMode, setParticipationMode] = React.useState<string>("");
    const [member, setMember] = React.useState<string>("");
    const [ministryName, setMinistryName] = React.useState<string>("");
    const [ministryPosition, setMinistryPosition] = React.useState<string>("");
    const [salvationExperience, setSalvationExperience] = React.useState<string>("");
    const [expectation, setExpectation] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);

    const options = useMemo(() => countryList().getData(), [])
    const navigate = useNavigate();

    const [captchaToken, setCaptchaToken] = useState(null);
    const captchaRef = useRef(null);


    const handleComplete = async () => {
        let data = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            gender: gender,
            phone: phone,
            country: country?.label,
            city: city,
            alumni_matric_no: alumniMatric,
            is_alumni: isAlumni === 'yes' ? true : false,
            education: education,
            baptized: baptized,
            attended_som_before: attended,
            where_attended: whereAttended,
            participation_mode: participationMode,
            ln_member: member,
            ministry: ministryName,
            ministry_role: ministryPosition,
            salvation_experience: salvationExperience,
            expectations: expectation,
        }
        let dataToSend: any = {};
        Object.entries(data).forEach(entry => {
            const [key, value] = entry;
            if (value !== '') {
                dataToSend[key] = value;
            }
        });

        try {
            setLoading(true);
            // call api to register student
            let response = await registerStudent(dataToSend) as { student: any };
            toast.success('Registration was successful');
            navigate(`/payment/${response.student.id}`);
        }
        catch (error: any) {
            if (error.message === 'Email already exists') {
                if (error.student.email_verified_at === null) {
                    toast.info('Email already exists but not verified', { autoClose: 10000 });
                    navigate(`/resend-verification?id=${error.student.id}`, { state: error });
                }
                else {
                    toast.info('Email already exists and verified', { autoClose: 10000 });
                    navigate(`/payment/${error.student.id}`);
                }
            }
            else {
                toast.error(error.message, {
                    autoClose: 10000
                });
            }


        }
        finally {
            setLoading(false);
        }

        // Handle form completion logic here
    };
    // check validate tab


    // error messages


    return (
        <div className="container my-5 bg-almond" style={{ color: '#2A2F54' }}>
            <div className="card-header text-center">
                <span className='px-1'> <Image
                    src={"./img/logo1.png"}

                    alt="ISM Logo"
                    height={40}
                    width={30}
                /></span>


                <Link to="/" className="h1">


                    <b>ISM</b>
                    <span> Portal</span>
                </Link>
            </div>
            {/* {} */}

            <div className="my-3 h3">Registration has closed!!!</div>
            <div>
                <a className="btn" style={{ background: '#C28E27', color: 'white' }} href={'http://www.femilazarusministries.com'}>Go back</a>
            </div>


            {/* add style */}
            <style>{`
        @import url("https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css");
        .form-control {
            height: 36px;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #495057;
            border: 1px solid #ced4da;
            border-radius: 0.25rem;
        }

        .finish-button{
        float: right;
        
          background-color: #C28E27;
          border: none;
          padding: 10px 20px;
          color: white;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          cursor: pointer;
          margin-right: 10px;
          margin-left: 10px;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          transition: background-color 0.3s ease;
        }
        .finish-button:hover {
          background-color: darkgreen;
          }
        
        .finish-button:focus {
          outline: none;
         }
          
        .finish-button:active {
          transform: translateY(2px);
         }

         .react-form-wizard .wizard-tab-content{
          text-align: left;
         }

        

      `}</style>
        </div >
    );
};

export default Register;
