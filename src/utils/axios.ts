import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
console.log('got here');
const authentication = localStorage.getItem('authentication');
let token: any = null;
if(authentication){
    token = JSON.parse(authentication).plainTextToken;
}

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        Authorization: 'Bearer ' + token
    }
})




// axios.defaults.baseURL = process.env.REACT_APP_API_URL;

instance.interceptors.request.use(
    config => {
        if(token){
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;},

        error => {
            Promise.reject(error)
        }
);

instance.interceptors.response.use(
    response => {
        return response;
    },
    function (error) {
        if(error.response.status === 401){
            // localStorage.removeItem("authentication");
            // localStorage.removeItem("profile");

        }
        else if(error.response.status === 404){
            
        }
        return Promise.reject(error)

    }
)
export default instance;