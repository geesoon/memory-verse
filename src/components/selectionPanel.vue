<template>
  <div class="panel-button-container">
    <div class="container-title">Memory Verse</div>
    <div class="selection-buttons">
      <button
        id="verse-button"
        class="btn panel-buttons"
        @click="showSelectionModal"
      >
        <h4>Verses</h4>
      </button>
      <div class="btn-group panel-buttons">
        <button
          type="button"
          id="level-button"
          class="btn dropdown-toggle"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <h4>{{ this.level }}</h4>
        </button>
        <div id="level-dropdown" class="dropdown-menu">
          <a class="dropdown-item" href="#" @click="level = 'Easy'"
            ><h4>Easy</h4></a
          >
          <a class="dropdown-item" href="#" @click="level = 'Medium'"
            ><h4>Medium</h4></a
          >
          <a class="dropdown-item" href="#" @click="level = 'Hard'"
            ><h4>Hard</h4></a
          >
        </div>
      </div>
    </div>
    <div>
      <div v-show="isStartAlert">
        <div class="alert alert-info" role="alert" style="text-align: center">
          <strong>Please select a verse!</strong>
        </div>
      </div>
      <button
        id="start-button"
        class="btn panel-buttons"
        @click="startAnswering()"
      >
        <h4>Start</h4>
      </button>
    </div>

    <!-- Verses Selection Overlay Panel -->
    <section class="selection-panel-overlay" v-show="showPanelOverlay">
      <div class="container ma-0">
        <div class="closeSelectionContainer">
          <button
            class="btn btn-link"
            style="font-weight: bold"
            @click="resetPanelState()"
          >
            X
          </button>
        </div>

        <!-- Select Book -->
        <div v-if="view == 'book'" class="books-overlay-container">
          <div class="testament-title">Old Testament</div>
          <div class="books-list-container">
            <span
              class="books-title"
              v-for="book in OTBooks"
              :key="book.id"
              @click="showBookChaptersPanel(book.id, 'OT')"
            >
              {{ book.name }}
            </span>
          </div>
          <div class="testament-title">New Testament</div>
          <div class="books-list-container">
            <span
              class="books-title"
              v-for="book in NTBooks"
              :key="book.id"
              @click="showBookChaptersPanel(book.id, 'NT')"
            >
              {{ book.name }}
            </span>
          </div>
        </div>

        <!-- Select Chapter -->
        <div v-if="view == 'chapter'" class="chapters-overlay-container">
          <div class="book-verses-title">{{ this.selection.book.name }}</div>
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
            {{ this.selection.book.name + " " + this.selection.chapter }}
          </div>
          <div class="spinner-container">
            <div
              v-if="isLoadingVerses"
              class="spinner-border text-dark"
              role="status"
            >
              <span class="visually-hidden"></span>
            </div>
          </div>
          <div class="chapter-list-container">
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
      </div>
    </section>
  </div>
</template>

<script>
import booksChapter from "../data/book.json";

export default {
  data() {
    return {
      level: "Easy",
      showPanelOverlay: false /**Indicator to show selection panel overlay */,
      NTBooks: [] /**Array of new testament book name */,
      OTBooks: [] /**Array of old testament book name */,
      booksChapter:
        booksChapter.data /**Stored json data locally to lower the number of queries needed to select a verse */,
      selection: {
        book: { id: "", name: "" },
        chapter: "",
        verses: "",
      } /**User's verse selection */,
      numOfChapters: "",
      numOfVerses: "",
      view: "book" /**Indicator of which selection view to display */,
      isLoadingVerses: true /**Indicator for verse loading spinner */,
      isStartAlert: false /**Indicator for no-verse selected start */,
    };
  },
  methods: {
    startAnswering() {
      /**
       * Check if verse is selected, if yes then change component to answer panel
       */
      if (
        this.selection.book.name != "" &&
        this.selection.chapter != "" &&
        this.selection.verses != ""
      ) {
        this.$emit("message", "AnswerPanel", this.selection, this.level);
      } else {
        this.isStartAlert = true;
      }
    },
    updateSelectionVerse(verseNum) {
      /**
       * Update the verse button text to the selected verse book:chapter:verse & reset the panel state
       */
      this.selection.verses = verseNum;
      const verseButton = document.querySelector("#verse-button > h4");
      verseButton.innerHTML = `${this.selection.book.name} ${this.selection.chapter}:${this.selection.verses}`;
      this.resetPanelState();
    },
    resetPanelState() {
      /**
       * Reset the selection panel view to book
       */
      this.isLoadingVerses = true;
      this.view = "book";
      this.numOfVerses = "";
      this.numOfChapters = "";
      this.isStartAlert = false;
      this.showPanelOverlay = false;
    },
    showChaptersVersesPanel(chapterNum) {
      /**
       * Fetch verses reference in the book:chapter
       */
      this.selection.chapter = chapterNum;
      this.view = "verse";
      const header = new Headers();
      header.append("api-key", "ea2400ebed2327b5e1b9595f416366e0");
      const request = new Request(
        `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/chapters/${
          this.selection.book.id + "." + chapterNum
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
      if (testament == "OT") {
        this.numOfChapters = this.OTBooks.find((book) => {
          return book.id === bookId;
        }).length;

        this.selection.book.id = bookId;
        this.selection.book.name = this.OTBooks.find((book) => {
          return book.id === bookId;
        }).name;
      } else {
        this.numOfChapters = this.NTBooks.find((book) => {
          return book.id === bookId;
        }).length;

        this.selection.book.id = bookId;
        this.selection.book.name = this.NTBooks.find((book) => {
          return book.id === bookId;
        }).name;
      }
      this.view = "chapter";
    },
    showSelectionModal() {
      /**
       * Display the selection panel overlay
       */
      this.showPanelOverlay = true;
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
.closeSelectionContainer {
  text-align: end;
  margin-bottom: -2rem;
}

.closeSelectionContainer > button {
  font-size: 2rem;
  color: black;
  margin: 0px;
}

/* Memory Verse title */
.container-title {
  margin: 1rem;
  padding: 0.5rem;
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  border: 1px solid black;
  border-radius: 1rem;
  box-shadow: 10px 10px;
}

@media only screen and (max-width: 600px) {
  /* Select book */
  .testament-title {
    background-color: lavender;
    padding: 0.5rem;
    border-radius: 5px;
    box-shadow: 0px 5px 1px 2px;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
    margin-top: 2rem;
    text-align: start;
    width: 100%;
    text-align: center;
  }
}

@media only screen and (min-width: 600px) {
  /* Select book */
  .testament-title {
    background-color: lavender;
    padding: 0.5rem;
    border-radius: 5px;
    box-shadow: 10px 10px;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
    margin-top: 2rem;
    text-align: start;
  }
}

.books-overlay-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 80%;
  width: 100%;
}

.books-list-container {
  border-radius: 5px;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
}

.books-title,
.book-verses-title {
  border: 1px solid black;
  border-radius: 5px;
  background-color: lavender;
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
  background-color: lavender;
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
  background-color: lavender;
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
  position: fixed;
  background-color: white;
  width: 100vw;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
  overflow-y: scroll;
  padding-bottom: 5rem;
}

/* General */
.spinner-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.panel-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50%;
  width: 80%;
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
  background-color: lavender;
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
</style>
