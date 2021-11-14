<template>
	<v-app id="app">
		<v-main>
			<v-alert
				:value="getAlert.isAlert"
				:type="getAlert.type"
				border="top"
				class="alert-bar"
				transition="fade-transition"
				@input="dismissAlert"
				dismissible
				>{{ getAlert.message }}</v-alert
			>
			<router-view />
		</v-main>
	</v-app>
</template>

<script>
	export default {
		name: "App",
		computed: {
			getAlert() {
				return this.$store.getters.getAlert;
			},
		},
		methods: {
			dismissAlert() {
				this.$store.commit("setAlert", { isAlert: false });
			},
		},
	};
</script>

<style>
	:root {
		--primary: #06ba63;
		--secondary: #103900;
		--background: whitesmoke;
		--action: #0fff95;
		--rounded: 0.5rem;
	}

	.theme--light.v-btn.v-btn--icon {
		color: black !important;
	}

	html {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	html::-webkit-scrollbar {
		display: none; /* chrome */
	}

	body {
		/* Disables pull-to-refresh but allows overscroll glow effects. */
		overscroll-behavior-y: auto !important;
	}

	.material-icons {
		cursor: pointer;
	}

	.alert-bar {
		position: fixed !important;
		width: 100vw;
		top: 0px;
		left: 0px;
	}
</style>
