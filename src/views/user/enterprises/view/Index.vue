<template>
  <div>
    <breadcrumb :items="breadcrumbs" class="pa-0 mb-4"></breadcrumb>
  <v-container fluid class="pa-4">

    <div class="d-flex align-center mb-4">
      <div class="d-flex align-center">
        <img :src="enterprise.logo ?? '/img/logo2.png'" :alt="enterprise.name" class="mr-2" height="32" />
        <h1 class="text-h6 font-weight-bold">{{ enterprise.name }}</h1>
      </div>
      
      <v-spacer></v-spacer>
      
      <v-btn
        outlined
        color="#89C98C"
        class="text-none mr-2 back-btn"
        height="36"
        @onclick="handleBack"
      >
        <span class="text-caption" @click="handleBack">BACK</span>
      </v-btn>

      <span v-for="(button, index) in navigationButtons" :key="index">
      <v-btn @click="queueActivation" v-if="enterprise.id && enterprise.status != `active`" color="#89C98C" class="text-none mr-2 nav-btn white--text" elevation="0" height="36">
            <span class="text-caption">{{ button }}</span>
          </v-btn>
    </span>

  
    </div>

    <ProfileInfo :enterprise="enterprise" />
    <!-- <Statistics />
    <BillingSummary /> -->
    <EnterpriseUsers :enterpriseId="enterprise.id" />
  </v-container>
  </div>
</template>

<script>
import ProfileInfo from '../components/ProfileInfo.vue'
// import Statistics from '../components/Statistics.vue'
// import BillingSummary from '../components/BillingSummary.vue'
import EnterpriseUsers from '../components/EnterpriseUsers.vue'
import UserService from '../../../../_services/UserService'
import loadingMixin from "@/mixins/LoadingMixin";
export default {
  name: 'EnterpriseViewPage',
  components: {
    ProfileInfo,
    // Statistics,
    // BillingSummary,
    EnterpriseUsers
  },
  mixins: [loadingMixin],
  created() {
    this.enterprise.id = this.$route.params.id;
  },
  async mounted() {
    this.startLoading();
    if (!this.enterprise.id) {
      this.$router.push('/enterprises');
    }

    const { data, success } = await UserService.getEnterprise(this.enterprise.id);

    if (!success) {
      this.$notify({
        title: "Failed to load enterprises",
        type: "error",
      });
      return;
    }

    this.enterprise = data;
    this.breadcrumbs.push({
      text: this.enterprise?.name,
      disabled: true,
    })
    this.stopLoading();
  },
  methods:{
    handleBack(){
      this.$router.go(-1);
    },
    async queueActivation() {
          this.startLoading();
      this.dialog = true;
      const status =  'active'
      this.queueAction =  'Creating'

      const { success } = await UserService.queueEnterpriseActivations({
        enterprises: [this.enterprise.id],
        status
      });

      if (!success) {
        this.$notify({
          title: `Failed to activate enterprises`,
          type: "error",
        });
        this.dialog = false;
        return;
      }

      this.dialog = false;
      this.selected = [];
      this.$notify({
        title: "Environment creation scheduled",
        type: "success",
      });
         this.stopLoading();
    },
  },
  data: () => ({
    breadcrumbs: [
      {
        text: 'Dashboard',
        disabled: false,
        to: '/dashboard',
      },
      {
        text: 'Enterprises',
        disabled: false,
        to: '/enterprises',
      }
    ],
    enterprise: {
      id: null,
      logo: '',
      name: 'N/A',
      country: 'N/A',
      access: []
    },
    navigationButtons: [
      'CREATE ADMIN ENVIRONMENT',
      // 'UPDATE PLAN',
      // 'EXTRA USAGE SUMMARY',
      // 'PAYMENTS',
      // 'ENTERPRISE SETTINGS'
    ]
  })
}
</script>

<style scoped>
.v-btn {
  text-transform: none !important;
  letter-spacing: normal !important;
  font-weight: normal !important;
  border-radius: 4px !important;
  padding: 0 16px !important;
}

.nav-btn {
  background-color:#04bc74 !important;
  color: white !important;
}

.nav-btn:hover {
  background-color: #04bc74 !important;
}

.back-btn {
  background-color: transparent !important;
  border-color:#04bc74 !important;
  color: #04bc74 !important;
}

.back-btn:hover {
  background-color: rgba(137, 201, 140, 0.04) !important;
}

.text-caption {
  font-size: 13px !important;
}

/* Override Vuetify's default button styles */
.v-btn::before {
  background-color: transparent !important;
}
</style>