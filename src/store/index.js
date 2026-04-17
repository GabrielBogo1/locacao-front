import Vue from "vue";
import Vuex from "vuex";
import { authModule } from "./auth";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: { authModule },
});
