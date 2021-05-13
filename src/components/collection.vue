<template>
  <v-container> </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  data: () => ({
    last_review: "",
    review_period: "",
    name: "",
    verses: [],
  }),
  computed: {
    getCollectionId() {
      return this.$store.getters.getCollectionId;
    },
    getUserId() {
      return this.$store.getters.getUserInfo.id;
    },
  },
  methods: {
    getCollectionDetail() {
      const db = firebase.firestore();

      db.collection("users")
        .doc(this.getUserId)
        .collection("collection")
        .doc(this.getCollectionId)
        .get()
        .then((querySnapshot) => {
          this.last_review = querySnapshot.data().last_review;
          this.review_period = querySnapshot.data().review_period;
          this.name = querySnapshot.data().name;
        })
        .catch((error) => {
          console.log("Error getting users collection info", error);
        });
    },
    getCollectionVerses() {
      const db = firebase.firestore();
      db.collection("users")
        .doc(this.getUserId)
        .collection("collection")
        .doc(this.getCollectionId)
        .collection("verses")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.verses = [...doc.data().reference];
          });
        })
        .catch((error) => {
          console.log("Error getting users collection", error);
        });

      console.log(this.verses);
    },
  },
  created() {
    this.getCollectionDetail();
    this.getCollectionVerses();
  },
};
</script>

<style></style>
