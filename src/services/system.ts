import axios from 'axios';
import { BaseApi } from '.';


const getListCurrentCies = (page: number, limit: number, isTotal?: Boolean) => {
  return axios.get(
    `${BaseApi}/api/istick/v1/internal/sys/currencies?page=${page}&limit=${limit}&isTotal=${isTotal}`
  );
};

const getListCountry = (page: number, limit: number, isTotal?: Boolean) => {
  return axios.get(
    `${BaseApi}/api/istick/v1/internal/sys/countries?page=${page}&limit=${limit}&isTotal=${isTotal}`
  );
};

const getListCities = (countryId: any) => {
  return axios.get(
    `${BaseApi}/api/istick/v1/internal/sys/countries/${countryId}/cities`
  );
};

const getListLevels = () => {
  return axios.get(
    `${BaseApi}/api/istick/v1/internal/sys/levels`
  );
};


const preSignedFile = (data: any) => {
  return axios.post(
    `${BaseApi}/api/istick/v1/internal/sys/presigned/files`, data
  );
};

export { getListCurrentCies, getListCountry, getListCities, getListLevels, preSignedFile };
