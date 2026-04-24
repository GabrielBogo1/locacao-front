<template>
  <LayoutComponent>
    <CrudTableComponent
      buttonText="Novo Cliente"
      :headers="headers"
      :itens="itens"
      @abrir-modal="abrirModal"
      @abrir-modal-delete="abrirModalDelete"
      @edit="abrirModalEdit"
    >
    </CrudTableComponent>
    <ModalDeleteComponent
      @input="dialogDelete = $event"
      @delete="deleteCliente"
      :value="dialogDelete"
      :item="item"
    ></ModalDeleteComponent>
    <ModalComponent
      :value="dialog"
      @input="dialog = $event"
      @save="save"
      ref="modal"
    >
      <template v-slot:conteudoCliente>
        <v-col cols="12">
          <v-text-field
            :rules="[rules.required]"
            label="Nome*"
            required
            v-model="nome"
          ></v-text-field>
          <v-text-field
            label="CPF*"
            :rules="[rules.required]"
            v-model="cpfFormatado"
            v-mask="['###.###.###-##']"
            type="tel"
            @keypress="apenasNumeros"
          ></v-text-field>
          <v-text-field
            label="Telefone*"
            v-model="telefone"
            v-mask="['(##) ####-####']"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
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
import CrudTableComponent from "./CrudTableComponent.vue";
import LayoutComponent from "./LayoutComponent.vue";
import ModalComponent from "./ModalComponent.vue";
import ModalDeleteComponent from "./ModalDeleteComponent.vue";
import clienteService from "@/services/clienteService";

export default {
  name: "ClientesComponent",
  data() {
    return {
      nome: "",
      cpf: "",
      telefone: "",
      dialog: false,
      dialogDelete: false,
      snackbar: false,
      mensagem: "",
      item: [],
      itens: [],
      isEditing: false,
      idEdit: null,
      color: "",
      headers: [
        { text: "Id", value: "id" },
        { text: "Nome", value: "nome" },
        { text: "Telefone", value: "telefone" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      rules: {
        required: (value) => !!value || "Campo obrigatório.",
      },
    };
  },
  computed: {
    cpfFormatado: {
      get() {
        return this.cpf
          .replace(/\D/g, "")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      },
      set(valor) {
        this.cpf = valor ? valor.replace(/\D/g, "") : "";
      },
    },
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
      this.isEditing = true;

      this.idEdit = item.id;
      this.nome = item.nome;
      this.cpf = item.cpf;
      this.telefone = item.telefone;
    },
    abrirModalDelete(item) {
      this.dialogDelete = true;
      this.item = item;
    },
    save() {
      let body = {
        nome: this.nome,
        cpf: this.cpf,
        telefone: this.telefone,
      };

      if (this.isEditing) {
        clienteService
          .update(this.idEdit, body)
          .then(() => {
            this.dialog = false;
            this.isEditing = false;
            this.dialog = false;
            this.snackbar = true;
            this.color = "green";
            this.mensagem = "Cliente atualizado com sucesso!";
            this.loadUsers();
          })
          .catch((error) => {
            this.snackbar = true;
            this.color = "red";
            Object.keys(error.response.data.errors).forEach((field) => {
              this.mensagem = error.response.data.errors[field][0];
            });
          });
      } else {
        clienteService
          .create(body)
          .then(() => {
            this.dialog = false;
            this.snackbar = true;
            this.color = "green";
            this.mensagem = "Cliente cadastrado com sucesso!";
            this.loadUsers();
          })
          .catch((error) => {
            this.snackbar = true;
            this.color = "red";
            Object.keys(error.response.data.errors).forEach((field) => {
              this.mensagem = error.response.data.errors[field][0];
            });
          });
      }
    },
    async deleteCliente() {
      clienteService
        .delete(this.item.id)
        .then(() => {
          this.dialogDelete = false;
          this.snackbar = true;
          this.color = "green";
          this.mensagem = "Cliente deletado com sucesso!";
          this.loadUsers();
        })
        .catch((error) => {
          this.snackbar = true;
          this.color = "red";

          Object.keys(error.response.data.errors).forEach((field) => {
            this.mensagem = error.response.data.errors[field][0];
          });
        });
    },
    apenasNumeros(event) {
      const char = String.fromCharCode(event.keyCode);
      if (!/[0-9]/.test(char)) {
        event.preventDefault();
      }
    },

    async loadUsers() {
      const { data } = await clienteService.getAll();
      this.itens = data.data;
    },
  },
  mounted() {
    this.loadUsers();
  },

  components: {
    LayoutComponent,
    CrudTableComponent,
    ModalComponent,
    ModalDeleteComponent,
  },
};
</script>
