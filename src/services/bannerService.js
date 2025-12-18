// // services/bannerService.js
// const API_URL = 'http://localhost:5000/api/banners'; // Adjust to your API URL

// export const getBanners = async () => {
//   const response = await fetch(API_URL);
//   if (!response.ok) {
//     throw new Error('Failed to fetch banners');
//   }
//   return response.json();
// };

// export const createBanner = async (formData) => {
//   const response = await fetch(API_URL, {
//     method: 'POST',
//     body: formData,
//   });
  
//   if (!response.ok) {
//     throw new Error('Failed to create banner');
//   }
//   return response.json();
// };

// export const updateBanner = async (id, formData) => {
//   const response = await fetch(`${API_URL}/${id}`, {
//     method: 'PUT',
//     body: formData,
//   });
  
//   if (!response.ok) {
//     throw new Error('Failed to update banner');
//   }
//   return response.json();
// };

// export const deleteBanner = async (id) => {
//   const response = await fetch(`${API_URL}/${id}`, {
//     method: 'DELETE',
//   });
  
//   if (!response.ok) {
//     throw new Error('Failed to delete banner');
//   }
//   return response.json();
// };