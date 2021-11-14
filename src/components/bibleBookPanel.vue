<template>
	<v-card class="verse-selection-container" flat>
		<!-- Verses Selection Overlay Panel -->
		<v-toolbar flat>
			<div class="verse-nav-bar">
				<div>
					<span class="material-icons" @click="goBack()">
						arrow_back
					</span>
				</div>
				<span class="material-icons" @click="resetPanelState()">
					clear
				</span>
			</div>
		</v-toolbar>

		<!-- Select Book -->
		<div
			v-if="this.getBibleBookSelectionPanelView == 'book'"
			class="books-overlay-container"
		>
			<div class="testament-title">
				<span class="material-icons"> book </span>
				Old Testament
			</div>
			<div class="books-list-container">
				<div
					class="books-title"
					v-for="book in OTBooks"
					:key="book.id"
					@click="showBookChaptersPanel(book.id)"
				>
					{{ book.abbreviation }}
				</div>
			</div>
			<div class="testament-title">
				<span class="material-icons"> book </span>New Testament
			</div>
			<div class="books-list-container">
				<div
					class="books-title"
					v-for="book in NTBooks"
					:key="book.id"
					@click="showBookChaptersPanel(book.id)"
				>
					{{ book.abbreviation }}
				</div>
			</div>
		</div>

		<!-- Select Chapter -->
		<div
			v-if="this.getBibleBookSelectionPanelView == 'chapter'"
			class="chapters-overlay-container"
		>
			<div class="book-verses-title">
				<span>
					{{ this.getSelection.book.name }}
				</span>
			</div>
			<div class="chapter-list-container">
				<div
					class="chapter-title-box"
					v-for="chapterNum in numOfChapters"
					:key="chapterNum"
					@click="showChaptersVersesPanel(chapterNum)"
				>
					{{ chapterNum }}
				</div>
			</div>
		</div>

		<!-- Select Verses -->
		<div
			v-if="this.getBibleBookSelectionPanelView == 'verse'"
			class="verses-overlay-container"
		>
			<div class="book-verses-title">
				<span>
					{{
						this.getSelection.book.name +
						" " +
						this.getSelection.chapter
					}}
				</span>
				<button class="add-verse-btn" @click="finishSelection()">
					Add
				</button>
			</div>
			<div class="verse-list-container" v-if="!isLoadingVerses">
				<div
					class="verse-title-box"
					v-for="verseNum in numOfVerses"
					:key="verseNum"
					:id="`v${verseNum}`"
					@click="updateSelectionVerse(verseNum, `v${verseNum}`)"
				>
					v{{ verseNum }}
				</div>
			</div>
			<div v-else class="verse-loading-container">
				<v-progress-circular
					indeterminate
					color="primary"
				></v-progress-circular>
			</div>
		</div>
		<div
			class="select-verse-bar"
			v-if="this.getBibleBookSelectionPanelView == 'verse'"
		>
			<button class="select-verse-btn" @click="finishSelection()">
				Add
			</button>
		</div>
	</v-card>
</template>

