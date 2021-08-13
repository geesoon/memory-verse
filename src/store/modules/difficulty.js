const state = {
  level: ["Easy", "Medium", "High"],
  selectedLevel: "",
};

const getters = {
  getLevel: (state) => {
    return state.level;
  },
};

const mutations = {
  setLevel(state, level) {
    state.selectedLevel = level;
  },
};

export default {
  state,
  mutations,
  getters,
};
