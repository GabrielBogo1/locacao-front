<template>
  <LayoutComponent>
    <CrudTableComponent
      buttonText="Novo Modelo"
      @abrir-modal="abrirModal"
      :headers="headers"
    ></CrudTableComponent>
    <ModalComponent :value="dialog" @input="dialog = $event" @save="save">
      <template v-slot:conteudoModelos>
        <v-select
          label="Marca*"
          v-model="marcaSelecionada"
          :rules="[rules.required]"
          validate-on-blur
          :items="marcas"
        ></v-select>
        <v-text-field
          label="Nome*"
          v-model="nome"
          :rules="[rules.required]"
        ></v-text-field>
        <v-file-input
          label="Imagem*"
          v-model="imagem"
          :rules="[rules.required]"
        ></v-file-input>
        <v-text-field
          label="Número de portas*"
          type="number"
          :rules="nPortasRules"
          v-model="nPortas"
        ></v-text-field>
        <v-text-field
          label="Qtd de lugares*"
          v-model="qtdLugares"
          :rules="qtdLugaresRules"
        ></v-text-field>
        <v-row justify="space-between" class="d-flex justify-end">
          <v-col>
            <v-radio-group name="airbag" v-model="airBag" mandatory>
              <p>Air Bag?*</p>
              <v-radio label="Sim" value="yes"></v-radio>
              <v-radio label="Não" value="no"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col>
            <v-radio-group v-model="freioAbs" mandatory>
              <p>Freio ABS?*</p>
              <v-radio label="Sim" value="yes"></v-radio>
              <v-radio label="Não" value="no"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </template>
    </ModalComponent>
  </LayoutComponent>
</template>

<script>
import CrudTableComponent from "./CrudTableComponent.vue";
import LayoutComponent from "./LayoutComponent.vue";
import ModalComponent from "./ModalComponent.vue";

export default {
  name: "ModelosComponent",
  data() {
    return {
      marcas: [],
      marcaSelecionada: null,
      nome: "",
      imagem: null,
      nPortas: "",
      qtdLugares: "",
      airBag: "",
      freioAbs: false,
      dialog: false,
      snackbar: false,
      mensagem: "",
      value: "",
      name: false,
      headers: [
        { text: "Id", value: "id" },
        { text: "Nome", value: "nome" },
        { text: "Imagem", value: "imagem" },
        { text: "nPortas", value: "nPortas" },
        { text: "qtdLugares", value: "qtdLugares" },
        { text: "airBag", value: "airBag" },
        { text: "freioAbs", value: "freioAbs" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      nPortasRules: [
        (v) => !!v || "Campo obrigatório.",
        (v) => (v && v >= 2) || "Número de portas deve ser maior que 1",
        (v) => (v && v <= 4) || "Número de portas não pode ser maior que 4",
      ],
      qtdLugaresRules: [
        (v) => !!v || "Campo obrigatório.",
        (v) => (v && v >= 2) || "Número de portas deve ser maior que 1",
        (v) => (v && v <= 20) || "Número de portas não pode ser maior que 20",
      ],
      rules: {
        required: (value) =>
          (value !== null && value !== undefined && value !== "") ||
          "Campo obrigatório.",
      },
    };
  },
  methods: {
    abrirModal() {
      this.dialog = true;
    },
    save() {
      // const formData = new FormData();
      // formData.append("nome", this.nome);
      // formData.append("imagem", this.imagem);
      // formData.append("nPortas", this.nPortas);
      // formData.append("qtdLugares", this.qtdLugares);
      // formData.append("airBag", this.airBag);
      // formData.append("freioAbs", this.freioAbs);

      this.freioAbs = this.value;

      console.log(this.airBag);
    },
  },
  components: {
    LayoutComponent,
    CrudTableComponent,
    ModalComponent,
  },
};
</script>
