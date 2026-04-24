import api from "./api";

export default {
  getAll() {
    return api.get("/modelo");
  },

  create(data) {
    return api.post("/modelo", data);
  },

  update(id, data) {
    return api.put(`modelo/${id}`, data);
  },

  delete(id) {
    return api.delete(`modelo/${id}`);
  },
};
