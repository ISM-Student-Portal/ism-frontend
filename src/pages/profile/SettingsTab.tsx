import { Button } from '@profabric/react-components';
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import { useState, useMemo } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';

const SettingsTab = ({ isActive }: { isActive: boolean }) => {
  const [value, setValue] = useState();
  const [country, setCountry] = useState('');
  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value: any) => {
    setCountry(value);
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
              className="form-control"
              id="inputName"
              placeholder=""
            />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">
            Middle Name
          </label>
          <div className="col-sm-10">
            <input
              type="text"
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
              className="form-control"
              id="inputEmail"
              placeholder="Email"
            />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="inputEmail" className="col-sm-2 col-form-label">
           Alt Email
          </label>
          <div className="col-sm-10">
            <input              
              type="email"
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
              value={value}
              //@ts-ignore
              onChange={setValue} />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="inputName2" className="col-sm-2 col-form-label">
            Alt Phone
          </label>
          <div className="col-sm-10">
            <PhoneInput

            initialValueFormat='national'
              placeholder="Enter phone number"
              value={value}
              //@ts-ignore
              onChange={setValue} />
          </div>
        </div>
        <div className="form-group row">
          <div className=" offset-sm-2 col-sm-3">
            
         { 
        //@ts-ignore
         <Select options={options} value={country} onChange={changeHandler} placeholder={"Select Country"}/>}
          </div>
          <div className=" col-sm-3">
            <input
              type="text"
              className="form-control"
              id="inputCity"
              placeholder="City"
            />
          </div>
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control"
              id="inputAddress"
              placeholder="Address"
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
              placeholder="Name on Cert"
            />
          </div>
        </div>
      
        <div className="form-group row">
          <div className="offset-sm-2 col-sm-10">
            <Button variant="danger">Submit</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsTab;
