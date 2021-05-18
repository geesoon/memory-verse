<template>
  <v-card>
    <v-container class="verse-selection-container">
      <!-- Verses Selection Overlay Panel -->
      <v-toolbar flat light>
        <div class="verse-nav-bar">
          <span class="material-icons" @click="goBack()"> arrow_back </span>
          <span class="material-icons" @click="resetPanelState()"> clear </span>
        </div>
      </v-toolbar>

      <!-- Select Book -->
      <div
        v-if="this.getBibleBookSelectionPanelView == 'book'"
        class="books-overlay-container"
      >
        <div class="testament-title">
          <span class="material-icons"> book </span>
          Old Testament
        </div>
        <div class="books-list-container">
          <div
            class="books-title"
            v-for="book in OTBooks"
            :key="book.id"
            @click="showBookChaptersPanel(book.id)"
          >
            {{ book.abbreviation }}
          </div>
        </div>
        <div class="testament-title">
          <span class="material-icons"> book </span>New Testament
        </div>
        <div class="books-list-container">
          <div
            class="books-title"
            v-for="book in NTBooks"
            :key="book.id"
            @click="showBookChaptersPanel(book.id)"
          >
            {{ book.abbreviation }}
          </div>
        </div>
      </div>

      <!-- Select Chapter -->
      <div
        v-if="this.getBibleBookSelectionPanelView == 'chapter'"
        class="chapters-overlay-container"
      >
        <div class="book-verses-title">{{ this.getSelection.book.name }}</div>
        <div class="chapter-list-container">
          <div
            class="chapter-title-box"
            v-for="chapterNum in numOfChapters"
            :key="chapterNum"
            @click="showChaptersVersesPanel(chapterNum)"
          >
            {{ chapterNum }}
          </div>
        </div>
      </div>

      <!-- Select Verses -->
      <div
        v-if="this.getBibleBookSelectionPanelView == 'verse'"
        class="verses-overlay-container"
      >
        <div class="book-verses-title">
          {{ this.getSelection.book.name + " " + this.getSelection.chapter }}
        </div>
        <div class="loading-container" v-if="this.isLoadingVerses">
          <span class="material-icons"> pending </span>
        </div>
        <div class="verse-list-container" v-else>
          <div
            class="verse-title-box"
            v-for="verseNum in numOfVerses"
            :key="verseNum"
            @click="updateSelectionVerse(verseNum)"
          >
            v{{ verseNum }}
          </div>
        </div>
      </div>

      <v-btn class="fab-add-collection" fab right @click="closeDialog()"
        >Add</v-btn
      >
    </v-container>
  </v-card>
</template>

<script>
import bible from "../data/book.json";

export default {
  data() {
    return {
      NTBooks: [],
      OTBooks: [],
      bibleBooks:
        bible.books /**Stored json data locally to lower the number of queries needed to select a verse */,
      numOfChapters: "",
      numOfVerses: "",
      isLoadingVerses: true /**Indicator for verse loading spinner */,
      isStartAlert: false /**Indicator for no-verse selected start */,
    };
  },
  computed: {
    getSelection() {
      return this.$store.getters.getVerseInfo.selection;
    },
    getSelectedBookId() {
      return this.$store.getters.getSelectedBookId;
    },
    getBibleBookSelectionPanelView() {
      if (this.$store.getters.getBibleBookSelectionPanelView == "chapter") {
        this.showBookChaptersPanel(this.getSelectedBookId);
      }
      return this.$store.getters.getBibleBookSelectionPanelView;
    },
  },
  methods: {
    goBack() {
      if (this.getBibleBookSelectionPanelView == "book") {
        this.$emit("closeDialog");
      } else if (this.getBibleBookSelectionPanelView == "chapter") {
        this.$store.commit("setBibleBookSelectionPanelView", "book");
      } else {
        this.$store.commit("setBibleBookSelectionPanelView", "chapter");
      }
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    updateSelectionVerse(verseNum) {
      /**
       * Update the verse button text to the selected verse book:chapter:verse & reset the panel state
       */
      this.$store.commit("setVerses", verseNum);
      // this.$emit("closeDialog");
    },
    resetPanelState() {
      this.$store.commit("resetSelection");
      this.closeDialog();
    },
    showChaptersVersesPanel(chapterNum) {
      /**
       * Fetch verses reference in the book:chapter
       */
      this.$store.commit("setChapter", chapterNum);
      this.$store.commit("setBibleBookSelectionPanelView", "verse");
      const header = new Headers();
      header.append("api-key", "ea2400ebed2327b5e1b9595f416366e0");
      const request = new Request(
        `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/chapters/${
          this.getSelection.book.id + "." + chapterNum
        }/verses`,
        { methods: "GET", headers: header }
      );
      fetch(request)
        .then((response) => {
          if (response.ok) {
            this.isLoadingVerses = false;
            return response.json();
          } else
            throw new Error("Fail to retrieve verses, please refresh the page");
        })
        .then((data) => {
          this.numOfVerses = data.data.length;
        })
        .catch((e) => {
          alert(e);
        });
    },
    showBookChaptersPanel(bookId) {
      /**
       * Display the chapter selection panel based on the selected book
       */
      let book = {
        id: "",
        name: "",
      };

      this.numOfChapters = this.bibleBooks.find((book) => {
        return book.id === bookId;
      }).length;

      book.id = bookId;
      book.name = this.bibleBooks.find((book) => {
        return book.id === bookId;
      }).name;

      this.$store.commit("setBook", book);
      this.$store.commit("setSelectedBookId", book.id);
      this.$store.commit("setBibleBookSelectionPanelView", "chapter");
    },
    parseData() {
      /**
       * Read bible books stored in local data/json into old and new testament arrays
       */
      let afterOT = false;
      for (let i = 0; i < this.bibleBooks.length; i++) {
        if (afterOT) {
          this.NTBooks.push(this.bibleBooks[i]);
        } else {
          if (this.bibleBooks[i].id == "MAT") {
            afterOT = true;
            this.NTBooks.push(this.bibleBooks[i]);
          } else {
            this.OTBooks.push(this.bibleBooks[i]);
          }
        }
      }
    },
  },
  mounted() {
    /**Prepare bible books data on mounted */
    this.parseData();
  },
};
</script>
