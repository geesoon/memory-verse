<template>
  <section>
    Flash Cards
    <div>
      {{ this.allVerses[this.indexCount] }}
    </div>
  </section>
</template>

<script>
export default {
  data: () => ({
    allVerses: [],
    indexCount: 0,
    completeVerse: "",
  }),
  computed: {
    getCollectionVerses() {
      return this.$store.getters.getCollectionVerses;
    },
  },
  methods: {
    fetchVerses() {
      let verses = this.$store.getters.getCollectionVerses;
      const header = new Headers();
      header.append("api-key", "ea2400ebed2327b5e1b9595f416366e0");
      verses.forEach((verse) => {
        this.completeVerse = "";
        for (let i = verse.startVerse; i < verse.endVerse; i++) {
          const ref = `${verse.book.id}.${verse.chapter}.${i}`;
          const request = new Request(
            `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/verses/${ref}?content-type=text`,
            { headers: header }
          );
          fetch(request)
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else
                throw new "Retrieve verse fail, please refresh the page."();
            })
            .then((data) => {
              this.completeVerse += data.data.content.split("]")[1];
            });
        }
        this.allVerses.push(this.completeVerse);
      });
    },
  },
  created() {
    this.fetchVerses();
  },
};
</script>

<style></style>
