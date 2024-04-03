import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const isLoggedIn = useSelector((state: any) => state.profile.profile);
  console.log(isLoggedIn, "profile")
  return isLoggedIn?.is_admin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
