<template>
  <section class="search-container">
    <div class="search-title">Search</div>
    <v-autocomplete
      auto-select-first
      clearable
      solo
      v-model="searchInput"
      items="books"
      placeholder="Search"
    ></v-autocomplete>
    <div class="search-tip-box" v-if="searchInput == ''">
      <div>Looking for a verse?</div>
    </div>
  </section>
</template>

<script>
import bibleBooks from "../data/book.json";

export default {
  data: () => ({
    searchInput: "",
    books: bibleBooks.books,
  }),
};
</script>

<style>
.search-container {
  margin: 0rem 1rem;
}

.search-title {
  font-size: 2rem;
  font-weight: bold;
  margin: 2rem 0rem;
}

.search-tip-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.search-tip-box > div {
  flex: 1;
}
</style>
