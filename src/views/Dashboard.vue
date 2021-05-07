<template>
  <div class="dashboard-container">
    <div class="header-bar">
      <div class="home-title-header">Memory<br />Verse</div>
      <div class="avatar-circle" @click="changeRoute('profile')">H</div>
    </div>
    <section class="dashboard-menu">
      <div class="verse dashboard-items" @click="changeRoute('verses')">
        Select Verses
      </div>
      <div class="level dashboard-items">
        Medium<br /><span class="level-text">level</span>
      </div>
      <div class="collection dashboard-items">Collection</div>
      <div class="start dashboard-items">Start</div>
    </section>
    <div class="footer-bar">
      <div>
        <span>Verse of the day</span><br />
        <span
          >In the beginning, God created the heaven and the earth. - Gen
          1:1</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    changeRoute(rn) {
      this.$router.push(rn);
    },
  },
};
</script>

<style>
.dashboard-container {
  height: 100%;
}

.header-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  margin: 1rem;
}

.avatar-circle {
  background: #e6e6fa;
  border-radius: 100%;
  width: 50px;
  height: 50px;
  text-align: center;
  font-weight: bold;
  font-size: 2rem;
  margin-top: 0.5rem;
}

.home-title-header {
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  border: 1px solid black;
  border-radius: 1rem;
  box-shadow: 10px 10px;
  margin-bottom: 4rem;
}

.verse {
  grid-area: verse;
}

.level {
  grid-area: level;
  background: blue;
}

.collection {
  grid-area: collection;
  background: green;
}

.start {
  grid-area: start-btn;
  background: #e6e6fa;
}

.level-text {
  font-size: 0.8rem;
}

.dashboard-menu {
  margin: 1rem 0rem;
  display: grid;
  gap: 1rem;
  grid-template:
    "verse level"
    "collection start-btn";
}

.dashboard-items {
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

.footer-bar {
  text-align: center;
  font-size: 0.8rem;
  width: 100%;
}
</style>
