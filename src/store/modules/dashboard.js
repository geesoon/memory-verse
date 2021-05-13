const state = {
  view: "Home",
  avatarName: "",
  user: {
    email: "",
    id: "",
  },
  selectedCollectionId: "",
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
  getCollectionId(state) {
    return state.selectedCollectionId;
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
    state.user.id = user.id;
  },
  setCollectionId(state, id) {
    state.selectedCollectionId = id;
  },
  clearState(state) {
    state.view = "Home";
    state.avatarName = "";
    state.user.email = "";
    state.user.id = "";
  },
};

export default {
  state,
  mutations,
  getters,
};
