<template>
  <v-app>
    <v-main>
      <v-container
        fluid
        fill-height
        class="d-flex align-center justify-center"
        style="background-color: #0f0f0f"
      >
        <div class="text-center">
          <img
            src="../assets/logolocacao.png"
            alt="logo-carromais"
            height="auto"
            width="550px"
            class="text-center"
            style="margin-top: 10px"
          />
        </div>
        <div class="d-flex flex-column position-relative">
          <transition name="fade">
            <v-alert
              dense
              outlined
              type="error"
              class="alert-overlay"
              v-if="this.mensagem != ''"
              >{{ this.mensagem }}
            </v-alert>
          </transition>
          <v-card
            width="450"
            color="#1e1e1e"
            class="pa-6 py-12"
            elevation="2"
            style="border-radius: 12px"
          >
            <h4 style="color: white; margin-bottom: 20px">Faça seu login</h4>
            <form @submit.prevent="login()" method="POST">
              <!-- Email -->
              <div class="mb-4">
                <span class="label">Email</span>
                <v-text-field
                  dark
                  outlined
                  dense
                  class="mt-1"
                  :rules="[rules.required, rules.email]"
                  v-model="email"
                />
              </div>

              <!-- Password -->
              <div class="mb-4">
                <span class="label">Senha</span>
                <v-text-field
                  dark
                  outlined
                  dense
                  class="mt-1"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                  :rules="[rules.required]"
                  v-model="password"
                />
              </div>

              <!-- Remember + Forgot -->
              <div class="d-flex align-center justify-space-between mb-4">
                <v-checkbox
                  dark
                  dense
                  hide-details
                  label="Lembre-se de mim"
                  class="ma-0 pa-0"
                />
                <a href="#" class="forgot-link">Esqueceu a senha?</a>
              </div>

              <!-- Button -->
              <v-btn
                block
                color="primary"
                height="45"
                style="border-radius: 8px"
                type="submit"
                :loading="isLoading"
                :disabled="isLoading"
                class="btn-login"
              >
                Login
              </v-btn>
            </form>
          </v-card>
          <v-snackbar
            v-model="snackbar"
            :timeout="4000"
            bottom
            right
            elevation="6"
            rounded="lg"
            color="error"
          >
            <div class="d-flex align-center">
              <v-icon left>mdi-alert-circle</v-icon>
              {{ this.mensagem }}
            </div>
          </v-snackbar>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginComponent",
  data() {
    return {
      show1: false,
      email: "",
      password: "",
      loader: null,
      isLoading: false,
      baseUrl: "http://localhost:8000/api/auth/login",
      snackbar: false,
      mensagem: "",
      rules: {
        required: (value) => !!value || "Campo obrigatório.",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "E-mail inválido.";
        },
      },
    };
  },
  methods: {
    login() {
      this.isLoading = true;

      let body = {
        email: this.email,
        password: this.password,
      };

      axios
        .post(this.baseUrl, body)
        .then((response) => {
          localStorage.setItem("token", response.data.access_token);
          if (!localStorage.getItem("token")) {
            this.$router.push("/");
          } else {
            this.$router.push("/locacoes");
            this.isLoggedIn = true;
            this.snackbar = true;
            this.mensagem = "Login realizado com sucesso!";
          }
        })
        .catch((error) => {
          this.isLoading = true;
          this.mensagem = error.response.data.Erro;
          if (error.response.status == 422) {
            this.mensagem = "Verifique os campos digitados!";
          }
          this.snackbar = true;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.label {
  color: #b3b3b3;
  font-size: 14px;
  text-align: left;
}

.forgot-link {
  color: #42a5f5;
  font-size: 14px;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.position-relative {
  position: relative;
}

.alert-overlay {
  position: absolute;
  top: -60px;
  left: 0;
  width: 100%;
  z-index: 10;
  opacity: 0.95;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.btn-login.v-btn--loading {
  color: white !important;
  opacity: 1 !important;
}

::v-deep input:-webkit-autofill,
::v-deep input:-webkit-autofill:hover,
::v-deep input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px #1e1e1e inset !important;
  -webkit-text-fill-color: white !important;
}

::v-deep .v-text-field input {
  font-size: 16px;
}
</style>
