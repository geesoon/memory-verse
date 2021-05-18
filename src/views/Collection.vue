<template>
  <section>
    <v-toolbar flat light>
      <div class="collection-nav-bar">
        <span class="material-icons" @click="popRoute()"> arrow_back </span
        ><span class="material-icons" @click="isShowCollectionOptions = true">
          more_vert
        </span>
      </div>
    </v-toolbar>
    <div class="collection-info">
      <div class="collection-title">
        {{ name }}
      </div>
      <div class="collection-subtitle">Last Review Date: {{ lastReview }}</div>
      <div class="collection-subtitle">Review Period: {{ reviewPeriod }}</div>
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
              @click="goToAnswer(verse)"
              v-if="verse.startVerse != verse.endVerse"
              >{{ verse.book }} {{ verse.chapter }}:{{ verse.startVerse }}-{{
                verse.endVerse
              }}</v-list-item-title
            >
            <v-list-item-title
              @click="goToAnswer(verse)"
              v-else-if="verse.startVerse == '' && verse.endVerse == ''"
              >{{ verse.book }} {{ verse.chapter }}</v-list-item-title
            >
            <v-list-item-title @click="goToAnswer(verse)" v-else
              >{{ verse.book }} {{ verse.chapter }}:{{
                verse.startVerse
              }}</v-list-item-title
            >
            <v-list-item-subtitle>{{
              verse.bibleVersion
            }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-btn icon style="z-index: 2">
            <span class="material-icons" @click="showVerseOptions(verse)">
              more_vert
            </span>
          </v-btn>
        </v-list-item>
      </v-list>
    </div>

    <!-- Edit Collection Options -->
    <v-bottom-sheet v-model="isShowCollectionOptions">
      <v-sheet height="240px">
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

    <v-dialog v-model="isShowDeleteConfirmationDialog">
      <v-card>
        <v-card-title>Confirm delete collection?</v-card-title>
        <v-card-text>Deleted collection cannot be restored.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="isShowDeleteConfirmationDialog = false"
            >Cancel</v-btn
          >
          <v-btn depressed rounded color="red" @click="removeCollection()"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Change review period bottom sheet -->
    <v-bottom-sheet v-model="isShowReviewPeriodOptions">
      <v-sheet height="260px">
        <v-list class="option-container">
          <v-list-item
            v-for="(item, key) in reviewPeriodOptions"
            :key="key"
            @click="changeReviewPeriod(item)"
          >
            <v-list-item-title class="option-text">{{
              item
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
    lastReview: "",
    reviewPeriod: "",
    name: "",
    verses: [],
    isShowVerseOptions: false,
    isShowCollectionOptions: false,
    collectionOptions: [
      { text: "Add Verses", icon: "add_circle_outline" },
      { text: "Change Review Period", icon: "alarm" },
      { text: "Edit Collection", icon: "edit" },
      { text: "Delete Collection", icon: "clear" },
    ],
    collectionItemOptions: [
      { text: "Remove from this Collection", icon: "remove_circle_outline" },
      { text: "Add to other Collection", icon: "playlist_add" },
    ],
    isShowDeleteConfirmationDialog: false,
    isShowReviewPeriodOptions: false,
    reviewPeriodOptions: ["Everyday", "3 days", "1 week", "2 weeks", "3 weeks"],
    editVerse: {},
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
    popRoute() {
      this.$router.back();
    },
    getCollectionDetail() {
      const db = firebase.firestore();

      db.collection("users")
        .doc(this.getUserId)
        .collection("collection")
        .doc(this.getCollectionId)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.data().lastReview != "") {
            let date = new Date(querySnapshot.data().lastReview.seconds * 1000);
            this.lastReview = `${date.getDate()} / ${date.getMonth()} / ${date.getFullYear()}`;
          } else {
            this.lastReview = "None";
          }
          this.reviewPeriod = querySnapshot.data().reviewPeriod;
          this.name = querySnapshot.data().name;
          this.verses = querySnapshot.data().verses;
        })
        .catch((error) => {
          console.log("Error getting users collection info", error);
        });
    },
    removeCollection() {
      const db = firebase.firestore();

      db.collection("users")
        .doc(this.getUserId)
        .collection("collection")
        .doc(this.getCollectionId)
        .delete()
        .then(() => {
          console.log("Successfully deleted the collection");
          this.$store.commit("setView", "Library");
        })
        .catch((error) => {
          console.log("Error getting users collection info", error);
        });
    },
    showVerseOptions(verse) {
      this.editVerse.book = verse.book;
      this.editVerse.chapter = verse.chapter;
      this.editVerse.startVerse = verse.startVerse;
      this.editVerse.endVerse = verse.endVerse;
      this.editVerse.bibleVersion = verse.bibleVersion;
      this.isShowVerseOptions = true;
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
      if (opt == "Delete Collection") {
        this.isShowDeleteConfirmationDialog = true;
      } else if (opt == "Change Review Period") {
        this.isShowReviewPeriodOptions = true;
        this.isShowCollectionOptions = false;
      }
    },
    chooseCollectionItemOption(opt) {
      console.log(opt);
      if (opt == "Remove from this Collection") {
        this.removeVerseFromCollection();
      }
    },
    removeVerseFromCollection() {
      // Filter out selected verse to operated on
      this.verses = this.verses.filter((verse) => {
        return (
          verse.book != this.editVerse.book ||
          verse.chapter != this.editVerse.chapter ||
          verse.startVerse != this.editVerse.startVerse ||
          verse.endVerse != this.editVerse.endVerse ||
          verse.bibleVersion != this.editVerse.bibleVersion
        );
      });

      const db = firebase.firestore();
      db.collection("users")
        .doc(this.getUserId)
        .collection("collection")
        .doc(this.getCollectionId)
        .update({
          verses: this.verses,
        })
        .then(() => {
          console.log("Successfully remove verse from the collection");
        })
        .catch((error) => {
          console.log("Error removing verse from the collection", error);
        });
      this.isShowVerseOptions = false;
    },
    addVerseToCollection() {
      console.log("add verse");
    },
    reviewAll() {
      /** Pass list of verses to answer panel */
    },
    changeReviewPeriod(period) {
      const db = firebase.firestore();
      db.collection("users")
        .doc(this.getUserId)
        .collection("collection")
        .doc(this.getCollectionId)
        .update({
          reviewPeriod: period,
        })
        .then(() => {
          console.log("Successfully the collection's review period");
        })
        .catch((error) => {
          console.log("Error to update the collection's review period", error);
        });
      this.isShowReviewPeriodOptions = false;
      this.getCollectionDetail();
    },
  },
  created() {
    this.getCollectionDetail();
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
