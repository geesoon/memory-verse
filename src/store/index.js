import Vue from "vue";
import Vuex from "vuex";
import Alert from "./modules/alert";
import Selection from "./modules/selection";
import Memorization from "./modules/memorization";
import User from "./modules/user";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    Alert,
    Selection,
    Memorization,
    User,
  },
});
