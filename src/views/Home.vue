<template>
  <div class="panel-container">
    <h1>Choose Your Verses</h1>
    <verses-selection-panel></verses-selection-panel>
  </div>
</template>

<script>
import VersesSelectionPanel from "../components/selectionPanelButtons.vue";
export default {
  components: {
    VersesSelectionPanel,
  },
};
</script>

<style>
.panel-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
