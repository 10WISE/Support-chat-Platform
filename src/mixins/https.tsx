import _axios from '../api/AxiosConfig';

const GetHADS = async (api: string, params = {}) => {
  try {
    const { data } = await _axios.get(`${api}`, { params });
    return data;
  } catch (error: any) {
    return Promise.reject({
      status: error.response.status,
      message: error.response.data,
    });
  }
};

const PostHADS = async (api: string, model: any) => {
  try {
    const { data } = await _axios.post(`${api}`, model);
    return data;
  } catch (error: any) {
    return Promise.reject({
      status: error.response.status,
      message: error.response.data,
    });
  }
};

export default {
  GetHADS,
  PostHADS,
};
