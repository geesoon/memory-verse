import firebase from "firebase";

export default {
  async login(email, password) {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        return new Promise(() => {
          return { res: response, valid: true };
        });
      })
      .catch((error) => {
        return {
          valid: false,
          error: error,
        };
      });
  },
};
