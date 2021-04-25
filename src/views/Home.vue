<template>
  <div class="home-container">
    <div class="home-title">Memory Verse</div>
    <router-link to="/guests" class="home-btn">Guests</router-link>
    <router-link to="/register" class="home-btn register-btn"
      >Register</router-link
    >
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
export default {
  methods: {},
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

.home-btn {
  font-size: 1.5rem;
  border: 1px solid black;
  padding: 1rem;
  border-radius: 1rem;
  margin: 0.5rem 1.5rem;
}

.register-btn {
  background: #e6e6fa;
}

.sign-in-tip {
  text-align: center;
  margin: 1rem 0rem;
  font-size: 0.8rem;
}

.sign-in-link {
  font-weight: bold;
}

@media only screen and (min-width: 768px) {
  .home-container {
    width: 50vw;
  }
}
</style>
