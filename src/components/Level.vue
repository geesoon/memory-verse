<template>
  <section>
    <div class="nav-bar">
      <span class="material-icons" @click="setView('Menu')"> arrow_back </span>
    </div>
    <div class="level-menu">
      <div class="level-title level-items">Level</div>
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
.level-title {
  grid-area: level;
  background: #42b72a;
  border: none !important;
  box-shadow: 13px 14px 0px -3px rgba(0, 0, 0, 0.74);
  -webkit-box-shadow: 13px 14px 0px -3px rgba(0, 0, 0, 0.74);
  -moz-box-shadow: 13px 14px 0px -3px rgba(0, 0, 0, 0.74);
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
  border-radius: 1rem;
  border: 1px solid black;
  height: 15vh;
  width: 47vw;
  text-align: center;
  font-size: 1.3rem;
  cursor: pointer;
}

.level-items:hover {
  box-shadow: 13px 14px 0px -3px rgba(0, 0, 0, 0.74);
  -webkit-box-shadow: 13px 14px 0px -3px rgba(0, 0, 0, 0.74);
  -moz-box-shadow: 13px 14px 0px -3px rgba(0, 0, 0, 0.74);
  transition: box-shadow 300ms;
}
</style>
