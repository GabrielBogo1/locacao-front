import api from "./api";

export default {
  getAll() {
    return api.get("/carro");
  },

  create(data) {
    return api.post("/carro", data);
  },

  update(id, data) {
    return api.put(`carro/${id}`, data);
  },

  delete(id) {
    return api.delete(`carro/${id}`);
  },
};
