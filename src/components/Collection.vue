<template>
  <section>
    <div class="nav-bar">
      <span class="material-icons" @click="setView('Menu')"> arrow_back </span>
    </div>
    <div class="collection-container">
      <div class="collection-block collection-title">Collection</div>
      <div class="collection-block">+ Add to collection</div>
      <div
        class="collection-block"
        v-for="(verse, key) in this.collection"
        :key="key"
      >
        {{ verse }}
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      collection: ["John 1:1", "Gen 1:1"],
    };
  },
  methods: {
    setView(view) {
      this.$store.commit("setView", view);
    },
  },
};
</script>

<style>
.nav-bar {
  width: 100%;
  text-align: left;
  margin: 1rem 0rem;
}

.collection-container {
  gap: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.collection-title {
  box-shadow: 13px 14px 0px -3px rgba(0, 0, 0, 0.74);
  -webkit-box-shadow: 13px 14px 0px -3px rgba(0, 0, 0, 0.74);
  -moz-box-shadow: 13px 14px 0px -3px rgba(0, 0, 0, 0.74);
  background: #42b72a;
  border: none !important;
}

.collection-block {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 1rem;
  height: 15vh;
  width: 47vw;
  text-align: center;
  font-size: 1.3rem;
  cursor: pointer;
}
</style>
