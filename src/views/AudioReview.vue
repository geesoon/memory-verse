<template>
  <section>
    <draggable @end="dragEnd" @start="dragStart" v-if="!isShowBackCard">
      <v-card
        elevation="2"
        class="flash-card"
        color="primary"
        @click="isShowBackCard = !isShowBackCard"
      >
        <section>
          <div class="flash-card-container front">
            <div class="front-card-title">
              {{ this.getBibleVersion }}
            </div>
            <div class="front-card-title">
              {{ this.getReference }}
            </div>
            <div class="front-card-subtitle">Memorization</div>
          </div>
        </section>
        <section>
          <v-btn icon @click="recordVoice()">
            <span class="material-icons mic-icon"> mic </span>
          </v-btn>
        </section>
        <section class="swiping-icons-container" v-show="isShowSwipingIcons">
          <span class="material-icons swipe-icon" id="swipe-back">
            arrow_back_ios
          </span>
          <span class="material-icons swipe-icon" id="swipe-next">
            arrow_forward_ios
          </span>
        </section>
      </v-card>
    </draggable>

    <v-card
      elevation="2"
      class="flash-card"
      color="primary"
      @click="isShowBackCard = !isShowBackCard"
      v-else
    >
      <v-skeleton-loader
        type="image"
        height="100%"
        width="100%"
        v-if="!isVerseReady"
      >
      </v-skeleton-loader>
      <div class="flash-card-container" v-else>
        <span>
          {{ this.allVerses[this.indexCount] }}
        </span>
        <div class="reference">
          {{ this.getReference }}
        </div>
      </div>
      <section class="swiping-icons-container" v-show="isShowSwipingIcons">
        <span class="material-icons swipe-icon" id="swipe-back">
          arrow_back_ios
        </span>
        <span class="material-icons swipe-icon" id="swipe-next">
          arrow_forward_ios
        </span>
      </section>
    </v-card>
  </section>
</template>

<script>
import draggable from "vuedraggable";

export default {
  data: () => ({
    allVerses: [],
    indexCount: 0,
    isShowBackCard: false,
    isShowSwipingIcons: false,
    isVerseReady: false,
  }),
  components: {
    draggable,
  },
  computed: {
    getCollectionVerses() {
      return this.$store.getters.getCollectionVerses;
    },
    getBibleVersion() {
      return this.$store.getters.getCollectionVerses[this.indexCount]
        .bibleVersion;
    },
    getReference() {
      let verse = this.getCollectionVerses[this.indexCount];
      let ref = "";
      console.log(verse);
      if (verse.endVerse != "") {
        ref = `${verse.book.id} ${verse.chapter}:${verse.startVerse}-${verse.endVerse}`;
      } else {
        ref = `${verse.book.id} ${verse.chapter}:${verse.startVerse}`;
      }
      return ref;
    },
    getSwipeBackCoordinate() {
      return document.getElementById("swipe-back").getBoundingClientRect();
    },
    getSwipeNextCoordinate() {
      return document.getElementById("swipe-next").getBoundingClientRect();
    },
  },
  methods: {
    recordVoice() {
      console.log("recording voice");
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("getUserMedia supported.");
        navigator.mediaDevices
          .getUserMedia(
            // constraints - only audio needed for this app
            {
              audio: true,
            }
          )

          // Error callback
          .catch(function (err) {
            console.log("The following getUserMedia error occurred: " + err);
          });
      } else {
        console.log("getUserMedia not supported on your browser!");
      }
    },
    dragStart() {
      this.isShowSwipingIcons = true;
    },
    dragEnd(evt) {
      this.isShowSwipingIcons = false;

      // swipe next
      if (
        evt.originalEvent.changedTouches[0].clientX >
        this.getSwipeNextCoordinate.left
      ) {
        if (this.indexCount < this.allVerses.length) {
          this.indexCount++;
          this.fetchVerses();
        }
      } else if (
        // swipe back
        evt.originalEvent.changedTouches[0].clientX <
        this.getSwipeBackCoordinate.right
      ) {
        if (this.indexCount != 0) {
          this.indexCount--;
        }
      } else {
        this.isShowBackCard = !this.isShowBackCard;
      }
    },
    changeRoute(rn) {
      if (this.$route.name != rn) {
        this.$router.push({ name: rn.toLowerCase() });
      }
    },
    async fetchVerses() {
      let verses = this.$store.getters.getCollectionVerses;
      this.isVerseReady = false;
      this.combinedVerses(verses[this.indexCount]).then((value) => {
        this.allVerses.push(value);
      });
    },
    async combinedVerses(verse) {
      const header = new Headers();
      header.append("api-key", "ea2400ebed2327b5e1b9595f416366e0");
      let completeVerse = "";
      for (let i = verse.startVerse; i < verse.endVerse; i++) {
        const ref = `${verse.book.id}.${verse.chapter}.${i}`;
        const request = new Request(
          `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/verses/${ref}?content-type=text`,
          { headers: header }
        );
        await fetch(request)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else throw new "Retrieve verse fail, please refresh the page."();
          })
          .then((data) => {
            completeVerse += data.data.content.split("]")[1];
          });
      }
      this.isVerseReady = true;
      return completeVerse;
    },
  },
  created() {
    this.fetchVerses();
  },
};
</script>

<style>
.v-skeleton-loader__image {
  height: 100% !important;
}

.flash-card-skeleton {
  width: 100%;
  height: 100% !important;
  border-radius: 1rem;
}

.swiping-icons-container {
  bottom: 50%;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.mic-icon {
  font-size: 50px;
}

.swipe-icon {
  font-size: 80px;
  opacity: 0.7;
}

.front-card-title {
  font-size: 2rem;
}

.front-card-subtitle {
  font-size: 1.5rem;
}

.flash-card {
  margin: 1rem 0.5rem;
  height: 95vh;
  border-radius: 1rem !important;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.flash-card-container {
  margin-top: 1rem 0rem;
  overflow-y: scroll;
  padding: 2rem;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: justify;
}

.front {
  justify-content: center;
}

.reference {
  text-align: end;
  width: 100%;
  margin: 1rem 0rem;
}
</style>
