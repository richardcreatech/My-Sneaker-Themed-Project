export const API_BASE_URL = "https://my-sneaker-backend.onrender.com";

export const apiFetch = (url, options = {}) =>
  fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  });
