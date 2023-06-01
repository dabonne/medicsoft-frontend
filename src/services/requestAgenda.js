import axios from 'axios';
import { deleteUser, getUser, setUser } from './storage';
import { apiUser } from './api';
import requestUser from './requestUser';

const URL = "https://medicsoft-agenda.herokuapp.com/"
const URL_BACKOFFICE = "agenda-management/external-api/agenda/"

const requestAgenda = axios.create({
    baseURL: URL+URL_BACKOFFICE,
    headers: {
        'Accept':'application/json',
    },
});

requestAgenda.interceptors.request.use(
    async (config) => {
      const user = getUser();
      config.headers.Authorization = `Bearer ${user.token}`;
      console.log("requestAgenda.interceptors.request.use")
      return config;
    },
    (error) => {
        console.log("requestAgenda.interceptors.request.use")
      return Promise.reject(error);
    }
  );
  
  requestAgenda.interceptors.response.use(
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
          return requestAgenda(originalConfig);
        } catch (e) {
          deleteUser()
          window.location.replace("/");
        }
      }
  
      return Promise.reject(error);
    }
  );

export default requestAgenda