<template>
  <section>
    <div class="header-bar">
      <div class="home-title-header" @click="goToView('Home')">
        Memory Verse
      </div>
      <div class="avatar-container" @click="goToView('Profile')">
        <div class="avatar-circle">{{ this.getAvatarName }}</div>
      </div>
    </div>
    <section style="padding-top: 5rem">
      <div class="votd">
        <p>In the beginning, God created the heaven and the earth</p>
        <p style="text-align: right">- Gen 1:1</p>
      </div>
      <!-- <v-skeleton-loader
        type="image"
        style="width: 30vw; height: 6rem"
      ></v-skeleton-loader> -->
      <div class="difficulty">
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
      </div>
      <div class="recent-memorized">
        <div class="section-title">Recently Memorized</div>
        <div class="recent-list">
          <div
            v-for="(item, key) in recent"
            :key="key"
            class="recent-item"
            @click="startAnswering(item)"
          >
            {{ item.id }} {{ item.chapter }}:{{ item.verse }}
          </div>
        </div>
      </div>
      <div class="collection">
        <div class="section-title">Your Collection</div>
        <div class="collection-list">
          <div
            v-for="(item, key) in collection"
            :key="key"
            class="collection-item"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div class="bible-books">
        <div class="bible-books-bar">
          <div class="section-title">Bible Books</div>
          <!-- <div class="show-all-book-btn" @click="showAllBook"></div> -->
          <v-dialog
            v-model="isShowAllBook"
            width="500"
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
              >
                Show All
              </v-btn>
            </template>
            <bible-book-panel />
          </v-dialog>
        </div>
        <div class="bible-books-list">
          <div v-for="n in 15" :key="n" class="book-item">
            {{ bibleBooks[n].id }}
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import firebase from "firebase";
import booksChapter from "../data/book.json";
import bibleBookPanel from "../components/bibleBookPanel.vue";

export default {
  components: {
    bibleBookPanel,
  },
  computed: {
    getAvatarName() {
      return this.$store.getters.getAvatarName;
    },
    getLevel() {
      return this.$store.getters.getVerseInfo.level;
    },
  },
  watch: {
    level: function () {
      this.$store.commit("setLevel", this.level);
    },
  },
  data: () => ({
    isShowAllBook: false,
    level: "Easy",
    recent: [
      {
        name: "John",
        id: "JHN",
        chapter: "1",
        verse: "1",
      },
      {
        name: "Genesis",
        id: "GEN",
        chapter: "1",
        verse: "1",
      },
      {
        name: "John",
        id: "JHN",
        chapter: "1",
        verse: "1",
      },
      {
        name: "John",
        id: "JHN",
        chapter: "1",
        verse: "1",
      },
    ],
    collection: ["YA", "YA", "YA", "YA", "YA", "YA", "YA", "YA", "YA"],
    bibleBooks: booksChapter.books,
  }),
  methods: {
    goToView(view) {
      this.$store.commit("setView", view);
    },
    showAllBook() {},
    changeRoute(rn) {
      this.$router.push(rn);
    },
    startAnswering(ref) {
      this.$store.commit("setBook", { name: ref.name, id: ref.id });
      this.$store.commit("setChapter", ref.chapter);
      this.$store.commit("setVerses", ref.verse);
      this.$router.push("/answer");
    },
  },
  created() {
    let avatarName = firebase
      .auth()
      .currentUser.email.split("")[0]
      .toUpperCase();
    this.$store.commit("setAvatarName", avatarName);
  },
};
</script>

<style>
.header-bar {
  position: fixed;
  top: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  z-index: 2;
  background-color: white;
  padding: 1rem 2rem 1rem 0rem;
}

.avatar-container {
  text-align: center;
}

.avatar-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #42b72a;
  border-radius: 100%;
  width: 45px;
  height: 45px;
  font-weight: bold;
  font-size: 1.5rem;
}

.home-title-header {
  padding: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  border: 1px solid black;
  border-radius: 0.5rem;
  box-shadow: 8px 5px;
  cursor: pointer;
}

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
  padding: 2rem 2rem;
  margin: 0rem 0.5rem;
  border-radius: 0.5rem;
  background: #d5e37d;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
}

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
</style>
