import axios from 'axios';
import { BaseApi } from '.';

const registerEvent = (data: any) => {
  return axios.post(`${BaseApi}/api/istick/v1/event/register`, data);
};

const getDetailsEvent = (eventId: string) => {
  return axios.get(`${BaseApi}/api/istick/v1/event/detail?slug=${eventId}`);
};

const getEventList = (page: number, limit: number, isTotal?: Boolean) => {
  return axios.get(
    `${BaseApi}/api/istick/v1/event/list?page=${page}&limit=${limit}&isTotal=${isTotal}`
  );
};

export { registerEvent, getDetailsEvent, getEventList };
