import axios from 'axios';

const URL = "https://backoffice-dashboard.herokuapp.com/"
const URL_external = "backoffice-management/external-api/"

const requestExternal = axios.create({
    baseURL: URL+URL_external,
    withCredentials: false,
    headers: {
        'Accept':'application/json',
    },
});



export default requestExternal