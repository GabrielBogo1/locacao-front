<template>
  <v-row justify="center">
    <v-dialog v-model="internalValueFinalizar" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Finalização de locação</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <slot name="conteudoLocacoesFinalizar"></slot>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="black darken-1"
            text
            @click="internalValueFinalizar = false"
          >
            Fechar
          </v-btn>
          <v-btn color="green darken-1" text @click="$emit('finalizar')">
            Finalizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "ModalFinalizarComponent",
  props: {
    value: Boolean,
    buttonText: String,
    items: Array,
  },
  methods: {
    resetForm() {
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    },
  },
  computed: {
    internalValueFinalizar: {
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
