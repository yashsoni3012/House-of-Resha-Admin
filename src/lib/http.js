// lib/http.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Helper: Get token from localStorage
// const getAuthToken = () => localStorage.getItem("auth_token") || "";

// ✅ Helper: Prepare headers (Authorization only; Content-Type handled per request)
// const getHeaders = () => {
//   const token = getAuthToken();
//   return {
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     // ⚠️ Note: Content-Type is added later depending on FormData or JSON
//   };
// };

// ✅ Main HTTP function used across all API requests
export async function apiRequest(endpoint, options = {}) {
  // const baseHeaders = getHeaders();

  // Check if the body is FormData
  const isFormData = options.body instanceof FormData;

  // Merge any custom headers provided
  const mergedHeaders = {
    // ...baseHeaders,
    ...(options.headers || {}),
  };

  // 🧠 Smart handling of Content-Type:
  if (isFormData) {
    // Browser will automatically set the correct multipart boundary
    delete mergedHeaders["Content-Type"];
  } else {
    // If not FormData, default to JSON if not already defined
    if (!("Content-Type" in mergedHeaders)) {
      mergedHeaders["Content-Type"] = "application/json";
    }
  }

  // ✅ Perform the request
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: mergedHeaders,
  });

  // ❌ Handle HTTP errors
  if (!response.ok) {
    let errMsg = `HTTP error! status: ${response.status}`;
    try {
      const errData = await response.json();
      if (errData?.message) errMsg = errData.message;
    } catch {
      // ignore parsing errors
    }
    throw new Error(errMsg);
  }

  // ✅ Handle empty responses (like DELETE)
  if (response.status === 204 || response.status === 205) {
    return {};
  }

  // // ✅ Parse response safely
  // const text = await response.text();
  // if (!text) return {};

  // const data = JSON.parse(text);

  // // ✅ Handle common backend format: { status: "success", data: [...] }
  // if (data?.status === "success" && "data" in data) {

  //   return data.data;
  // }

  // // Otherwise, return the raw response object
  // return data;

  // ✅ Parse response safely
  const text = await response.text();
  if (!text) return {};
  const data = JSON.parse(text);

  // ✅ Unwrap if 'data' key exists (handles inconsistent backend formats)
  let result = data;
  if (
    result &&
    typeof result === "object" &&
    !Array.isArray(result) &&
    "data" in result
  ) {
    result = result.data;
  }

  // ✅ Handle common backend format: { status: "success", data: [...] } (keep for backward compatibility if needed)
  if (result?.status === "success" && "data" in result) {
    console.log("returning common backend format", result.data);
    result = result.data;
  }

  console.log("returning last value", result);
  // Otherwise, return the result
  return result;
}
