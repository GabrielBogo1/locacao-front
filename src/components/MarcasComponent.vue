<template>
  <LayoutComponent>
    <CrudTableComponent
      buttonText="Nova Marca"
      @abrir-modal="abrirModal"
      :itens="itens"
      :headers="headers"
    ></CrudTableComponent>
    <ModalComponent :value="dialog" @input="dialog = $event" @save="save">
      <template v-slot:conteudoMarcas>
        <v-text-field
          label="Nome*"
          :rules="[rules.required]"
          v-model="nome"
        ></v-text-field>
        <v-file-input
          label="imagem*"
          v-model="imagem"
          :rules="[rules.required]"
        ></v-file-input>
      </template>
    </ModalComponent>
    <v-snackbar
      v-model="snackbar"
      :timeout="4000"
      bottom
      right
      elevation="6"
      rounded="lg"
      color="error"
    >
      <div class="d-flex align-center">
        <v-icon left>mdi-alert-circle</v-icon>
        {{ this.mensagem }}
      </div>
    </v-snackbar>
  </LayoutComponent>
</template>

<script>
import CrudTableComponent from "./CrudTableComponent.vue";
import LayoutComponent from "./LayoutComponent.vue";
import ModalComponent from "./ModalComponent.vue";
import api from "@/services/api";

export default {
  name: "MarcasComponent",
  data() {
    return {
      dialog: false,
      urlBase: "http://localhost:8000/api/v1/marca",
      nome: "",
      imagem: null,
      itens: [],
      mensagem: "",
      snackbar: false,
      headers: [
        { text: "Id", value: "id" },
        { text: "Nome", value: "nome" },
        { text: "Imagem", value: "imagem" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      rules: {
        required: (value) => !!value || "Campo obrigatório.",
      },
    };
  },
  mounted() {
    this.carregarLista();
    console.log(this.itens);
  },
  methods: {
    abrirModal() {
      this.dialog = true;
    },
    save() {
      if (this.nome == "" || this.imagem == "") {
        this.snackbar = true;
        this.mensagem = "Verifique os campos obrigatórios";
      } else {
        const formData = new FormData();
        formData.append("nome", this.nome);
        formData.append("imagem", this.imagem);

        let config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        api
          .post(this.urlBase, formData, config)
          .then((response) => {
            console.log(response);
            this.dialog = false;
            this.carregarLista();
          })
          .catch((error) => {
            console.log(error);
            (this.snackbar = true),
              Object.keys(error.response.data.errors).forEach((field) => {
                this.mensagem = error.response.data.errors[field][0];
              });
          });
      }
    },
    carregarLista() {
      api
        .get(this.urlBase)
        .then((response) => {
          this.itens = response.data.data;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  components: {
    LayoutComponent,
    CrudTableComponent,
    ModalComponent,
  },
};
</script>
