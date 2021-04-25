import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import firebase from "firebase";

Vue.config.productionTip = false;

var firebaseConfig = {
  apiKey: "AIzaSyATq45dS7FJsdZGoYQTLlWS3JbzK1G4SZc",
  authDomain: "memory-verse-app.firebaseapp.com",
  projectId: "memory-verse-app",
  storageBucket: "memory-verse-app.appspot.com",
  messagingSenderId: "467984320988",
  appId: "1:467984320988:web:2b71fd8935a2869b30e719",
  measurementId: "G-EZ0TKRW3T4",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
