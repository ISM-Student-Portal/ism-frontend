import { Image } from '@profabric/react-components';
import { AnyARecord } from 'node:dns';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { changepass } from '@app/services/authServices';


const StyledContentImage = styled(Image)`
  display: inline-block;
  margin-left: 5px;
  &:first-child {
    margin-left: 0;
  }
`;

const ChangePassword = ({ isActive, profile }: { isActive: boolean, profile: any }) => {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState<any>(null);
    const [repeatPassword, setRepeatPassword] = useState<any>(null);


    const editProfile = async () => {
        if (!password) {
            toast.error('Password cannot be empty!!')
            return;
        }
        if (password !== repeatPassword) {
            toast.error('Password does not match!!')
            return;
        }
        setLoading(true);

        try {
            let res = await changepass({ 'password': password });
            toast.success('profile updated successfully');
            setPassword(null);
            setRepeatPassword(null);


        } catch (error) {

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
                        New Password
                    </label>
                    <div className="col-sm-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setPassword(event.target.value);
                            }}
                            className="form-control"
                            id="inputName"
                            placeholder=""
                        />
                    </div>
                </div>



                <div className="form-group row">
                    <label htmlFor="inputName" className="col-sm-2 col-form-label">
                        Repeat Password
                    </label>
                    <div className="col-sm-4">
                        <input
                            type="password"
                            className="form-control"
                            id="inputName"
                            placeholder=""
                            value={repeatPassword}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setRepeatPassword(event.target.value);
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

export default ChangePassword;
