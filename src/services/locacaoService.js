import api from "./api";

export default {
  getAll() {
    return api.get("/locacao");
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
