import firebase from "firebase";

export default {
  async getUserId(email) {
    const db = firebase.firestore();
    await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs[0].id;
      })
      .catch((error) => {
        console.log("Error getting users id", error);
      });
  },
};
