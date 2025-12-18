// hooks/useProducts.js
import { useState, useEffect } from 'react';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Men', 'Women', 'Unisex', 'Kids']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load products from localStorage (replace with API call)
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Save to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id, productData) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...productData } : product
    ));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addCategory = (categoryName) => {
    if (!categories.includes(categoryName)) {
      setCategories(prev => [...prev, categoryName]);
    }
  };

  return {
    products,
    categories,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
  };
};