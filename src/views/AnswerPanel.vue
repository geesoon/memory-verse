<template>
  <v-container class="answer-panel-container">
    <div class="answer-panel-button">
      <div class="back-button" @click="goToMenu">
        <span class="material-icons"> expand_more </span>
      </div>
      <div class="right-btn-set">
        <div class="btn reset-button" @click="resetQuestion">
          <span class="material-icons"> restart_alt </span>
        </div>
        <div class="btn next-button" @click="nextVerse">
          <span class="material-icons"> skip_next </span>
        </div>
        <!-- <div
          id="auto-button"
          class="btn auto-off-button"
          @click="toggleAutoVerse"
        >
          <span class="material-icons" v-if="isAutoVerse"> toggle_on </span>
          <span class="material-icons" v-else> toggle_off </span>
        </div> -->
        <div class="btn more-button" @click="isShowOptions = true">
          <span class="material-icons"> more_vert </span>
        </div>
        <v-bottom-sheet v-model="isShowOptions">
          <v-sheet height="200px">
            <v-list class="option-container">
              <v-list-item
                v-for="(item, key) in this.getOptionItems"
                :key="key"
                @click="chooseOption(item.text)"
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
      </div>
      <v-snackbar v-model="isSnackbar" :timeout="timeout">
        {{ snackbarMsg }}

        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="isSnackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
    <section v-if="isQuestionConstructed">
      <div class="question-outer-container">
        <div class="question-container">
          <div
            v-for="(word, index) in verse"
            :key="index"
            :class="word.class"
            :id="'b' + index"
          >
            {{ word.word }}
          </div>
          <div class="question-verse-quote-container">
            <span class="question-verse-quote"
              >{{ this.getSelection.book.name }}
              {{ this.getSelection.chapter }}:{{
                this.getSelection.verses
              }}</span
            >
          </div>
        </div>
        <div class="progress">
          <div
            id="bar"
            class="progress-bar progress-bar-striped in-progress"
            role="progressbar"
            style="width: 0%"
            aria-valuenow="0"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
      <!-- use blankLocation length as the key to force draggable to rerender everytime user drag and drop successfully -->
      <draggable
        class="answer-container"
        v-model="answer"
        group="answer"
        @end="dragEnd"
        :move="isSortable"
      >
        <div
          v-for="(element, index) in answer"
          :key="'a' + index"
          :id="'a' + index"
          class="answer-block"
        >
          {{ element.word }}
        </div>
      </draggable>
    </section>
    <section class="answer-panel-loading" v-else>
      <v-skeleton-loader
        type="image"
        class="question-block-skeleton"
      ></v-skeleton-loader>
      <v-row>
        <v-skeleton-loader
          type="image"
          class="answer-block-skeleton"
        ></v-skeleton-loader>

        <v-skeleton-loader
          type="image"
          class="answer-block-skeleton"
        ></v-skeleton-loader>

        <v-skeleton-loader
          type="image"
          class="answer-block-skeleton"
        ></v-skeleton-loader>
      </v-row>
    </section>
  </v-container>
</template>

<script>
import draggable from "vuedraggable";

