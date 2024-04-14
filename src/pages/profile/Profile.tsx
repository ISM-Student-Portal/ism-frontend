import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentHeader } from '@components';
import { Image } from '@profabric/react-components';
import styled from 'styled-components';

import ActivityTab from './ActivityTab';
import TimelineTab from './TimelineTab';
import SettingsTab from './SettingsTab';
import { Button } from '@app/styles/common';
import { useSelector } from 'react-redux';

const StyledUserImage = styled(Image)`
  --pf-border: 3px solid #adb5bd;
  --pf-padding: 3px;
`;

const Profile = () => {
  const [activeTab, setActiveTab] = useState('SETTINGS');
  const profile = useSelector((state: any) => state.profile.profile);
  console.log(profile)

  // const [editProflie, setEditProfile ] = useState<any>(profile);

  const [t] = useTranslation();

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

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
                      width={100}
                      height={100}
                      rounded
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
                      <button
                        type="button"
                        className={`nav-link ${activeTab === 'SETTINGS' ? 'active' : ''
                          }`}
                        onClick={() => toggle('SETTINGS')}
                      >
                        Edit Profile
                      </button>
                    </li>
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
    </>
  );
};

export default Profile;
