import axios from 'axios';

const URL = "https://medicsoft-employee-management.herokuapp.com/"
const URL_EMPLOYE = "employee-management/external-api/employee/"

const requestEmploye = axios.create({
    baseURL: URL+URL_EMPLOYE,
    
    headers: {
        'Accept':'application/json',
    },
});



export default requestEmploye