<template>
  <section>
    <div class="mobile-home-header-bar">
      <div class="header-logo-container">
        <div class="home-title-header" @click="changeRoute('main')">
          Memory Verse
        </div>
      </div>
      <div class="avatar-container" @click="changeRoute('profile')">
        <div class="avatar-circle">
          {{ this.getAvatarName }}
        </div>
      </div>
    </div>
    <div class="votd">
      Let the word of Christ dwell in you richly...
      <p style="text-align: right">- Col 3:16</p>
    </div>
    <div v-if="collection.length != 0" class="collection">
      <div class="section-title">Your Collection</div>
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
        <div class="section-title">Bible Books</div>
        <v-dialog
          v-model="isShowAllBook"
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
import Collection from "../apis/collection";
import bibleBookPanel from "../components/bibleBookPanel";
import booksChapter from "../data/book.json";

export default {
  components: {
    bibleBookPanel,
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
    async getCollection() {
      let res = await Collection.getCollection(this.getUserId);
      if (res.valid) {
        this.collection = res.res;
      } else {
        this.collection = [];
      }
    },
  },
};
</script>

<style>
/* Share between library and collection */
.my-collection-item {
  margin: 1rem 0rem;
  background: #d5e37d;
  text-align: left;
  border-radius: 0.5rem;
  font-weight: bold;
}

.mobile-home-header-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0rem;
}

.votd {
  font-size: 1.3rem;
  background: whitesmoke;
  border-radius: 0.5rem;
  padding: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
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
.collection-list {
  margin-top: 1rem;
}

.collection-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  overflow-x: scroll;
  overflow-y: hidden;
}

.bible-books-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;
}

.bible-books-list::-webkit-scrollbar,
.collection-list::-webkit-scrollbar {
  display: none;
}

.collection-item {
  min-width: 8rem;
  max-width: 8rem;
  min-height: 8rem;
  max-height: 8rem;
  padding: 1rem;
  margin: 0rem 0.5rem;
  border-radius: 0.5rem;
  background: #d5e37d;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
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

.collection-item:hover,
.book-item:hover {
  opacity: 0.8;
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
  .mobile-home-header-bar {
    display: none;
  }
}

@media only screen and (min-width: 1440px) {
  .bible-books-list {
    grid-template-columns: repeat(8, 1fr);
  }
}
</style>
