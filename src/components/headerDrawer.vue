<template>
  <section class="header-drawer">
    <div class="header-bar">
      <div class="header-logo-container">
        <span class="material-icons side-bar-menu-icon" @click="toggleDrawer()">
          menu
        </span>
        <div class="home-title-header" @click="changeRoute('main')">
          Memory Verse
        </div>
      </div>
      <div class="avatar-container" @click="changeRoute('profile')">
        <div class="avatar-circle">{{ this.getAvatarName }}</div>
      </div>
    </div>

    <!-- Desktop navigation drawer -->
    <v-navigation-drawer
      absolute
      bottom
      temporary
      class="nav-side"
      v-model="drawer"
    >
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
  </section>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    getAvatarName() {
      return this.$store.getters.getAvatarName;
    },
    getUserId() {
      return this.$store.getters.getUserInfo.id;
    },
    getUserEmail() {
      return this.$store.getters.getUserEmail;
    },
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    changeRoute(rn) {
      if (this.$route.name != rn) {
        this.$router.push({ name: rn.toLowerCase() });
      }
    },
  },
};
</script>

<style>
.header-drawer {
  display: none;
}

.header-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  margin-bottom: 1rem;
}

.header-logo-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.header-logo-container > .material-icons {
  margin-right: 1rem;
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
  width: 45px;
  height: 45px;
  font-weight: bold;
  font-size: 1.5rem;
  cursor: pointer;
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

.side-bar-menu-icon {
  display: none;
}

.nav-side {
  display: none !important;
}

@media only screen and (min-width: 1024px) {
  .header-drawer {
    display: block;
  }

  .avatar-container {
    display: none;
  }
  .nav-bottom {
    display: none !important;
  }

  .nav-side {
    display: block !important;
  }

  .side-bar-menu-icon {
    display: block;
  }
}
</style>
