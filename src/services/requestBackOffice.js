import axios from 'axios';
import { deleteUser, getUser, setUser } from './storage';
import requestUser from './requestUser';
import { apiUser } from './api';

const URL = "https://backoffice-dashboard.herokuapp.com/"
const URL_BACKOFFICE = "backoffice-management/external-api/"

const requestBackOffice = axios.create({
    baseURL: URL+URL_BACKOFFICE,
    headers: {
        'Accept':'application/json',
    },
});

requestBackOffice.interceptors.request.use(
    async (config) => {
      const user = getUser();
      config.headers.Authorization = `Bearer ${user.token}`;
      console.log("requestBackOffice.interceptors.request.use")
      return config;
    },
    (error) => {
        console.log("requestBackOffice.interceptors.request.use")
      return Promise.reject(error);
    }
  );
  
  requestBackOffice.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalConfig = error.config;
  
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
  
        try {
          const user = getUser();
          const refreshToken = user.refreshToken;
          const { data } = await requestUser.post(apiUser.refreshToken+"?refreshToken="+ refreshToken);
          user.token = data.accessToken
          setUser(user)
          return requestBackOffice(originalConfig);
        } catch (e) {
          deleteUser()
          window.location.replace("/");
        }
      }
  
      return Promise.reject(error);
    }
  );


export default requestBackOffice