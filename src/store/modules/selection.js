const state = {
  selection: {
    book: { id: "", name: "" },
    chapter: "",
    startVerse: "",
    endVerse: "",
    next: "",
    previous: "",
    bibleVersion: "KJV",
  },
  level: "Easy",
  selectedCollectionId: "",
  selectedBookId: "",
  panelView: "",
};

const getters = {
  getVerseInfo: (state) => {
    return {
      selection: state.selection,
      level: state.level,
    };
  },
  getCollectionId(state) {
    return state.selectedCollectionId;
  },
  getBibleBookSelectionPanelView(state) {
    return state.panelView;
  },
  getSelectedBookId(state) {
    return state.selectedBookId;
  },
};

const mutations = {
  setSelection(state, selection) {
    state.selection.book.id = selection.book.id;
    state.selection.book.name = selection.book.name;
    state.selection.chapter = selection.chapter;
    state.selection.startVerse = selection.startVerse;
    state.selection.endVerse = selection.endVerse;
    state.selection.next = selection.next;
    state.selection.previous = selection.previous;
  },
  setBook(state, book) {
    state.selection.book.id = book.id;
    state.selection.book.name = book.name;
  },
  setChapter(state, chapter) {
    state.selection.chapter = chapter;
  },
  setStartVerse(state, verse) {
    state.selection.startVerse = verse;
  },
  setEndVerse(state, verse) {
    state.selection.endVerse = verse;
  },
  setNext(state, next) {
    state.selection.next = next;
  },
  setPrevious(state, previous) {
    state.selection.previous = previous;
  },
  setLevel(state, level) {
    state.level = level;
  },
  resetSelection(state) {
    state.selection.book.id = "";
    state.selection.book.name = "";
    state.selection.chapter = "";
    state.selection.startVerse = "";
    state.selection.endVerse = "";
    state.selection.next = "";
    state.selection.previous = "";
    state.selectedBookId = "";
    state.panelView = "";
  },
  setCollectionId(state, id) {
    state.selectedCollectionId = id;
  },
  setBibleBookSelectionPanelView(state, panelView) {
    state.panelView = panelView;
  },
  setSelectedBookId(state, id) {
    state.selectedBookId = id;
  },
};

export default {
  state,
  mutations,
  getters,
};
