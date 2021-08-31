<template>
  <section>
    <draggable v-if="!isShowBackCard" @end="dragEnd" @start="dragStart">
      <v-card
        elevation="2"
        class="flash-card"
        color="primary"
        @click="isShowBackCard = !isShowBackCard"
      >
        <section>
          <div class="flash-card-container front">
            <div class="front-card-title">
              {{ getBibleVersion }}
            </div>
            <div class="front-card-title">
              {{ getReference }}
            </div>
            <div class="front-card-subtitle">Memorization</div>
          </div>
        </section>
        <section>
          <v-btn icon @click="recordVoice()">
            <span class="material-icons mic-icon"> mic </span>
          </v-btn>
        </section>
        <section v-show="isShowSwipingIcons" class="swiping-icons-container">
          <span id="swipe-back" class="material-icons swipe-icon">
            arrow_back_ios
          </span>
          <span id="swipe-next" class="material-icons swipe-icon">
            arrow_forward_ios
          </span>
        </section>
      </v-card>
    </draggable>

    <v-card
      v-else
      elevation="2"
      class="flash-card"
      color="primary"
      @click="isShowBackCard = !isShowBackCard"
    >
      <v-skeleton-loader
        v-if="!isVerseReady"
        type="image"
        height="100%"
        width="100%"
      />
      <div v-else class="flash-card-container">
        <span>
          {{ allVerses[indexCount] }}
        </span>
        <div class="reference">
          {{ getReference }}
        </div>
      </div>
      <section v-show="isShowSwipingIcons" class="swiping-icons-container">
        <span id="swipe-back" class="material-icons swipe-icon">
          arrow_back_ios
        </span>
        <span id="swipe-next" class="material-icons swipe-icon">
          arrow_forward_ios
        </span>
      </section>
    </v-card>
  </section>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
  },
  data: () => ({
    allVerses: [],
    indexCount: 0,
    isShowBackCard: false,
    isShowSwipingIcons: false,
    isVerseReady: false,
  }),

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
  created() {
    this.fetchVerses();
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
};
</script>

<style>
.v-skeleton-loader__image {
  height: 100% !important;
}

.flash-card-skeleton {
  width: 100%;
  height: 100% !important;
  border-radius: var(--rounded);
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
  border-radius: var(--rounded) !important;
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
