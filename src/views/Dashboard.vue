<template>
  <v-container class="dashboard-container">
    <component :is="this.getCurrentView" class="content" />
    <!-- Mobile navigation drawer -->
    <v-bottom-navigation :value="value" grow fixed class="nav-bottom">
      <v-btn value="home" @click="goToView('home')">
        <span>Home</span>
        <span class="material-icons"> home </span>
      </v-btn>

      <v-btn value="review" @click="goToView('review')">
        <span>Review</span><span class="material-icons"> alarm </span>
      </v-btn>

      <v-btn value="library" @click="goToView('library')">
        <span>Library</span>
        <span class="material-icons"> library_books </span>
      </v-btn>
    </v-bottom-navigation>

    <!-- Desktop navigation drawer -->
    <v-navigation-drawer permanent expand-on-hover class="nav-side">
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar @click="goToView('profile')">
            <v-avatar color="green" size="36">
              <span class="black--text headline">{{ this.getAvatarName }}</span>
            </v-avatar>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link @click="goToView('profile')">
          <v-list-item-content>
            <v-list-item-subtitle>{{
              this.getUserEmail()
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item link @click="goToView('home')">
          <v-list-item-icon>
            <span class="material-icons"> home </span>
          </v-list-item-icon>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="goToView('search')">
          <v-list-item-icon>
            <span class="material-icons"> search </span>
          </v-list-item-icon>
          <v-list-item-title>Search</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="goToView('library')">
          <v-list-item-icon>
            <span class="material-icons"> library_books </span>
          </v-list-item-icon>
          <v-list-item-title>Library</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list>
        <v-list-item> </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import Home from "../components/home.vue";
import Review from "../components/review.vue";
import Library from "../components/library.vue";
import Profile from "../components/profile.vue";
import Collection from "../components/collection.vue";
import firebase from "firebase";

export default {
  data: () => ({
    value: "home",
  }),
  computed: {
    getCurrentView() {
      return this.$store.getters.getCurrentView;
    },
    getAvatarName() {
      return this.$store.getters.getAvatarName;
    },
  },
  components: {
    Home,
    Review,
    Library,
    Profile,
    Collection,
  },
  methods: {
    goToView(view) {
      this.$store.commit("setView", view);
    },
    getUserEmail() {
      return firebase.auth().currentUser.email;
    },
  },
  created() {
    this.$store.commit("setView", this.getCurrentView);
  },
};
</script>

<style>
.v-avatar > span {
  cursor: pointer;
}

.content {
  margin-bottom: 4rem;
}

.nav-side {
  display: none !important;
}

@media only screen and (min-width: 1024px) {
  .dashboard-container {
    max-width: 90vw !important;
  }

  .nav-bottom {
    display: none !important;
  }

  .nav-side {
    z-index: 4;
    position: fixed;
    left: 0;
    display: block !important;
  }
}
</style>
