<template>
  <div class="dashboard-container">
    <div class="header-bar">
      <div class="home-title-header" @click="goToView('Menu')">
        Memory<br />Verse
      </div>
      <div class="avatar-container" @click="changeRoute('profile')">
        <div class="avatar-circle">{{ this.getAvatarName }}</div>
      </div>
    </div>
    <component :is="this.getCurrentView" />
  </div>
</template>

<script>
import firebase from "firebase";
import Menu from "../components/Menu.vue";
import Level from "../components/Level.vue";
import Collection from "../components/Collection.vue";

export default {
  computed: {
    getCurrentView() {
      return this.$store.getters.getCurrentView;
    },
    getAvatarName() {
      return this.$store.getters.getAvatarName;
    },
  },
  components: {
    Menu,
    Level,
    Collection,
  },
  methods: {
    goToView(view) {
      this.$store.commit("setView", view);
    },
    changeRoute(rn) {
      this.$router.push(rn);
    },
  },
  created() {
    this.$store.commit("setView", "Menu");

    let avatarName = firebase
      .auth()
      .currentUser.email.split("")[0]
      .toUpperCase();
    this.$store.commit("setAvatarName", avatarName);
  },
};
</script>

<style>
.dashboard-container {
  width: 100vw;
}

.header-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  width: 100%;
  margin-bottom: 2rem;
}

.avatar-container {
  text-align: center;
}

.avatar-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #42b72a;
  border-radius: 100%;
  width: 50px;
  height: 50px;
  font-weight: bold;
  font-size: 2rem;
}

.home-title-header {
  padding: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  border: 1px solid black;
  border-radius: 0.5rem;
  box-shadow: 8px 5px;
  cursor: pointer;
}

@media only screen and (min-width: 768px) {
  .dashboard-container {
    width: 30vw;
  }
}
</style>
