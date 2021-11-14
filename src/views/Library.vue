<template>
	<section>
		<div class="my-collection-bar">
			<div class="collection-title">Your Collection</div>
			<v-btn icon
				><span class="material-icons" @click="goToSelectVerse()">
					add
				</span></v-btn
			>
		</div>
		<v-dialog
			v-model="isAddCollection"
			persistent
			fullscreen
			hide-overlay
			transition="dialog-bottom-transition"
		>
			<add-new-collection
				@closeDialog="refreshCollection()"
				@success="addSuccess()"
				@fail="addFail()"
			/>
		</v-dialog>
		<v-snackbar v-model="isSnackbar" :timeout="timeout">
			{{ snackbarMsg }}

			<template v-slot:action="{ attrs }">
				<v-btn
					color="white"
					text
					v-bind="attrs"
					@click="isSnackbar = false"
				>
					Close
				</v-btn>
			</template>
		</v-snackbar>
		<section>
			<div class="search-collection-bar">
				<v-text-field
					label="Search"
					clearable
					filled
					dense
					rounded
					v-model="search"
				></v-text-field>
			</div>
			<div class="view-toggle" v-if="filteredCollection.length != 0">
				<v-btn
					icon
					v-if="!isGridView"
					@click="isGridView = !isGridView"
				>
					<span class="material-icons"> grid_view </span>
				</v-btn>
				<v-btn icon v-else @click="isGridView = !isGridView">
					<span class="material-icons"> view_list </span>
				</v-btn>
			</div>

			<!--  Loading view -->
			<section v-if="isLoading" class="library-loading-container">
				<v-progress-circular
					indeterminate
					color="primary"
				></v-progress-circular>
			</section>

			<!-- Finish loading view -->
			<section v-else>
				<!-- No collection view -->
				<section
					v-if="collection.length == 0"
					class="no-result-container"
				>
					<div class="no-collection-face">(;-;)</div>
					<div>No collection</div>
					<v-btn plain @click="goToSelectVerse()">Create</v-btn>
				</section>

				<!-- No search result view -->
				<section
					v-else-if="filteredCollection.length == 0"
					class="no-result-container"
				>
					<div class="no-collection-face">(#_#)</div>
					<div>No result</div>
				</section>

				<!-- Collection view -->
				<section v-else>
					<v-list
						subheader
						two-line
						class="list-view-collection"
						v-if="!isGridView"
					>
						<v-list-item
							v-for="(item, key) in filteredCollection"
							:key="key"
							class="library-collection-item"
							@click="showCollection(item)"
						>
							<v-list-item-content>
								<v-list-item-title
									v-text="item.name"
								></v-list-item-title>
								<v-list-item-subtitle
									v-text="item.num"
								></v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
					</v-list>
					<div v-else class="grid-view-collection">
						<div
							v-for="(item, key) in filteredCollection"
							:key="key"
							class="grid-collection-item"
							@click="showCollection(item)"
						>
							<div>
								{{ item.name }}
							</div>
						</div>
					</div>
				</section>
			</section>
		</section>
	</section>
</template>

<script>
	import firebase from "firebase";
	import AddNewCollection from "../components/addNewCollection.vue";

	export default {
		data: () => ({
			collection: [],
			isGridView: false,
			isAddCollection: false,
			snackbarMsg: "",
			timeout: 2000,
			isSnackbar: false,
			isLoading: true,
			search: "",
		}),
		components: {
			AddNewCollection,
		},
		computed: {
			getAvatarName() {
				return this.$store.getters.getAvatarName;
			},
			getUserId() {
				return this.$store.getters.getUserInfo.id;
			},
			filteredCollection() {
				if (this.search == "" || this.search == null) {
					return this.collection;
				} else {
					return this.collection.filter((collection) => {
						var result = collection.name
							.toLowerCase()
							.indexOf(this.search.toLowerCase());
						if (result != -1) {
							return true;
						} else {
							return false;
						}
					});
				}
			},
		},
		methods: {
			goToSelectVerse() {
				this.$store.commit("resetSelection");
				this.isAddCollection = true;
			},
			addSuccess() {
				this.snackbarMsg = "Collection successfully added";
				this.isSnackbar = true;
			},
			addFail() {
				this.snackbarMsg = "Fail to add the collection";
				this.isSnackbar = true;
			},
			getCollection() {
				this.isLoading = true;
				const db = firebase.firestore();
				this.collection = [];
				db.collection("users")
					.doc(this.getUserId)
					.collection("collection")
					.get()
					.then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							this.collection.push({
								id: doc.id,
								name: doc.data().name,
								lastReview: doc.data().id,
								reviewPeriod: doc.data().review_period,
							});
						});
						this.isLoading = false;
					})
					.catch((error) => {
						this.$store.dispatch("setAlert", {
							message: error,
							type: "warning",
						});
						this.isLoading = false;
					});
			},
			showCollection(selectedCollection) {
				this.$store.commit("setCollectionId", selectedCollection.id);
				this.$router.push({
					name: "collection",
					params: { collectionId: selectedCollection.id },
				});
			},
			changeRoute(rn) {
				this.$router.push({ name: rn });
			},
			refreshCollection() {
				this.getCollection();
				this.isAddCollection = false;
			},
		},
		created() {
			this.getCollection();
		},
	};
</script>

<style>
	.no-result-container {
		width: 100%;
		text-align: center;
	}

	.search-collection-bar {
		margin-top: 1rem;
	}

	.library-collection-item {
		margin: 1rem 0rem;
		background: var(--primary);
		text-align: left;
		border-radius: var(--rounded);
		font-weight: bold;
	}
	.library-loading-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-width: 100%;
		min-height: 100vh;
	}

	.my-collection-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
		width: 100%;
	}

	.library-avatar {
		margin-right: 1rem;
	}

	.view-toggle {
		display: flex;
		flex-direction: row;
		width: 100%;
		justify-content: flex-end;
		align-items: center;
	}

	.grid-view-collection {
		margin: 1rem 0rem;
		display: grid;
		grid-gap: 1rem;
		grid-template-columns: 1fr 1fr;
	}

	.grid-collection-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2rem 2rem;
		min-height: 8rem;
		background: var(--primary);
		border-radius: var(--rounded);
		font-weight: bold;
	}

	.add-collection-title-bar {
		background: var(--primary);
		font-weight: bold;
		font-size: 1.3rem;
	}
</style>
