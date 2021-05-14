<template>
  <v-container class="home-container">
    <div class="home-title">Memory<br />Verse</div>
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
  </v-container>
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
          this.getUserId();
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    getUserId() {
      console.log("get user's id");
      const db = firebase.firestore();
      let logonEmail = firebase.auth().currentUser.email;
      db.collection("users")
        .where("email", "==", logonEmail)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.$store.commit("setUser", {
              email: this.email,
              id: doc.id,
            });
          });

          this.$router.push("/dashboard");
        })
        .catch((error) => {
          console.log("Error getting users id", error);
        });
    },
  },
};
</script>

<style>
.login-form-container {
  margin: 3rem 1rem;
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
  /* margin: 4rem 1rem 4rem 1rem; */
  margin: 1rem;
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
    max-width: 60vw !important;
  }
}

@media only screen and (min-width: 1024px) {
  .home-container {
    max-width: 40vw !important;
  }
}
</style>
