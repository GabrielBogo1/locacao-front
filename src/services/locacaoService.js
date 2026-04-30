import api from "./api";

export default {
  getAll() {
    return api.get("/locacao");
  },

  getPaginate(page = 1, perPage = 10) {
    return api.get(`/locacao/paginate?page=${page}&per_page=${perPage}`);
  },

  create(data) {
    return api.post("/locacao", data);
  },

  update(id, data) {
    return api.put(`locacao/${id}`, data);
  },

  delete(id) {
    return api.delete(`locacao/${id}`);
  },
};
