<template>
  <LayoutComponent>
    <CrudTableComponent
      :headers="headers"
      :itens="itens"
      buttonText="Nova Locação"
      @abrir-modal="abrirModal"
      @edit="abrirModalEdit"
      @abrir-modal-delete="abrirModalDelete"
    ></CrudTableComponent>
    <ModalDeleteComponent
      @input="dialogDelete = $event"
      @delete="deleteLocacao"
      :value="dialogDelete"
      :item="item"
    ></ModalDeleteComponent>
    <ModalComponent
      :value="dialog"
      @input="dialog = $event"
      @save="save"
      ref="modal"
    >
      <template v-slot:conteudoLocacoes>
        <v-select
          label="Cliente*"
          v-model="clienteSelecionado"
          :items="clientes"
          item-text="nome"
          item-value="id"
        ></v-select>
        <v-select
          label="Carro*"
          v-model="carroSelecionado"
          :items="carros"
          item-text="placa"
          item-value="id"
        ></v-select>
        <v-text-field
          label="Valor diária*"
          :rules="[rules.required]"
          v-model="valor_diaria"
        ></v-text-field>
        <v-text-field
          label="KM Inicial*"
          :rules="[rules.required]"
          v-model="km_inicial"
        ></v-text-field>
        <v-text-field
          label="KM Final*"
          :rules="[rules.required]"
          v-model="km_final"
        ></v-text-field>
      </template>
    </ModalComponent>
  </LayoutComponent>
</template>

<script>
import CrudTableComponent from "@/components/CrudTableComponent.vue";
import LayoutComponent from "./LayoutComponent.vue";
import ModalComponent from "./ModalComponent.vue";
import locacaoService from "@/services/locacaoService";
import carroService from "@/services/carroService";
import clienteService from "@/services/clienteService";
import ModalDeleteComponent from "./ModalDeleteComponent.vue";
export default {
  name: "LocacoesComponent",
  components: {
    CrudTableComponent,
    LayoutComponent,
    ModalComponent,
    ModalDeleteComponent,
  },
  data() {
    return {
      item: [],
      itens: [],
      clientes: [],
      clienteSelecionado: null,
      carros: [],
      carroSelecionado: null,
      data_inicio_periodo: "",
      data_final_previsto_periodo: "",
      data_final_realizado_periodo: "",
      valor_diaria: "",
      km_inicial: "",
      km_final: "",
      snackbar: false,
      mensagem: "",
      dialog: false,
      dialogDelete: false,
      rules: {
        required: (value) =>
          (value !== null && value !== undefined && value !== "") ||
          "Campo obrigatório.",
      },
      headers: [
        { text: "Cliente", value: "cliente_id" },
        { text: "Carro", value: "carro_id" },
        { text: "Data Início", value: "data_inicio_periodo" },
        { text: "Data Final Prev.", value: "data_final_previsto_periodo" },
        { text: "Valor diária", value: "valor_diaria" },
        { text: "Ações", value: "actions" },
      ],
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

      this.clienteSelecionado = item.cliente_id;
      this.carroSelecionado = item.carro_id;
      this.data_inicio_periodo = item.data_inicio_periodo;
      this.data_final_previsto_periodo = item.data_final_previsto_periodo;
      this.valor_diaria = item.valor_diaria;
      this.km_inicial = item.km_inicial;
      this.km_final = item.km_final;
    },
    abrirModalDelete(item) {
      this.dialogDelete = true;
      this.item = item;
    },

    save() {},
    deleteLocacao() {
      locacaoService
        .delete(this.item.id)
        .then(() => {
          this.dialogDelete = false;
          this.loadLocacoes();
        })
        .catch((error) => {
          this.snackbar = true;
          Object.keys(error.response.data.errors).forEach((field) => {
            this.mensagem = error.response.data.errors[field][0];
          });
        });
    },
    async loadLocacoes() {
      const { data } = await locacaoService.getAll();
      this.itens = data.data;
    },
    async loadCarros() {
      const { data } = await carroService.getAll();
      this.carros = data.data;
    },
    async loadClientes() {
      const { data } = await clienteService.getAll();
      this.clientes = data.data;
    },
  },

  mounted() {
    this.loadLocacoes();
    this.loadCarros();
    this.loadClientes();
  },
};
</script>
