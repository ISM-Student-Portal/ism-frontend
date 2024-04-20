import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setWindowClass } from '@app/utils/helpers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Form, InputGroup } from 'react-bootstrap';
import { Button } from '@app/styles/common';
import { Image } from '@profabric/react-components';
import { changepass } from '@app/services/authServices';
import { useState } from 'react';


const RecoverPassword = () => {
  const [isAuthLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();


  const [t] = useTranslation();
  const changePassword = async (password: any) => {
    setAuthLoading(true);
    try {
      let res = await changepass({
        password: password,
      });
      if (res.status === 'success') {
        toast.success('password changed successfully');
        navigate('/login');
      }
      else {
        toast.error('An error occurred ');

      }

    }
    catch (error) {
      toast.error("unable to complete")
    }

    setAuthLoading(false);

  }

  const { handleChange, values, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(5, 'Must be 5 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required('Required'),
      confirmPassword: Yup.string()
        .min(5, 'Must be 5 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required('Required'),
    }),
    onSubmit: (values) => {
      changePassword(values.password);
      console.log('values', values);
    },
  });

  setWindowClass('hold-transition login-page');
  return (
    <div className="login-box">
      <div className="card card-outline card-warning">
        <div className="card-header text-center">
          <span className='px-1'> <Image
            src={"./img/logo1.png"}

            alt="AdminLTELogo"
            height={40}
            width={30}
          /></span>


          <Link to="/" className="h1">


            <b>ISM</b>
            <span> Portal</span>
          </Link>
        </div>
        <div className="card-body">
          <p className="login-box-msg">{t('recover.oneStepAway')}</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={values.password}
                  isValid={touched.password && !errors.password}
                  isInvalid={touched.password && !!errors.password}
                />
                {touched.password && errors.password ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-lock" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  onChange={handleChange}
                  value={values.confirmPassword}
                  isValid={touched.confirmPassword && !errors.confirmPassword}
                  isInvalid={
                    touched.confirmPassword && !!errors.confirmPassword
                  }
                />
                {touched.confirmPassword && errors.confirmPassword ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-lock" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="row">
              <div className="col-12">
                <Button
                  disabled={isAuthLoading}

                  onClick={handleSubmit as any}>{t('recover.changePassword')}</Button>
              </div>
            </div>
          </form>
          <p className="mt-3 mb-1">
            <Link to="/login">{t('login.button.signIn.label')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
