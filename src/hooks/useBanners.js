// src/hooks/useBanners.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = "https://api.houseofresha.com";

export const fetchBanners = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/banners`);
  return data;
};

export const useBanners = () => {
  return useQuery(["banners"], fetchBanners, {
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
