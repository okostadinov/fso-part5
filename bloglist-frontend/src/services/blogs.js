import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newBlogObj) => {
  const config = { headers: { Authorization: token } };

  const response = await axios.post(baseUrl, newBlogObj, config);
  return response.data;
};

const update = async (updatedBlogObj) => {
  const config = { headers: { Authorization: token } };

  const response = await axios.put(
    `${baseUrl}/${updatedBlogObj.id}`,
    updatedBlogObj,
    config
  );
  return response.data;
};

const remove = async (blog) => {
  const config = { headers: { Authorization: token } };

  const response = await axios.delete(`${baseUrl}/${blog.id}`, config);
  return response.data;
};

export default { getAll, create, update, remove, setToken };
