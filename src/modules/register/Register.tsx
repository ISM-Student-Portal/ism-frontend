import React, { useMemo, useState } from "react";
import FormWizard from "react-form-wizard-component";
import "react-form-wizard-component/dist/style.css";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css';
import countryList from "react-select-country-list";
import Select from 'react-select'
import { Link, useNavigate } from "react-router-dom";
import { Image } from "@profabric/react-components";
import { registerStudent } from "@app/utils/oidc-providers";
import { toast } from 'react-toastify';




const Register = () => {
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>("");
  const [country, setCountry] = React.useState<{ label: string, value: string }>({ label: 'Nigeria', value: 'NG' });
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


  const handleComplete = async () => {
    console.log("Form completed!");
    let data = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      gender: gender,
      phone: phone,
      country: country?.label,
      city: city,
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
    try {
      setLoading(true);
      // call api to register student
      let response = await registerStudent(data) as { student: any };
      console.log("Data", response);
      toast.success('Registration was successful');
      navigate(`/resend-verification?id=${response.student.id}`);
    }
    catch (error) {
      toast.error('Something went wrong!!! Try again later')


    }
    finally {
      setLoading(false);
    }

    // Handle form completion logic here
  };
  // check validate tab
  const checkValidateTab = () => {
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      phone === "" ||
      country === undefined ||
      city === "" || education === "" || gender === ""
    ) {
      return false;
    }
    return true;
  };
  // error messages
  const errorMessages = () => {
    // you can add alert or console.log or any thing you want
    alert("Please fill in the required fields");
  };

  const handleChange = (selectedOption: any) => {
    setCountry(selectedOption);
  };

  return (
    <div className="container my-5">
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
      <FormWizard onComplete={handleComplete} shape="circle" title="Register" subtitle="Please fill in the form below"
        finishButtonTemplate={(handleComplete) => (
          <button className="finish-button" onClick={handleComplete} disabled={loading}>
            finish
          </button>
        )}
        color="#C28E27">
        <FormWizard.TabContent title="Personal details" icon="ti-user">
          <div className="row">

            <div className="col">
              <label>
                First Name
                <span
                  style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                >
                  *
                </span>
              </label>
              <br />
              <input
                className="form-control"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="for">
                Last Name
                <span
                  style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                >
                  *
                </span>
              </label>
              <br />
              <input className="form-control" type="text" value={lastName}
                onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label>
                Email
                <span
                  style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                >
                  *
                </span>
              </label>
              <br />
              <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="col-md-6">
              <label>
                Phone
                <span
                  style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                >
                  *
                </span>
              </label>
              <br />
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="NG"
                placeholder="Enter phone number"
                value={phone}
                //@ts-ignore
                onChange={setPhone} />

            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label>
                Country of residence
                <span
                  style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                >
                  *
                </span>
              </label>
              <br />
              <Select
                //@ts-ignore 
                options={options}
                value={country} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label>
                City of residence
                <span
                  style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                >
                  *
                </span>
              </label>
              <br />
              <input className="form-control" type="text" value={city} onChange={(e) => setCity(e.target.value)} />


            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label>
                Gender
                <span
                  style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                >
                  *
                </span>
              </label>
              <br />
              <select name="" id="" className="form-control" value={gender} onChange={(e) => setGender(e.currentTarget.value)}>
                <option selected>--Gender--</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="col-md-6">
              <label>
                Level of Education
                <span
                  style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                >
                  *
                </span>
              </label>
              <br />
              <select name="" id="" className="form-control" value={education} onChange={(e) => setEducation(e.currentTarget.value)}>
                <option selected>--Education--</option>

                <option value="bsc">BSc</option>
                <option value="msc">MSc</option>
                <option value="phd">PHD</option>
                <option value="others">Others</option>
              </select>


            </div>
          </div>






        </FormWizard.TabContent>
        {/* Tabs should be validated */}
        <FormWizard.TabContent
          title="Additional Info"
          icon="ti-settings"
          isValid={checkValidateTab()}
          validationError={errorMessages}
        >
          <div className="row gap-20">

            <div className="col-md-6">
              <label className="label">
                Are You baptized in the Holy Ghost with the evidence of speaking in tongues?

              </label>
              <br />
              <select name="" id="" className="form-control" value={baptized} onChange={(e) => setBaptized(e.currentTarget.value)}>
                <option selected>--select--</option>

                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="col-form-label">
                Have you attended any school of ministry before?

              </label>
              <br />
              <select name="" id="" className="form-control" value={attended} onChange={(e) => setAttended(e.currentTarget.value)}>
                <option selected>--select--</option>

                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="row">
            <label>
              Tell us where

            </label>
            <br />
            <textarea name="" id="" cols={30} rows={5} className="form-control" value={whereAttended} onChange={(e) => setWhereAttended(e.target.value)}></textarea>
          </div>

          <div className="row">

            <div className="col-md-6">
              <label className="label">
                Mode of Participation

              </label>
              <br />
              <select name="" id="" className="form-control" value={participationMode} onChange={(e) => setParticipationMode(e.currentTarget.value)}>
                <option selected>--select--</option>
                <option value="online">Online</option>
                <option value="onsite">On-site</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="col-form-label">
                Are you a member?

              </label>
              <br />
              <select name="" id="" className="form-control" value={member} onChange={(e) => setMember(e.currentTarget.value)}>
                <option selected>--select--</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="row">

            <div className="col-md-6">
              <label>
                Name of Ministry

              </label>
              <br />
              <input
                className="form-control"
                type="text"
                value={ministryName}
                onChange={(e) => setMinistryName(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="for">
                Position in Ministry

              </label>
              <br />
              <input className="form-control" type="text" value={ministryPosition} onChange={(e) => setMinistryPosition(e.target.value)} />
            </div>
          </div>



        </FormWizard.TabContent>
        <FormWizard.TabContent title="Last step" icon="ti-check">
          <div className="row">
            <label>
              Tell us about your salvation experience

            </label>
            <br />
            <textarea name="" id="" cols={30} rows={5} className="form-control" value={salvationExperience} onChange={(e) => setSalvationExperience(e.target.value)}></textarea>
          </div>
          <div className="row">
            <label>
              What are your expectations?

            </label>
            <br />
            <textarea name="" id="" cols={30} rows={5} className="form-control" value={expectation} onChange={(e) => setExpectation(e.target.value)}></textarea>
          </div>
        </FormWizard.TabContent>
      </FormWizard>
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
