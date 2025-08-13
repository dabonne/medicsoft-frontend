import axios from 'axios';

const URL = process.env.REACT_APP_BACKOFFICE_MANAGEMENT
const URL_external = "/backoffice-management/external-api/"

const requestExternal = axios.create({
    baseURL: URL+URL_external,
    withCredentials: false,
    headers: {
        'Accept':'application/json',
    },
});



export default requestExternal