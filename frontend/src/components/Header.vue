<template>
  <header class="header">
    <Menubar :model="items">
      <template #start>
        <img alt="logo" src="../assets/logo.png" height="55" class="mr-2" />
        <div class="header__text">
          <p class="header__title">Waterline project</p>
          <p class="header__description">New solutions for data assimilation and communication to improve hydrological modelling and forecasting</p>
        </div>
      </template>
    </Menubar>
    <Dialog v-model:visible="data_models_dialog_visible" modal header="Data Models" :style="{ width: '50vw' }">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <template #footer>
        <Button label="No" icon="pi pi-times" @click="data_models_dialog_visible = false" text />
        <Button label="Yes" icon="pi pi-check" @click="data_models_dialog_visible = false" autofocus />
      </template>
    </Dialog>
    <Dialog v-model:visible="stations_dialog_visible" modal header="Stations" :style="{ width: '50vw' }">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <template #footer>
        <Button label="No" icon="pi pi-times" @click="stations_dialog_visible = false" text />
        <Button label="Yes" icon="pi pi-check" @click="stations_dialog_visible = false" autofocus />
      </template>
    </Dialog>
    <Dialog v-model:visible="customize_ui_dialog_visible" modal header="Customize UI" :style="{ width: '50vw' }">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <template #footer>
        <Button label="No" icon="pi pi-times" @click="customize_ui_dialog_visible = false" text />
        <Button label="Yes" icon="pi pi-check" @click="customize_ui_dialog_visible = false" autofocus />
      </template>
    </Dialog>
  </header>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { ref} from "vue";

const data_models_dialog_visible = ref(false);
const stations_dialog_visible = ref(false);
const customize_ui_dialog_visible = ref(false);

const items = ref([
  {
    label: 'Data Models',
    icon: 'pi pi-fw pi-database',
    command: () => {
      data_models_dialog_visible.value = true;
    }
  },
  {
    label: 'Stations',
    icon: 'pi pi-fw pi-map-marker',
    command: () => {
      stations_dialog_visible.value = true;
    }
  },
  {
    label: 'Customize UI',
    icon: 'pi pi-fw pi-palette',
    command: () => {
      customize_ui_dialog_visible.value = true;
    }
  }
]);
</script>

<style>
.header {
  margin: 1rem;
}

.header .p-menubar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header .p-menubar-start {
  display: flex;
  align-items: center;
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
}

.header__description {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.7);
  text-align: justify;
}
</style>
