<template>
  <div class="panel-button-container">
    <button class="btn btn-primary panel-buttons" @click="showSelectionModal">
      <h3>Select Verses</h3>
    </button>
    <button class="btn btn-primary panel-buttons"><h3>Start</h3></button>
    <section class="versePanelOverlay" v-show="showPanelOverlay">
      <div class="container">
        <div class="row mb-4">
          <button class="btn btn-link" @click="showPanelOverlay = false">
            X
          </button>
        </div>
        <div class="row">
          <div class="list col-6">
            <div><h5>Old Testament</h5></div>
            <!-- Loop the list of books in OT -->
          </div>
          <div class="list col-6">
            <div><h5>New Testament</h5></div>
            <!-- Loop the list of books in NT -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPanelOverlay: false,
    };
  },
  methods: {
    showSelectionModal() {
      this.showPanelOverlay = true;
    },
  },
};
</script>

<style>
.panel-button-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-items: center;
}

.panel-buttons {
  margin: 1rem;
  min-width: 100px;
  width: 250px;
}

.versePanelOverlay {
  margin: 1rem;
  background-color: white;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}
</style>
