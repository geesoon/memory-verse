<template>
	<section class="review-container">
		<header-drawer />
		<div class="review-title">Review</div>
		<div class="review-tip-box">Stay Tuned</div>
	</section>
</template>

<script>
	import bibleBooks from "../data/book.json";
	import headerDrawer from "../components/headerDrawer.vue";

	export default {
		data: () => ({
			books: bibleBooks.books,
		}),
		components: {
			headerDrawer,
		},
	};
</script>

<style>
	.review-container {
		margin: 0rem 1rem;
	}

	.review-title {
		font-size: 2rem;
		font-weight: bold;
		margin: 2rem 0rem;
	}

	.review-tip-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.review-tip-box > div {
		flex: 1;
	}
</style>
