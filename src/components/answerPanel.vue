<template>
  <div class="answer-panel-container">
    <section class="ma-0 pa-0">
      <div class="answer-panel-button">
        <div class="btn back-button" @click="goToMenu">Menu</div>
        <div>
          <div class="btn reset-button" @click="resetQuestion">Reset</div>
          <div class="btn next-button" @click="nextVerse">Next</div>
          <div
            id="auto-button"
            class="btn auto-off-button"
            @click="toggleAutoVerse"
          >
            Auto
          </div>
        </div>
      </div>
      <div v-if="isQuestionConstructed">
        <div class="question-outer-container">
          <div class="question-container">
            <span
              v-for="(word, index) in verse"
              :key="index"
              :class="word.class"
              :id="'b' + index"
            >
              {{ word.word }}
            </span>
            <div class="question-verse-quote-container">
              <span class="question-verse-quote"
                >{{ this.selection.book.name }} {{ this.selection.chapter }}:{{
                  this.selection.verses
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
        <draggable
          class="answer-container"
          v-model="answer"
          group="answer"
          @end="dragEnd"
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
      </div>
      <div class="answer-panel-loading" v-else>
        <div>
          <img src="../assets/book.gif" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  data() {
    return {
      verse: [],
      answer: [],
      blankLocation: [],
      isQuestionConstructed: false,
      isVerseCorrect: false,
      isAutoVerse: false,
    };
  },
  props: {
    selection: {
      book: { id: String, name: String },
      chapter: String,
      verses: String,
    },
    level: String,
  },
  components: {
    draggable,
  },
  methods: {
    toggleAutoVerse() {
      if (this.isAutoVerse == false) {
        this.isAutoVerse = true;
        let autoButton = document.getElementById("auto-button");
        autoButton.classList = "btn auto-on-button";
        this.checkScore();
      } else {
        this.isAutoVerse = false;
        let autoButton = document.getElementById("auto-button");
        autoButton.classList = "btn auto-off-button";
      }
    },
    checkScore(score) {
      setTimeout(() => {
        if (score == null) {
          score = document.getElementById("bar").style.width.split("%")[0];
        }
        if (score == 100 && this.isAutoVerse == true) {
          this.nextVerse();
        }
      }, 500);
    },
    calculateScore() {
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
      this.verse = [];
      this.answer = [];
      this.blankLocation = [];
      this.isVerseCorrect = false;
      this.isQuestionConstructed = false;
      this.fetchVerse(this.selection.next);
    },
    resetQuestion() {
      this.verse = [];
      this.answer = [];
      this.blankLocation = [];
      this.isVerseCorrect = false;
      this.isQuestionConstructed = false;
      this.fetchVerse();
    },
    goToMenu() {
      this.$emit("message", "SelectionPanel");
    },
    dragEnd(evt) {
      // Compare the drop location to all blank location, if match then replace else return to the answer pool
      let matchingId = "";
      this.blankLocation.forEach((blank) => {
        if (evt.originalEvent.changedTouches != null) {
          if (
            evt.originalEvent.changedTouches[0].pageX < blank.right &&
            evt.originalEvent.changedTouches[0].pageX > blank.left &&
            evt.originalEvent.changedTouches[0].pageY > blank.top &&
            evt.originalEvent.changedTouches[0].pageY < blank.bottom
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
        evt.item.addEventListener("click", (e) => {
          this.resetListener(e);
        });
        evt.item.id = matchingId;
        evt.item.draggable = true;
        blankReplaced.replaceWith(evt.item);
        this.updateScore();
      } else {
        console.log("Not within blank drop zone");
      }

      // update blank location after each successful drop
      this.retrieveBlankLocation();
    },
    resetListener(e) {
      let clickedAnsweredBlock = document.getElementById(e.target.id);

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
    },
    updateScore() {
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
    undoAnswerBlock(index) {
      console.log(index);
    },
    fetchVerse(nextVerse) {
      const verse =
        nextVerse == null
          ? `${this.selection.book.id}.${this.selection.chapter}.${this.selection.verses}`
          : nextVerse;
      const header = new Headers();
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
          this.selection.book.name = data.data.reference.split(" ")[0];
          this.selection.verses = data.data.reference.split(":")[1];
          this.selection.chapter = data.data.chapterId.split(".")[1];
          this.selection.book.id = data.data.bookId;
          this.selection.next = data.data.next.id;
          this.constructQuestion();
        });
    },
    constructQuestion() {
      let verseLength = this.verse.length;
      let replacePercentage = null;

      if (this.level == "Easy") {
        replacePercentage = 0.1;
      } else if (this.level == "Medium") {
        replacePercentage = 0.25;
      } else {
        replacePercentage = 0.5;
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
    // Cater for minimum loading gif
    setTimeout(() => {
      this.fetchVerse();
    }, 500);
  },
  updated() {
    this.retrieveBlankLocation();
  },
};
</script>

<style>
@media only screen and (max-width: 600px) {
  .answer-panel-loading {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    text-align: center;
    background-color: #f5f7f6;
  }

  .answer-panel-loading > div > img {
    width: 100vw;
    height: auto;
  }

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
  }

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
    margin: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .answer-panel-container {
    width: 100vw;
    height: 100%;
  }

  .question-outer-container {
    margin-bottom: 3rem;
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
    font-size: 1.5rem;
    font-weight: bold;
  }

  .question-word-blank {
    width: 5rem;
    background-color: lightgray;
    border-radius: 10px;
    margin: 0.5rem;
    height: 2rem;
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
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }

  .answer-block {
    box-shadow: 5px 5px;
    width: 50%;
    margin: 0.5rem;
    padding: 0.5rem;
    background-color: lavender;
    border-radius: 10px;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
  }
}

/* Desktop */
@media only screen and (min-width: 600px) {
  .answer-panel-loading {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    text-align: center;
    background-color: #f5f7f6;
  }

  .answer-panel-loading > div > img {
    width: 50%;
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
    margin: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .answer-panel-container {
    width: 70vw;
    height: 100%;
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
