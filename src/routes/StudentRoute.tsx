import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StudentRoute = () => {
  const isLoggedIn = useSelector((state: any) => state.auth.authentication);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default StudentRoute;
