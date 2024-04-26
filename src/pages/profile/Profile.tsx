import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentHeader } from '@components';
import { Image } from '@profabric/react-components';
import styled from 'styled-components';

import SettingsTab from './SettingsTab';
import axios from '../../utils/axios';

// import { Button } from '@app/styles/common';
import Button from '@mui/material/Button';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Cloudinary } from '@cloudinary/url-gen';


import { useDispatch, useSelector } from 'react-redux';
import { Box, Modal } from '@mui/material';
import { toast } from 'react-toastify';
import { uploadPics } from '@app/services/admin/studentServices';
import { setProfile } from '@app/store/reducers/profile';
import { getAdmission } from '@app/services/student/classServices';

const StyledUserImage = styled(Image)`
  --pf-border: 3px solid #adb5bd;
  --pf-padding: 3px;
`;

const Profile = () => {
  const [activeTab, setActiveTab] = useState('SETTINGS');
  const profile = useSelector((state: any) => state.profile.profile);
  const [uploadOpen, setUploadOpen] = useState(false)
  const [filename, setFilename] = useState<any>()
  const [file, setFile] = useState<any>()
  const [preview, setPreview] = useState<any>()


  const [loading, setLoading] = useState(false)

  // const [editProflie, setEditProfile ] = useState<any>(profile);

  const [t] = useTranslation();

  const handleUploadOpen = () => {
    setUploadOpen(true);
  };
  const handleUploadClose = () => {
    setUploadOpen(false);
  };
  const dispatch = useDispatch();


  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const UploadPics = async () => {
    setLoading(true);
    let formData = new FormData();
    let cloudName = 'ded69cslb';
    formData.append('upload_preset', 'ml_default');
    formData.append('file', file);
    let url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    fetch(url, {
      method: 'POST',
      body: formData
    }).then((response) => response.json()).then((data) => {
      let res = uploadPics({ profile_pix_url: data.url });
      res.then((res) => {
        toast.success("Uploaded Successfully");
        dispatch(setProfile(res.user_profile));
        localStorage.setItem(
          'profile',
          JSON.stringify({ ...res.user_profile })
        );
        handleUploadClose();
      })


    }).catch((error) => {
      toast.error('Error uploading picture')
    })


    //@ts-ignore

    setLoading(false);
    handleUploadClose();


  }

  const getAdmissionLetter = async () => {
    // let res = getAdmission().then((res: any) => {
    //   console.log(res)
    //   const url = window.URL.createObjectURL(new Blob([res.data]));
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.setAttribute('download', 'admission_letter.pdf'); //or any other extension
    //   document.body.appendChild(link);
    //   link.click();
    // })

    axios.get('get-admission-letter', { responseType: 'blob' }).then((res: any) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'admission_letter.pdf'); //or any other extension
      document.body.appendChild(link);
      link.click();
    })
    toast.success("Request was successful");


  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const file: any = e.target.files[0];
    setFile(file);
    const { name } = file;

    setFilename(name);
  };

  useEffect(() => {
    if (!file) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  return (
    <>
      <ContentHeader title="Profile" />
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <div className="card card-primary card-outline">
                <div className="card-body box-profile">
                  <div className="text-center">
                    <StyledUserImage
                      onClick={handleUploadOpen}
                      rounded
                      width={100}
                      height={100}
                      className='ro'
                      src={profile?.profile?.profile_pix_url ? profile?.profile?.profile_pix_url : "/img/default-profile.png"}
                      alt="User profile"
                    />
                  </div>
                  <h3 className="profile-username text-center">
                    {profile?.profile?.first_name} {profile?.profile?.last_name}
                  </h3>

                </div>
                {/* /.card-body */}
              </div>
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">{t('main.label.aboutMe')}</h3>
                </div>
                <div className="card-body">
                  <strong>
                    <i className="fas fa-book mr-1" />
                    Email
                  </strong>
                  <p className="text-muted">
                    {profile?.email}
                  </p>
                  <hr />
                  <strong>
                    <i className="fas fa-book mr-1" />
                    Alternate Email
                  </strong>
                  <p className="text-muted">
                    {profile?.profile?.alt_email}
                  </p>
                  <hr />
                  <strong>
                    <i className="fas fa-book mr-1" />
                    Subscription
                  </strong>
                  <p className="text-muted">
                    {profile?.profile?.subscription}
                  </p>
                  <hr />
                  <strong>
                    <i className="fas fa-book mr-1" />
                    Phone
                  </strong>
                  <p className="text-muted">
                    {profile?.profile?.phone}
                  </p>
                  <hr />
                  <strong>
                    <i className="fas fa-book mr-1" />
                    Alternate Phone
                  </strong>
                  <p className="text-muted">
                    {profile?.profile?.alt_phone}
                  </p>
                  <hr />
                  <strong>
                    <i className="fas fa-map-marker-alt mr-1" />
                    {t('main.label.location')}
                  </strong>
                  <p className="text-muted">{profile?.profile?.country} {profile?.profile?.address} {profile?.profile?.city}</p>
                  <hr />

                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div className="card">
                <div className="card-header p-2">
                  <ul className="nav nav-pills">


                    <li className="nav-item">
                      <span
                        // type="button"
                        className={`nav-link ${activeTab === 'SETTINGS' ? 'active' : ''
                          }`}
                      >
                        Edit Profile
                      </span>

                    </li>
                    {profile.is_admin ? (
                      <div></div>
                    ) : (
                      <li className="nav-item">
                        <span
                          // type="button"
                          className={`nav-link`}
                          style={{
                            cursor: "pointer"
                          }}
                          onClick={getAdmissionLetter}

                        >
                          Get Admission Letter
                        </span>

                      </li>
                    )}

                  </ul>
                </div>
                <div className="card-body">
                  <div className="tab-content">
                    {/* <ActivityTab isActive={activeTab === 'ACTIVITY'} /> */}
                    {/* <TimelineTab isActive={activeTab === 'TIMELINE'} /> */}
                    <SettingsTab isActive={activeTab === 'SETTINGS'} profile={profile} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Modal
        open={uploadOpen}
        onClose={handleUploadClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description">
        <Box sx={{ ...style, width: '50%', borderRadius: '5px', marginX: 'auto' }}>
          <h4 id="child-modal-title" className='text-center text-'>Upload profile picture</h4>
          <span className='w-75 mx-auto'>{preview ? (<img width={100} height={100} src={preview} alt="pix" />) : (<img width={100} height={100} src="/img/default-profile.png" />)}</span>

          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileIcon />}
            sx={{ marginX: "1rem" }}
            disabled={loading}
          >
            Upload Picture
            <input
              type="file"
              hidden
              onChange={handleFileUpload}
            />
          </Button>
          <br />

          {/* <Button variant="outlined" onClick={handleClose}>Close Child Modal</Button> */}
          <div className='text-right my-2'>
            <Button variant='outlined' size='small' sx={{
              marginRight: ".2rem"
            }} onClick={handleUploadClose}>Cancel</Button>
            <Button variant='contained' size='small' onClick={UploadPics}>Submit</Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Profile;
