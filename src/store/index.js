import Vue from "vue";
import Vuex from "vuex";
import verseSelection from "./modules/verse";
import dashboard from "./modules/dashboard";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    dashboard,
    verseSelection,
  },
});
