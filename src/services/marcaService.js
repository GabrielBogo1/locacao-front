import api from "./api";

export default {
  getAll() {
    return api.get("/marca");
  },

  create(data) {
    return api.post("/marca", data);
  },

  update(id, data) {
    return api.put(`marca/${id}`, data);
  },

  delete(id) {
    return api.delete(`marca/${id}`);
  },
};
