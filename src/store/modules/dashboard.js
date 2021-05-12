const state = {
  view: "Home",
  avatarName: "",
  user: {
    email: "",
  },
};

const getters = {
  getCurrentView(state) {
    return state.view;
  },
  getAvatarName(state) {
    return state.avatarName;
  },
  getUserInfo(state) {
    return state.user;
  },
};

const mutations = {
  setView(state, view) {
    state.view = view;
  },
  setAvatarName(state, name) {
    state.avatarName = name;
  },
  setUser(state, user) {
    state.user.email = user.email;
  },
};

export default {
  state,
  mutations,
  getters,
};
