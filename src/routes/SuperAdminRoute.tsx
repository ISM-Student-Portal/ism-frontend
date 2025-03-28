import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SuperAdminRoute = () => {
    const isLoggedIn = useSelector((state: any) => state.profile.profile);
    return isLoggedIn?.super_admin ? <Outlet /> : <Navigate to="/login" />;
};

export default SuperAdminRoute;
