<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>

    <v-container fluid class="pa-0">
      <div class="content-wrapper">

        <div class="d-flex align-center mb-6">
          <h2 class="text-h5 font-weight-bold">{{$t('Enterprises.Enterprise')}}</h2>
          <v-spacer></v-spacer>

          <v-btn-toggle
            v-model="viewType"
            mandatory
            class="mr-4 transparent"
          >
            <v-btn 
              small
              text
              value="list"
              class="px-2"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
            <v-btn 
              small
              text
              value="grid"
              class="px-2"
            >
              <v-icon>mdi-grid</v-icon>
            </v-btn>
          </v-btn-toggle>

         
          <v-btn
            color="primary"
            class="text-none"
            elevation="0"
            @click="registerNewEnterprise"
          >
          {{ $t('Enterprises.Resgister_New_Enterprise') }}
            <!-- REGISTER NEW ENTERPRISE -->
          </v-btn>
        </div>

        <v-card elevation="3">
          <ListingEnterprises :type="viewType" />
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script>
import ListingEnterprises from './components/ListingEnterprises.vue'

export default {
  name: 'EnterpriseIndex',
  components: {
    ListingEnterprises
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
          
        },
        {
          text: this.$t('Enterprises.Enterprise'),
          disabled: true,
          to: "/enterprises",
        },
      ],
      viewType: 'list'
    }
  },
  methods: {
    viewMembershipPlans() {
    },
    registerNewEnterprise() {
      this.$router.push('/create-enterprises')
    }
  }
}
</script>

<style scoped>
.content-wrapper {
  width: 98%;
  margin: 0 auto;
  padding: 10px;
}

::v-deep .v-btn-toggle {
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  background-color: white !important;
}

::v-deep .v-btn-toggle .v-btn {
  border: none !important;
  height: 36px !important;
  min-width: 36px !important;
}

::v-deep .v-btn-toggle .v-btn.v-item--active {
  background-color: #E8F5E9 !important;
  color: #2E7D32 !important;
}

::v-deep .v-btn-toggle .v-btn:not(.v-item--active) {
  color: #757575 !important;
}
</style>