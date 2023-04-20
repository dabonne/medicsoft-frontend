import axios from 'axios';

const URL = "https://backoffice-dashboard.herokuapp.com/"
const URL_BACKOFFICE = "backoffice-management/external-api/"

const requestBackOffice = axios.create({
    baseURL: URL+URL_BACKOFFICE,
    withCredentials: false,
    headers: {
        'Accept':'application/json',
    },
});



export default requestBackOffice