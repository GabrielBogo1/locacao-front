import api from "./api";

export default {
  getAll() {
    return api.get("/modelo");
  },

  getPaginate(page = 1, perPage = 10) {
    return api.get(`/modelo/paginate?page=${page}&per_page=${perPage}`);
  },

  create(data) {
    return api.post("/modelo", data);
  },

  update(id, data) {
    return api.post(`modelo/${id}`, data);
  },

  delete(id) {
    return api.delete(`modelo/${id}`);
  },
};
