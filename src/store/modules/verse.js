const state = {
  selection: {
    book: { id: "", name: "" },
    chapter: "",
    verses: "",
  },
  level: "Medium",
  isStartAlert: false,
};

const getters = {
  getVerseInfo: (state) => {
    return {
      selection: state.selection,
      level: state.level,
      isStartAlert: state.isStartAlert,
    };
  },
};

const mutations = {
  setStartAlert(state, alert) {
    state.isStartAlert = alert;
  },
  setBook(state, book) {
    state.selection.book.id = book.id;
    state.selection.book.name = book.name;
  },
  setChapter(state, chapter) {
    state.selection.chapter = chapter;
  },
  setVerses(state, verses) {
    state.selection.verses = verses;
  },
  setLevel(state, level) {
    state.level = level;
  },
  resetSelection(state) {
    state.selection.book.id = "";
    state.selection.book.name = "";
    state.selection.chapter = "";
    state.selection.verses = "";
    state.isStartAlert = false;
  },
};

export default {
  state,
  mutations,
  getters,
};
