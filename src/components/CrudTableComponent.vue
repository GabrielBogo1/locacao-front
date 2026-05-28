<template>
  <v-container class="mt-8">
    <v-row align="center" justify="space-between" class="d-flex justify-end">
      <v-col cols="12" md="3">
        <v-btn color="success" dark @click="$emit('abrir-modal')">
          {{ buttonText }}
        </v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :label="searchLabel"
          v-model="search"
          dense
          outlined
          append-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :items="itens"
      :search="search"
      :server-items-length="totalItens"
      :options.sync="localOptions"
      @update:options="$emit('update:options', $event)"
    >
      <template
        v-for="header in headers"
        v-slot:[`item.${header.value}`]="{ item }"
      >
        <slot :name="`item.${header.value}`" :item="item">
          {{ item[header.value] }}
        </slot>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          icon
          @click="$emit('edit', item)"
          :disabled="!item.ativa && disableActions"
        >
          <v-icon color="yellow">mdi-pencil</v-icon>
        </v-btn>

        <v-btn
          icon
          @click="$emit('abrir-modal-delete', item)"
          :disabled="!item.ativa && disableActions"
        >
          <v-icon color="red">mdi-delete</v-icon>
        </v-btn>
        <v-btn
          v-if="mostraBotaoFinalizar"
          icon
          :disabled="!item.ativa"
          @click="$emit('abrir-modal-finalizar', item)"
        >
          <v-icon color="green">mdi-check-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      localOptions: { ...this.options },
    };
  },
  props: {
    headers: Array,
    itens: Array,
    marcas: Array,
    loading: Boolean,
    totalItens: {
      type: Number,
      default: 0,
    },
    options: {
      type: Object,
      default: () => ({ page: 1, itemsPerPage: 10 }),
    },
    item: Array,
    buttonText: {
      type: String,
      default: "Novo cadastro",
    },
    mostraBotaoFinalizar: {
      type: Boolean,
      default: false,
    },
    disableBotaoFinalizar: {
      type: Boolean,
      default: false,
    },
    disableActions: {
      type: Boolean,
      default: false,
    },
    searchLabel: {
      type: String,
      default: "Pesquisar",
    },
  },
  watch: {
    options(val) {
      this.localOptions = { ...val };
    },
  },
};
</script>
