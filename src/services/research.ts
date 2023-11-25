import axios from 'axios';
import { BaseApi } from '.';

const getDetailsResearch = (researchId: string) => {
  return axios.get(`${BaseApi}/api/istick/v1/post/detail?slug=${researchId}`);
};

const getListResearch = (page: number, limit: number, isTotal?: Boolean) => {
  return axios.get(
    `${BaseApi}/api/istick/v1/post/list?page=${page}&limit=${limit}&isTotal=${isTotal}&postType=RESEARCH`
  );
};

export { getDetailsResearch, getListResearch };
