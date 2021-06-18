<template>
  <section class="dashboard-container">
    <router-view></router-view>
    <!-- Mobile navigation drawer -->
    <v-bottom-navigation
      :value="this.$route.name"
      grow
      fixed
      class="nav-bottom"
    >
      <v-btn value="home" @click="changeRoute('main')">
        <span>Home</span>
        <span class="material-icons"> home </span>
      </v-btn>

      <v-btn value="review" @click="changeRoute('review')">
        <span>Review</span><span class="material-icons"> alarm </span>
      </v-btn>

      <v-btn value="library" @click="changeRoute('library')">
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

export default {
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
.dashboard-container {
  padding: 0.5rem 1rem;
}

.v-avatar > span {
  cursor: pointer;
}

.nav-bottom {
  height: 37px !important;
}
</style>
