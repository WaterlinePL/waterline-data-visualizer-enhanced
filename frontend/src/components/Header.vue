<template>
  <header class="header">
    <Menubar :model="items">
      <template #start>
        <div class="header__logo">
          <canvas id="logoCanvas" ref="logoCanvas" class="logo__content" />
          <div class="header__text">
            <p class="header__title">{{ customizeStore.headerTitle }}</p>
            <p class="header__description">{{ customizeStore.headerDescription }}</p>
          </div>
        </div>
        <MultiSelect class="header__multiselect" v-model="timeSeriesStore.selectedTimeSeriesData" :options="timeSeriesStore.timeSeries" filter :maxSelectedLabels="1"
                     optionLabel="name" optionValue="data" placeholder="Select Time Series" />
      </template>
    </Menubar>
    <Dialog v-model:visible="stationsDialogVisible" modal header="Stations" :style="{ width: '50vw' }">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <template #footer>
        <Button label="No" icon="pi pi-times" @click="stationsDialogVisible = false" text />
        <Button label="Yes" icon="pi pi-check" @click="stationsDialogVisible = false" autofocus />
      </template>
    </Dialog>
    <Dialog v-model:visible="customizeUIDialogVisible" header="Getting Started - Setup User Interface" :style="{ width: '50vw' }">
      <div class="customize-ui__dialog">
        <TabView>
          <TabPanel header="General">
            <div class="dialog__tab-panel">
              <div class="section__part">
                <div class="part__colorpicker">
                  <p class="colorpicker__title">Background Color</p>
                  <ColorPicker v-model="customizeStore.generalBackgroundColor" />
                </div>
              </div>
              <div class="section__part">
                <div class="part__colorpicker">
                  <p class="colorpicker__title">Components Background Color</p>
                  <ColorPicker v-model="customizeStore.generalComponentsBackgroundColor" />
                </div>
              </div>
              <div class="section__part">
                <div class="part__colorpicker">
                  <p class="colorpicker__title">Border Color</p>
                  <ColorPicker v-model="customizeStore.generalBorderColor" />
                </div>
              </div>
              <div class="section__part">
                <div class="part__colorpicker">
                  <p class="colorpicker__title">Border Width</p>
                  <InputNumber v-model="customizeStore.generalBorderWidth" mode="decimal" showButtons :min="0" :max="5" />
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Header">
            <div class="dialog__tab-panel">
              <div class="section__part">
                <label class="part__label" for="username">Header Title</label>
                <InputText id="username" v-model="customizeStore.headerTitle" />
              </div>
              <div class="section__part">
                <div class="part__colorpicker">
                  <p class="colorpicker__title">Header Title Color</p>
                  <ColorPicker v-model="customizeStore.headerTitleColor" />
                </div>
              </div>
              <div class="section__part">
                <p class="part__title">Header Description</p>
                <Textarea v-model="customizeStore.headerDescription" autoResize rows="2" />
              </div>
              <div class="section__part">
                <div class="part__colorpicker">
                  <p class="colorpicker__title">Header Description Color</p>
                  <ColorPicker v-model="customizeStore.headerDescriptionColor" />
                </div>
              </div>
              <div class="section__part">
                <p class="part__title">Logo</p>
                <input type="file" id="logoInput" ref="logoInput" :multiple="false" accept="image/*" @change="handleFileUpload">
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Footer">
            <div class="dialog__tab-panel">
              <div class="section__part">
                <p class="part__title">Footer Description</p>
                <Textarea v-model="customizeStore.footerDescription" autoResize rows="2" />
              </div>
              <div class="section__part">
                <div class="part__colorpicker">
                  <p class="colorpicker__title">Footer Description Color</p>
                  <ColorPicker v-model="customizeStore.footerDescriptionColor" />
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </Dialog>
  </header>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';

import {useTimeSeriesStore} from '@/state/timeseries.state';
import {useCustomizeStore} from "@/state/customize.state";

const customizeStore = useCustomizeStore();

const headerTitleColor = ref(customizeStore.headerTitleColor);
watch(() => customizeStore.headerTitleColor, newColor => {
  headerTitleColor.value = '#' + newColor;
})

const headerDescriptionColor = ref(customizeStore.headerDescriptionColor);
watch(() => customizeStore.headerDescriptionColor, newColor => {
  headerDescriptionColor.value = '#' + newColor;
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

const timeSeriesStore = useTimeSeriesStore();
watch(() => timeSeriesStore.selectedTimeSeriesData, selectedTimeSeriesData => {
  timeSeriesStore.updateTimeSeriesData(selectedTimeSeriesData);
})

const stationsDialogVisible = ref(false);
const customizeUIDialogVisible = ref(true);

const items = ref([
  {
    label: 'Stations',
    icon: 'pi pi-fw pi-map-marker',
    command: () => {
      stationsDialogVisible.value = true;
    }
  }
]);

const logoCanvas = ref(null);
const selectedFile = ref(null);

const handleFileUpload = (event) => {
  if (event.target.files.length > 0) {
    selectedFile.value = event.target.files[0];
    drawImageOnCanvas();
  }
};

const drawImageOnCanvas = () => {
  const canvas = logoCanvas.value;
  const context = canvas.getContext('2d');
  const img = new Image();

  img.onload = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  img.src = URL.createObjectURL(selectedFile.value);
};

const drawDefaultImageOnCanvas = (file) => {
  const canvas = logoCanvas.value;
  const context = canvas.getContext('2d');
  const img = new Image();

  img.onload = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  fetch(file)
      .then(response => response.blob())
      .then(blob => {
        img.src = URL.createObjectURL(blob);
      });
};

onMounted(() => {
  const defaultImageFile = require('@/assets/logo.png');
  drawDefaultImageOnCanvas(defaultImageFile);
});

</script>

<style>
.header {
  margin: 1rem;
}

.header .p-menubar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: v-bind(generalComponentsBackgroundColor);
  border-width: v-bind(computedGeneralBorderWidth);
  border-style: solid;
  border-color: v-bind(generalBorderColor);
}

.header .p-menubar-start {
  display: flex;
  align-items: center;
}

.header__logo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__logo .logo__content {
  width: 60px;
  height: 60px;
}

.header__multiselect {
  margin-left: 5rem;
  min-width: 210px;
}

.header__text {
  flex-direction: row;
  max-width: 330px;
  padding: 0 1rem;
  margin-left: 0.5rem;
}

.header__title {
  font-size: 1.25rem;
  font-weight: bold;
  text-align: left;
  margin-bottom: 0.25rem;
  color: v-bind(headerTitleColor);
}

.header .p-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-content .p-menuitem-link .p-menuitem-icon,
.header .p-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-content .p-menuitem-link .p-menuitem-text {
  color: v-bind(headerTitleColor) !important;
}

.header__description {
  font-size: 0.75rem;
  color: v-bind(headerDescriptionColor);
  text-align: justify;
}

.customize-ui__dialog {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.customize-ui__dialog .section__part {
  display: flex;
  flex-direction: column;
  margin: 1.5rem 0;
}

.customize-ui__dialog .section__part .p-inputnumber-input {
  max-width: 3rem;
}

.customize-ui__dialog .section__part .part__label,
.customize-ui__dialog .section__part .part__title,
.customize-ui__dialog .colorpicker__title {
  margin: .5rem 0;
  font-weight: 500;
  font-size: 1rem;
}

.customize-ui__dialog .part__colorpicker {
  display: flex;
  flex-direction: column;
}

.customize-ui__dialog .p-colorpicker-preview {
  width: 100%;
  max-width: 6rem;
  height: 3rem;
}

</style>
