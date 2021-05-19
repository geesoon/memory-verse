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
    state.selection.startVerse = selection.startVerse;
    state.selection.endVerse = selection.endVerse;
    state.selection.next = selection.next;
    state.selection.previous = selection.previous;
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
    state.isStartAlert = false;
  },
};

export default {
  state,
  mutations,
  getters,
};
