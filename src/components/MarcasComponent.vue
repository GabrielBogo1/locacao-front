<template>
  <LayoutComponent>
    <CrudTableComponent
      buttonText="Nova Marca"
      @abrir-modal="abrirModal"
      @abrir-modal-delete="abrirModalDelete"
      @edit="abrirModalEdit"
      :itens="itens"
      :headers="headers"
    >
      <template v-slot:[`item.image`]="{ item }">
        <v-img
          :src="'http://localhost:8000/storage/' + item.imagem"
          max-width="60"
          max-height="60"
          contain
        ></v-img>
      </template>
    </CrudTableComponent>

    <ModalDeleteComponent
      @input="dialogDelete = $event"
      @delete="deleteMarca"
      :value="dialogDelete"
      :item="item"
    ></ModalDeleteComponent>
    <ModalComponent
      :value="dialog"
      @input="dialog = $event"
      @save="save"
      ref="modal"
    >
      <template v-slot:conteudoMarcas>
        <v-text-field
          label="Nome*"
          :rules="[rules.required]"
          v-model="nome"
        ></v-text-field>
        <div v-if="imagemAtual && !imagem" class="mb-3">
          <p class="caption grey--text">Imagem atual:</p>
          <v-img
            :src="imagemAtual"
            max-width="120"
            max-height="120"
            contain
          ></v-img>
        </div>
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
      :color="color"
    >
      <div class="d-flex align-center">
        <v-icon left>mdi-alert-circle</v-icon>
        {{ this.mensagem }}
      </div>
    </v-snackbar>
  </LayoutComponent>
</template>

<script>
import marcaService from "@/services/marcaService";
import CrudTableComponent from "./CrudTableComponent.vue";
import LayoutComponent from "./LayoutComponent.vue";
import ModalComponent from "./ModalComponent.vue";
import ModalDeleteComponent from "./ModalDeleteComponent.vue";

export default {
  name: "MarcasComponent",
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      nome: "",
      imagem: null,
      itens: [],
      item: [],
      mensagem: "",
      isEditing: false,
      snackbar: false,
      imagemAtual: null,
      color: "",
      headers: [
        { text: "Id", value: "id" },
        { text: "Nome", value: "nome" },
        { text: "Imagem", value: "image" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      rules: {
        required: (value) => !!value || "Campo obrigatório.",
      },
    };
  },
  methods: {
    abrirModal() {
      this.dialog = true;
      this.$nextTick(() => {
        this.$refs.modal.resetForm();
      });
    },
    abrirModalEdit(item) {
      this.dialog = true;

      this.nome = item.nome;
      this.imagem = item.imagem;
    },
    abrirModalDelete(item) {
      this.item = item;
      this.dialogDelete = true;
    },

    save() {
      const formData = new FormData();
      formData.append("nome", this.nome);
      formData.append("imagem", this.imagem);

      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (this.nome == "" || this.imagem == "") {
        this.snackbar = true;
        this.mensagem = "Verifique os campos obrigatórios";
      } else {
        if (this.isEditing) {
          marcaService
            .update(formData, config)
            .then(() => {
              this.dialog = false;
              this.snackbar = true;
              this.color = "green";
              this.mensagem = "Marca atualizada com sucesso!";
              this.loadMarcas();
            })
            .catch((error) => {
              this.snackbar = true;
              this.color = "red";
              Object.keys(error.response.data.errors).forEach((field) => {
                this.mensagem = error.response.data.errors[field][0];
              });
            });
        } else {
          marcaService
            .create(formData, config)
            .then(() => {
              this.dialog = false;
              this.snackbar = true;
              this.color = "green";
              this.mensagem = "Marca criada com sucesso!";
              this.loadMarcas();
            })
            .catch((error) => {
              this.color = "red";
              this.snackbar = true;
              Object.keys(error.response.data.errors).forEach((field) => {
                this.mensagem = error.response.data.errors[field][0];
              });
            });
        }
      }
    },
    deleteMarca() {
      marcaService
        .delete(this.item.id)
        .then(() => {
          this.dialogDelete = false;
          this.snackbar = true;
          this.color = "green";
          this.mensagem = "Marca deletada com sucesso!";
          this.loadMarcas();
        })
        .catch((error) => {
          this.snackbar = true;
          this.color = "red";
          Object.keys(error.response.data.errors).forEach((field) => {
            this.mensagem = error.response.data.errors[field][0];
          });
        });
    },

    async loadMarcas() {
      const { data } = await marcaService.getAll();
      this.itens = data.data;
      console.log(this.itens);
    },
  },
  async mounted() {
    await this.loadMarcas();
  },
  components: {
    LayoutComponent,
    CrudTableComponent,
    ModalComponent,
    ModalDeleteComponent,
  },
};
</script>
