import axios from 'axios';
import { BaseApi } from '.';

const loginWithGoogle = (data: {idToken: string, userType: string}) => {
  return axios.post(`${BaseApi}/api/istick/v1/internal/iam/users/google-oauth`, data);
};

const logoutUser = () => {
  return axios.post(`${BaseApi}/api/istick/v1/internal/iam/users/logout`);
};

const getUserInfo = () => {
  return axios.get(`${BaseApi}/api/istick/v1/internal/iam/users/self-info`);
};

const updateUserInfo = ( userId: string, data :any) => {
  return axios.put(`${BaseApi}/api/istick/v1/internal/iam/users/${userId}`, data);
};

const uploadFile = (data:any) => {
  return axios.post(`${BaseApi}/api/istick/v1/internal/sys/upload/files`, data)
}

export { loginWithGoogle,getUserInfo, updateUserInfo, uploadFile, logoutUser };
