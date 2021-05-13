<template>
  <section>
    <div class="header-bar">
      <div class="my-collection-bar">
        <div
          class="avatar-container library-avatar"
          @click="goToView('Profile')"
        >
          <div class="avatar-circle">{{ this.getAvatarName }}</div>
        </div>
        <div class="section-title">Your Collection</div>
      </div>
      <span class="material-icons"> playlist_add </span>
    </div>
    <section class="collection-container">
      <div class="view-toggle">
        <span
          class="material-icons"
          v-if="!isGridView"
          @click="isGridView = !isGridView"
        >
          grid_view
        </span>
        <span class="material-icons" v-else @click="isGridView = !isGridView">
          view_list
        </span>
      </div>
      <div v-if="!isGridView">
        <v-list subheader two-line class="list-view-collection">
          <v-list-item
            v-for="(item, key) in collection"
            :key="key"
            class="my-collection-item"
            @click="showCollection(item)"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
              <v-list-item-subtitle v-text="item.num"></v-list-item-subtitle>
            </v-list-item-content>
            <!-- <v-list-item-action>
              <v-btn icon>
                <span class="material-icons"> more_vert </span>
              </v-btn>
            </v-list-item-action> -->
          </v-list-item>
        </v-list>
      </div>

      <div v-else class="grid-view-collection">
        <div
          v-for="(item, key) in collection"
          :key="key"
          class="grid-collection-item"
          @click="showCollection(item)"
        >
          <div>
            {{ item.name }}<br />
            {{ item.num }}
          </div>
          <!-- <v-btn icon>
            <span class="material-icons"> more_vert </span>
          </v-btn> -->
        </div>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  data: () => ({
    collection: [
      { name: "YA", num: "5" },
      { name: "YA", num: "5" },
      { name: "YA", num: "5" },
      { name: "YA", num: "5" },
      { name: "YA", num: "5" },
      { name: "YA", num: "5" },
      { name: "YA", num: "5" },
      { name: "YA", num: "5" },
      { name: "YA", num: "5" },
      { name: "YA", num: "5" },
      { name: "YA", num: "5" },
      { name: "YA", num: "5" },
      { name: "YA", num: "5" },
      { name: "YA", num: "5" },
    ],
    isGridView: false,
  }),
  computed: {
    getAvatarName() {
      return this.$store.getters.getAvatarName;
    },
  },
  methods: {
    showCollection(selectedCollection) {
      console.log(selectedCollection);
    },
    goToView(view) {
      this.$store.commit("setView", view);
    },
    changeRoute(rn) {
      this.$router.push(rn);
    },
  },
};
</script>

<style>
.my-collection-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.collection-container {
  padding-top: 5rem;
  margin: 0rem 1rem;
}

.my-collection-item {
  margin: 1rem 0rem;
  background: #d5e37d;
  text-align: left;
  box-shadow: 8px 0px 0px 0px;
}

.library-avatar {
  margin-right: 1rem;
}

.view-toggle {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
}

.grid-view-collection {
  margin: 1rem 0rem;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr 1fr;
}

.grid-collection-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1rem;
  background: #d5e37d;
  box-shadow: 8px 0px 0px 0px;
}
</style>
