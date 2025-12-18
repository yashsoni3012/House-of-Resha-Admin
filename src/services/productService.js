// services/productService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const productApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add product API call
export const addProduct = async (productData) => {
  const response = await productApi.post('/products', productData);
  return response.data;
};

// Get categories API call
export const getCategories = async () => {
  const response = await productApi.get('/categories');
  return response.data;
};

// Upload images API call
export const uploadImages = async (images) => {
  const formData = new FormData();
  images.forEach(image => {
    formData.append('images', image);
  });
  
  const response = await productApi.post('/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};