<FormWizard onComplete={handleComplete} shape="square" stepSize="sm" title="Register" subtitle="Please fill in the form below"

    color="#C28E27">

    <FormWizard.TabContent title="Personal details" icon="ti-user">
        <div className="row">

            <div className="col">
                <label className="text-sm">
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
                <label className="text-sm">
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
                <label className="text-sm">
                    {isAlumni === 'yes' ? 'Previous ISM Email to enjoy 50% discount' : 'Email'}
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
                <label className="text-sm">
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


        </div>








        <div className="row">

            <div className="col-md-6">
                <label className="text-sm">
                    Are you an Alumni?
                    <span
                        style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                    >
                        *
                    </span>

                </label>
                <br />
                <select name="" id="" className="form-control" value={isAlumni} onChange={(e) => setIsAlumni(e.currentTarget.value)}>
                    <option selected>--select--</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>

            {
                isAlumni === 'yes' && (
                    <div className="col-md-6">
                        <label className="text-sm">
                            Alumni Registration No
                            <span
                                style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                            >
                                *
                            </span>

                        </label>
                        <br />
                        <input className="form-control" type="text" value={alumniMatric} onChange={(e) => setAlumniMatric(e.target.value)} />

                    </div>
                )
            }
        </div>





        <div className="row">
            <div className="col-md-6">
                <label className="text-sm">
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
                    countryCallingCodeEditable={true}
                    placeholder="Enter phone number"
                    value={phone}
                    //@ts-ignore

                    defaultCountry={country?.value}
                    //@ts-ignore
                    onChange={setPhone} />

            </div>

            <div className="col-md-6">
                <label className="text-sm">
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
                <label className="text-sm">
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
                <label className="text-sm">
                    Level of Education
                    <span
                        style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                    >
                        *
                    </span>
                </label>
                <br />
                <select name="" id="" className="form-control" value={education} onChange={(e) => setEducation(e.currentTarget.value)} required>
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
                <label className="text-sm">
                    Are You baptized in the Holy Ghost with the evidence of speaking in tongues?
                    <span
                        style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                    >
                        *
                    </span>

                </label>
                <br />
                <select name="" id="" className="form-control" value={baptized} onChange={(e) => setBaptized(e.currentTarget.value)}>
                    <option selected>--select--</option>

                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>

            <div className="col-md-6">
                <label className="text-sm">
                    Have you attended any school of ministry before?
                    <span
                        style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                    >
                        *
                    </span>

                </label>
                <br />
                <select name="" id="" className="form-control" value={attended} onChange={(e) => setAttended(e.currentTarget.value)}>
                    <option selected>--select--</option>

                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>
        </div>


        {
            attended === 'yes' && (
                <div className="row">
                    <label className="text-sm">
                        Tell us where
                        <span
                            style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                        >
                            *
                        </span>

                    </label>
                    <br />
                    <textarea name="" id="" cols={30} rows={5} className="form-control" value={whereAttended} onChange={(e) => setWhereAttended(e.target.value)}></textarea>
                </div>
            )
        }



        <div className="row">

            <div className="col-md-6">
                <label className="text-sm">
                    Mode of Participation
                    <span
                        style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                    >
                        *
                    </span>

                </label>
                <br />
                <select name="" id="" className="form-control" value={participationMode} onChange={(e) => setParticipationMode(e.currentTarget.value)}>
                    <option selected>--select--</option>
                    <option value="online">Online</option>
                    <option value="onsite">On-site</option>
                </select>
            </div>

            <div className="col-md-6">
                <label className="text-sm">
                    Are you a minister?
                    <span
                        style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                    >
                        *
                    </span>

                </label>
                <br />
                <select name="" id="" className="form-control" value={member} onChange={(e) => setMember(e.currentTarget.value)}>
                    <option selected>--select--</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>
        </div>

        {member === 'yes' && (
            <div className="row">

                <div className="col-md-6">
                    <label className="text-sm">
                        Name of Ministry

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
                        value={ministryName}
                        onChange={(e) => setMinistryName(e.target.value)}
                    />
                </div>

                <div className="col-md-6">
                    <label className="text-sm">
                        Position in Ministry
                        <span
                            style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                        >
                            *
                        </span>

                    </label>
                    <br />
                    <input className="form-control" type="text" value={ministryPosition} onChange={(e) => setMinistryPosition(e.target.value)} />
                </div>
            </div>
        )}





    </FormWizard.TabContent>
    <FormWizard.TabContent title="Last step" icon="ti-check">
        <div>
            Please note that this program will cost
            <ul>
                <li>
                    <b>$150 (₦225,000) for Basic plan: Three month training</b>
                </li>
                <li>
                    <b>$250 (₦375,000) for Premium plan: Basic Training  plus weekly Mentorship Sessions with the Principal</b>
                </li>
            </ul>
            <p>Submit your registration to get the payment link in your email and you can proceed to make payment on or before 31st March, 2025</p>
        </div>
        <div className="row">
            <label className="text-sm">
                Tell us about your salvation experience

                <span
                    style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                >
                    *
                </span>

            </label>
            <br />
            <textarea name="" id="" cols={30} rows={5} className="form-control" value={salvationExperience} onChange={(e) => setSalvationExperience(e.target.value)}></textarea>
        </div>
        <div className="row">
            <label className="text-sm">
                What are your expectations?

                <span
                    style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
                >
                    *
                </span>

            </label>
            <br />
            <textarea name="" id="" cols={30} rows={5} className="form-control" value={expectation} onChange={(e) => setExpectation(e.target.value)}></textarea>
        </div>

        <div className="my-3">
            <ReCAPTCHA
                sitekey="6Ld4lKoqAAAAAJKSGNRE-FL0W1gPnKH_LMQXCpGG"
                onChange={onChange}
            />
        </div>
    </FormWizard.TabContent>
</FormWizard>