<script>
	import bible from "../data/book.json";

	export default {
		data() {
			return {
				NTBooks: [],
				OTBooks: [],
				bibleBooks:
					bible.books /**Stored json data locally to lower the number of queries needed to select a verse */,
				numOfChapters: "",
				numOfVerses: "",
				isLoadingVerses: false /**Indicator for verse loading spinner */,
				isStartAlert: false /**Indicator for no-verse selected start */,
				isStartVerse: true,
				fullPage: true,
			};
		},
		computed: {
			getSelection() {
				return this.$store.getters.getVerseInfo.selection;
			},
			getSelectedBookId() {
				return this.$store.getters.getSelectedBookId;
			},
			getBibleBookSelectionPanelView() {
				if (
					this.$store.getters.getBibleBookSelectionPanelView ==
					"chapter"
				) {
					this.showBookChaptersPanel(this.getSelectedBookId);
				}
				return this.$store.getters.getBibleBookSelectionPanelView;
			},
		},
		methods: {
			finishSelection() {
				if (
					this.getSelection.chapter == "" &&
					this.getSelection.book.id != ""
				) {
					alert("Please select a chapter");
				} else if (this.getSelection.book.id == "") {
					alert("Please select a book");
				} else {
					this.$emit("updateVerse");
					this.$emit("answer");
				}
			},
			goBack() {
				if (this.getBibleBookSelectionPanelView == "book") {
					this.$emit("closeDialog");
				} else if (this.getBibleBookSelectionPanelView == "chapter") {
					this.$store.commit("setChapter", "");
					this.$store.commit(
						"setBibleBookSelectionPanelView",
						"book"
					);
				} else {
					this.$store.commit("setStartVerse", "");
					this.$store.commit("setEndVerse", "");
					this.$store.commit(
						"setBibleBookSelectionPanelView",
						"chapter"
					);
				}
			},
			updateSelectionVerse(verseNum, blockId) {
				if (this.isStartVerse) {
					// Reset previous selection range
					for (let i = 1; i <= this.numOfVerses; i++) {
						document.getElementById(`v${i}`).classList =
							"verse-title-box";
					}

					// Set the new start range
					document.getElementById(blockId).classList =
						"verse-title-box-active";
					this.$store.commit("setStartVerse", verseNum);
					this.isStartVerse = false;
				} else {
					// Set the new end range
					let startVerse = this.getSelection.startVerse;
					if (blockId.split("v")[1] > startVerse) {
						for (
							let i = startVerse;
							i <= blockId.split("v")[1];
							i++
						) {
							document.getElementById(`v${i}`).classList =
								"verse-title-box-active";
						}
						this.$store.commit("setEndVerse", verseNum);
					}
					this.isStartVerse = true;
				}
			},
			resetPanelState() {
				this.$store.commit("resetSelection");
				this.$emit("closeDialog");
			},
			showChaptersVersesPanel(chapterNum) {
				/**
				 * Fetch verses reference in the book:chapter
				 */

				this.isLoadingVerses = true;
				this.$store.commit("setChapter", chapterNum);
				this.$store.commit("setBibleBookSelectionPanelView", "verse");
				const header = new Headers();
				header.append("api-key", "ea2400ebed2327b5e1b9595f416366e0");
				const request = new Request(
					`https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/chapters/${
						this.getSelection.book.id + "." + chapterNum
					}/verses`,
					{ methods: "GET", headers: header }
				);
				fetch(request)
					.then((response) => {
						if (response.ok) {
							// this.isLoadingVerses = false;
							return response.json();
						} else
							this.$store.dispatch("setAlert", {
								message:
									"Fail to retrieve verses, please refresh the page",
								type: "warning",
							});
					})
					.then((data) => {
						this.numOfVerses = data.data.length;
					})
					.catch((error) => {
						// this.isLoadingVerses = false;
						this.$store.dispatch("setAlert", {
							message: error,
							type: "warning",
						});
					});
			},
			showBookChaptersPanel(bookId) {
				/**
				 * Display the chapter selection panel based on the selected book
				 */
				let book = {
					id: "",
					name: "",
				};

				this.numOfChapters = this.bibleBooks.find((book) => {
					return book.id === bookId;
				}).length;
				book.id = bookId;
				book.name = this.bibleBooks.find((book) => {
					return book.id === bookId;
				}).name;

				this.$store.commit("setBook", book);
				this.$store.commit("setSelectedBookId", book.id);
				this.$store.commit("setBibleBookSelectionPanelView", "chapter");
			},
			parseData() {
				/**
				 * Read bible books stored in local data/json into old and new testament arrays
				 */
				let afterOT = false;
				for (let i = 0; i < this.bibleBooks.length; i++) {
					if (afterOT) {
						this.NTBooks.push(this.bibleBooks[i]);
					} else {
						if (this.bibleBooks[i].id == "MAT") {
							afterOT = true;
							this.NTBooks.push(this.bibleBooks[i]);
						} else {
							this.OTBooks.push(this.bibleBooks[i]);
						}
					}
				}
			},
		},
		mounted() {
			/**Prepare bible books data on mounted */
			this.parseData();
		},
	};
</script>

