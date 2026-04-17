<template>
  <v-row justify="center">
    <v-dialog v-model="internalValueDelete" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Deletar Registro? </v-card-title>
        <v-card-text>Deseja deletar o registro?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text @click="internalValueDelete = false">
            Cancelar
          </v-btn>
          <v-btn color="red darken-1" text @click="$emit('delete')">
            Deletar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "ModalDeleteComponent",
  props: {
    value: Boolean,
    buttonText: String,
    items: Array,
  },
  computed: {
    internalValueDelete: {
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
