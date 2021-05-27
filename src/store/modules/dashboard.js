const state = {
  avatarName: "",
  user: {
    email: "",
    id: "",
  },
  selectedCollectionId: "",
  view: "",
  selectedBookId: "",
};

const getters = {
  getAvatarName(state) {
    return state.avatarName;
  },
  getUserInfo(state) {
    return state.user;
  },
  getCollectionId(state) {
    return state.selectedCollectionId;
  },
  getBibleBookSelectionPanelView(state) {
    return state.view;
  },
  getSelectedBookId(state) {
    return state.selectedBookId;
  },
};

const mutations = {
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
  setBibleBookSelectionPanelView(state, view) {
    state.view = view;
  },
  setSelectedBookId(state, id) {
    state.selectedBookId = id;
  },
  clearState(state) {
    state.view = "";
    state.selectedBookId = "";
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
