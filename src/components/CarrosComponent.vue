<template>
  <LayoutComponent>
    <CrudTableComponent
      buttonText="Novo Carro"
      @abrir-modal="abrirModal"
    ></CrudTableComponent>
    <ModalComponent :value="dialog" @input="dialog = $event">
      <template v-slot:conteudoCarro>
        <v-text-field label="Modelo*" required v-model="modelo"></v-text-field>
        <v-text-field label="Placa*" required v-model="placa"></v-text-field>
        <v-text-field label="KM*" required v-model="km"></v-text-field>
      </template>
    </ModalComponent>
  </LayoutComponent>
</template>

<script>
import CrudTableComponent from "./CrudTableComponent.vue";
import LayoutComponent from "./LayoutComponent.vue";
import ModalComponent from "./ModalComponent.vue";

export default {
  name: "CarrosComponent",
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    abrirModal() {
      this.dialog = true;
    },
  },
  components: {
    LayoutComponent,
    CrudTableComponent,
    ModalComponent,
  },
};
</script>
