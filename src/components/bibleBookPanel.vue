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
      <div v-if="view == 'book'" class="books-overlay-container">
        <div class="testament-title">
          <span class="material-icons"> book </span>
          Old Testament
        </div>
        <div class="books-list-container">
          <div
            class="books-title"
            v-for="book in OTBooks"
            :key="book.id"
            @click="showBookChaptersPanel(book.id, 'OT')"
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
            @click="showBookChaptersPanel(book.id, 'NT')"
          >
            {{ book.abbreviation }}
          </div>
        </div>
      </div>

      <!-- Select Chapter -->
      <div v-if="view == 'chapter'" class="chapters-overlay-container">
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
      <div v-if="view == 'verse'" class="verses-overlay-container">
        <div class="book-verses-title">
          {{ this.getSelection.book.name + " " + this.getSelection.chapter }}
        </div>
        <div class="loading-container" v-if="isLoadingVerse">
          <span class="material-icons"> pending </span>
        </div>
        <div class="chapter-list-container" v-else>
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
    </v-container>
  </v-card>
</template>

<script>
import booksChapter from "../data/book.json";

export default {
  data() {
    return {
      NTBooks: [] /**Array of new testament book name */,
      OTBooks: [] /**Array of old testament book name */,
      booksChapter:
        booksChapter.books /**Stored json data locally to lower the number of queries needed to select a verse */,
      numOfChapters: "",
      numOfVerses: "",
      view: "book" /**Indicator of which selection view to display */,
      isLoadingVerses: true /**Indicator for verse loading spinner */,
      isStartAlert: false /**Indicator for no-verse selected start */,
    };
  },
  computed: {
    getSelection() {
      return this.$store.getters.getVerseInfo.selection;
    },
  },
  props: {
    selectedBook: String,
  },
  methods: {
    goBack() {
      if (this.view == "book") {
        this.$emit("closeDialog");
      } else if (this.view == "chapter") {
        this.view = "book";
      } else {
        this.view = "chapter";
      }
    },
    updateSelectionVerse(verseNum) {
      /**
       * Update the verse button text to the selected verse book:chapter:verse & reset the panel state
       */
      this.$store.commit("setVerses", verseNum);
      this.$router.push("/answer");
    },
    resetPanelState() {
      this.$store.commit("resetSelection");
      this.$emit("closeDialog");
    },
    showChaptersVersesPanel(chapterNum) {
      /**
       * Fetch verses reference in the book:chapter
       */
      this.$store.commit("setChapter", chapterNum);
      this.view = "verse";
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
    showBookChaptersPanel(bookId, testament) {
      /**
       * Display the chapter selection panel based on the selected book
       */
      let book = {
        id: "",
        name: "",
      };

      if (testament == "OT") {
        this.numOfChapters = this.OTBooks.find((book) => {
          return book.id === bookId;
        }).length;

        book.id = bookId;
        book.name = this.OTBooks.find((book) => {
          return book.id === bookId;
        }).name;
        this.$store.commit("setBook", book);
      } else {
        this.numOfChapters = this.NTBooks.find((book) => {
          return book.id === bookId;
        }).length;

        book.id = bookId;
        book.name = this.NTBooks.find((book) => {
          return book.id === bookId;
        }).name;
        this.$store.commit("setBook", book);
      }
      this.view = "chapter";
    },
    parseData() {
      /**
       * Read bible books stored in local data/json into old and new testament arrays
       */
      let afterOT = false;
      for (let i = 0; i < this.booksChapter.length; i++) {
        if (afterOT) {
          this.NTBooks.push(this.booksChapter[i]);
        } else {
          if (this.booksChapter[i].id == "MAT") {
            afterOT = true;
            this.NTBooks.push(this.booksChapter[i]);
          } else {
            this.OTBooks.push(this.booksChapter[i]);
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

<style>
.verse-nav-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 5vh;
}

/* Select book */
.testament-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5rem;
  border-radius: 5px;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: start;
}

.books-overlay-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.books-list-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.books-title,
.book-verses-title {
  border-radius: 5px;
  background-color: #d5e37d;
  padding: 1rem;
  margin: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  text-align: left;
  cursor: pointer;
}

.verse-title-box:hover,
.books-title:hover {
  box-shadow: 10px 10px;
  background-color: #d5e37d;
  border-radius: 5px;
  transition: 0.5s;
}

/* Select chapter */
.chapters-overlay-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.book-verses-title {
  font-size: 1.5rem !important;
  background-color: #d5e37d;
  padding: 0.5rem;
  border-radius: 5px;
  box-shadow: 10px 10px;
}

.chapter-list-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.verse-title-box,
.chapter-title-box {
  margin: 1rem;
  width: 3rem;
  height: 3rem;
  border: 2px solid black;
  border-radius: 5px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 5px;
}

.chapter-title-box:hover {
  font-size: 1.2rem;
  font-weight: bold;
  box-shadow: 5px 10px;
  transition: 0.2s;
}

/* Select verse */
.verses-overlay-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}

.selection-panel-overlay {
  width: 100vw;
  overflow-y: scroll;
  padding-bottom: 5rem;
}

/* General */
.loading-container {
  width: 100%;
  text-align: center;
}

.selection-buttons {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.panel-buttons {
  margin: 0.5rem;
  min-width: 100px;
  width: 250px;
}

#verse-button {
  border-radius: 5px;
  border: 1px solid black;
}

#level-button:hover,
#verse-button:hover,
#start-button:hover {
  box-shadow: 1px 1px 1px 1px black;
}

#level-button {
  border-radius: 5px !important;
  border: 1px solid black !important;
}

#start-button {
  background-color: #d5e37d;
  border-radius: 5px;
  border: 1px solid black;
}

#level-dropdown {
  width: 100%;
  text-align: center;
}

#dropdown-item:focus {
  background-color: lightgreen;
}

.dropdown-toggle::after {
  display: none !important;
}

@media only screen and (min-width: 768px) {
  .books-list-container {
    grid-gap: 0.5rem;
    grid-template-columns: repeat(8, 1fr);
  }
}

@media only screen and (min-width: 1024px) {
  .verse-selection-container {
    width: 50vw !important;
  }

  /* Select book */
  .testament-title {
    background-color: #d5e37d;
    padding: 0.5rem;
    border-radius: 5px;
    box-shadow: 10px 10px;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 1rem 0rem;
    text-align: start;
  }
}
</style>
