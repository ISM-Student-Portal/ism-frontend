import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { setWindowClass } from '@app/utils/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Form, InputGroup } from 'react-bootstrap';
import { Button } from '@profabric/react-components';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { resetPassword } from '@app/services/authServices';

const ResetPassword = () => {
  const [t] = useTranslation();
  const [params] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();




  const [data, setData] = useState(Object.fromEntries([...params]));

  const resetPass = async (password: string) => {
    setAuthLoading(true);
    try {
      let res = await resetPassword({
        email: data.email,
        password: password,
        token: data.token
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
      // email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: (values) => {
      resetPass(values.password);
      console.log('values', values);
    },
  });

  setWindowClass('hold-transition login-page');

  return (
    <div className="login-box">
      <div className="card card-outline card-warning">
        <div className="card-header text-center">
          <div className="card-header text-center">


            <Link to="/" className="h1">

              <b>ISM</b>
              <span> Portal</span>
            </Link>
          </div>
        </div>
        <div className="card-body">
          <p className="login-box-msg">Enter new password</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
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
                    <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
                      {!showPassword ? <i className="fas fa-eye-slash" /> : <i className="fas fa-eye" />}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat Password"
                  onChange={handleChange}
                  value={values.confirmPassword}
                  isValid={touched.confirmPassword && !errors.confirmPassword}
                  isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                />

                {touched.confirmPassword && errors.confirmPassword ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
                      {!showPassword ? <i className="fas fa-eye-slash" /> : <i className="fas fa-eye" />}
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="row">
              <Button
                disabled={isAuthLoading}
                onClick={handleSubmit as any}
                variant='warning'

              >
                Reset Password
              </Button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