<style>
	.verse-loading-container {
		width: 100vw;
		text-align: center;
	}

	.add-verse-btn {
		display: none;
	}

	.select-verse-bar {
		position: fixed;
		bottom: 5%;
		min-width: 100%;
		text-align: center;
		z-index: 4;
		cursor: pointer;
	}

	.select-verse-btn {
		font-size: 1.3rem;
		min-width: 40%;
		border-radius: 1rem;
		padding: 0.5rem 0rem;
		background: var(--primary);
	}

	.verse-selection-container {
		margin-bottom: 3rem;
	}

	.verse-nav-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 5vh;
	}

	.verse-nav-bar > div {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-items: flex-start;
	}

	.verse-nav-bar > div > span {
		margin-right: 1rem;
	}

	/* Select book */
	.testament-title {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0.5rem;
		border-radius: 5px;
		font-size: 1.5rem;
		font-weight: bold;
		text-align: start;
	}

	.books-overlay-container {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.chapters-overlay-container,
	.verses-overlay-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.books-list-container,
	.verse-list-container,
	.chapter-list-container {
		max-width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.books-title {
		width: 4rem;
		height: 4rem;
	}

	.books-title {
		border-radius: 5px;
		background-color: var(--primary);
		margin: 0.5rem;
		font-size: 1rem;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		cursor: pointer;
	}

	.book-verses-title {
		margin: 0.5rem;
		font-size: 1rem;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		cursor: pointer;
		min-width: 80%;
	}

	.verse-title-box-active,
	.chapter-title-box:hover,
	.books-title:hover {
		box-shadow: 10px 10px;
		background-color: var(--primary);
		border-radius: 5px;
		transition: 0.5s;
	}

	.book-verses-title > span {
		font-size: 1.5rem !important;
		background-color: var(--primary);
		padding: 0.5rem;
		border-radius: 5px;
		box-shadow: 10px 10px;
	}

	.add-verse-btn {
		background-color: var(--primary);
		padding: 1rem;
		border-radius: 5px;
	}

	.add-verse-btn:hover {
		opacity: 0.8;
	}

	.verse-title-box-active,
	.verse-title-box,
	.chapter-title-box {
		width: 3rem;
		height: 3rem;
		margin: 0.5rem;
		border: 2px solid black;
		border-radius: 5px;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-radius: 5px;
	}

	.selection-panel-overlay {
		width: 100vw;
		overflow-y: scroll;
		padding-bottom: 5rem;
	}

	/* General */
	.loading-container {
		width: 100%;
		text-align: center;
	}

	.selection-buttons {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.panel-buttons {
		margin: 0.5rem;
		min-width: 100px;
		width: 250px;
	}

	#verse-button {
		border-radius: 5px;
		border: 1px solid black;
	}

	#level-button:hover,
	#verse-button:hover,
	#start-button:hover {
		box-shadow: 1px 1px 1px 1px black;
	}

	#level-button {
		border-radius: 5px !important;
		border: 1px solid black !important;
	}

	#start-button {
		background-color: var(--primary);
		border-radius: 5px;
		border: 1px solid black;
	}

	#level-dropdown {
		width: 100%;
		text-align: center;
	}

	#dropdown-item:focus {
		background-color: lightgreen;
	}

	.dropdown-toggle::after {
		display: none !important;
	}

	@media only screen and (min-width: 768px) {
		.verse-list-container,
		.chapter-list-container,
		.books-list-container {
			grid-gap: 0.5rem;
			grid-template-columns: repeat(8, 1fr);
		}
	}

	@media only screen and (min-width: 1024px) {
		.select-verse-bar {
			display: none;
		}

		.add-verse-btn {
			display: block;
		}

		.verse-selection-container {
			width: 50vw !important;
		}

		/* Select book */
		.testament-title {
			background-color: var(--primary);
			padding: 0.5rem;
			border-radius: 5px;
			box-shadow: 10px 10px;
			font-size: 1.5rem;
			font-weight: bold;
			margin: 1rem 0rem;
			text-align: start;
		}

		.books-overlay-container,
		.chapters-overlay-container,
		.verses-overlay-container {
			margin-top: 3rem;
			align-items: center;
		}

		.books-list-container,
		.verse-list-container,
		.chapter-list-container {
			max-width: 80%;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;
			flex-wrap: wrap;
			margin-top: 1rem;
		}
	}
</style>
