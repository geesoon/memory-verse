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
      <v-dialog
        v-model="isShowAddVersePanel"
        width="500"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            outlined
            rounded
            x-small
            color="green"
            class="add-verse-btn"
            v-bind="attrs"
            v-on="on"
            @click="showAddVersePanel()"
          >
            ADD VERSES
          </v-btn>
        </template>
        <addCollectionBibleBookPanel
          @updateVerse="updateVerseAdded()"
          @closeDialog="closeAddVersePanel()"
        ></addCollectionBibleBookPanel>
      </v-dialog>
    </div>
    <div>
      <v-list subheader two-line class="list-view-collection">
        <v-list-item
          v-for="(verse, key) in verses"
          :key="key"
          class="my-collection-item"
        >
          <v-list-item-content>
            <!-- book chapter:start -->
            <v-list-item-title
              @click="goToAnswer(verse)"
              v-if="verse.endVerse == '' && verse.startVerse != ''"
              >{{ verse.book.name }} {{ verse.chapter }}:{{
                verse.startVerse
              }}</v-list-item-title
            >
            <!-- book chapter -->
            <v-list-item-title
              @click="goToAnswer(verse)"
              v-else-if="verse.startVerse == '' && verse.endVerse == ''"
              >{{ verse.book.name }} {{ verse.chapter }}</v-list-item-title
            >
            <!-- book chapter:start-end -->
            <v-list-item-title @click="goToAnswer(verse)" v-else
              >{{ verse.book.name }} {{ verse.chapter }}:{{
                verse.startVerse
              }}-{{ verse.endVerse }}</v-list-item-title
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
      <v-sheet height="250px">
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
import addCollectionBibleBookPanel from "../components/bibleBookPanel.vue";

export default {
  data: () => ({
    lastReview: "",
    reviewPeriod: "",
    name: "",
    verses: [],
    isShowVerseOptions: false,
    isShowCollectionOptions: false,
    collectionOptions: [
      { text: "Flash Cards", icon: "style" },
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
    isShowAddVersePanel: false,
  }),
  components: {
    addCollectionBibleBookPanel,
  },
  computed: {
    getCollectionId() {
      return this.$store.getters.getCollectionId;
    },
    getUserId() {
      return this.$store.getters.getUserInfo.id;
    },
    getSelectedVerse() {
      return this.$store.getters.getVerseInfo.selection;
    },
  },
  methods: {
    closeAddVersePanel() {
      this.$store.commit("resetSelection");
      this.isShowAddVersePanel = false;
    },
    showAddVersePanel() {
      this.isShowAddVersePanel = true;
      this.$store.commit("resetSelection");
      this.$store.commit("setBibleBookSelectionPanelView", "book");
    },
    updateVerseAdded() {
      this.verses.push({
        book: {
          id: this.getSelectedVerse.book.id,
          name: this.getSelectedVerse.book.name,
        },
        chapter: this.getSelectedVerse.chapter,
        startVerse: this.getSelectedVerse.startVerse,
        endVerse: this.getSelectedVerse.endVerse,
        bibleVersion: this.getSelectedVerse.bibleVersion,
      });
      this.isShowAddVersePanel = false;
      this.addVerseToCollection();
    },
    addVerseToCollection() {
      const db = firebase.firestore();
      db.collection("users")
        .doc(this.getUserId)
        .collection("collection")
        .doc(this.getCollectionId)
        .update({ verses: this.verses })
        .catch((error) => {
          console.log("Error adding verses to collection", error);
        });
    },
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
          this.$router.replace({ name: "library" });
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
      let selection = {
        book: {
          id: verse.book.id,
          name: verse.book.name,
        },
        chapter: verse.chapter,
        startVerse: verse.startVerse == "" ? 1 : verse.startVerse,
        endVerse: verse.endVerse,
        bibleVersion: verse.bibleVersion,
        next: "",
        previous: "",
      };
      this.$store.commit("setSelection", selection);
      this.$router.replace("/answer");
    },
    chooseCollectionOption(opt) {
      if (opt == "Delete Collection") {
        this.isShowDeleteConfirmationDialog = true;
      } else if (opt == "Change Review Period") {
        this.isShowReviewPeriodOptions = true;
        this.isShowCollectionOptions = false;
      } else if (opt == "Flash Cards") {
        this.$store.commit("setCollectionVerses", this.verses);
        this.$router.push({ name: "flashcard" });
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
