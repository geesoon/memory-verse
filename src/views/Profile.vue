<template>
  <div class="profile-container">
    <div class="navBar">
      <span class="material-icons" @click="goToDashboard"> arrow_back </span>
    </div>
    <div class="profilePic">
      <div class="avatar">H</div>
      <div @click="updateProfilePic">Change</div>
    </div>
    <div class="profileInfo">
      <div class="profile-btn">hiewgs@gmail.com</div>
      <div class="profile-btn" @click="updatePassword">Update Password</div>
    </div>
    <div class="logout-btn">
      <div class="profile-btn" @click="logout">Log Out</div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  methods: {
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

.profile-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 90vh;
  width: 100%;
}

.profilePic {
  text-align: center;
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

.profile-btn {
  border: 1px solid black;
  border-radius: 1rem;
  padding: 1rem 3rem;
  margin: 1rem 0;
  cursor: pointer;
}
</style>
