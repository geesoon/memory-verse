<template>
  <div class="profile-container animate__animated animate__slideInRight">
    <div class="navBar">
      <span class="material-icons" @click="goToDashboard"> arrow_back </span>
    </div>
    <div class="profilePic">
      <div class="avatar">{{ this.getAvatarName }}</div>
      <!-- <div @click="updateProfilePic">Change</div> -->
    </div>
    <div class="profileInfo">
      <div class="user-email">{{ this.getUserEmail() }}</div>
      <div class="update-pw-btn" @click="updatePassword">Update Password</div>
    </div>
    <div class="logout-btn" @click="logout">Log Out</div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  computed: {
    getAvatarName() {
      return this.$store.getters.getAvatarName;
    },
  },
  methods: {
    getUserEmail() {
      return firebase.auth().currentUser.email;
    },
    goToDashboard() {
      this.$router.replace("dashboard");
    },
    updateProfilePic() {
      console.log("update profile pic");
    },
    updatePassword() {
      console.log("update password");
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          alert("Successfully logged out");
          this.$router.push("/");
        })
        .catch((error) => {
          alert(error.message);
          this.$router.push("/");
        });
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
  width: 100%;
}

.navBar {
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
  background: green;
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
  background: #1877f2;
  color: white;
  font-weight: bold;
}

.logout-btn {
  border-radius: 0.5rem;
  padding: 1rem 3rem;
  margin: 1rem 0;
  cursor: pointer;
  background: #42b72a;
  color: white;
  font-weight: bold;
}

@media only screen and (min-width: 600px) {
  .profile-container {
    width: 40vw;
  }
}
</style>
