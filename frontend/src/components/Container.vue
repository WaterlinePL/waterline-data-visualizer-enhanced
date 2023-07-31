<template>
  <main class="container">
    <Header/>
    <section class="section">
      <aside class="aside">
        <SidePanel/>
      </aside>
      <section class="content">
        <Map/>
      </section>
    </section>
    <Footer/>
  </main>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.js";
import "leaflet/dist/leaflet.css";
import Header from "./Header.vue";
import SidePanel from "./SidePanel.vue";
import Map from "./Map.vue";
import Footer from "./Footer.vue";
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
  }

  .section {
    display: flex;
    flex-direction: row;
    margin: 1rem;
  }

  .aside {
    flex: 1;
    margin-right: 1rem;
    overflow: scroll !important;
    max-width: 350px;
  }

  .content {
    display: flex;
    flex: 1;
    margin-left: 1rem;
    flex-grow: 3;
    flex-direction: column;
  }
</style>
