<template>
  <v-container class="dashboard-container">
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
    </v-bottom-navigation>

    <!-- Desktop navigation drawer -->
    <v-navigation-drawer permanent expand-on-hover class="nav-side">
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar @click="changeRoute('profile')">
            <v-avatar color="green" size="36">
              <span class="black--text headline">{{ this.getAvatarName }}</span>
            </v-avatar>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link @click="changeRoute('profile')">
          <v-list-item-content>
            <v-list-item-subtitle>{{ this.getUserEmail }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item link @click="changeRoute('main')">
          <v-list-item-icon>
            <span class="material-icons"> home </span>
          </v-list-item-icon>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="changeRoute('review')">
          <v-list-item-icon>
            <span class="material-icons"> alarm </span>
          </v-list-item-icon>
          <v-list-item-title>Review</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="changeRoute('library')">
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
import firebase from "firebase";

export default {
  data: () => ({}),
  computed: {
    getAvatarName() {
      return this.$store.getters.getAvatarName;
    },
    getUserId() {
      return this.$store.getters.getUserInfo.id;
    },
    getUserEmail() {
      return firebase.auth().currentUser.email;
    },
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
.v-avatar > span {
  cursor: pointer;
}

.content {
  margin-bottom: 4rem;
}

.nav-side {
  display: none !important;
}

.nav-bottom {
  height: 37px !important;
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
