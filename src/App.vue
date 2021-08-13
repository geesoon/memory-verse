<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
:root {
  --primary: #d5e37d;
  --bg: whitesmoke;
  --action: #42b72a;
}

html {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

html::-webkit-scrollbar {
  display: none; /* chrome */
}

body {
  /* Disables pull-to-refresh but allows overscroll glow effects. */
  overscroll-behavior-y: auto !important;
}

.material-icons {
  cursor: pointer;
}
</style>
