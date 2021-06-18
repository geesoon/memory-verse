import firebase from "firebase";

export default {
  getUserId() {
    const db = firebase.firestore();
    let logonEmail = firebase.auth().currentUser.email;
    db.collection("users")
      .where("email", "==", logonEmail)
      .limit(1)
      .get()
      .then((querySnapshot) => {
        return querySnapshot;
      })
      .catch((error) => {
        console.log("Error getting users id", error);
      });
  },
};
