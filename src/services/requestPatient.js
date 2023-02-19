import axios from 'axios';

const URL = "https://doctor-management.herokuapp.com/"
const URL_BACKOFFICE = "doctor-management/external-api/doctor/"

const requestPatient = axios.create({
    baseURL: URL+URL_BACKOFFICE,
    withCredentials: false,
    headers: {
        'Accept':'application/json',
    },
});



export default requestPatient