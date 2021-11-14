<template>
	<section class="register-container">
		<div class="register-header">
			<div class="home-title-top-left" @click="gotoHome">
				Memory Verse
			</div>
			<div class="register-info">
				<p class="sign-up">Sign Up</p>
				<p>Create your own verse collection with an account.</p>
			</div>
		</div>
		<v-form
			@submit.prevent="register"
			class="register-form"
			v-if="!isLoading"
		>
			<v-text-field
				label="Email"
				v-model="email"
				:rules="[rules.email]"
			></v-text-field>
			<v-text-field
				:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
				:type="showPassword ? 'text' : 'password'"
				:rules="[rules.required, rules.min]"
				label="Password"
				@click:append="showPassword = !showPassword"
				v-model="password"
			></v-text-field>
			<v-btn depressed @click="register" color="action">Sign Up</v-btn>
		</v-form>
		<div v-else style="text-align: center">
			<p>Registering...</p>
			<v-progress-circular
				indeterminate
				color="primary"
			></v-progress-circular>
		</div>
		<div class="sign-in-tip">
			<span
				>Already have an account?
				<br />
				<router-link to="/" class="sign-in-link"
					>Log In</router-link
				></span
			>
		</div>
	</section>
</template>

<script>
	import firebase from "firebase";

	export default {
		data() {
			return {
				email: "",
				password: "",
				showPassword: false,
				rules: {
					required: (value) => !!value || "Required.",
					min: (v) => v.length >= 8 || "Min 8 characters",
					email: (value) => {
						const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
						return pattern.test(value) || "Invalid e-mail.";
					},
				},
				isLoading: false,
			};
		},
		methods: {
			gotoHome() {
				this.$router.push({ path: "/" });
			},
			register() {
				this.isLoading = true;
				firebase
					.auth()
					.createUserWithEmailAndPassword(this.email, this.password)
					.then(() => {
						this.$store.dispatch("setAlert", {
							message: "Successfully registered! Please login.",
							type: "success",
						});
						this.$router.push("/");
					})
					.catch((error) => {
						this.$store.dispatch("setAlert", {
							message: error.message,
							type: "warning",
						});
					});
				this.isLoading = false;
			},
		},
	};
</script>

<style>
	.register-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		max-width: 100%;
		min-width: 100%;
		min-height: 100%;
	}

	.sign-up {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.register-header {
		display: flex;
		flex-direction: row;
	}

	/* Memory Verse title */
	.home-title-top-left {
		margin: 1rem;
		padding: 1rem;
		font-size: 1rem;
		font-weight: bold;
		text-align: center;
		border: 1px solid black;
		border-radius: var(--rounded);
		box-shadow: 10px 10px;
		cursor: pointer;
	}

	.register-info {
		text-align: left;
		margin-left: 1rem;
		margin-top: 1rem;
		font-size: 1rem;
	}

	.register-form {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-content: center;
		height: 20vh;
		width: 100%;
		padding: 0rem 1rem;
		margin-top: 3rem;
		margin-bottom: 3rem;
	}

	.register-form > input {
		font-size: 1rem;
		height: 8vh;
		border: 1px solid black;
		padding: 1rem;
		border-radius: var(--rounded);
		margin: 0.5rem;
	}

	.register-form > button {
		font-size: 1rem;
		font-weight: bold;
		border: none;
		padding: 1rem;
		margin: 0.5rem;
		border-radius: var(--rounded);
		background: var(--action);
		color: white;
	}

	@media only screen and (min-width: 768px) {
		.register-container {
			max-width: 60vw !important;
		}
		.register-form {
			width: 60vw;
		}
	}

	@media only screen and (min-width: 1024px) {
		.register-container {
			max-width: 40vw !important;
		}
		.register-form {
			width: 40vw;
		}
	}

	@media only screen and (min-width: 1440px) {
		.register-container {
			max-width: 30vw !important;
		}
		.register-form {
			width: 30vw;
		}
	}
</style>
