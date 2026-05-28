<template>
  <LayoutComponent>
    <CrudTableComponent
      :headers="headers"
      :itens="itens"
      buttonText="Nova Locação"
      :mostraBotaoFinalizar="true"
      :disableActions="true"
      @abrir-modal="abrirModal"
      @edit="abrirModalEdit"
      @abrir-modal-delete="abrirModalDelete"
      @abrir-modal-finalizar="abrirModalFinalizar"
      :total-itens="totalItens"
      :options.sync="options"
      @update:options="loadLocacoesPaginado"
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
    <ModalFinalizarComponent
      @input="dialogFinalizar = $event"
      @finalizar="finalizarLocacao"
      :value="dialogFinalizar"
      :item="item"
      ref="modaldois"
    >
      <template v-slot:conteudoLocacoesFinalizar>
        <v-menu
          ref="menuFinalizacao"
          v-model="menuFinalizacao"
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
              :value="dataFinalizacaoFormatada"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="data_final_realizado_periodo"
            no-title
            scrollable
            locale="pt-BR"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menuFinalizacao = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="menuFinalizacao = false">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>

        <v-text-field
          label="KM Final*"
          :rules="[rules.required]"
          v-model="km_final"
        ></v-text-field>
      </template>
    </ModalFinalizarComponent>
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
          v-model="cliente_id"
          :items="clientes"
          item-text="nome"
          item-value="id"
        ></v-select>
        <v-select
          label="Carro*"
          v-model="carro_id"
          :items="carros"
          item-text="placa"
          item-value="id"
          :item-disabled="disableItem"
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
        <!-- <v-text-field
          label="KM Final*"
          :rules="[rules.required]"
          v-model="km_final"
        ></v-text-field> -->
        <v-menu
          ref="menuInicial"
          v-model="menuInicial"
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
              :value="dataFormatada"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="data_inicio_periodo"
            no-title
            scrollable
            locale="pt-BR"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menuInicial = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="menuInicial = false">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>

        <!---SEPARACAO---->

        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              label="Data Final"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              :value="dataFinalFormatada"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="data_final_previsto_periodo"
            no-title
            scrollable
            locale="pt-BR"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="menu = false"> OK </v-btn>
          </v-date-picker>
        </v-menu>
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
import CrudTableComponent from "@/components/CrudTableComponent.vue";
import LayoutComponent from "./LayoutComponent.vue";
import ModalComponent from "./ModalComponent.vue";
import locacaoService from "@/services/locacaoService";
import carroService from "@/services/carroService";
import clienteService from "@/services/clienteService";
import ModalDeleteComponent from "./ModalDeleteComponent.vue";
import ModalFinalizarComponent from "./ModalFinalizarComponent.vue";
export default {
  name: "LocacoesComponent",
  components: {
    CrudTableComponent,
    LayoutComponent,
    ModalComponent,
    ModalDeleteComponent,
    ModalFinalizarComponent,
  },
  data() {
    return {
      menu: false,
      menuInicial: false,
      menuFinalizacao: false,
      dialogFinalizar: false,
      item: [],
      itens: [],
      clientes: [],
      cliente_id: null,
      carros: [],
      carro_id: null,
      data_inicio_periodo: "",
      data_final_previsto_periodo: "",
      data_final_realizado_periodo: "",
      valor_diaria: "",
      km_inicial: "",
      km_final: "",
      ativa: "",
      teste: 0,
      totalItens: 0,
      options: { page: 1, itemsPerPage: 10 },
      snackbar: false,
      isEditing: false,
      idSelecionado: null,
      mensagem: "",
      dialog: false,
      color: "",
      statusColor: "",
      dialogDelete: false,
      horaAtual: new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      }),
      rules: {
        required: (value) =>
          (value !== null && value !== undefined && value !== "") ||
          "Campo obrigatório.",
      },
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
    };
  },
  computed: {
    dataFormatada() {
      if (!this.data_inicio_periodo) return "";
      const [ano, mes, dia] = this.data_inicio_periodo.split("-");
      return `${dia}/${mes}/${ano}`;
    },
    dataFinalFormatada() {
      if (!this.data_final_previsto_periodo) return "";
      const [ano, mes, dia] = this.data_final_previsto_periodo.split("-");
      return `${dia}/${mes}/${ano}`;
    },
    dataFinalizacaoFormatada() {
      if (!this.data_final_realizado_periodo) return "";
      const [ano, mes, dia] = this.data_final_realizado_periodo.split("-");
      return `${dia}/${mes}/${ano}`;
    },
  },
  methods: {
    abrirModal() {
      this.dialog = true;
      this.$nextTick(() => {
        this.$refs.modal.resetForm();
        this.data_inicio_periodo = new Date().toISOString().substr(0, 10);
      });
    },
    abrirModalEdit(item) {
      this.dialog = true;
      this.isEditing = true;

      this.idSelecionado = item.id;
      this.cliente_id = item.cliente_id;
      this.carro_id = item.carro_id;
      this.data_inicio_periodo = item.data_inicio_periodo.substr(0, 10);
      this.data_final_previsto_periodo =
        item.data_final_previsto_periodo.substr(0, 10);
      this.valor_diaria = item.valor_diaria;
      this.km_inicial = item.km_inicial;
    },
    abrirModalDelete(item) {
      this.dialogDelete = true;
      this.item = item;
    },
    abrirModalFinalizar(item) {
      this.dialogFinalizar = true;
      this.idSelecionado = item.id;

      this.$nextTick(() => {
        this.$refs.modaldois.resetForm();
      });
    },
    save() {
      let horarioEnvio = this.horaAtual.split(",");
      let body = {
        cliente_id: this.cliente_id,
        carro_id: this.carro_id,
        data_inicio_periodo: this.data_inicio_periodo + "" + horarioEnvio[1],
        data_final_previsto_periodo:
          this.data_final_previsto_periodo + "" + horarioEnvio[1],
        valor_diaria: this.valor_diaria,
        km_inicial: this.km_inicial,
        data_final_realizado_periodo: null,
        // km_final: null,
        ativa: true,
      };

      if (this.isEditing) {
        locacaoService
          .update(this.idSelecionado, body)
          .then(() => {
            this.dialog = false;
            this.snackbar = true;
            this.color = "green";
            this.mensagem = "Locação atualizada com sucesso!";
            this.loadLocacoes();
          })
          .catch((error) => {
            this.snackbar = true;
            this.color = "red";
            Object.keys(error.response.data.errors).forEach((field) => {
              this.mensagem = error.response.data.errors[field][0];
            });
          });
      } else {
        locacaoService
          .create(body)
          .then(() => {
            this.dialog = false;
            this.isEditing = false;
            this.snackbar = true;
            this.color = "green";
            this.mensagem = "Locação criada com sucesso!";
            this.loadLocacoes();
          })
          .catch((error) => {
            this.snackbar = true;
            this.color = "red";
            if (error.response.status == 500) {
              this.snackbar = true;
              this.mensagem = error.response.data.message;
            } else {
              Object.keys(error.response.data.errors).forEach((field) => {
                this.mensagem = error.response.data.errors[field][0];
              });
            }
          });
      }
    },
    deleteLocacao() {
      locacaoService
        .delete(this.item.id)
        .then(() => {
          this.dialogDelete = false;
          this.color = "green";
          this.mensagem = "Locação deletada com sucesso!";
          this.loadLocacoes();
        })
        .catch((error) => {
          this.snackbar = true;
          Object.keys(error.response.data.errors).forEach((field) => {
            this.mensagem = error.response.data.errors[field][0];
          });
        });
    },
    finalizarLocacao() {
      let body = {
        data_final_realizado_periodo: this.data_final_realizado_periodo,
        km_final: this.km_final,
        ativa: false,
      };

      locacaoService
        .update(this.idSelecionado, body)
        .then(() => {
          this.dialogFinalizar = false;
          this.snackbar = true;
          this.color = "green";
          this.mensagem = "Locação finalizada com sucesso!";
          this.loadLocacoes();
        })
        .catch((error) => {
          this.snackbar = true;
          this.color = "red";
          Object.keys(error.response.data.errors).forEach((field) => {
            this.mensagem = error.response.data.errors[field][0];
          });
        });
    },
    disableItem(item) {
      if (item.disponivel == 1) {
        return false;
      } else return true;
    },
    getNomeCarro(id) {
      const carro = this.carros.find((c) => c.id === id);
      return carro ? carro.placa : id;
    },
    getNomeCliente(id) {
      const cliente = this.clientes.find((c) => c.id === id);
      return cliente ? cliente.nome : id;
    },
    getStatus(ativa) {
      if (ativa == true) {
        return "Ativa";
      } else {
        return "Finalizada";
      }
    },
    formatarData(data) {
      if (!data) return "";
      const [ano, mes, dia] = data.substr(0, 10).split("-");
      return `${dia}/${mes}/${ano}`;
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
    async loadLocacoesPaginado() {
      const { data } = await locacaoService.getPaginate(
        this.options.page,
        this.options.itemsPerPage
      );
      this.itens = data.data;
      this.totalItens = data.total;
    },
  },

  mounted() {
    this.loadLocacoes();
    this.loadCarros();
    this.loadClientes();
  },
};
</script>
