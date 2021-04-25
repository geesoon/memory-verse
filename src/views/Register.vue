<template>
  <div class="home-container">
    <div class="home-title-top-left" @click="gotoHome">Memory Verse</div>
    <div class="register-info">
      <span>Register now to create your own verse collection!</span>
    </div>
    <form @submit.prevent="register" class="register-form">
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <button type="submit">Register</button>
    </form>
    <div class="sign-in-tip">
      <span
        >Already have an account?
        <router-link to="/login" class="sign-in-link"
          >Sign in</router-link
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
    register() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          alert("Successfully registered! Please login.");
          this.$router.push("/");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
};
</script>

<style>
/* Memory Verse title */
.home-title-top-left {
  position: relative;
  left: 0;
  top: 0;
  margin: 1rem;
  padding: 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  border: 1px solid black;
  border-radius: 0.5rem;
  box-shadow: 10px 10px;
  width: 100px;
  cursor: pointer;
}

.register-info {
  text-align: left;
  margin-left: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-content: center;
  margin: 4rem 1rem 4rem 1rem;
  height: 20vh;
}

.register-form > input {
  border-radius: 1rem !important;
  height: 8vh;
  border: 1px solid black;
  padding: 1rem;
  border-radius: 1rem;
  margin: 0.5rem;
}

.register-form > button {
  border: 1px solid black;
  font-weight: bold;
  padding: 1rem;
  margin: 0.5rem;
  border-radius: 1rem;
  background: #e6e6fa;
}
</style>
