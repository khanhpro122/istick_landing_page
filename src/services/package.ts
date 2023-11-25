import axios from 'axios';
import { BaseApi } from '.';


const getPackageList = (page: number, limit: number) => {
  return axios.get(
    `${BaseApi}/api/istick/v1/internal/hire/packs?page=${page}&limit=${limit}`
  );
};

export { getPackageList };
