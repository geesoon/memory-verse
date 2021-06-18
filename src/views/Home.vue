<template>
  <section>
    <header-drawer />
    <div class="mobile-home-header-bar header-bar">
      <div class="header-logo-container">
        <div
          class="home-title-header"
          @click="changeRoute('main')"
        >
          Memory Verse
        </div>
      </div>
      <div
        class="avatar-container"
        @click="changeRoute('profile')"
      >
        <div class="avatar-circle">
          {{ this.getAvatarName }}
        </div>
      </div>
    </div>
    <div class="votd">
      <p>In the beginning, God created the heaven and the earth</p>
      <p style="text-align: right">
        - Gen 1:1
      </p>
    </div>
    <!-- <div class="difficulty">
        <div class="section-title">Difficulty</div>
        <v-btn-toggle
          v-model="level"
          tile
          color="deep-yellow accent-3"
          group
          class="difficulty-list"
        >
          <v-btn value="Easy"> Easy </v-btn>
          <v-btn value="Medium"> Medium </v-btn>
          <v-btn value="Hard"> Hard </v-btn>
        </v-btn-toggle>
      </div> -->
    <!-- <div class="recent-memorized" v-if="recent.length != 0">
        <div class="section-title">Recently Memorized</div>
        <div class="recent-list">
          <div
            v-for="(item, key) in recent"
            :key="key"
            class="recent-item"
            @click="startAnswering(item)"
          >
            {{ item.abbreviation }} {{ item.chapter }}:{{ item.verse }}
          </div>
        </div>
      </div> -->
    <div
      v-if="collection.length != 0"
      class="collection"
    >
      <div class="section-title">
        Your Collection
      </div>
      <div class="collection-list">
        <div
          v-for="(item, key) in collection"
          :key="key"
          class="collection-item"
          @click="goToCollection(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="bible-books">
      <div class="bible-books-bar">
        <div class="section-title">
          Bible Books
        </div>
        <v-dialog
          v-model="isShowAllBook"
          width="500"
          persistent
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              x-small
              color="transparent"
              v-bind="attrs"
              v-on="on"
              @click="showAllBook()"
            >
              Show All
            </v-btn>
          </template>
          <bible-book-panel
            @closeDialog="isShowAllBook = false"
            @answer="goToAnswer()"
          />
        </v-dialog>
      </div>
      <div class="bible-books-list">
        <div
          v-for="n in 15"
          :key="n"
          class="book-item"
          @click="showBookChapter(bibleBooks[n - 1].id)"
        >
          {{ bibleBooks[n - 1].abbreviation }}
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import firebase from "firebase";
import bibleBookPanel from "../components/bibleBookPanel";
import booksChapter from "../data/book.json";
import headerDrawer from "../components/headerDrawer";

export default {
  components: {
    bibleBookPanel,
    headerDrawer,
  },
  data: () => ({
    selectedBookId: "",
    isShowAllBook: false,
    level: "",
    recent: [],
    collection: [],
    bibleBooks: booksChapter.books,
  }),
  computed: {
    getAvatarName() {
      return this.$store.getters.getAvatarName;
    },
    getLevel() {
      return this.$store.getters.getVerseInfo.level;
    },
    getUserId() {
      return this.$store.getters.getUserInfo.id;
    },
    getUserEmail() {
      return firebase.auth().currentUser.email;
    },
  },
  watch: {
    level: function () {
      this.$store.commit("setLevel", this.level);
    },
  },
  created() {
    this.getCollection();
    let avatarName = firebase
      .auth()
      .currentUser.email.split("")[0]
      .toUpperCase();
    this.$store.commit("setAvatarName", avatarName);
    this.selectedBook = "";
    this.level = this.getLevel;
  },
  methods: {
    toggleDrawer() {
      this.$emit("toggleDrawer");
    },
    showBookChapter(bookId) {
      this.$store.commit("setBibleBookSelectionPanelView", "chapter");
      this.$store.commit("setSelectedBookId", bookId);
      this.isShowAllBook = true;
    },
    goToAnswer() {
      this.isShowAllBook = false;
      this.$router.push("/answer");
    },
    goToView(view) {
      this.$store.commit("setView", view);
    },
    goToCollection(item) {
      this.$store.commit("setCollectionId", item.id);
      this.$router.push({ name: "collection" });
    },
    showAllBook() {
      this.$store.commit("setBibleBookSelectionPanelView", "book");
    },
    changeRoute(rn) {
      if (this.$route.name != rn) {
        this.$router.push({ name: rn.toLowerCase() });
      }
    },
    startAnswering(ref) {
      this.$store.commit("setBook", { name: ref.name, id: ref.id });
      this.$store.commit("setChapter", ref.chapter);
      this.$store.commit("setVerses", ref.verse);
      this.$router.push("/answer");
    },
    getCollection() {
      const db = firebase.firestore();

      db.collection("users")
        .doc(this.getUserId)
        .collection("collection")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.collection.push({
              id: doc.id,
              name: doc.data().name,
              lastReview: doc.data().lastReview.seconds,
              reviewPeriod: doc.data().reviewPeriod,
            });
          });
        })
        .catch((error) => {
          console.log("Error getting users collection", error);
        });
    },
  },
};
</script>

<style>
.votd {
  font-size: 1.3rem;
  font-weight: 300;
  background: #1877f2;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  opacity: 0.9;
  margin: 0.5rem 0rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.difficulty {
  margin-bottom: 1rem;
}

.bible-books {
  padding-bottom: 3rem;
}

.bible-books,
.collection,
.recent-memorized {
  margin: 1rem 0rem;
}

.bible-books-list,
.collection-list,
.recent-list,
.difficulty-list {
  margin-top: 1rem;
}

.collection-list,
.recent-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  overflow-x: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.bible-books-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;
}

.bible-books-list::-webkit-scrollbar,
.collection-list::-webkit-scrollbar,
.recent-list::-webkit-scrollbar {
  display: none; /* chrome */
}

.collection-item,
.recent-item {
  padding: 1rem 2rem;
  margin: 0rem 0.5rem;
  border-radius: 0.5rem;
  background: #d5e37d;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  height: 6rem;
}

/* Truncate collection name */
.collection-item {
  border-radius: 0px !important;
  box-shadow: 8px 8px 0px 0px;
}

.book-item {
  padding: 2rem 0rem;
  border-radius: 0.5rem;
  background: #d5e37d;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
}

.bible-books-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.show-all-book-btn {
  font-size: 0.8rem;
  font-weight: bold;
}

@media only screen and (min-width: 768px) {
  .bible-books-list {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media only screen and (min-width: 1024px) {
  .bible-books-list {
    grid-template-columns: repeat(8, 1fr);
  }
  .mobile-home-header-bar {
    display: none;
  }
}
</style>
