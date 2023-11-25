import axios from "axios";
import { BaseApi } from ".";

const getListJob = (limit = 10, page = 1) => {
  return axios.get(
    `${BaseApi}/api/istick/v1/internal/hire/jobs?limit=${limit}&page=${page}`
  );
};

const createJob = (data: any) => {
  return axios.post(`${BaseApi}/api/istick/v1/internal/hire/jobs`, data);
};

const updateJob = (jobId: string, data: any) => {
  return axios.put(
    `${BaseApi}/api/istick/v1/internal/hire/jobs/${jobId}`,
    data
  );
};

const applyJob = (jobId: string, data: any) => {
  return axios.post(
    `${BaseApi}/api/istick/v1/internal/hire/jobs/${jobId}/apply`,
    data
  );
};

const deleteJob = (jobId: string) => {
  return axios.delete(`${BaseApi}/api/istick/v1/internal/hire/jobs/${jobId}`);
};

const getDetailsJob = (jobId: any) => {
  return axios.get(`${BaseApi}/api/istick/v1/internal/hire/jobs/${jobId}`);
};

const getJobByCompanyId = (
  limit = 10,
  page = 1,
  companyId: any,
  isTotal = false
) => {
  return axios.get(
    `${BaseApi}/api/istick/v1/internal/landing/jobs?limit=${limit}&page=${page}&companyId=${companyId}&isTotal=${isTotal}`
  );
};

const getListJobPublic = (limit = 10, page = 1, isTotal = false) => {
  return axios.get(
    `${BaseApi}/api/istick/v1/internal/landing/jobs?limit=${limit}&page=${page}&isTotal=${isTotal}`
  );
};

const getJobDetailsPublic = (jobId: any) => {
  return axios.get(
    `${BaseApi}/api/istick/v1/internal/landing/jobs/slug/${jobId}`
  );
};

const getJobRelatedById = (
  jobId: string,
  limit = 10,
  page = 1,
  isTotal = false
) => {
  return axios.get(
    `${BaseApi}/api/istick/v1/internal/landing/jobs/${jobId}/related-job?limit=${limit}&page=${page}&isTotal=${isTotal}`
  );
};

const getListResumeByJobId = (jobId: string, data: any) => {
  return axios.get(
    `${BaseApi}/api/istick/v1/internal/hire/jobs/${jobId}/applied-list`,
    data
  );
};

const getListJobMatching = (data: any) => {
  return axios.get(
    `${BaseApi}/api/istick/v1/internal/landing/jobs/job-seeking`,
    data
  );
};

export {
  getListJobMatching,
  getListJob,
  createJob,
  updateJob,
  deleteJob,
  getDetailsJob,
  getJobByCompanyId,
  applyJob,
  getJobDetailsPublic,
  getJobRelatedById,
  getListResumeByJobId,
  getListJobPublic,
};
