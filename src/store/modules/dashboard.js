const state = {
  view: "Menu",
};

const getters = {
  getCurrentView(state) {
    return state.view;
  },
};

const mutations = {
  setView(state, view) {
    state.view = view;
  },
};

export default {
  state,
  mutations,
  getters,
};
