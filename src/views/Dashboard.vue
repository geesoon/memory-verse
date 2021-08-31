<template>
  <section class="home-container">
    <!-- Desktop Side Nav Card -->
    <header-drawer />

    <!-- Main content -->
    <router-view class="content-view" :key="$route.fullPath"></router-view>

    <!-- Mobile navigation drawer -->
    <v-bottom-navigation
      :value="this.$route.name"
      grow
      fixed
      mandatory
      app
      flat
      class="nav-bottom"
    >
      <v-btn value="home" @click="changeRoute('main')">
        <span>Home</span>
        <span class="material-icons"> home </span>
      </v-btn>
      <v-btn @click="changeRoute('library')">
        <span>Collection</span>
        <span class="material-icons"> library_books </span>
      </v-btn>
      <v-btn value="profile" @click="changeRoute('profile')">
        <span>Profile</span>
        <span class="material-icons"> account_circle </span>
      </v-btn>
    </v-bottom-navigation>
  </section>
</template>

<script>
import firebase from "firebase";

import headerDrawer from "../components/headerDrawer";
export default {
  components: {
    headerDrawer,
  },
  methods: {
    changeRoute(rn) {
      if (this.$route.name != rn) {
        this.$router.push({ name: rn.toLowerCase() });
      }
    },
  },
  created() {
    let avatarName = firebase
      .auth()
      .currentUser.email.split("")[0]
      .toUpperCase();
    this.$store.commit("setAvatarName", avatarName);
  },
};
</script>

<style>
.home-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
}

.content-view {
  min-width: 100vw;
  max-width: 100vw;
  padding: 0rem 0.5rem 0.5rem 0.5rem;
}

.v-avatar > span {
  cursor: pointer;
}

.nav-bottom {
  height: 39px !important;
}

@media only screen and (min-width: 1024px) {
  .content-view {
    min-width: 50vw;
    max-width: 50vw;
    margin-top: 3rem;
    padding: 1rem;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    border-radius: var(--rounded);
  }
}
</style>
