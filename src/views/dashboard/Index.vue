<template>
  <v-app>
    <notifications position="bottom right" animation-type="css" />

    <sidebar></sidebar>

    <app-bar></app-bar>

    <v-main>
      <router-view>
      </router-view>
      <v-spacer></v-spacer>
      <ptsi-footer></ptsi-footer>
    </v-main>
  </v-app>
</template>

<script>
import sidebar from "@/components/core/Sidebar";
import AppBar from "@/components/core/AppBar";
import PtsiFooter from "./components/PtsiFooter.vue";
import store from "../../store";
export default {
  components: {
    sidebar: sidebar,
    "app-bar": AppBar,
    "ptsi-footer": PtsiFooter,
  },
  computed:{
    isIndonesianClient() {
      // const currentUser =  localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      const currentUser = store.getters.getUser || null;
      // const roles = currentUser?.user_role_assoc?.map(role => role.id) || [];
      const roles = currentUser?.user_role_assoc?.map(role => role.id);
      const indonesiaRoles = ['indonesia_admin', 'dds_exporter', 'dds_ptsi'];
      return roles?.some(role => indonesiaRoles.includes(role));
    }
  }
};
</script>

<style scoped></style>
