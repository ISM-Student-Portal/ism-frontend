import { Button } from '@profabric/react-components';
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';

import Select from 'react-select';
import countryList from 'react-select-country-list';
import { updateProfile } from '@app/services/admin/studentServices';
import { setProfile } from '../../store/reducers/profile';
import { useDispatch } from 'react-redux';


const SettingsTab = ({ isActive, profile }: { isActive: boolean, profile: any }) => {
  const [value, setValue] = useState();
  const [country, setCountry] = useState(profile?.country);
  const [city, setCity] = useState(profile?.city);
  const [firstName, setFirstName] = useState(profile?.first_name);
  const [lastName, setLastName] = useState(profile?.last_name);
  const [phone, setPhone] = useState(profile?.phone);
  const [nameCert, setNameCert] = useState(profile?.name_on_cert);

  const [email, setEmail] = useState(profile?.email);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();




  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value: any) => {
    setCountry(value);
  }

  const editProfile = async () => {
    setLoading(true);
    try {
      let pCh = await updateProfile({
        first_name: firstName,
        last_name: lastName,
        country: country?.label,
        city: city,

        name_on_cert: nameCert
      });
      if (pCh.status === 'success') {
        toast.success('profile updated successfully');
        dispatch(setProfile(pCh.user_profile));
        localStorage.setItem(
          'profile',
          JSON.stringify({ ...pCh.user_profile })
        );

      }
    }
    catch (error: any) {
      toast.error("Unsuccessful");
    }
    finally {
      setLoading(false);
    }


  }


  return (
    <div className={`tab-pane ${isActive ? 'active' : ''}`}>
      <form className="form-horizontal">
        <div className="form-group row">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">
            First Name
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              value={firstName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFirstName(event.target.value);
              }}
              className="form-control"
              id="inputName"
              placeholder=""
            />
          </div>
        </div>



        <div className="form-group row">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">
            Last Name
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="inputName"
              placeholder=""
              value={lastName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setLastName(event.target.value);
              }}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="inputEmail" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input
              disabled
              type="email"
              value={email}
              className="form-control"
              id="inputEmail"
              placeholder="Email"
            />
          </div>
        </div>


        <div className="form-group row">
          <label htmlFor="inputName2" className="col-sm-2 col-form-label">
            Phone
          </label>
          <div className="col-sm-10">
            <PhoneInput
              className=''
              initialValueFormat='national'
              placeholder="Enter phone number"
              value={phone}
              disabled
              //@ts-ignore
              onChange={setPhone} />
          </div>
        </div>


        <div className="form-group row">
          <div className=" offset-sm-2 col-sm-3">

            {
              //@ts-ignore
              <Select options={options} value={country} onChange={changeHandler} placeholder={"Select Country"} />}
          </div>
          <div className=" col-sm-3">
            <input
              type="text"
              className="form-control"
              id="inputCity"
              placeholder="City"
              value={city}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setCity(event.target.value);
              }}
            />
          </div>

        </div>
        <div className="form-group row">
          <label htmlFor="inputSkills" className="col-sm-3 col-form-label">
            Name On Certificate
          </label>
          <div className="col-sm-9">
            <input
              type="text"
              className="form-control"
              id="inputNameCert"
              placeholder="How you want it to appear on your certificate"
              value={nameCert}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNameCert(event.target.value);
              }}
            />
          </div>
        </div>

        <div className="form-group row">
          <div className="offset-sm-2 col-sm-10">
            <Button variant="primary" onClick={editProfile} disabled={loading}>Submit</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsTab;
