import axios from 'axios';
import requestUser from './requestUser';
import { apiUser } from './api';
import { deleteUser, getUser, setUser } from './storage';

export const URL_FILE_MANAGEMENT = process.env.REACT_APP_FILE_MANAGEMENT || "https://file-management.medicsoft.app";
const URL = process.env.REACT_APP_BACKOFFICE_MANAGEMENT
const URL_BACKOFFICE = "/backoffice-management/external-api/backoffice/"

const requestOrganisation = axios.create({
    baseURL: URL+URL_BACKOFFICE,
    withCredentials: false,
    headers: {
        'Accept':'application/json',
    },
});

requestOrganisation.interceptors.request.use(
    async (config) => {
      const user = getUser();
      config.headers.Authorization = `Bearer ${user.token}`;
      console.log("requestEmploye.interceptors.request.use")
      return config;
    },
    (error) => {
        console.log("requestEmploye.interceptors.request.use")
      return Promise.reject(error);
    }
  );
  
  requestOrganisation.interceptors.response.use(
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
          return requestOrganisation(originalConfig);
        } catch (e) {
          deleteUser()
          window.location.replace("/");
        }
      }
  
      return Promise.reject(error);
    }
  );

export default requestOrganisation