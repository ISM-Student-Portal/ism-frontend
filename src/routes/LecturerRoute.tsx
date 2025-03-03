import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const LecturerRoute = () => {
    const isLoggedIn = useSelector((state: any) => state.profile.profile);
    console.log(isLoggedIn, "profile")
    return isLoggedIn.is_lecturer ? <Outlet /> : <Navigate to="/login" />;
};

export default LecturerRoute;
