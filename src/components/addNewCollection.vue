<template>
  <v-card>
    <v-card-title class="add-collection-title-bar">
      <span>Add Collection</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="newCollection.name"
              label="Collection name*"
              required
              clearable
              dense
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="newCollection.reviewPeriod"
              outlined
              dense
              :items="['Everyday', '3 days', '1 week', '2 weeks', '3 weeks']"
              label="Review Period*"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="newCollection.bibleVersion"
              outlined
              dense
              :items="['KJV', 'ESV']"
              label="Bible Version*"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" md="12">
            <v-dialog
              v-model="isShowAllBook"
              width="500"
              fullscreen
              hide-overlay
              transition="dialog-bottom-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="transparent"
                  v-bind="attrs"
                  v-on="on"
                  @click="showAllBook()"
                >
                  Add Verses
                </v-btn>
              </template>
              <addCollectionBibleBookPanel
                @closeDialog="updateVerseAdded()"
              ></addCollectionBibleBookPanel>
            </v-dialog>
          </v-col>
          <v-col cols="12" md="12">
            <v-row
              ><div v-for="(verse, key) in versesAdded" :key="key">
                <v-chip
                  >{{ verse.book.name }} {{ verse.chapter }}:{{
                    verse.verses
                  }}</v-chip
                >
              </div></v-row
            >
          </v-col>
        </v-row>
      </v-container>
      <v-col cols="12">
        <small>*indicates required field</small>
      </v-col>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="closeDialog()"> Close </v-btn>
      <v-btn color="blue darken-1" text @click="addCollection()"> Save </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import firebase from "firebase";
import bible from "../data/book.json";
import addCollectionBibleBookPanel from "../components/addCollectionBibleBookPanel";

export default {
  data: () => ({
    isShowAllBook: false,
    versesAdded: [],
    newCollection: {
      name: "",
      reviewPeriod: "Everyday",
      bibleVersion: "KJV",
      verseToBeAdd: [],
      formattedVerses: [],
    },
  }),
  components: {
    addCollectionBibleBookPanel,
  },
  watch: {
    "newCollection.verseToBeAdd": function () {
      this.newCollection.verseToBeAdd[
        this.newCollection.verseToBeAdd.length - 1
      ] = `${
        this.newCollection.verseToBeAdd[
          this.newCollection.verseToBeAdd.length - 1
        ]
      } (${this.newCollection.bibleVersion})`;
    },
  },
  computed: {
    getUserId() {
      return this.$store.getters.getUserInfo.id;
    },
    getSelectedVerse() {
      return this.$store.getters.getVerseInfo.selection;
    },
  },
  methods: {
    updateVerseAdded() {
      this.isShowAllBook = false;
      this.versesAdded.push(this.getSelectedVerse);
    },
    showAllBook() {
      this.isShowAllBook = true;
      this.$store.commit("setBibleBookSelectionPanelView", "book");
    },
    addCollection() {
      console.log(this.newCollection);

      this.formatVerseToAdd();

      const db = firebase.firestore();

      db.collection("users")
        .doc(this.getUserId)
        .collection("collection")
        .add({
          lastReview: "",
          name: this.newCollection.name,
          reviewPeriod: this.newCollection.reviewPeriod,
          verses: this.newCollection.formattedVerses,
        })
        .then(() => {
          console.log("Document successfully written user-> collection");
          this.$emit("success");
        })
        .catch((err) => {
          console.log("Fail to write to doc", err);
          this.$emit("fail");
        });
      this.closeDialog();
    },
    formatVerseToAdd() {
      /**Construct verse object from array of string in verseToAdd to be added to the database*/
      let verses = [...this.newCollection.verseToBeAdd];
      var format = /[!@#$%^&*()_+=[]{};'"|,.<>\/?]+/;

      verses.forEach((ref) => {
        console.log(ref);
        console.log(format.test(ref));
        if (!format.test(ref)) {
          let bibleVersion = "";
          let chapter = "";
          let startVerse = "";
          let endVerse = "";
          let book = "";
          let bookId = "";

          bibleVersion = ref.split("(")[1].split(")")[0];
          // Book & Chapter
          if (ref.search(":") == -1 && ref.search("-") == -1) {
            console.log("Book & Chapter", ref);
            book = ref.split(" (")[0].split(" ").slice(0, -1).join(" ");
            chapter = ref.split(" (")[0].split(" ").slice(-1).join("");
            startVerse = endVerse = 1;
          } else if (ref.search("-") == -1 && ref.search(":") != -1) {
            // Book Chapter:Verse
            console.log("Book Chapter:Verse", ref);
            book = ref.split(":")[0].split(" ").slice(0, -1).join(" ");
            startVerse = ref.split(":")[1].split(" (")[0];
            chapter = ref.split(":")[0].split(" ").slice(-1).join();
            endVerse = startVerse;
          } else {
            // Book Chapter:StartVerse-EndVerse
            console.log("Book Chapter:StartVerse-EndVerse", ref);
            chapter = ref.split(":")[0].split(" ").slice(-1).join();
            startVerse = ref.split(":")[1].split("-")[0];
            endVerse = ref.split("-")[1].split(" ")[0];
            book = ref.split(":")[0].split(" ").slice(0, -1).join(" ");
          }

          bookId = bible.books.filter((item) => {
            return (
              item.abbreviation.toLowerCase() ==
                book.split(" ").join("").toLowerCase() ||
              item.name.toLowerCase() == book.toLowerCase()
            );
          });

          if (bookId.length != 0) {
            this.newCollection.formattedVerses.push({
              id: bookId[0].id,
              book: book,
              chapter: chapter,
              startVerse: startVerse,
              endVerse: endVerse,
              bibleVersion: bibleVersion,
            });
          }
        }
      });
    },
    closeDialog() {
      (this.search = ""),
        (this.newCollection = {
          name: "",
          reviewPeriod: "Everyday",
          bibleVersion: "KJV",
          verseToBeAdd: [],
          formattedVerses: [],
        });
      this.$emit("closeDialog");
    },
  },
};
</script>

<style></style>
