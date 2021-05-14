<template>
  <div class="home-container">
    <div class="register-header">
      <div class="home-title-top-left" @click="gotoHome">Memory Verse</div>
      <div class="register-info">
        <p class="sign-up">Sign Up</p>
        <p>Create your own verse collection with an account.</p>
      </div>
    </div>
    <form @submit.prevent="register" class="register-form">
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <button>Sign Up</button>
    </form>
    <div class="sign-in-tip">
      <span
        >Already have an account?
        <router-link to="/" class="sign-in-link">Log In</router-link></span
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
  border-radius: 0.5rem;
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
  margin: 4rem 1rem 4rem 1rem;
  height: 20vh;
}

.register-form > input {
  font-size: 1rem;
  height: 8vh;
  border: 1px solid black;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 0.5rem;
}

.register-form > button {
  font-size: 1rem;
  font-weight: bold;
  border: none;
  padding: 1rem;
  margin: 0.5rem;
  border-radius: 0.5rem;
  background: #42b72a;
  color: white;
}
</style>
