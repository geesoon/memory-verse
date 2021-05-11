<template>
  <div class="home-container">
    <div class="home-title-top-left" @click="gotoHome">Memory Verse</div>
    <form @submit.prevent="login" class="login-form">
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <button type="submit">Log In</button>
    </form>
    <div class="sign-in-tip">
      <span
        >Don't have an account?
        <router-link to="/register" class="sign-in-link"
          >Create an account now</router-link
        ></span
      >
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    gotoHome() {
      this.$router.push({ path: "/" });
    },
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          alert("Successfully logged in");
          this.$router.push("/dashboard");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
};
</script>

<style>
.login-form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-content: center;
  margin: 4rem 1rem 4rem 1rem;
  height: 20vh;
}

.login-form > input {
  font-size: 1rem;
  border-radius: 1rem !important;
  height: 8vh;
  border: 1px solid black;
  padding: 1rem;
  border-radius: 1rem;
  margin: 0.5rem;
}

.login-form > button {
  font-size: 1rem;
  border: 1px solid black;
  font-weight: bold;
  padding: 1rem;
  margin: 0.5rem;
  border-radius: 1rem;
  background: ;
}
</style>
