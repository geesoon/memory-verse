<template>
  <div class="dashboard-container">
    <div class="header-bar">
      <div class="home-title-header">Memory<br />Verse</div>
      <div class="avatar-circle" @click="changeRoute('profile')">H</div>
    </div>
    <component :is="this.getCurrentView" />
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
import Menu from "../components/Menu.vue";
import Level from "../components/Level.vue";
import Collection from "../components/Collection.vue";

export default {
  computed: {
    getCurrentView() {
      return this.$store.getters.getCurrentView;
    },
  },
  components: {
    Menu,
    Level,
    Collection,
  },
  methods: {
    changeRoute(rn) {
      this.$router.push(rn);
    },
  },
  created() {
    this.$store.commit("setView", "Menu");
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

.footer-bar {
  text-align: center;
  font-size: 0.8rem;
  width: 100%;
}
</style>
