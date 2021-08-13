<template>
  <v-card flat>
    <v-toolbar flat>
      <div class="verse-nav-bar">
        <div>
          <span class="material-icons" @click="closeAddCollectionDialog()">
            arrow_back
          </span>
          <v-toolbar-title>Add Collection</v-toolbar-title>
        </div>
        <span class="material-icons" @click="closeAddCollectionDialog()">
          clear
        </span>
      </div>
    </v-toolbar>
    <section class="collection-form-container">
      <div>
        <v-text-field
          v-model="collection.name"
          label="Collection name*"
          required
          clearable
          outlined
          color="whitesmoke"
        ></v-text-field>
        <div v-show="this.error != ''" class="error-message">
          {{ this.error }}
        </div>
      </div>
      <div>
        <v-select
          v-model="collection.reviewPeriod"
          outlined
          :items="['Everyday', '3 days', '1 week', '2 weeks', '3 weeks']"
          label="Review Period*"
          required
          color="whitesmoke"
        ></v-select>
      </div>
      <div><small>*indicates required field</small></div>
      <br />
      <div>
        <v-dialog
          v-model="isShowAllBook"
          width="500"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="whitesmoke"
              v-bind="attrs"
              v-on="on"
              @click="showAllBook()"
            >
              Add Verses
            </v-btn>
          </template>
          <addCollectionBibleBookPanel
            @updateVerse="updateVerseAdded()"
            @closeDialog="closeAddVersePanel()"
          ></addCollectionBibleBookPanel>
        </v-dialog>
      </div>
      <div>
        <v-chip-group column>
          <v-chip
            v-for="(verse, key) in collection.verses"
            :key="key"
            close
            @click:close="removeVerse(verse)"
            color="whitesmoke"
          >
            <span v-if="verse.startVerse != '' && verse.endVerse != ''">
              {{ verse.book.name }} {{ verse.chapter }}:{{
                verse.startVerse
              }}-{{ verse.endVerse }} ({{ verse.bibleVersion }})
            </span>
            <span v-else-if="verse.endVerse == '' && verse.startVerse == ''">
              {{ verse.book.name }} {{ verse.chapter }} ({{
                verse.bibleVersion
              }})
            </span>
            <span v-else>
              {{ verse.book.name }} {{ verse.chapter }}:{{
                verse.startVerse
              }}
              ({{ verse.bibleVersion }})
            </span>
          </v-chip>
        </v-chip-group>
      </div>
    </section>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="darken-1" text @click="addCollection()"> Save </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import firebase from "firebase";
import addCollectionBibleBookPanel from "../components/bibleBookPanel.vue";

