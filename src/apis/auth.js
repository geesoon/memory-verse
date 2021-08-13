import firebase from "firebase";

export default {
  async login(email, password) {
    try {
      let res = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      return { valid: true, res: res };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  },
  async logout() {
    try {
      await firebase.auth().signOut();
      return true;
    } catch (err) {
      return err;
    }
  },
};
