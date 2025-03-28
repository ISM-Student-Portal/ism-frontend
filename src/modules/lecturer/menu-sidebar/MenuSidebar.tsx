import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MenuItem } from '@components';
import { Image } from '@profabric/react-components';
import styled from 'styled-components';
import { SidebarSearch } from '@app/components/sidebar-search/SidebarSearch';
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
    path: '/lecturer',
  },
  {
    name: 'Courses',
    icon: 'fas fa-users nav-icon',
    path: '/lecturer/courses',
  },
  {
    name: 'Classes',
    icon: 'fas fa-users nav-icon',
    path: '/lecturer/classes',
  },

  {
    name: 'Assignments',
    icon: 'fas fa-envelope-square nav-icon',
    path: '/lecturer/assignments',
  },


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

  const sidebarSkin = useSelector((state: any) => state.ui.sidebarSkin);
  const menuItemFlat = useSelector((state: any) => state.ui.menuItemFlat);
  const menuChildIndent = useSelector((state: any) => state.ui.menuChildIndent);

  return (
    <aside className={`main-sidebar elevation-4`} style={{ backgroundColor: '#2a2f54', color: 'white' }}>
      <Link to={"/admin"} className="brand-link d-flex align-items-center justify-content-around ">
        <Image
          src="/img/logo11.png"
          alt="ISM Logo"
          width={70}
          height={95}
          rounded
        />
        <span className="brand-text font-weight-bold" style={{ color: 'white', marginRight: '17px' }}>ISM Portal</span>
      </Link>
      <div className="sidebar my-5">
        {/* <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <StyledUserImage
              src={profile?.profile_pix_url}
              fallbackSrc="/img/default-profile.png"
              alt="User"
              width={34}
              height={34}
              rounded
            />
          </div>
          <div className="info">
            <Link to="/lecturer/profile" className="d-block" style={{ color: '#c28e27' }}>
              {profile?.email}
            </Link>
          </div>
        </div> */}

        <nav className="mt-2" style={{ overflowY: 'hidden' }}>
          <ul
            className={`nav nav-pills nav-sidebar flex-column${menuItemFlat ? ' nav-flat' : ''
              }${menuChildIndent ? ' nav-child-indent' : ''}`}
            role="menu"
          >
            {MENU.map((menuItem: IMenuItem) => (
              <MenuItem
                key={menuItem.name + menuItem.path}
                menuItem={menuItem}
              />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default MenuSidebar;
