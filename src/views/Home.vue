<template>
  <section>
    <div class="mobile-home-header-bar">
      <div class="header-logo-container">
        <div class="home-title-header" @click="changeRoute('main')">
          Memory Verse
        </div>
      </div>
      <div class="avatar-container" @click="changeRoute('profile')">
        <div class="avatar-circle">
          {{ this.getAvatarName }}
        </div>
      </div>
    </div>
    <div class="votd">
      Let the word of Christ dwell in you richly...
      <p style="text-align: right">- Col 3:16</p>
    </div>
    <div class="collection-title">Your Collection</div>
    <div v-if="isLoading" class="home-collection-container">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <div v-else-if="collection.length != 0" class="home-collection-container">
      <div class="collection-list">
        <div
          v-for="(item, key) in collection"
          :key="key"
          class="collection-item"
          @click="goToCollection(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div v-else class="home-collection-container">
      <div class="no-collection-face">(;-;)</div>
      <div>No collection</div>
      <v-btn plain @click="createNewCollection">Create</v-btn>
    </div>
  </section>
</template>

<script>
import firebase from "firebase";
import Collection from "@/apis/collection";

export default {
  data: () => ({
    collection: [],
    isLoading: false,
  }),
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
  created() {
    this.getCollection();
    let avatarName = firebase
      .auth()
      .currentUser.email.split("")[0]
      .toUpperCase();
    this.$store.commit("setAvatarName", avatarName);
  },
  methods: {
    createNewCollection() {},
    goToCollection(item) {
      this.$store.commit("setCollectionId", item.id);
      this.$router.push({
        name: "collection",
        params: { collectionId: item.id },
      });
    },
    changeRoute(rn) {
      if (this.$route.name != rn) {
        this.$router.push({ name: rn.toLowerCase() });
      }
    },
    async getCollection() {
      this.isLoading = true;
      let res = await Collection.getCollection(this.getUserId);
      if (res.valid) {
        this.collection = res.res;
      } else {
        this.collection = [];
      }
      this.isLoading = false;
    },
  },
};
</script>

<style>
.home-collection-container {
  text-align: center;
  margin-top: 1rem;
}

.no-collection-face {
  font-size: 4rem;
  color: lightgrey;
}

.mobile-home-header-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0rem;
}

.votd {
  font-size: 1.3rem;
  background: var(--secondary);
  border-radius: var(--rounded);
  padding: 2rem;
  margin: 1rem 0rem;
  color: white;
}

.collection-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.collection {
  margin: 1rem 0rem;
}

.collection-list {
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(2, 1fr);
}
.collection-list::-webkit-scrollbar {
  display: none;
}

.collection-item {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 8rem;
  padding: 1rem;
  border-radius: var(--rounded);
  background: var(--primary);
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
}

.collection-item:hover {
  opacity: 0.8;
}

@media only screen and (min-width: 768px) {
  .collection-list {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media only screen and (min-width: 1024px) {
  .mobile-home-header-bar {
    display: none;
  }

  .collection-list {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
