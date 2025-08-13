import axios from "axios";
import { deleteUser, getUser, setUser } from "./storage";
import requestUser from "./requestUser";
import { apiUser } from "./api";

const URL = process.env.REACT_APP_EMPLOYEE_MANAGEMENT
const URL_EMPLOYE = "/employee-management/external-api/employee/";

const requestEmploye = axios.create({
  baseURL: URL + URL_EMPLOYE,

  headers: {
    Accept: "application/json",
  },
});
  
  requestEmploye.interceptors.request.use(
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
  
  requestEmploye.interceptors.response.use(
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
          return requestEmploye(originalConfig);
        } catch (e) {
          deleteUser()
          window.location.replace("/");
        }
      }
  
      return Promise.reject(error);
    }
  );

export default requestEmploye;
