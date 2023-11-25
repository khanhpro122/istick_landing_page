import https from 'https';
import axios from 'axios';
import { getCookie, getLocalUserData } from '@/utils';

const BaseApi = process.env.BASE_API || 'https://istick.io';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});
axios.defaults.httpsAgent = httpsAgent;

axios.interceptors.request.use(
  (config) => {
    const {accessToken, refreshToken} = getLocalUserData();
    if (accessToken) {
      config.headers['AccessToken'] = accessToken;
      config.headers['RefreshToken'] = refreshToken;
    }
    return config;
  },
  (err) => {
    Promise.reject(err);
  }
);

export { BaseApi };
