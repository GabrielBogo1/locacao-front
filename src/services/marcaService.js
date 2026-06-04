import api from "./api";

export default {
  getAll() {
    return api.get("/marca");
  },

  getPaginate(page = 1, perPage = 10, search = "") {
    return api.get(
      `/marca/paginate?page=${page}&per_page=${perPage}&search=${search}`
    );
  },

  create(data) {
    return api.post("/marca", data);
  },

  update(id, data) {
    return api.post(`marca/${id}`, data);
  },

  delete(id) {
    return api.delete(`marca/${id}`);
  },
};
