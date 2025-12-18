// lib/crudFactory.js
import { apiRequest } from "./http"; // small helper that wraps fetch

// Optional custom endpoints for each API
export function createCrudApi(resource, options = {}) {
  return {
    // ✅ GET ALL RECORDS
    async getAll() {
      const endpoint = options.getAllEndpoint || `/${resource}/`;
      console.log(endpoint, "filter endpoint");
      return apiRequest(endpoint);
    },

    // ✅ GET ONE RECORD BY ID
    async getOne(id) {
      // If a custom "getOne" endpoint is provided (like /seller_order/seller)
      if (options.getOne) {
        return apiRequest(`${options.getOne}/${id}/`);
      }

      // Otherwise fallback to the normal getAllEndpoint
      const baseEndpoint = options.getAllEndpoint || `/${resource}`;
      const endpoint = `${baseEndpoint}/${id}/`;
      return apiRequest(endpoint);
    },

    // ✅ CREATE NEW RECORD
    async create(data) {
      const endpoint = options.postEndpoint || `/${resource}/`;
      const isFormData = data instanceof FormData;

      return apiRequest(endpoint, {
        method: "POST",
        headers: isFormData
          ? undefined
          : { "Content-Type": "application/json" },
        body: isFormData ? data : JSON.stringify(data),
      });
    },

    // ✅ UPDATE EXISTING RECORD
    async update(id, data) {
      const baseEndpoint = options.patchEndpoint || `/${resource}`;
      const endpoint = `${baseEndpoint}${id}/`;
      const isFormData = data instanceof FormData;

      return apiRequest(endpoint, {
        method: "PATCH",
        headers: isFormData
          ? undefined
          : { "Content-Type": "application/json" },
        body: isFormData ? data : JSON.stringify(data),
      });
    },

    // ✅ DELETE RECORD
    async remove(id) {
      const baseEndpoint = options.deleteEndpoint || `/${resource}`;
      const endpoint = `${baseEndpoint}${id}/`;
      await apiRequest(endpoint, { method: "DELETE" });
    },
  };
}
