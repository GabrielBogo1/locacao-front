<template>
  <LayoutComponent>
    <CrudTableComponent
      buttonText="Novo Carro"
      @abrir-modal="abrirModal"
      @abrir-modal-delete="abrirModalDelete"
      @edit="abrirModalEdit"
      :itens="itens"
      :headers="headers"
      :total-itens="totalItens"
      :options.sync="options"
      @update:options="loadCarrosPaginado"
      @update:search="search = $event"
    >
      <template #[`item.modelo_id`]="{ item }">
        {{ getNomeModelo(item.modelo_id) }}
      </template>

      <template #[`item.disponivel`]="{ item }">
        {{ getDisponivel(item.disponivel) }}
      </template>
      <template #[`item.km`]="{ item }">
        {{ getQuilometragem(item.km) }} KM
      </template>
    </CrudTableComponent>
    <ModalDeleteComponent
      @input="dialogDelete = $event"
      @delete="deleteCarro"
      :value="dialogDelete"
      :item="item"
    ></ModalDeleteComponent>
    <ModalComponent
      :value="dialog"
      @input="dialog = $event"
      @save="save"
      ref="modal"
    >
      <template v-slot:conteudoCarro>
        <v-select
          label="Modelo*"
          v-model="modeloSelecionado"
          :rules="[rules.required]"
          validate-on-blur
          :items="modelos"
          item-text="nome"
          item-value="id"
        ></v-select>
        <v-text-field
          label="Placa*"
          :rules="[rules.required]"
          v-model="placa"
        ></v-text-field>
        <v-text-field
          label="KM*"
          :rules="[rules.required]"
          v-model="km"
        ></v-text-field>
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
import carroService from "@/services/carroService";
import CrudTableComponent from "./CrudTableComponent.vue";
import LayoutComponent from "./LayoutComponent.vue";
import ModalComponent from "./ModalComponent.vue";
import ModalDeleteComponent from "./ModalDeleteComponent.vue";
import modeloService from "@/services/modeloService";

export default {
  name: "CarrosComponent",
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      item: [],
      itens: [],
      modelos: [],
      modeloSelecionado: null,
      totalItens: 0,
      options: { page: 1, itemsPerPage: 10 },
      placa: "",
      disponivel: 1,
      km: "",
      color: "",
      search: "",
      snackbar: false,
      mensagem: false,
      isEditing: false,
      idSelecionado: null,
      headers: [
        { text: "ID", value: "id" },
        { text: "Modelo", value: "modelo_id" },
        { text: "Placa", value: "placa" },
        { text: "Quilometragem", value: "km" },
        { text: "disponivel", value: "disponivel" },
        { text: "Ações", value: "actions" },
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
      this.isEditing = false;
      this.$nextTick(() => {
        this.$refs.modal.resetForm();
      });
    },
    abrirModalEdit(item) {
      this.dialog = true;
      this.isEditing = true;

      this.modeloSelecionado = item.modelo_id;
      this.placa = item.placa;
      this.disponivel = item.disponivel;
      this.km = item.km;
      this.idSelecionado = item.id;
    },
    abrirModalDelete(item) {
      this.item = item;
      this.dialogDelete = true;
    },
    async loadCarrosPaginado() {
      const { data } = await carroService.getPaginate(
        this.options.page,
        this.options.itemsPerPage,
        this.search
      );
      this.itens = data.data;
      this.totalItens = data.total;
    },
    save() {
      let body = {
        modelo_id: this.modeloSelecionado,
        placa: this.placa,
        disponivel: this.disponivel,
        km: this.km,
      };

      if (this.isEditing) {
        carroService
          .update(this.idSelecionado, body)
          .then(() => {
            this.dialog = false;
            this.snackbar = true;
            this.color = "green";
            this.mensagem = "Carro atualizado com sucesso!";
            this.loadCarros();
          })
          .catch((error) => {
            this.snackbar = true;
            this.color = "red";
            Object.keys(error.response.data.errors).forEach((field) => {
              this.mensagem = error.response.data.errors[field][0];
            });
          });
      } else {
        carroService
          .create(body)
          .then(() => {
            this.dialog = false;
            this.snackbar = true;
            this.color = "green";
            this.mensagem = "Carro cadastrado com sucesso!";
            this.loadCarros();
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
    deleteCarro() {
      carroService
        .delete(this.item.id)
        .then(() => {
          this.dialogDelete = false;
          this.snackbar = true;
          this.color = "green";
          this.mensagem = "Carro deletado com sucesso!";
          this.loadCarros();
        })
        .catch((error) => {
          this.snackbar = true;
          this.color = "red";
          Object.keys(error.response.data.errors).forEach((field) => {
            this.mensagem = error.response.data.errors[field][0];
          });
        });
    },
    getDisponivel(id) {
      const carro = this.itens.find((m) => m.id === id);
      const disponivel = carro ? carro.disponivel : id;

      if (disponivel == "1") {
        return "Sim";
      } else {
        return "Não";
      }
    },
    getQuilometragem(id) {
      const carro = this.itens.find((m) => m.id === id);
      return carro ? carro.km : id;
    },
    getNomeModelo(id) {
      const modelo = this.modelos.find((m) => m.id === id);
      return modelo ? modelo.nome : id;
    },
    async loadCarros() {
      const { data } = await carroService.getAll();
      this.itens = data.data;
    },
    async loadModelos() {
      const { data } = await modeloService.getAll();
      this.modelos = data.data;
    },
  },
  mounted() {
    this.loadModelos();
  },
  watch: {
    search() {
      this.options.page = 1;
      this.loadCarrosPaginado();
    },
  },
  components: {
    LayoutComponent,
    CrudTableComponent,
    ModalComponent,
    ModalDeleteComponent,
  },
};
</script>
