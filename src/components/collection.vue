<template>
  <section>
    <v-toolbar flat light>
      <div class="collection-nav-bar">
        <span class="material-icons" @click="goBack()"> arrow_back </span
        ><span class="material-icons" @click="isShowCollectionOptions = true">
          more_vert
        </span>
      </div>
    </v-toolbar>
    <div class="collection-info">
      <div class="collection-title">
        {{ name }}
      </div>
      <div class="collection-subtitle">Last Review Date: {{ last_review }}</div>
      <div class="collection-subtitle">Review Period: {{ review_period }}</div>
      <v-btn
        rounded
        depressed
        x-large
        color="green"
        class="review-all-btn"
        @click="reviewAll()"
        >REVIEW ALL</v-btn
      >
      <v-btn
        outlined
        rounded
        x-small
        color="green"
        class="add-verse-btn"
        @click="addVerseToCollection()"
      >
        ADD VERSES
      </v-btn>
    </div>
    <div>
      <v-list subheader two-line class="list-view-collection">
        <v-list-item
          v-for="(verse, key) in verses"
          :key="key"
          class="my-collection-item"
        >
          <v-list-item-content>
            <v-list-item-title
              v-text="verse"
              @click="goToAnswer(verse)"
            ></v-list-item-title>
          </v-list-item-content>
          <v-btn icon style="z-index: 2">
            <span class="material-icons" @click="isShowVerseOptions = true">
              more_vert
            </span>
          </v-btn>
        </v-list-item>
      </v-list>
    </div>

    <!-- Edit Collection Options -->
    <v-bottom-sheet v-model="isShowCollectionOptions">
      <v-sheet height="180px">
        <v-list class="option-container">
          <v-list-item
            v-for="(item, key) in collectionOptions"
            :key="key"
            @click="chooseCollectionOption(item.text)"
          >
            <v-list-item-icon>
              <span class="material-icons option-icon">
                {{ item.icon }}
              </span>
            </v-list-item-icon>
            <v-list-item-title class="option-text">{{
              item.text
            }}</v-list-item-title>
            <v-divider></v-divider>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-bottom-sheet>

    <!-- Edit Collection Item Options -->
    <v-bottom-sheet v-model="isShowVerseOptions">
      <v-sheet height="130px">
        <v-list class="option-container">
          <v-list-item
            v-for="(item, key) in collectionItemOptions"
            :key="key"
            @click="chooseCollectionItemOption(item.text)"
          >
            <v-list-item-icon>
              <span class="material-icons option-icon">
                {{ item.icon }}
              </span>
            </v-list-item-icon>
            <v-list-item-title class="option-text">{{
              item.text
            }}</v-list-item-title>
            <v-divider></v-divider>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-bottom-sheet>
  </section>
</template>

<script>
import firebase from "firebase";

export default {
  data: () => ({
    last_review: "",
    review_period: "",
    name: "",
    verses: [],
    isShowVerseOptions: false,
    isShowCollectionOptions: false,
    collectionOptions: [
      { text: "Delete Collection", icon: "clear" },
      { text: "Add verses", icon: "add_circle_outline" },
      { text: "Change Review Period", icon: "alarm" },
    ],
    collectionItemOptions: [
      { text: "Remove from this Collection", icon: "remove_circle_outline" },
      { text: "Add to other Collection", icon: "playlist_add" },
    ],
  }),
  computed: {
    getCollectionId() {
      return this.$store.getters.getCollectionId;
    },
    getUserId() {
      return this.$store.getters.getUserInfo.id;
    },
    getPreviousView() {
      return this.$store.getters.getPreviousView;
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
          let date = new Date(querySnapshot.data().last_review.seconds * 1000);
          this.last_review = `${date.getDate()} / ${date.getMonth()} / ${date.getFullYear()}`;
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
    goToAnswer(verse) {
      console.log("Go to review", verse);
      let verseSplit = verse.split(" ");
      let bookId = verseSplit[0];

      let chapter = verseSplit[1].split(":")[0];
      let verses = verseSplit[1].split(":")[1];

      let selection = {
        book: {
          id: bookId,
          name: "",
        },
        chapter: chapter,
        verses: verses,
      };
      console.log(selection);
      this.$store.commit("setSelection", selection);
      this.$router.push("/answer");
    },
    chooseCollectionOption(opt) {
      console.log(opt);
    },
    chooseCollectionItemOption(opt) {
      console.log(opt);
    },
    goBack() {
      this.$store.commit("setView", "Library");
    },
    addVerseToCollection() {
      console.log("add verse");
    },
    reviewAll() {
      /** Pass list of verses to answer panel */
    },
  },
  created() {
    this.getCollectionDetail();
    this.getCollectionVerses();
  },
};
</script>

<style>
.collection-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
}

.collection-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.collection-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 1rem 0rem;
}

.collection-subtitle {
  font-size: 0.8rem;
}

.review-all-btn {
  margin-top: 1rem;
}

.add-verse-btn {
  margin: 1rem 0rem;
}
</style>
