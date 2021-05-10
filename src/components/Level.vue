<template>
  <section>
    <div class="nav-bar">
      <span class="material-icons" @click="setView('Menu')"> arrow_back </span>
    </div>
    <div class="level-menu">
      <div class="level level-items">Level</div>
      <div class="easy level-items" @click="updateLevel('Easy')">Easy</div>
      <div class="medium level-items" @click="updateLevel('Medium')">
        Medium
      </div>
      <div class="high level-items" @click="updateLevel('High')">High</div>
    </div>
  </section>
</template>

<script>
export default {
  methods: {
    setView(view) {
      this.$store.commit("setView", view);
    },
    updateLevel(level) {
      this.$store.commit("setLevel", level);
      this.$store.commit("setView", "Menu");
    },
  },
};
</script>

<style>
.level {
  grid-area: level;
}

.easy {
  grid-area: easy;
}

.medium {
  grid-area: medium;
}

.high {
  grid-area: high;
}

.level-menu {
  display: grid;
  gap: 1rem;
  grid-template:
    "level easy"
    "medium high";
}

.level-items {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 1rem;
  width: 45vw;
  height: 20vh;
  text-align: center;
  font-size: 2rem;
  cursor: pointer;
}
</style>
