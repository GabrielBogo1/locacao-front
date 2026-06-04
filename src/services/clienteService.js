import api from "./api";

export default {
  getAll() {
    return api.get("/cliente");
  },

  getPaginate(page = 1, perPage = 10, search = "") {
    return api.get(
      `/cliente/paginate?page=${page}&per_page=${perPage}&search=${search}`
    );
  },

  create(data) {
    return api.post("/cliente", data);
  },

  update(id, data) {
    return api.put(`cliente/${id}`, data);
  },

  delete(id) {
    return api.delete(`cliente/${id}`);
  },
};
