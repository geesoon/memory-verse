<template>
  <section>
    <section class="profile-container">
      <div class="profilePic">
        <div class="avatar">{{ this.getAvatarName }}</div>
        <!-- <div @click="updateProfilePic">Change</div> -->
      </div>
      <div class="profileInfo">
        <div class="user-email">{{ this.getUserEmail }}</div>
        <div class="update-pw-btn" @click="updatePassword">Update Password</div>
      </div>
      <div class="logout-btn" @click="logout">Log Out</div>
    </section>
    <loading-overlay :active="isLoading" :is-full-page="fullPage" />
  </section>
</template>

<script>
import Auth from "../apis/auth";

export default {
  data() {
    return {
      isLoading: false,
      fullPage: true,
    };
  },
  computed: {
    getAvatarName() {
      return this.$store.getters.getAvatarName;
    },
    getPreviousView() {
      return this.$store.getters.getPreviousView;
    },
    getUserEmail() {
      return this.$store.getters.getUserEmail;
    },
  },
  methods: {
    popState() {
      this.$router.back();
    },
    updateProfilePic() {
      console.log("update profile pic");
    },
    updatePassword() {
      console.log("update password");
    },
    async logout() {
      this.isLoading = true;
      let res = await Auth.logout();
      if (res == true) {
        this.$store.commit("clearUser");
        this.$store.commit("resetSelection");
        this.$router.replace("/");
      } else {
        alert(res.message);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style>
.profile-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-width: 100%;
}

.profile-nav-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.back-btn {
  border: 1px solid black;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.avatar {
  margin: 1rem 0;
  border-radius: 100%;
  width: 150px;
  height: 150px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  background: whitesmoke;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4rem;
  font-weight: bold;
}

.user-email {
  padding: 1rem 3rem;
  margin: 1rem 0rem;
}

.profilePic {
  text-align: center;
}

.update-pw-btn {
  border-radius: 0.5rem;
  padding: 1rem 3rem;
  margin: 1rem 0;
  cursor: pointer;
  background: var(--action);
  color: white;
  font-weight: bold;
}

.logout-btn {
  border-radius: 0.5rem;
  padding: 1rem 3rem;
  margin: 1rem 0;
  cursor: pointer;
  background: var(--action);
  color: white;
  font-weight: bold;
}

@media only screen and (min-width: 1024px) {
  .profile-nav-bar {
    display: none;
  }
}
</style>
