import Vue from "vue";
import VueRouter from "vue-router";
import LoginComponent from "@/components/LoginComponent.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
    name: "login",
    component: LoginComponent,
  },
  {
    path: "/login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/locacoes",
    name: "locacoes",
    component: () => import("@/views/LocacoesView.vue"),
    meta: { requiresAuth: true, title: "Locações" },
  },
  {
    path: "/clientes",
    name: "clientes",
    component: () => import("@/views/ClientesView.vue"),
    meta: { requiresAuth: true, title: "Clientes" },
  },
  {
    path: "/carros",
    name: "carros",
    component: () => import("@/views/CarrosView.vue"),
    meta: { requiresAuth: true, title: "Carros" },
  },
  {
    path: "/marcas",
    name: "marcas",
    component: () => import("@/views/MarcasView.vue"),
    meta: { requiresAuth: true, title: "Marcas" },
  },
  {
    path: "/modelos",
    name: "modelos",
    component: () => import("@/views/ModelosView.vue"),
    meta: { requiresAuth: true, title: "Modelos" },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!localStorage.getItem("token")) {
      next({
        name: "login",
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
