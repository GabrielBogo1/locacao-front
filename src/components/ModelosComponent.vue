<template>
  <LayoutComponent>
    <CrudTableComponent
      buttonText="Novo Modelo"
      @abrir-modal="abrirModal"
      @abrir-modal-delete="abrirModalDelete"
      @edit="abrirModalEdit"
      :headers="headers"
      :itens="itens"
      :total-itens="totalItens"
      :options.sync="options"
      @update:options="loadModelosPaginado"
      @update:search="search = $event"
    >
      <template v-slot:[`item.image`]="{ item }">
        <v-img
          :src="'http://localhost:8000/storage/' + item.imagem"
          max-width="60"
          max-height="60"
          contain
        ></v-img>
      </template>
      <template v-slot:[`item.marca_id`]="{ item }">
        {{ getMarca(item.marca_id) }}
      </template>
      <template v-slot:[`item.air_bag`]="{ item }">
        {{ returnAirBag(item.air_bag) }}
      </template>
      <template v-slot:[`item.abs`]="{ item }">
        {{ returnFreioAbs(item.abs) }}
      </template>
    </CrudTableComponent>
    <ModalDeleteComponent
      @input="dialogDelete = $event"
      @delete="deleteModelo"
      :value="dialogDelete"
      :item="item"
    ></ModalDeleteComponent>
    <ModalComponent
      :value="dialog"
      @input="dialog = $event"
      @save="save"
      ref="modal"
    >
      <template v-slot:conteudoModelos>
        <v-select
          label="Marca*"
          v-model="marcaSelecionada"
          :rules="[rules.required]"
          validate-on-blur
          :items="marcas"
          item-text="nome"
          item-value="id"
        ></v-select>
        <v-text-field
          label="Nome*"
          v-model="nome"
          :rules="[rules.required]"
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
          :label="
            isEditing
              ? 'Deixe em branco caso queira manter a imagem atual'
              : 'Imagem*'
          "
          v-model="imagem"
          :rules="isEditing ? [] : [rules.required]"
        ></v-file-input>
        <v-text-field
          label="Número de portas*"
          type="number"
          :rules="nPortasRules"
          v-model="numero_portas"
        ></v-text-field>
        <v-text-field
          label="Qtd de lugares*"
          v-model="lugares"
          :rules="qtdLugaresRules"
        ></v-text-field>
        <v-row justify="space-between" class="d-flex justify-end">
          <v-col>
            <v-radio-group name="airbag" v-model="air_bag" mandatory>
              <p>Air Bag?*</p>
              <v-radio label="Sim" value="1"></v-radio>
              <v-radio label="Não" value="0"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col>
            <v-radio-group v-model="abs" mandatory>
              <p>Freio ABS?*</p>
              <v-radio label="Sim" value="1"></v-radio>
              <v-radio label="Não" value="0"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
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
import modeloService from "@/services/modeloService";
import CrudTableComponent from "./CrudTableComponent.vue";
import LayoutComponent from "./LayoutComponent.vue";
import ModalComponent from "./ModalComponent.vue";
import marcaService from "@/services/marcaService";
import ModalDeleteComponent from "./ModalDeleteComponent.vue";

export default {
  name: "ModelosComponent",
  data() {
    return {
      marcas: [],
      marcaSelecionada: null,
      totalItens: 0,
      options: { page: 1, itemsPerPage: 10 },
      nome: "",
      itens: [],
      item: [],
      idEdit: "",
      search: "",
      isEditing: false,
      imagem: null,
      numero_portas: "",
      dialogDelete: false,
      lugares: "",
      air_bag: "",
      color: "",
      abs: "",
      img: "",
      dialog: false,
      snackbar: false,
      mensagem: "",
      value: "",
      name: false,
      imagemAtual: null,
      label: "",
      headers: [
        { text: "Id", value: "id" },
        { text: "Marca", value: "marca_id" },
        { text: "Nome", value: "nome" },
        { text: "Imagem", value: "image" },
        { text: "nPortas", value: "numero_portas" },
        { text: "qtdLugares", value: "lugares" },
        { text: "airBag", value: "air_bag" },
        { text: "freioAbs", value: "abs" },
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
      this.isEditing = false;
      this.imagemAtual = null;
      this.$nextTick(() => {
        this.$refs.modal.resetForm();
      });
    },
    abrirModalEdit(item) {
      this.dialog = true;
      this.isEditing = true;
      this.idEdit = item.id;
      this.marcaSelecionada = item.marca_id;
      this.nome = item.nome;
      this.imagem = null;
      this.imagemAtual = "http://localhost:8000/storage/" + item.imagem;
      this.numero_portas = item.numero_portas;
      this.lugares = item.lugares;
      this.air_bag = String(item.air_bag);
      this.abs = String(item.abs);

      console.log(item.abs);
      console.log(item.air_bag);
    },
    abrirModalDelete(item) {
      this.dialogDelete = true;
      this.item = item;
    },
    async loadModelosPaginado() {
      const { data } = await modeloService.getPaginate(
        this.options.page,
        this.options.itemsPerPage,
        this.search
      );
      this.itens = data.data;
      this.totalItens = data.total;
    },
    save() {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("marca_id", this.marcaSelecionada);
      formData.append("nome", this.nome);
      formData.append("numero_portas", this.numero_portas);
      formData.append("lugares", this.lugares);
      formData.append("air_bag", this.air_bag);
      formData.append("abs", this.abs);

      if (this.imagem) {
        formData.append("imagem", this.imagem);
      }

      if (this.isEditing) {
        formData.append("_method", "PUT");
        modeloService
          .update(this.idEdit, formData, config)
          .then(() => {
            this.dialog = false;
            this.isEditing = false;
            this.snackbar = true;
            this.color = "green";
            this.mensagem = "Modelo atualizado com sucesso!";
            this.loadModelos();
          })
          .catch((error) => {
            this.snackbar = true;
            this.color = "red";
            Object.keys(error.response.data.errors).forEach((field) => {
              this.mensagem = error.response.data.errors[field][0];
            });
          });
      } else {
        modeloService
          .create(formData, config)
          .then(() => {
            this.loadModelos();
            this.dialog = false;
            this.snackbar = true;
            this.color = "green";
            this.mensagem = "Modelo criado com sucesso!";
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
    deleteModelo() {
      modeloService
        .delete(this.item.id)
        .then(() => {
          this.dialogDelete = false;
          this.loadModelos();
          this.snackbar = true;
          this.color = "green";
          this.mensagem = "Modelo deletado com sucesso!";
        })
        .catch((error) => {
          this.snackbar = true;
          this.color = "red";
          Object.keys(error.response.data.errors).forEach((field) => {
            this.mensagem = error.response.data.errors[field][0];
          });
        });
    },
    getMarca(id) {
      const marca = this.marcas.find((c) => c.id === id);
      return marca ? marca.nome : id;
    },
    async loadModelos() {
      const { data } = await modeloService.getAll();
      this.itens = data.data;
    },
    async loadMarcas() {
      const { data } = await marcaService.getAll();
      this.marcas = data.data;
    },
    returnAirBag(item) {
      return item == 1 ? "Sim" : "Não";
    },
    returnFreioAbs(item) {
      return item == true ? "Sim" : "Não";
    },
  },
  mounted() {
    this.loadMarcas();
    this.loadModelosPaginado();
  },
  watch: {
    search() {
      this.options.page = 1;
      this.loadModelosPaginado();
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
