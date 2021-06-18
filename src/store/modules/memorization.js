const state = {
  collectionVerses: [],
};

const getters = {
  getCollectionVerses: (state) => {
    return state.collectionVerses;
  },
};

const mutations = {
  setCollectionVerses(state, verses) {
    state.collectionVerses = [];
    state.collectionVerses = [...verses];
  },
};

export default {
  state,
  mutations,
  getters,
};
