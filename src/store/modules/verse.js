const state = {
  selection: {
    book: { id: "", name: "" },
    chapter: "",
    verses: "",
    next: "",
  },
  level: "Easy",
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
  setSelection(state, selection) {
    state.selection.book.id = selection.book.id;
    state.selection.book.name = selection.book.name;
    state.selection.chapter = selection.chapter;
    state.selection.verses = selection.verses;
    state.selection.next = selection.next;
  },
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
  setNext(state, next) {
    state.selection.next = next;
  },
  setLevel(state, level) {
    state.level = level;
  },
  resetSelection(state) {
    state.selection.book.id = "";
    state.selection.book.name = "";
    state.selection.chapter = "";
    state.selection.verses = "";
    state.selection.next = "";
    state.isStartAlert = false;
  },
};

export default {
  state,
  mutations,
  getters,
};
