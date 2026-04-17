import api from "./api";

export default {
  getAll() {
    return api.get("/cliente");
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
