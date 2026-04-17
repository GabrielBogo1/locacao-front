import api from "./api";

export default {
  logout() {
    let baseUrl = "http://localhost:8000/api/v1/logout";

    api
      .post(baseUrl)
      .then((response) => {
        console.log(response);
        this.$router.push("/");

        localStorage.clear("token");
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
