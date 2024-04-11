import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { setAuthentication } from '@store/reducers/auth';
import { setWindowClass } from '@app/utils/helpers';
import { Checkbox } from '@profabric/react-components';
import * as Yup from 'yup';

import { authLogin, getAuthStatus, getProfileStatus } from '@app/utils/oidc-providers';
import { Form, InputGroup, ToggleButton } from 'react-bootstrap';
import { Button } from '@app/styles/common';
import { Image } from '@profabric/react-components';
import { setProfile } from '@app/store/reducers/profile';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ButtonBase } from '@mui/material';


const Login = () => {
  const [isAuthLoading, setAuthLoading] = useState(false);
  const [isGoogleAuthLoading, setGoogleAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFacebookAuthLoading, setFacebookAuthLoading] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [t] = useTranslation();

  const login = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      const response: any = await authLogin(email, password);
      const authStatus: any = await getAuthStatus();
      let profile: any = await getProfileStatus();

      if (authStatus) {
        dispatch(setAuthentication(authStatus));
        dispatch(setProfile(profile));
      }
      // console.log(response);

      toast.success('Login is Successful!');
      setAuthLoading(false);
      // dispatch(loginUser(token));
      if (response.profile.is_admin === 1) {
        console.log('here')
        navigate('/admin');
      } else {
        navigate('/');
      }
      window.location.reload();
    } catch (error: any) {
      setAuthLoading(false);
      toast.error(error.message || 'Failed');
    }
  };





  const { handleChange, values, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(5, 'Must be 5 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required('Required'),
    }),
    onSubmit: (values) => {
      login(values.email, values.password);
    },
  });

  setWindowClass('hold-transition login-page');

  return (
    <div className='login-box'>
      <div className='d-none d-md-block col-6' >
        {/* <div style={{ width: '50%', margin: "auto" }}>
          <Image
            src={"./img/logo1.png"}

            alt="AdminLTELogo"
            height={360}
            width={280}
          />
        </div> */}
      </div>
      <div className='w-100 h-100'>
        <div className="login-box mx-auto ">
          <div className="card card-outline card-warning">
            <div className="card-header text-center">


              <Link to="/" className="h1">

                <b>ISM</b>
                <span> Portal</span>
              </Link>
            </div>
            <div className="card-body">
              <p className="login-box-msg">{t('login.label.signIn')}</p>
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

                <div className="row">
                  <div className="col-8">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox checked={false} />
                      <label style={{ margin: 0, padding: 0, paddingLeft: '4px' }}>
                        {t('login.label.rememberMe')}
                      </label>
                    </div>
                  </div>
                  <div className="col-4 mybutton">
                    <Button
                      loading={isAuthLoading}
                      disabled={isFacebookAuthLoading || isGoogleAuthLoading}
                      onClick={handleSubmit as any}
                      variant='warning'

                    >
                      {t('login.button.signIn.label')}
                    </Button>
                  </div>
                </div>
              </form>

              <p className="mb-1 text-warning">
                <Link to="/forgot-password">{t('login.label.forgotPass')}</Link>
              </p>

            </div>
          </div>
        </div>
      </div>

    </div>

  );
};

export default Login;
