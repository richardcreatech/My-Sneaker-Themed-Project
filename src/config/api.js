export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://my-sneaker-backend.onrender.com";

export const apiFetch = (url, options = {}) =>
  fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  });
