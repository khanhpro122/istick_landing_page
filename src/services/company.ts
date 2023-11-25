import axios from 'axios';
import { BaseApi } from '.';

const getListCompany = (limit = 10, page = 1, selfManage = false) => {
  return axios.get(`${BaseApi}/api/istick/v1/internal/sys/companies?limit=${limit}&page=${page}&selfManage=${selfManage}`);
};

const getDetailCompany = (companyId: any) => {
  return axios.get(`${BaseApi}/api/istick/v1/internal/sys/companies/${companyId}`);
};

const getDetailSlugCompany = (companySlug: any) => {
  return axios.get(`${BaseApi}/api/istick/v1/internal/sys/companies/slug/${companySlug}`);
};

const createCompany = ( data :any) => {
  return axios.post(`${BaseApi}/api/istick/v1/internal/sys/companies`, data);
};

const updateCompany = ( companyId:string, data :any) => {
  return axios.put(`${BaseApi}/api/istick/v1/internal/sys/companies/${companyId}`, data);
};

const deleteCompany = ( companyId:string) => {
  return axios.delete(`${BaseApi}/api/istick/v1/internal/sys/companies/${companyId}`);
};

export { getListCompany, getDetailCompany, createCompany, updateCompany, deleteCompany, getDetailSlugCompany };
