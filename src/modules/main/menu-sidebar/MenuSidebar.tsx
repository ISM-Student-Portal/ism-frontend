import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MenuItem } from '@components';
import { Image } from '@profabric/react-components';
import styled from 'styled-components';
import i18n from '@app/utils/i18n';

export interface IMenuItem {
  name: string;
  icon?: string;
  path?: string;
  children?: Array<IMenuItem>;
}

export const MENU: IMenuItem[] = [
  {
    name: i18n.t('menusidebar.label.dashboard'),
    icon: 'fas fa-tachometer-alt nav-icon',
    path: '/admin',
  },
  {
    name: i18n.t('menusidebar.label.students'),
    icon: 'fas fa-users nav-icon',
    path: '/admin/students',
  },

  {
    name: 'Classrooms',
    icon: 'fas fa-graduation-cap nav-icon',
    path: '/admin/classroom',
  },
  {
    name: 'Assignments',
    icon: 'fas fa-briefcase nav-icon',
    path: '/admin/assignment',
  },
  {
    name: 'Admins',
    icon: 'fas fa-user-shield nav-icon',
    path: '/admin/admins',
  },
  {
    name: 'Report',
    icon: 'fas fa-user-shield nav-icon',
    path: '/admin/attendance-report',
  },


  // {
  //   name: i18n.t('menusidebar.label.notifications'),
  //   icon: 'fas fa-envelope-square nav-icon',
  //   path: '/Notifications',
  // },

];

export const STUDENT_MENU: IMenuItem[] = [
  {
    name: 'Dashboard',
    icon: 'fas fa-tachometer-alt nav-icon',
    path: '/',
  },
  {
    name: 'Assignments',
    icon: 'fas fa-briefcase nav-icon',
    path: '/assignments',
  },

  {
    name: 'Classrooms',
    icon: 'fas fa-graduation-cap nav-icon',
    path: '/classroom',
  },
  {
    name: 'Submissions',
    icon: 'fas fa-plane nav-icon',
    path: '/submissions',
  },

  // {
  //   name: i18n.t('menusidebar.label.notifications'),
  //   icon: 'fas fa-envelope-square nav-icon',
  //   path: '/notifications',
  // },

];

const StyledBrandImage = styled(Image)`
  float: left;
  line-height: 0.8;
  margin: -1px 8px 0 6px;
  opacity: 0.8;
  --pf-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23) !important;
`;

const StyledUserImage = styled(Image)`
  --pf-box-shadow: 0 3px 6px #00000029, 0 3px 6px #0000003b !important;
`;

const MenuSidebar = () => {
  const authentication = useSelector((state: any) => state.auth.authentication);
  const profile = useSelector((state: any) => state.profile.profile);

  if (profile?.profile?.subscription === 'premium' && STUDENT_MENU.length < 4) {
    STUDENT_MENU.push({
      name: 'Mentorship',
      icon: 'fas fa-chalkboard-teacher nav-icon',
      path: '/mentorship',
    })
  }

  const sidebarSkin = useSelector((state: any) => state.ui.sidebarSkin);
  const menuItemFlat = useSelector((state: any) => state.ui.menuItemFlat);
  const menuChildIndent = useSelector((state: any) => state.ui.menuChildIndent);

  return (
    <aside className={`main-sidebar elevation-4 ${sidebarSkin}`}>
      <Link to={profile.is_admin ? "/admin" : "/"} className="brand-link">
        <StyledBrandImage
          src="/img/logo1.png"
          alt="ISM Logo"
          width={33}
          height={33}
          rounded
        />
        <span className="brand-text font-weight-light">ISM Portal</span>
      </Link>
      <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <StyledUserImage
              src={profile?.profile?.profile_pix_url}
              fallbackSrc="/img/default-profile.png"
              alt="User"
              width={34}
              height={34}
              rounded
            />
          </div>
          <div className="info">
            <Link to={profile.is_admin ? '/admin/profile' : '/profile'} className="d-block">
              {profile?.email}
            </Link>
          </div>
        </div>

        <nav className="mt-2" style={{ overflowY: 'hidden' }}>
          <ul
            className={`nav nav-pills nav-sidebar flex-column${menuItemFlat ? ' nav-flat' : ''
              }${menuChildIndent ? ' nav-child-indent' : ''}`}
            role="menu"
          >
            {profile.is_admin ? (MENU.map((menuItem: IMenuItem) => (
              <MenuItem
                key={menuItem.name + menuItem.path}
                menuItem={menuItem}
              />
            ))) : (
              STUDENT_MENU.map((menuItem: IMenuItem) => (
                <MenuItem
                  key={menuItem.name + menuItem.path}
                  menuItem={menuItem}
                />
              ))
            )}
            {/* {!profile.is_admin && STUDENT_MENU.map((menuItem: IMenuItem) => (
              <MenuItem
                key={menuItem.name + menuItem.path}
                menuItem={menuItem}
              />
            ))} */}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default MenuSidebar;
