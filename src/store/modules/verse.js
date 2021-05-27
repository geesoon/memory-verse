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
  collectionVerses: [],
};

const getters = {
  getVerseInfo: (state) => {
    return {
      selection: state.selection,
      level: state.level,
      isStartAlert: state.isStartAlert,
    };
  },
  getCollectionVerses: (state) => {
    return state.collectionVerses;
  },
};

const mutations = {
  setCollectionVerses(state, verses) {
    state.collectionVerses = [];
    state.collectionVerses = [...verses];
  },
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
    state.collectionVerses = [];
  },
};

export default {
  state,
  mutations,
  getters,
};
