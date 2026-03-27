<template>
  <v-app id="inspire">
    <v-navigation-drawer dark v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> CarroMais </v-list-item-title>
          <v-list-item-subtitle> Locações </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="divider-style"></v-divider>
      <v-list-item v-for="item in items" :key="item.title" link>
        <v-list-item-icon class="py-5">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-conent>
          <v-list-item-title class="subtitle-1">{{
            item.title
          }}</v-list-item-title>
        </v-list-item-conent>
      </v-list-item>
      <v-divider class="divider-style"></v-divider>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>fa-solid fa-right-from-bracket</v-icon>
        </v-list-item-icon>
        <v-list-item-conent>
          <v-list-item-title class="subtitle-1">Sair</v-list-item-title>
        </v-list-item-conent>
      </v-list-item>
    </v-navigation-drawer>

    <v-app-bar dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Locações</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <div>
        <v-text-field placeholder="Pesquisar"></v-text-field>
      </div>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "LocacoesComponent",
  data() {
    return {
      items: [
        { title: "Locações", icon: "fa fa-tachometer-alt" },
        { title: "Clientes", icon: "fa-regular fa-user" },
        { title: "Carros", icon: "fa-solid fa-car" },
        { title: "Marcas", icon: "fa-solid fa-car-side" },
        { title: "Modelos", icon: "fa-solid fa-car-on" },
      ],
      right: null,
      drawer: null,
    };
  },
};
</script>

<style scoped>
.divider-style {
  border-width: 2px;
  border-color: white;
}
</style>
