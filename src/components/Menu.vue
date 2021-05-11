<template>
  <section class="dashboard-menu">
    <div
      class="verse dashboard-items"
      @click="changeRoute('verses')"
      v-if="this.isVerseSelected()"
    >
      <span class="small-select-verse">Select Verse</span>
      {{ this.showVersesSelected() }}
    </div>
    <div class="verse dashboard-items" @click="changeRoute('verses')" v-else>
      Select Verse
    </div>
    <div class="level dashboard-items" @click="goToView('Level')">
      {{ this.getVerseInfo.level }}<br /><span class="level-text">level</span>
    </div>
    <div class="collection dashboard-items" @click="goToView('Collection')">
      Collection
    </div>
    <div class="start dashboard-items" @click="changeRoute('/answer')">
      Start
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
  background: turquoise;
}

.collection {
  grid-area: collection;
  background: lightgreen;
}

.start {
  grid-area: start-btn;
  background: #e6e6fa;
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
  border: 1px solid black;
  border-radius: 1rem;
  height: 20vh;
  text-align: center;
  font-size: 1.5rem;
  cursor: pointer;
}

.dashboard-items:hover {
  box-shadow: 13px 14px 0px -3px rgba(0, 0, 0, 0.74);
  -webkit-box-shadow: 13px 14px 0px -3px rgba(0, 0, 0, 0.74);
  -moz-box-shadow: 13px 14px 0px -3px rgba(0, 0, 0, 0.74);
  transition: box-shadow 300ms;
}
</style>
