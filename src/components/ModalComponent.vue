<template>
  <v-row justify="center">
    <v-dialog v-model="internalValue" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Cadastro de {{ $route.meta.title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <slot name="conteudoCliente"></slot>
                <slot name="conteudoCarro"></slot>
                <slot name="conteudoMarcas"></slot>
                <slot name="conteudoModelos"></slot>
                <slot name="conteudoLocacoes"></slot>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black darken-1" text @click="internalValue = false">
            Fechar
          </v-btn>
          <v-btn
            color="yellow darken-1"
            text
            @click="$emit('update')"
            v-if="isEditing"
          >
            Editar
          </v-btn>
          <v-btn color="green darken-1" text @click="$emit('save')" v-else>
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "ModalComponent",
  props: {
    value: Boolean,
    buttonText: String,
    isEditing: Boolean,
  },
  methods: {
    resetForm() {
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    },
  },
  computed: {
    internalValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>
