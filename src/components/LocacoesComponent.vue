<template>
  <LayoutComponent>
    <!-- Tabela Principal -->
    <CrudTableComponent
      :headers="tabela.headers"
      :itens="apiData.itens"
      buttonText="Nova Locação"
      :mostraBotaoFinalizar="true"
      :disableActions="true"
      @abrir-modal="abrirModal"
      @edit="abrirModalEdit"
      @abrir-modal-delete="abrirModalDelete"
      @abrir-modal-finalizar="abrirModalFinalizar"
      :total-itens="tabela.totalItens"
      :options.sync="tabela.options"
      @update:options="listar"
    >
      <template #[`item.data_inicio_periodo`]="{ item }">
        {{ formatarData(item.data_inicio_periodo) }}
      </template>

      <template #[`item.data_final_previsto_periodo`]="{ item }">
        {{ formatarData(item.data_final_previsto_periodo) }}
      </template>
      <template #[`item.carro_id`]="{ item }">
        {{ getNomeCarro(item.carro_id) }}
      </template>
      <template #[`item.cliente_id`]="{ item }">
        {{ getNomeCliente(item.cliente_id) }}
      </template>
      <template #[`item.valor_diaria`]="{ item }">
        R$ {{ item.valor_diaria }}
      </template>
      <template #[`item.ativa`]="{ item }">
        <span
          :style="{
            color: item.ativa ? 'green' : 'red',
            'font-weight': 'bold',
          }"
        >
          {{ getStatus(item.ativa) }}
        </span>
      </template>
    </CrudTableComponent>

    <!-- Modal delete locação -->
    <ModalDeleteComponent
      @input="ui.dialogs.dialogDelete = $event"
      @delete="deleteLocacao"
      :value="ui.dialogs.dialogDelete"
      :item="apiData.item"
    ></ModalDeleteComponent>

    <!-- Modal de criação e edição de locação -->
    <ModalComponent
      :value="ui.dialogs.dialogNovo"
      :isEditing="ui.isEditing"
      @input="ui.dialogs.dialogNovo = $event"
      @save="save"
      @update="update"
      ref="modalCreate"
    >
      <template v-slot:conteudoLocacoes>
        <v-select
          label="Cliente*"
          v-model="form.cliente_id"
          :items="apiData.clientes"
          item-text="nome"
          item-value="id"
        ></v-select>
        <v-select
          label="Carro*"
          v-model="form.carro_id"
          :items="apiData.carros"
          item-text="placa"
          item-value="id"
          :item-disabled="disableItem"
        ></v-select>
        <v-text-field
          label="Valor diária*"
          :rules="[rules.required]"
          v-model="form.valor_diaria"
        ></v-text-field>
        <v-text-field
          label="KM Inicial*"
          :rules="[rules.required]"
          v-model="form.km_inicial"
        ></v-text-field>
        <v-menu
          ref="datePickerDataInicial"
          v-model="ui.menus.dataInicial"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              label="Data inicial"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              :value="formatarData(form.data_inicio_periodo)"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="form.data_inicio_periodo"
            no-title
            scrollable
            locale="pt-BR"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="ui.menus.dataInicial = false">
              Cancelar
            </v-btn>
            <v-btn text color="primary" @click="ui.menus.dataInicial = false">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-menu
          ref="datePickerDataFinalPrevista"
          v-model="ui.menus.dataFinalPrevista"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              label="Data Final Prevista"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              :value="formatarData(form.data_final_previsto_periodo)"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="form.data_final_previsto_periodo"
            no-title
            scrollable
            locale="pt-BR"
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="ui.menus.dataFinalPrevista = false"
            >
              Cancelar
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="ui.menus.dataFinalPrevista = false"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </template>
    </ModalComponent>

    <!-- Modal de finalização de locação -->
    <ModalFinalizarComponent
      @input="ui.dialogs.dialogFinalizar = $event"
      @finalizar="finalizarLocacao"
      :value="ui.dialogs.dialogFinalizar"
      :item="apiData.item"
      ref="modalFinalizarLocacao"
    >
      <template v-slot:conteudoLocacoesFinalizar>
        <v-menu
          ref="datePickerFinalizacaoDeLocacao"
          v-model="ui.menus.finalizacao"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              label="Data da finalização"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              :value="formatarData(form.data_final_realizado_periodo)"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="form.data_final_realizado_periodo"
            no-title
            scrollable
            locale="pt-BR"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="ui.menus.finalizacao = false">
              Cancelar
            </v-btn>
            <v-btn text color="primary" @click="ui.menus.finalizacao = false">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-text-field
          label="KM Final*"
          :rules="[rules.required]"
          v-model="form.km_final"
        ></v-text-field>
      </template>
    </ModalFinalizarComponent>

    <!-- Snackbar -->
    <v-snackbar
      v-model="ui.snackbar"
      :timeout="4000"
      bottom
      right
      elevation="6"
      rounded="lg"
      :color="ui.color"
    >
      <div class="d-flex align-center">
        <v-icon left>mdi-alert-circle</v-icon>
        {{ this.ui.mensagem }}
      </div>
    </v-snackbar>
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
import ModalFinalizarComponent from "./ModalFinalizarComponent.vue";
import crudMixin from "@/mixins/crudMixin.js";
export default {
  name: "LocacoesComponent",
  components: {
    CrudTableComponent,
    LayoutComponent,
    ModalComponent,
    ModalDeleteComponent,
    ModalFinalizarComponent,
  },
  mixins: [crudMixin],
  data() {
    return {
      service: locacaoService,
      // UI / Controle de estado
      ui: {
        menus: {
          dataFinalPrevista: false,
          dataInicial: false,
          dataFinalizacao: false,
        },
        dialogs: {
          dialogNovo: false,
          dialogFinalizar: false,
          dialogDelete: false,
        },
        snackbar: false,
        color: "",
        mensagem: "",
        isEditing: false,
      },

      // Dados da tabela
      tabela: {
        headers: [
          { text: "ID", value: "id" },
          { text: "Cliente", value: "cliente_id" },
          { text: "Carro", value: "carro_id" },
          { text: "Data Início", value: "data_inicio_periodo" },
          { text: "Data Final Prev.", value: "data_final_previsto_periodo" },
          { text: "Valor diária", value: "valor_diaria" },
          { text: "Status", value: "ativa" },
          { text: "Ações", value: "actions" },
        ],
        options: { page: 1, itemsPerPage: 10 },
        totalItens: 0,
      },

      // Dados do formulário
      form: {
        cliente_id: null,
        carro_id: null,
        data_inicio_periodo: "",
        data_final_previsto_periodo: "",
        data_final_realizado_periodo: "",
        valor_diaria: "",
        km_inicial: "",
        km_final: "",
        ativa: "",
      },

      // Dados api
      apiData: {
        item: [],
        itens: [],
        clientes: [],
        carros: [],
        idSelecionado: null,
      },

      horaAtual: new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      }),
      rules: {
        required: (value) =>
          (value !== null && value !== undefined && value !== "") ||
          "Campo obrigatório.",
      },
    };
  },
  computed: {
    requestPayload() {
      let horarioEnvio = this.horaAtual.split(",");
      return {
        cliente_id: this.form.cliente_id,
        carro_id: this.form.carro_id,
        data_inicio_periodo:
          this.form.data_inicio_periodo + "" + horarioEnvio[1],
        data_final_previsto_periodo:
          this.form.data_final_previsto_periodo + "" + horarioEnvio[1],
        valor_diaria: this.form.valor_diaria,
        km_inicial: this.form.km_inicial,
        data_final_realizado_periodo: null,
        ativa: true,
      };
    },
    requestParams() {
      return {
        page: this.tabela.options.page,
        per_page: this.tabela.options.itemsPerPage,
      };
    },
  },
  methods: {
    abrirModal() {
      this.ui.dialogs.dialogNovo = true;
      this.ui.isEditing = false;
      this.loadClientes();

      this.$nextTick(() => {
        this.$refs.modalCreate.resetForm();
        this.data_inicio_periodo = new Date().toISOString().substr(0, 10);
      });
    },
    abrirModalEdit(item) {
      this.ui.dialogs.dialogNovo = true;
      this.ui.isEditing = true;

      this.apiData.idSelecionado = item.id;
      this.form.cliente_id = item.cliente_id;
      this.form.carro_id = item.carro_id;
      this.form.data_inicio_periodo = item.data_inicio_periodo.substr(0, 10);
      this.form.data_final_previsto_periodo =
        item.data_final_previsto_periodo.substr(0, 10);
      this.form.valor_diaria = item.valor_diaria;
      this.form.km_inicial = item.km_inicial;
    },
    abrirModalDelete(item) {
      this.ui.dialogs.dialogDelete = true;
      this.apiData.item = item;
    },
    abrirModalFinalizar(item) {
      this.ui.dialogs.dialogFinalizar = true;
      this.apiData.idSelecionado = item.id;

      this.$nextTick(() => {
        this.$refs.modalFinalizarLocacao.resetForm();
      });
    },
    deleteLocacao() {
      locacaoService
        .delete(this.apiData.item.id)
        .then(() => {
          this.ui.dialogs.dialogDelete = false;
          this.ui.color = "green";
          this.ui.mensagem = "Locação deletada com sucesso!";
          this.loadLocacoes();
        })
        .catch((error) => {
          this.ui.snackbar = true;
          Object.keys(error.response.data.errors).forEach((field) => {
            this.ui.mensagem = error.response.data.errors[field][0];
          });
        });
    },
    finalizarLocacao() {
      let body = {
        data_final_realizado_periodo: this.form.data_final_realizado_periodo,
        km_final: this.form.km_final,
        ativa: false,
      };

      locacaoService
        .update(this.apiData.idSelecionado, body)
        .then(() => {
          this.ui.dialogs.dialogFinalizar = false;
          this.ui.snackbar = true;
          this.ui.color = "green";
          this.ui.mensagem = "Locação finalizada com sucesso!";
          this.loadLocacoes();
        })
        .catch((error) => {
          this.ui.snackbar = true;
          this.ui.color = "red";
          Object.keys(error.response.data.errors).forEach((field) => {
            this.ui.mensagem = error.response.data.errors[field][0];
          });
        });
    },
    disableItem(item) {
      if (item.disponivel == 1) {
        return false;
      } else return true;
    },
    getNomeCarro(id) {
      const carro = this.apiData.carros.find((c) => c.id === id);
      return carro ? carro.placa : id;
    },
    getNomeCliente(id) {
      const cliente = this.apiData.clientes.find((c) => c.id === id);
      return cliente ? cliente.nome : id;
    },
    getStatus(ativa) {
      let status = ativa ? "Ativa" : "Finalizada";
      return status;
    },
    formatarData(data) {
      if (!data) return "";
      const [ano, mes, dia] = data.substr(0, 10).split("-");
      return `${dia}/${mes}/${ano}`;
    },
    async loadCarros() {
      const { data } = await carroService.getAll();
      this.apiData.carros = data.data;
    },
    async loadClientes() {
      const { data } = await clienteService.getAll();
      this.apiData.clientes = data.data;
    },
  },
  mounted() {
    this.listar();
    this.loadClientes();
    this.loadCarros();
  },
};
</script>
