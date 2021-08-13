<template>
  <section class="header-drawer">
    <div class="logo-bar">
      <div class="header-logo-container">
        <div class="home-title-header" @click="changeRoute('main')">
          Memory Verse
        </div>
      </div>
      <div class="avatar-container" @click="changeRoute('profile')">
        <div class="avatar-circle">{{ this.getAvatarName }}</div>
      </div>
    </div>

    <v-card class="side-nav-card">
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

      <v-list nav>
        <v-list-item link @click="changeRoute('main')">
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="changeRoute('library')">
          <v-list-item-title>Collection</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
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
.side-nav-card {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px !important;
  border-radius: 1rem !important;
}

.header-drawer {
  display: none;
}

.logo-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
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
  background: whitesmoke;
  border-radius: 100%;
  width: 45px;
  height: 45px;
  font-weight: bold;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
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

@media only screen and (min-width: 1024px) {
  .header-drawer {
    display: block;
    min-width: 25vw;
    max-width: 25vw;
    padding: 3rem;
  }
  .avatar-container {
    display: none;
  }
  .nav-bottom {
    display: none !important;
  }
}

@media only screen and (min-width: 1440px) {
  .header-drawer {
    display: block;
    min-width: 20vw;
    max-width: 20vw;
    padding: 3rem;
  }
}
</style>
