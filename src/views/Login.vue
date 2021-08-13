<template>
  <v-container class="login-container">
    <div class="home-title">Memory<br />Verse</div>
    <section class="login-form-container">
      <form class="login-form" @submit.prevent="login">
        <input v-model="email" type="text" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <button type="submit" class="login-btn">Log In</button>
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
    <loading-overlay :active="isLoading" :is-full-page="fullPage" />
  </v-container>
</template>

<script>
// import Auth from "../apis/auth";
// import Account from "../apis/account";
import firebase from "firebase";

export default {
  data() {
    return {
      email: "",
      password: "",
      isLoading: false,
      fullPage: true,
    };
  },
  methods: {
    onCancel() {
      console.log("User cancelled the loader.");
    },
    gotoHome() {
      this.$router.push({ path: "/" });
    },
    async login() {
      this.isLoading = true;
      const db = firebase.firestore();
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password);
        let userId = await db
          .collection("users")
          .where("email", "==", this.email)
          .limit(1)
          .get()
          .then((querySnapshot) => {
            return querySnapshot.docs[0].id;
          })
          .catch((error) => {
            console.log("Error getting users id", error);
          });
        this.$store.commit("setUser", { email: this.email, id: userId });
        this.$router.replace("/dashboard/main");
      } catch (err) {
        alert(err);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style>
.login-form-container {
  margin: 3rem 0rem;
}

/* Memory Verse title */
.home-title {
  margin: 1rem;
  padding: 1rem;
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
  margin: 1rem;
}

.login-form > input {
  font-size: 1rem;
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
  background: var(--action);
  color: white !important;
}

.guest-btn {
  font-size: 1rem;
  border: none;
  font-weight: bold;
  padding: 1rem;
  margin: 0.5rem;
  margin-bottom: 5rem;
  border-radius: 0.5rem;
  color: white !important;
  background: #42b72a;
}

.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  min-height: 100%;
}

@media only screen and (min-width: 768px) {
  .login-container {
    max-width: 60vw !important;
  }
}

@media only screen and (min-width: 1024px) {
  .login-container {
    max-width: 40vw !important;
  }
}

@media only screen and (min-width: 1440px) {
  .login-container {
    max-width: 30vw !important;
  }
}
</style>
