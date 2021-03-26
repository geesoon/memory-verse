<template>
  <div class="panel-button-container">
    <div class="container-title">Memory Verse</div>
    <div class="selection-buttons">
      <button
        id="verse-button"
        class="btn panel-buttons"
        @click="showSelectionModal"
      >
        <h3>Verses</h3>
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
          <a class="dropdown-item" href="#" @click="level = 'EASY'"
            ><h4>EASY</h4></a
          >
          <a class="dropdown-item" href="#" @click="level = 'MEDIUM'"
            ><h4>MEDIUM</h4></a
          >
          <a class="dropdown-item" href="#" @click="level = 'HARD'"
            ><h4>HARD</h4></a
          >
        </div>
      </div>
    </div>
    <div>
      <div v-show="isStartAlert">
        <div class="alert alert-danger" role="alert">
          <strong>Please select a verse!</strong>
        </div>
      </div>
      <button
        id="start-button"
        class="btn panel-buttons"
        @click="startAnswering()"
      >
        <h3>Start</h3>
      </button>
    </div>

    <!-- Verses Selection Overlay Panel -->
    <section class="verse-panel-overlay" v-show="showPanelOverlay">
      <div class="container">
        <div>
          <button class="btn btn-link" @click="resetPanelState()">X</button>
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
          <div class="chapter-list-container">
            <div class="spinner-container">
              <div
                v-if="isLoadingVerses"
                class="spinner-border text-dark"
                role="status"
              >
                <span class="visually-hidden"></span>
              </div>
            </div>
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
      level: "EASY",
      showPanelOverlay: false,
      NTBooks: [],
      OTBooks: [],
      booksChapter: booksChapter.data,
      selection: { book: { id: "", name: "" }, chapter: "", verses: "" },
      numOfChapters: "",
      numOfVerses: "",
      view: "book",
      isLoadingVerses: true,
      isStartAlert: false,
    };
  },
  methods: {
    startAnswering() {
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
      this.selection.verses = verseNum;
      const verseButton = document.querySelector("#verse-button > h3");
      verseButton.innerHTML = `${this.selection.book.name} ${this.selection.chapter}:${this.selection.verses}`;
      this.resetPanelState();
    },
    resetPanelState() {
      this.showPanelOverlay = false;
      this.isLoadingVerses = true;
      this.view = "book";
      this.numOfVerses = "";
      this.numOfChapters = "";
      this.isStartAlert = false;
    },
    showChaptersVersesPanel(chapterNum) {
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
      this.showPanelOverlay = true;
    },
    parseData() {
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
    this.parseData();
  },
};
</script>

<style>
/* Memory Verse title */
.container-title {
  margin: 1rem;
  padding: 1rem;
  font-size: 3.5rem;
  font-weight: bold;
  text-align: center;
  border: 1px dashed black;
  border-radius: 1rem;
}

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

.books-overlay-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 80%;
  width: 100%;
}

.books-list-container {
  background-color: white;
  border-radius: 5px;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1rem;
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

.verse-panel-overlay {
  padding: 1rem;
  background-color: whitesmoke;
  position: fixed;
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
  background-color: whitesmoke;
  border-radius: 5px;
  border: 1px solid black;
}

#level-button:hover,
#verse-button:hover,
#start-button:hover {
  box-shadow: 1px 1px 1px 1px black;
}

#level-button {
  background-color: whitesmoke !important;
  border-radius: 5px !important;
  border: 1px solid black !important;
}

#start-button {
  background-color: lightskyblue;
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
