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

<script setup>
import "leaflet/dist/leaflet.js";
import "leaflet/dist/leaflet.css";
import Header from "./Header.vue";
import SidePanel from "./SidePanel.vue";
import Map from "./Content.vue";
import Footer from "./Footer.vue";
import {useCustomizeStore} from "@/state/customize.state";
import {ref, watch} from "vue";

const customizeStore = useCustomizeStore();

const generalBackgroundColor = ref(customizeStore.generalBackgroundColor);
watch(() => customizeStore.generalBackgroundColor, newColor => {
  generalBackgroundColor.value = '#' + newColor;
})

const generalBorderColor = ref(customizeStore.generalBorderColor);
watch(() => customizeStore.generalBorderColor, newColor => {
  generalBorderColor.value = '#' + newColor;
})

const generalBorderWidth = ref(customizeStore.generalBorderWidth);
const computedGeneralBorderWidth = ref("1px");
watch(() => customizeStore.generalBorderWidth, newWidth => {
  generalBorderWidth.value = newWidth;
  computedGeneralBorderWidth.value = newWidth + 'px';
})

const generalComponentsBackgroundColor = ref(customizeStore.generalComponentsBackgroundColor);
watch(() => customizeStore.generalComponentsBackgroundColor, newColor => {
  generalComponentsBackgroundColor.value = '#' + newColor;
})
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    background-color: v-bind(generalBackgroundColor);
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
    border-width: v-bind(computedGeneralBorderWidth);
    border-style: solid;
    border-color: v-bind(generalBorderColor);
    background-color: #FFFFFF;
  }

  .content {
    display: flex;
    flex: 1;
    margin-left: 1rem;
    flex-grow: 3;
    flex-direction: column;
    background-color: #FFFFFF;
    border-width: v-bind(computedGeneralBorderWidth);
    border-style: solid;
    border-color: v-bind(generalBorderColor);
  }
</style>
