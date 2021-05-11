<template>
  <div class="home-container">
    <div class="home-title">Memory Verse</div>
    <section class="login-form-container">
      <form @submit.prevent="login" class="login-form">
        <input type="text" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />
        <button type="submit" class="login-btn">Log In</button>
        <router-link to="/guests" class="guest-btn"
          >Log In As Guest</router-link
        >
      </form>
      <div class="sign-in-tip">
        <span
          >Don't have an account?
          <router-link to="/register" class="sign-in-link"
            >Create an account now</router-link
          ></span
        >
      </div>
    </section>
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
.home-container {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  width: 100vw;
}

.login-form-container {
  margin: 3rem 1rem;
}

/* Memory Verse title */
.home-title {
  margin: 1rem;
  padding: 2rem;
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  border: 1px solid black;
  border-radius: 1rem;
  box-shadow: 10px 10px;
}

a {
  text-decoration: none;
  color: black;
  text-align: center;
}

.sign-in-tip {
  text-align: center;
  margin: 1rem 0rem;
  font-size: 0.8rem;
}

.sign-in-link {
  font-weight: bold;
}

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
  height: 8vh;
  border: 1px solid black;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 0.5rem;
}

.login-btn {
  font-size: 1rem;
  border: none;
  font-weight: bold;
  padding: 1rem;
  margin: 0.5rem;
  border-radius: 0.5rem;
  background: #1877f2;
  color: white;
}

.guest-btn {
  font-size: 1rem;
  border: none;
  font-weight: bold;
  padding: 1rem;
  margin: 0.5rem;
  margin-bottom: 5rem;
  border-radius: 0.5rem;
  color: white;
  background: #42b72a;
}

@media only screen and (min-width: 768px) {
  .home-container {
    width: 30vw;
  }
}
</style>
