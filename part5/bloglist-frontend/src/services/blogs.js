import axios from 'axios';
//const baseUrl = '/api/blogs';
const baseUrl = 'http://localhost:3003/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (newObject) => {
  const updateUrl = baseUrl + '/' + newObject.id;
  const config = { headers: { Authorization: token } };
  const response = await axios.put(updateUrl, newObject, config);
  return response.data;
};

const remove = async (id) => {
  const updateUrl = baseUrl + '/' + id;

  const config = { headers: { Authorization: token } };
  const response = await axios.delete(updateUrl, config);
  return response.data;
};

export default { setToken, getAll, create, update, remove };