export default {
  data: () => ({
    isShowAllBook: false,
    collection: {
      name: "",
      reviewPeriod: "Everyday",
      verses: [],
    },
    error: "",
  }),
  components: {
    addCollectionBibleBookPanel,
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
    closeAddVersePanel() {
      this.$store.commit("resetSelection");
      this.isShowAllBook = false;
    },
    removeVerse(selectedVerse) {
      this.collection.verses = this.collection.verses.filter((verse) => {
        return (
          verse.book.id != selectedVerse.book.id &&
          verse.chapter != selectedVerse.chapter &&
          verse.startVerse != selectedVerse.startVerse &&
          verse.endVerse != selectedVerse.endVerse &&
          verse.bibleVersion != selectedVerse.bibleVersion
        );
      });
    },
    updateVerseAdded() {
      this.collection.verses.push({
        book: {
          id: this.getSelectedVerse.book.id,
          name: this.getSelectedVerse.book.name,
        },
        chapter: this.getSelectedVerse.chapter,
        startVerse: this.getSelectedVerse.startVerse,
        endVerse: this.getSelectedVerse.endVerse,
        bibleVersion: this.getSelectedVerse.bibleVersion,
      });
      this.isShowAllBook = false;
    },
    showAllBook() {
      this.isShowAllBook = true;
      this.$store.commit("resetSelection");
      this.$store.commit("setBibleBookSelectionPanelView", "book");
    },
    addCollection() {
      if (this.checkForm()) {
        const db = firebase.firestore();
        db.collection("users")
          .doc(this.getUserId)
          .collection("collection")
          .add({
            lastReview: "",
            name: this.collection.name,
            reviewPeriod: this.collection.reviewPeriod,
            verses: this.collection.verses,
          })
          .then(() => {
            console.log("Document successfully written user-> collection");
            this.$emit("success");
          })
          .catch((err) => {
            console.log("Fail to write to doc", err);
            this.$emit("fail");
          });
        this.closeAddCollectionDialog();
      }
    },
    checkForm() {
      if (this.collection.name != "" && this.collection.reviewPeriod != "") {
        this.error = "";
        return true;
      } else {
        this.error = "Collection name cannot be empty.";
        return false;
      }
    },
    closeAddCollectionDialog() {
      this.collection = {
        name: "",
        reviewPeriod: "Everyday",
        verses: [],
      };
      this.error = "";
      this.$store.commit("resetSelection");
      this.$emit("closeDialog");
    },
    // formatVerseToAdd() {
    //   /**Construct verse object from array of string in verseToAdd to be added to the database*/
    //   let verses = [...this.collection.verses];
    //   var format = /[!@#$%^&*()_+=[]{};'"|,.<>\/?]+/;

    //   verses.forEach((ref) => {
    //     console.log(ref);
    //     console.log(format.test(ref));
    //     if (!format.test(ref)) {
    //       let bibleVersion = "";
    //       let chapter = "";
    //       let startVerse = "";
    //       let endVerse = "";
    //       let book = "";
    //       let bookId = "";

    //       bibleVersion = ref.split("(")[1].split(")")[0];
    //       // Book & Chapter
    //       if (ref.search(":") == -1 && ref.search("-") == -1) {
    //         console.log("Book & Chapter", ref);
    //         book = ref.split(" (")[0].split(" ").slice(0, -1).join(" ");
    //         chapter = ref.split(" (")[0].split(" ").slice(-1).join("");
    //         startVerse = endVerse = 1;
    //       } else if (ref.search("-") == -1 && ref.search(":") != -1) {
    //         // Book Chapter:Verse
    //         console.log("Book Chapter:Verse", ref);
    //         book = ref.split(":")[0].split(" ").slice(0, -1).join(" ");
    //         startVerse = ref.split(":")[1].split(" (")[0];
    //         chapter = ref.split(":")[0].split(" ").slice(-1).join();
    //         endVerse = startVerse;
    //       } else {
    //         // Book Chapter:StartVerse-EndVerse
    //         console.log("Book Chapter:StartVerse-EndVerse", ref);
    //         chapter = ref.split(":")[0].split(" ").slice(-1).join();
    //         startVerse = ref.split(":")[1].split("-")[0];
    //         endVerse = ref.split("-")[1].split(" ")[0];
    //         book = ref.split(":")[0].split(" ").slice(0, -1).join(" ");
    //       }

    //       bookId = bible.books.filter((item) => {
    //         return (
    //           item.abbreviation.toLowerCase() ==
    //             book.split(" ").join("").toLowerCase() ||
    //           item.name.toLowerCase() == book.toLowerCase()
    //         );
    //       });

    //       if (bookId.length != 0) {
    //         this.collection.formattedVerses.push({
    //           id: bookId[0].id,
    //           book: book,
    //           chapter: chapter,
    //           startVerse: startVerse,
    //           endVerse: endVerse,
    //           bibleVersion: bibleVersion,
    //         });
    //       }
    //     }
    //   });
    // },
  },
};
</script>

<style>
.collection-form-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 1rem;
}

.collection-form-container > div {
  min-width: 100%;
  margin-bottom: 0.5rem;
}

.error-message {
  color: red;
  line-height: 0.5rem;
}

@media only screen and (min-width: 1024px) {
  .collection-form-container > div {
    min-width: 50%;
  }

  .collection-form-container {
    justify-content: center;
    align-items: center;
  }
}
</style>
