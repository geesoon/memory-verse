import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import firebase from "firebase";
import vuetify from "./plugins/vuetify";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

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

Vue.component("loading-overlay", Loading);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

// Reverse the order of collection item to make sure the latest one stay on top of the list
Vue.filter("reverse", function (value) {
  // slice to make a copy of array, then reverse the copy
  return value.slice().reverse();
});
