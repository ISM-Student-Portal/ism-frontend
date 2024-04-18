import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { setWindowClass } from '@app/utils/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Form, InputGroup } from 'react-bootstrap';
import { Button } from '@profabric/react-components';
import { forgotPasswordAction } from '@app/services/authServices';
import { useState } from 'react';

const ForgotPassword = () => {
  const [t] = useTranslation();
  const [isAuthLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();



  const forgotPass = async (email: string) => {
    setAuthLoading(true);
    try {
      let res = await forgotPasswordAction({
        email: email       
      });
      if (res.status === 'success') {
        toast.success('Check your mail for Instructions');
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
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: (values) => {
      forgotPass(values.email);
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
          <p className="login-box-msg">{t('recover.forgotYourPassword')}</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  value={values.email}
                  isValid={touched.email && !errors.email}
                  isInvalid={touched.email && !!errors.email}
                />
                {touched.email && errors.email ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-envelope" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="row">
            <Button
                      
                      onClick={handleSubmit as any}
                      variant='warning'
                      loading={isAuthLoading}

                    >
                      {t('recover.requestNewPassword')}
                    </Button>
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

export default ForgotPassword;
