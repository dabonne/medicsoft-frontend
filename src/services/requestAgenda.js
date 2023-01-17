import axios from 'axios';

const URL = "https://medicsoft-agenda.herokuapp.com/"
const URL_BACKOFFICE = "agenda-management/external-api/agenda/"

const requestAgenda = axios.create({
    baseURL: URL+URL_BACKOFFICE,
    withCredentials: false,
    headers: {
        'Accept':'application/json',
    },
});



export default requestAgenda