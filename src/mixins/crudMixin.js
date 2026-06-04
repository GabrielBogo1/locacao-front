export default {
  data() {
    return {
      itens: [],
      item: {},
      totalItens: 0,
      loading: false,
      service: "",
    };
  },

  methods: {
    async listar() {
      try {
        const { data } = await this.service.getPaginate(
          this.tabela.options.page,
          this.tabela.options.itemsPerPage,
          this.tabela.search
        );
        this.apiData.itens = data.data;
        this.tabela.totalItens = data.total;
      } catch (e) {
        this.notificar("Erro ao carregar dados!", "error");
      }
    },

    async save() {
      try {
        await this.service.create(this.requestPayload);
        this.notificar("Registro salvo com sucesso!", "success");
        this.ui.dialogs.dialogNovo = false;
        this.listar();
      } catch (error) {
        this.ui.dialogs.dialogNovo = true;
        this.handleErrors(error);
      }
    },

    async update() {
      try {
        await this.service.update(
          this.apiData.idSelecionado,
          this.requestPayload
        );
        this.notificar("Registro atualizado com sucesso", "success");
        this.ui.dialogs.dialogNovo = false;
        this.listar();
      } catch (error) {
        this.handleErrors(error);
      }
    },

    async destroy() {
      try {
        await this.service.delete(this.apiData.item.id);
        this.notificar("Registro deletado com sucesso", "success");
        this.ui.dialogs.dialogDelete = false;
        this.listar();
      } catch (error) {
        this.handleErrors(error);
      }
    },

    notificar(mensagem, color) {
      this.ui.mensagem = mensagem;
      this.ui.color = color;
      this.ui.snackbar = true;
    },

    handleErrors(error) {
      if (error.response.status == 500) {
        this.ui.mensagem = error.response.data.message;
        this.notificar(this.ui.mensagem, "error");
      } else {
        Object.keys(error.response.data.errors).forEach((field) => {
          this.ui.mensagem = error.response.data.errors[field][0];
        });
        this.notificar(this.ui.mensagem, "error");
      }
    },
  },
};
