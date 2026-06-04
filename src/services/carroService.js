import api from "./api";

export default {
  getAll() {
    return api.get("/carro");
  },

  getPaginate(page = 1, perPage = 10, search = "") {
    return api.get(
      `/carro/paginate?page=${page}&per_page=${perPage}&search=${search}`
    );
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
