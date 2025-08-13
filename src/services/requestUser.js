import axios from 'axios';

export const URLLVM = "https://laafivisionmedical.com/"
const URL = process.env.REACT_APP_USER_MANAGEMENT
const URL_BACKOFFICE = "/user-management/external-api/"

const requestUser = axios.create({
    baseURL: URL+URL_BACKOFFICE,
    withCredentials: false,
    headers: {
        'Accept':'application/json',
    },
});



export default requestUser