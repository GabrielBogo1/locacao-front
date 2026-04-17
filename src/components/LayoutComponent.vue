<template>
  <v-app id="inspire">
    <v-navigation-drawer dark v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> CarroMais </v-list-item-title>
          <v-list-item-subtitle> {{ $route.meta.title }} </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="divider-style"></v-divider>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.to"
        link
        router
        exact
      >
        <v-list-item-icon class="py-5">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="subtitle-1">{{
            item.title
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="divider-style"></v-divider>
      <v-list-item link @click="logout">
        <v-list-item-icon>
          <v-icon>fa-solid fa-right-from-bracket</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="subtitle-1">Sair</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-app-bar dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
    </v-app-bar>
    <slot></slot>
  </v-app>
</template>

<script>
import auth from "@/services/auth";

export default {
  name: "LayoutComponent",
  props: {},
  data() {
    return {
      items: [
        { title: "Locações", icon: "fa fa-tachometer-alt", to: "/locacoes" },
        { title: "Clientes", icon: "fa-regular fa-user", to: "/clientes" },
        { title: "Carros", icon: "fa-solid fa-car", to: "/carros" },
        { title: "Marcas", icon: "fa-solid fa-car-side", to: "/marcas" },
        { title: "Modelos", icon: "fa-solid fa-car-on", to: "/modelos" },
      ],
      right: null,
      drawer: null,
    };
  },
  methods: {
    logout() {
      auth.logout();
    },
  },
};
</script>

<style scoped>
.divider-style {
  border-width: 2px;
  border-color: white;
}

.v-list-item--active {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
