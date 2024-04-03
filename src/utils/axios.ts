import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


const authentication = localStorage.getItem('authentication');
let token: any = null;
if(authentication){
    token = JSON.parse(authentication).plainTextToken;
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
    config => {
        config.headers['Authorization'] = 'Bearer ' + token
        return config;},

        error => {
            Promise.reject(error)
        }
);

axios.interceptors.response.use(
    response => {
        return response;
    },
    function (error) {
        const navigate = useNavigate();

        if(error.response.status === 401){
            navigate('/login');
            return Promise.reject(error)
        }
    }
)
export default axios;