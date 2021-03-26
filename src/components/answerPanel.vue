<template>
  <div class="answer-panel-container">
    <div class="question-container">
      <span
        v-for="(word, index) in verse"
        :key="index"
        :id="index"
        :class="word.class"
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
    <div class="answer-container">
      <span
        v-for="(answer, index) in answer"
        :key="index"
        class="answer-block"
        draggable="true"
      >
        {{ answer.word }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      verse: [],
      answer: [],
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
  methods: {
    fetchVerse() {
      const verse = `${this.selection.book.id}.${this.selection.chapter}.${this.selection.verses}`;
      console.log(verse);
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
          this.constructQuestion();
        });
    },
    constructQuestion() {
      let verseLength = this.verse.length;
      let replacePercentage = null;

      if (this.level == "EASY") {
        replacePercentage = 0.25;
      } else if (this.level == "MEDIUM") {
        replacePercentage = 0.5;
      } else {
        replacePercentage = 0.75;
      }

      let numOfWordToBeReplaced = replacePercentage * verseLength;

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
      console.log(this.answer);
    },
  },
  mounted() {
    this.fetchVerse();
  },
};
</script>

<style>
.answer-panel-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100vw;
}

.question-container {
  background-color: whitesmoke;
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: 90%;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.question-word {
  margin: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
}

.question-word-blank {
  width: 3rem;
  background-color: lightgray;
  border-radius: 10px;
  margin: 0.5rem;
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
}

.answer-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  width: 90%;
}

.answer-block {
  margin: 0.5rem;
  padding: 1rem;
  background-color: lightgoldenrodyellow;
  border-radius: 10px;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

@media only screen and (min-width: 768px) {
  .answer-panel-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  .question-container {
    background-color: whitesmoke;
    padding: 1.5rem;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    width: 80%;
    margin-bottom: 5rem;
  }

  .question-word {
    margin: 0.5rem;
    font-size: 2.5rem;
  }

  .question-word-blank {
    width: 6rem;
    background-color: lightgray;
    border-radius: 10px;
    margin: 0.5rem;
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
    font-size: 1.5rem;
  }

  .answer-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    width: 80%;
  }

  .answer-block {
    margin: 1rem;
    padding: 1rem;
    background-color: lightgoldenrodyellow;
    border-radius: 10px;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
  }
}
</style>