export default {
  data() {
    return {
      verse: [] /**Store the question block */,
      answer: [] /**Store the answer block */,
      blankLocation: [] /**Store the blank location property */,
      isQuestionConstructed: false /**Indicator for complete question constructed */,
      isVerseCorrect: false /**Indicator for 100% */,
      isAutoVerse: true /**Indicator for auto toggle */,
      isShowOptions: false,
      selectedOption: "",
      snackbarMsg: "",
      timeout: 2000,
      isSnackbar: false,
    };
  },
  computed: {
    getSelection() {
      return this.$store.getters.getVerseInfo.selection;
    },
    getLevel() {
      return this.$store.getters.getVerseInfo.level;
    },
    getOptionItems() {
      let opts = [];
      if (this.isAutoVerse) {
        opts = [
          { text: "Add to collection", icon: "playlist_add" },
          { text: "Turn off auto-verse", icon: "toggle_on" },
        ];
      } else {
        opts = [
          { text: "Add to collection", icon: "playlist_add" },
          { text: "Turn on auto-verse", icon: "toggle_off" },
        ];
      }
      return opts;
    },
  },
  components: {
    draggable,
  },
  methods: {
    chooseOption(opt) {
      switch (opt) {
        case "Turn on auto-verse":
          this.isAutoVerse = true;
          this.snackbarMsg = "Auto-verse is on";
          this.checkScore();
          break;
        case "Turn off auto-verse":
          this.isAutoVerse = false;
          this.snackbarMsg = "Auto-verse is off";
          break;
        case "Add to collection":
          console.log("add to collection");
          this.snackbarMsg = "Added to collection";
          break;
      }
      setTimeout(() => {
        this.isShowOptions = false;
      }, 300);

      setTimeout(() => {
        this.isSnackbar = true;
      }, 400);
    },
    isSortable() {
      /**return false to disable block from sorting while user drag and to avoid vue-draggable from targeting the wrong block as it sorts */
      return false;
    },
    checkScore(score) {
      /**Cater for auto button
       * Check if score is 100% if true then fetch the next verse automatically */
      if (score == null) {
        score = document.getElementById("bar").style.width.split("%")[0];
      }
      if (score == 100 && this.isAutoVerse == true) {
        setTimeout(() => {
          this.nextVerse();
        }, 500);
      }
    },
    calculateScore() {
      /**Calculate the score based on the number of correct answer over the length of answer array */
      let score = 0;
      let arrFilled = [];
      let filled = document.querySelectorAll(".question-container")[0]
        .childNodes;

      filled.forEach((block) => {
        arrFilled.push(block.innerText);
      });

      this.answer.forEach((answer) => {
        if (arrFilled[answer.index] == answer.word) {
          score += 1;
        }
      });
      // Compare the list of innerHTML from .answer-container to answer array word
      return (score / this.answer.length) * 100;
    },
    nextVerse() {
      /**Reset the component data and fetch the next verse */
      this.verse = [];
      this.answer = [];
      this.blankLocation = [];
      this.isVerseCorrect = false;
      this.isQuestionConstructed = false;
      this.fetchVerse(this.getSelection.next);
    },
    resetQuestion() {
      /**Reset the question and the component data */
      this.verse = [];
      this.answer = [];
      this.blankLocation = [];
      this.isVerseCorrect = false;
      this.isQuestionConstructed = false;
      this.fetchVerse();
    },
    goToMenu() {
      this.$router.replace("dashboard");
    },
    dragEnd(evt) {
      // Compare the drop location to all blank location, if match then replace else return to the answer pool
      let matchingId = "";
      this.blankLocation.forEach((blank) => {
        if (evt.originalEvent.changedTouches != null) {
          if (
            evt.originalEvent.changedTouches[0].clientX < blank.right &&
            evt.originalEvent.changedTouches[0].clientX > blank.left &&
            evt.originalEvent.changedTouches[0].clientY > blank.top &&
            evt.originalEvent.changedTouches[0].clientY < blank.bottom
          ) {
            matchingId = blank.id;
          }
        } else {
          if (
            evt.originalEvent.pageX < blank.right &&
            evt.originalEvent.pageX > blank.left &&
            evt.originalEvent.pageY > blank.top &&
            evt.originalEvent.pageY < blank.bottom
          ) {
            matchingId = blank.id;
          }
        }
      });
      if (matchingId != "") {
        let blankReplaced = document.getElementById(matchingId);
        evt.item.style.width = "auto";
        evt.item.style.margin = "0px 0.5rem 0.5rem 0px";
        evt.item.addEventListener("click", (e) => {
          this.resetListener(e);
        });
        evt.item.id = matchingId;
        evt.item.draggable = false;
        blankReplaced.replaceWith(evt.item);
        this.updateScore();
      } else {
        console.log("Not within blank drop zone");
      }

      // update blank location after each successful drop
      this.retrieveBlankLocation();
    },
    resetListener(e) {
      /**onclick listener attached to every answered block to remove from question container and attach back to the answer pool */
      var clickedAnsweredBlock = document.getElementById(e.target.id);
      console.log(clickedAnsweredBlock);
      //append answer back to answer container
      let newAnswerBlock = document.createElement("div");
      newAnswerBlock.classList = "answer-block";
      newAnswerBlock.innerHTML = clickedAnsweredBlock.innerHTML;
      let answerContainer = document.querySelector(".answer-container");
      answerContainer.append(newAnswerBlock);

      //replace answered block with blank block
      let newBlankBlock = document.createElement("span");
      newBlankBlock.id = clickedAnsweredBlock.id;
      newBlankBlock.classList = "question-word-blank";
      clickedAnsweredBlock.replaceWith(newBlankBlock);
      this.updateScore();
      this.retrieveBlankLocation();
    },
    updateScore() {
      /**Update the score bar and score */
      let score = this.calculateScore();
      let bar = document.getElementById("bar");
      bar.style.width = `${score}%`;
      if (score == 100) {
        bar.classList = "progress-bar progress-bar-striped finished";
      } else {
        bar.classList = "progress-bar progress-bar-striped in-progress";
      }
      this.checkScore(score);
    },
    fetchVerse(nextVerse) {
      /**Fetch verse based on either the current verse selection or by next verse id */
      let selection = this.getSelection;

      const verse =
        nextVerse == null
          ? `${selection.book.id}.${selection.chapter}.${selection.verses}`
          : nextVerse;
      const header = new Headers();

      /** Move this api-key to environment variable */
      header.append("api-key", "ea2400ebed2327b5e1b9595f416366e0");

      const request = new Request(
        `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/verses/${verse}?content-type=text`,
        { headers: header }
      );

      fetch(request)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else throw new "Retrieve verse fail, please refresh the page."();
        })
        .then((data) => {
          let arrVerse = data.data.content.split(" ");

          // Filter out empty or space character from string split
          arrVerse.forEach((element) => {
            if (
              element != " " &&
              element != "" &&
              element != "\n" &&
              !element.includes("[")
            ) {
              this.verse.push({ word: element, class: "question-word" });
            }
          });

          let updatedSelection = {
            book: { name: "", id: "" },
            verses: "",
            chapter: "",
            next: "",
          };

          let firstHalf = data.data.reference.split(":")[0];
          let verse = data.data.reference.split(":")[1];
          let chapter = firstHalf.split(" ").slice(-1).join("");
          let book = firstHalf.split(" ").slice(0, -1).join(" ");

          updatedSelection.book.name = book;
          updatedSelection.verses = verse;
          updatedSelection.chapter = chapter;
          updatedSelection.book.id = data.data.bookId;
          updatedSelection.next = data.data.next.id;
          this.$store.commit("setSelection", updatedSelection);

          this.constructQuestion();
        });
    },
    constructQuestion() {
      /**Construct question based on the verses retrieved and the level selected  */
      let verseLength = this.verse.length;
      let replacePercentage = null;

      /**10% blank for Easy
       * 25% blank for Medium
       * 50% blank for Hard
       */
      console.log(this.getLevel);
      if (this.getLevel == "Easy") {
        replacePercentage = 0.1;
      } else if (this.getLevel == "Medium") {
        replacePercentage = 0.2;
      } else {
        replacePercentage = 0.3;
      }

      let numOfWordToBeReplaced = replacePercentage * verseLength;

      // Cater for minimum answer block
      if (numOfWordToBeReplaced == 1) {
        numOfWordToBeReplaced++;
      }

      var arr = [];
      while (arr.length < numOfWordToBeReplaced) {
        let r = Math.floor(Math.random() * verseLength);
        if (arr.indexOf(r) === -1) arr.push(r);
      }

      // Stored the answer-word to answer array
      arr.forEach((index) => {
        this.answer.push({
          word: this.verse[index].word,
          index: index,
        });
        this.verse[index].word = "";
        this.verse[index].class = "question-word-blank";
      });
      this.isQuestionConstructed = true;
    },
    retrieveBlankLocation() {
      /**Retrieve the latest blank in question container and its boundingClientRect properties */
      this.blankLocation = [];
      document
        .getElementsByClassName("question-word-blank")
        .forEach((blank) => {
          let rect = blank.getBoundingClientRect();
          let location = {
            top: rect.y,
            bottom: rect.bottom,
            left: rect.x,
            right: rect.right,
            id: blank.id,
          };
          this.blankLocation.push(location);
        });
    },
  },
  created() {
    // Listen for window resize
    window.addEventListener("resize", this.retrieveBlankLocation);

    // Cater for minimum loading gif
    setTimeout(() => {
      this.fetchVerse();
    }, 500);
  },
  updated() {
    this.retrieveBlankLocation();
  },
  destroyed() {
    window.removeEventListener("resize", this.retrieveBlankLocation);
  },
};
</script>

