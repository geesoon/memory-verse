import firebase from "firebase";

const state = {
  avatarName: "",
  user: {
    email: "",
    id: "",
  },
};

const getters = {
  getAvatarName(state) {
    return state.avatarName;
  },
  getUserInfo(state) {
    return state.user;
  },
  getUserEmail() {
    return firebase.auth().currentUser.email;
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
  clearUser(state) {
    state.avatarName = "";
    state.user.email = "";
    state.user.id = "";
  },
  logout() {
    firebase
      .auth()
      .signOut()
      .catch((error) => {
        alert(error.message);
      });
  },
};

export default {
  state,
  mutations,
  getters,
};
