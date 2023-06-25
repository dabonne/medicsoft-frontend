import axios from 'axios';

export const URLLVM = "https://laafivisionmedical.com/"
const URL = "https://medicsoft-user-management.herokuapp.com/"
const URL_BACKOFFICE = "user-management/external-api/"

const requestUser = axios.create({
    baseURL: URL+URL_BACKOFFICE,
    withCredentials: false,
    headers: {
        'Accept':'application/json',
    },
});



export default requestUser