<style>
.question-block-skeleton {
  width: 95vw;
  height: 15rem;
}

.answer-block-skeleton {
  width: 25vw;
  height: 3rem;
  margin: 1rem;
}

.right-btn-set {
  display: flex;
  flex-direction: row;
}

.answer-panel-button {
  background-color: white;
  padding: 0.5rem 0rem;
  position: sticky;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.answer-panel-loading {
  width: 100vw;
  height: 100vh;
  text-align: center;
}

.more-button,
.back-button,
.reset-button,
.next-button,
.auto-off-button {
  border: 1px solid black !important;
  padding: 0.5rem !important;
  background-color: white !important;
  border-radius: 5px !important;
  text-align: center !important;
  font-size: 1rem !important;
  font-weight: bold !important;
  cursor: pointer;
}

.more-button:focus,
.back-button:focus,
.reset-button:focus,
.next-button:focus,
.auto-off-button:click {
  box-shadow: 1px 1px 1px 1px lightgray;
}

.auto-on-button {
  border: 1px solid black !important;
  padding: 0.5rem !important;
  background-color: pink !important;
  border-radius: 5px !important;
  text-align: center !important;
  font-size: 1rem !important;
  font-weight: bold !important;
}

.auto-on-button,
.auto-off-button,
.reset-button,
.next-button {
  margin-right: 0.5rem;
}

.progress {
  border-radius: 0px !important;
  height: 0.5rem !important;
}

.in-progress {
  background-color: gray !important;
}

.finished {
  background-color: lightgreen !important;
}

.answer-panel-button {
  top: 0;
}

.answer-panel-container {
  width: 100%;
  height: 100%;
}

.question-outer-container {
  margin-bottom: 1rem;
}

.question-container {
  padding: 1rem;
  background-color: whitesmoke;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.question-word {
  margin: 0.3rem;
  font-size: 1rem;
  font-weight: bold;
}

.question-word-blank {
  width: 5rem;
  background-color: lightgray;
  border-radius: 10px;
  margin: 0.5rem;
  height: 1.5rem;
  box-shadow: 5px 5px gray;
}

.question-word-blank:hover {
  background-color: gray;
}

.question-verse-quote-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
}

.question-verse-quote {
  margin: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
}

.answer-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.answer-block {
  box-shadow: 5px 5px;
  margin: 0.5rem;
  padding: 0.5rem;
  background-color: lavender;
  border-radius: 10px;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.option-container {
  width: 100vw;
  height: 200px;
}

.option-text {
  font-size: 1.2rem;
}

/* Desktop  */
@media only screen and (min-width: 1024px) {
  .answer-panel-container {
    width: 70vw;
    height: 100%;
  }
}

/* Tablet */
@media only screen and (min-width: 768px) {
  .answer-panel-loading {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    justify-content: flex-start;
    text-align: center;
  }

  .question-block-skeleton {
    width: 100%;
    height: 15rem;
  }

  .answer-block-skeleton {
    width: 25%;
    height: 3rem;
    margin: 1rem;
  }

  .back-button,
  .reset-button,
  .next-button,
  .auto-off-button {
    border: 1px solid black !important;
    padding: 0.5rem;
    background-color: white;
    border-radius: 10px;
    text-align: center;
    font-size: 1rem;
    font-weight: bold !important;
  }

  .auto-on-button {
    border: 1px solid black !important;
    padding: 0.5rem;
    background-color: pink !important;
    border-radius: 10px;
    text-align: center;
    font-size: 1rem;
    font-weight: bold !important;
  }

  .reset-button,
  .next-button {
    margin-right: 0.5rem;
  }

  .back-button:hover,
  .reset-button:hover,
  .next-button:hover {
    background-color: lavender;
    transition: 0.2s;
  }

  .progress {
    height: 0.5rem !important;
    border-radius: 0px 0px 10px 10px !important;
  }

  .in-progress {
    background-color: gray !important;
  }

  .finished {
    background-color: lightgreen !important;
  }

  .answer-panel-button {
    background-color: white;
    padding: 1rem;
    width: 100%;
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .question-outer-container {
    margin-bottom: 3rem;
  }

  .question-container {
    background-color: whitesmoke;
    padding: 1.5rem;
    border-radius: 10px 10px 0px 0px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    margin-top: 3rem;
  }

  .question-word {
    margin: 0.5rem;
    font-size: 2rem;
  }

  .question-word-blank {
    width: 6rem;
    background-color: lightgray;
    border-radius: 10px;
    margin: 0.5rem;
    height: 3rem;
    box-shadow: 5px 5px gray;
  }

  .question-verse-quote-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    width: 100%;
  }

  .question-verse-quote {
    margin: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
  }

  .answer-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    flex: 1;
  }

  .answer-block {
    margin: 1rem;
    padding: 1rem;
    background-color: lavender;
    border-radius: 10px;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: move;
    box-shadow: 5px 5px;
  }
}
</style>
