const BASE_URL = 'https://thinkful-list-api.herokuapp.com';
const USERNAME = 'BrunoM';

const FULL_URL = `${BASE_URL}/${USERNAME}/bookmarks`;

const apiFetch = function (...args) {
  let error;
  return fetch(...args)
    .then(res => {
      if (!res.ok) {
        error = { code: res.status };

        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }

      return res.json();
    })
    .then(data => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }

      return data;
    });
};

const getBookmarks = () => {
  return apiFetch(`${FULL_URL}`);
};

const createBookmark = (bookmark) => {
  const newBookmark = JSON.stringify(bookmark);
  return apiFetch(`${FULL_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: newBookmark
  });
};

const deleteBookmark = (id) => {
  return apiFetch(`${FULL_URL}/${id}`, {
    method: 'DELETE'
  });
};


export default {
  getBookmarks,
  createBookmark,
  deleteBookmark,
};

