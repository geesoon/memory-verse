<template>
  <section>
    <div class="dashboard-menu">
      <div
        class="verse dashboard-items"
        @click="changeRoute('/verses')"
        v-if="this.isVerseSelected()"
      >
        <span class="small-select-verse">Select Verse</span>
        {{ this.showVersesSelected() }}
      </div>
      <div class="verse dashboard-items" @click="changeRoute('/verses')" v-else>
        Select Verse
      </div>
      <div class="level dashboard-items" @click="goToView('Level')">
        {{ this.getVerseInfo.level }}<br /><span class="level-text">level</span>
      </div>
      <div class="collection dashboard-items" @click="goToView('Collection')">
        <span class="material-icons"> collections_bookmark </span>Collection
      </div>
      <div class="start dashboard-items" @click="changeRoute('/answer')">
        Start
      </div>
    </div>
    <div class="footer-bar">
      <div>
        <span>Verse of the day</span><br />
        <span
          >In the beginning, God created the heaven and the earth. - Gen
          1:1</span
        >
      </div>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    getVerseInfo() {
      return this.$store.getters.getVerseInfo;
    },
  },
  methods: {
    changeRoute(rn) {
      this.$router.push(rn);
    },
    isVerseSelected() {
      let selection = this.getVerseInfo.selection;
      console.log(selection);
      return (
        selection.book.id != "" &&
        selection.book.name != "" &&
        selection.chapter != "" &&
        selection.verse != ""
      );
    },
    showVersesSelected() {
      let selection = this.getVerseInfo.selection;
      return `${selection.book.id} ${selection.chapter}:${selection.verses}`;
    },
    goToView(view) {
      this.$store.commit("setView", view);
    },
  },
};
</script>

<style>
.verse {
  grid-area: verse;
  background: lavender;
}

.level {
  grid-area: level;
  background: #42b72a;
}

.collection {
  grid-area: collection;
  background: #42b72a;
}

.start {
  grid-area: start-btn;
  background: lavender;
}

.level-text {
  font-size: 0.8rem;
}

.dashboard-menu {
  display: grid;
  gap: 1rem;
  grid-template:
    "verse level"
    "collection start-btn";
}

.small-select-verse {
  font-size: 1rem;
}

.dashboard-items {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  border-radius: 1rem;
  height: 15vh;
  width: 47vw;
  text-align: center;
  font-size: 1.3rem;
  cursor: pointer;
}

.dashboard-items:hover {
  box-shadow: 13px 14px 0px -3px rgba(0, 0, 0, 0.74);
  -webkit-box-shadow: 13px 14px 0px -3px rgba(0, 0, 0, 0.74);
  -moz-box-shadow: 13px 14px 0px -3px rgba(0, 0, 0, 0.74);
  transition: box-shadow 300ms;
}

.footer-bar {
  text-align: center;
  font-size: 0.8rem;
  width: 100%;
  margin: 2rem 0rem;
}
</style>
