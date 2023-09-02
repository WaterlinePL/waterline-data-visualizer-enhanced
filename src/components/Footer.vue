<template>
  <footer class="footer">
    <p class="footer-text">
      {{ customizeStore.footerDescription }}
    </p>
  </footer>
</template>

<script setup>
import {useCustomizeStore} from "@/state/customize.state";
import {ref, watch} from "vue";

const customizeStore = useCustomizeStore();

const footerDescriptionColor = ref(customizeStore.footerDescriptionColor);
watch(() => customizeStore.footerDescriptionColor, newColor => {
  footerDescriptionColor.value = '#' + newColor;
})

const generalComponentsBackgroundColor = ref(customizeStore.generalComponentsBackgroundColor);
watch(() => customizeStore.generalComponentsBackgroundColor, newColor => {
  generalComponentsBackgroundColor.value = '#' + newColor;
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

</script>

<style>
.footer {
  margin: 1rem;
  background-color: v-bind(generalComponentsBackgroundColor);
}

.footer-text {
  color: v-bind(footerDescriptionColor);
  border-width: v-bind(computedGeneralBorderWidth);
  border-style: solid;
  border-color: v-bind(generalBorderColor);
  padding: 2rem;
}
</style>