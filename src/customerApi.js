
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function customerApi(url, options = {}) {
  const token = localStorage.getItem("customerToken");

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && token) {
    localStorage.removeItem("customer");
    localStorage.removeItem("customerToken");

    window.dispatchEvent(
      new Event("customerSessionExpired")
    );
  }

  return response;
}
