<template>
  <header class="header">
    <Menubar :model="items">
      <template #start>
        <div class="header__logo">
          <img alt="logo" :src="headerLogoUrl" height="60" />
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
    <Dialog v-model:visible="customizeUIDialogVisible" header="Customize UI" :style="{ width: '50vw' }">
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
                <FileUpload mode="basic" :customUpload="true" @upload="handleLogoUpload" accept="image/*" :maxFileSize="5000000" />
              </div>
              <div class="section__part">
                <div class="part__colorpicker">
                  <p class="colorpicker__title">Header Background Color</p>
                  <ColorPicker v-model="customizeStore.headerBackgroundColor" />
                </div>
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
              <div class="section__part">
                <div class="part__colorpicker">
                  <p class="colorpicker__title">Footer Background Color</p>
                  <ColorPicker v-model="customizeStore.footerBackgroundColor" />
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
import {ref, watch} from 'vue';

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

const headerBackgroundColor = ref(customizeStore.headerBackgroundColor);
watch(() => customizeStore.headerBackgroundColor, newColor => {
  headerBackgroundColor.value = '#' + newColor;
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
const customizeUIDialogVisible = ref(false);

const items = ref([
  {
    label: 'Stations',
    icon: 'pi pi-fw pi-map-marker',
    command: () => {
      stationsDialogVisible.value = true;
    }
  },
  {
    label: 'Customize UI',
    icon: 'pi pi-fw pi-palette',
    command: () => {
      customizeUIDialogVisible.value = true;
    }
  }
]);

const headerLogoUrl = ref(require('@/assets/logo.png'));

const uploadedImage = ref(null);
const handleLogoUpload = (event) => {
  // Assuming the first file is the uploaded image
  const file = event.files[0];

  // Create a URL for the uploaded image
  uploadedImage.value = URL.createObjectURL(file);

  // Log the uploaded file for testing purposes
  console.log(file);
  console.log(uploadedImage.value)
};

</script>

<style>
.header {
  margin: 1rem;
}

.header .p-menubar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: v-bind(headerBackgroundColor);
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
