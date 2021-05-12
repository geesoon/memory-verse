<template>
  <v-container>
    <component :is="this.getCurrentView" keep-alive class="content" />
    <v-bottom-navigation :value="value" grow fixed class="nav-bottom">
      <v-btn value="home" @click="goToView('home')">
        <span>Home</span>
        <span class="material-icons"> home </span>
      </v-btn>

      <v-btn value="search" @click="goToView('search')">
        <span>Search</span>
        <span class="material-icons"> search </span>
      </v-btn>

      <v-btn value="library" @click="goToView('library')">
        <span>Library</span>
        <span class="material-icons"> library_books </span>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script>
import Home from "../components/home.vue";
import Search from "../components/search.vue";
import Library from "../components/library.vue";

export default {
  data: () => ({
    value: "home",
  }),
  computed: {
    getCurrentView() {
      return this.$store.getters.getCurrentView;
    },
  },
  components: {
    Home,
    Search,
    Library,
  },
  methods: {
    goToView(view) {
      this.$store.commit("setView", view);
    },
  },
  created() {
    this.$store.commit("setView", this.getCurrentView);
  },
};
</script>

<style>
.content {
  margin-bottom: 4rem;
}

@media only screen and (min-width: 768px) {
  .dashboard-container {
    width: 30vw;
  }
}
</style>
