<template>
  <div class="panel-container">
    <component
      :is="currentComponent"
      :selection="selection"
      :level="level"
      @message="updateComponentView"
    ></component>
  </div>
</template>

<script>
import SelectionPanel from "../components/selectionPanel.vue";
import AnswerPanel from "../components/answerPanel.vue";

export default {
  data() {
    return {
      currentComponent: "SelectionPanel",
      selection: { book: { id: "", name: "" }, chapter: "", verses: "" },
      level: "",
    };
  },
  components: {
    SelectionPanel,
    AnswerPanel,
  },
  methods: {
    updateComponentView(componentName, selection, level) {
      this.currentComponent = componentName;

      this.level = level;
      this.selection.book.id = selection.book.id;
      this.selection.book.name = selection.book.name;
      this.selection.chapter = selection.chapter;
      this.selection.verses = selection.verses;
    },
  },
};
</script>

<style>
.panel-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
