<template>
  <section>
    <div class="header-bar">
      <div class="my-collection-bar">
        <div
          class="avatar-container library-avatar"
          @click="changeRoute('profile')"
        >
          <div class="avatar-circle">{{ this.getAvatarName }}</div>
        </div>
        <div class="section-title">Your Collection</div>
      </div>
    </div>
    <v-dialog
      v-model="isAddCollection"
      persistent
      fullscreen
      scrollable
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <add-new-collection
        @closeDialog="refreshCollection()"
        @success="addSuccess()"
        @fail="addFail()"
      />
    </v-dialog>
    <v-snackbar v-model="isSnackbar" :timeout="timeout">
      {{ snackbarMsg }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="isSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <section class="collection-container">
      <v-fab-transition>
        <v-btn class="fab-add-collection" color="#d5e37d" fab right>
          <span class="material-icons" @click="isAddCollection = true">
            playlist_add
          </span>
        </v-btn>
      </v-fab-transition>
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
            {{ item.name }}
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import firebase from "firebase";
import AddNewCollection from "../components/addNewCollection.vue";

export default {
  data: () => ({
    collection: [],
    isGridView: false,
    isAddCollection: false,
    snackbarMsg: "",
    timeout: 2000,
    isSnackbar: false,
  }),
  components: {
    AddNewCollection,
  },
  computed: {
    getAvatarName() {
      return this.$store.getters.getAvatarName;
    },
    getUserId() {
      return this.$store.getters.getUserInfo.id;
    },
  },
  methods: {
    addSuccess() {
      this.snackbarMsg = "Collection successfully added";
      this.isSnackbar = true;
    },
    addFail() {
      this.snackbarMsg = "Fail to add the collection";
      this.isSnackbar = true;
    },
    getCollection() {
      const db = firebase.firestore();
      this.collection = [];

      db.collection("users")
        .doc(this.getUserId)
        .collection("collection")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.collection.push({
              id: doc.id,
              name: doc.data().name,
              lastReview: doc.data().id,
              reviewPeriod: doc.data().review_period,
            });
          });

          console.log(this.collection);
        })
        .catch((error) => {
          console.log("Error getting users collection", error);
        });
    },
    showCollection(selectedCollection) {
      this.$store.commit("setCollectionId", selectedCollection.id);
      this.$router.push({ name: "collection" });
    },
    changeRoute(rn) {
      this.$router.push({ name: rn });
    },
    refreshCollection() {
      this.getCollection();
      this.isAddCollection = false;
    },
  },
  created() {
    this.getCollection();
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

.fab-add-collection {
  position: fixed;
  bottom: 5rem;
  right: 2rem;
  z-index: 4;
}

.add-collection-title-bar {
  background: #d5e37d;
  font-weight: bold;
  font-size: 1.3rem;
}
</style>
