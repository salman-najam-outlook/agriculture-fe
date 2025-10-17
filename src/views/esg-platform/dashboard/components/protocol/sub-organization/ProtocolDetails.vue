<template>
  <div v-if="protocol">
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <div class="px-4">
      <div class="d-flex flex-wrap align-center justify-space-between">
        <h1 class="text-h5 text-uppercase font-weight-bold">{{ pageTitle }}</h1>
        <v-btn color="primary" @click="$router.go(-1)">{{ $t('back') }}</v-btn>
      </div>

      <!-- Protocol Information Section -->
      <protocol-information
        :show-actions="showActions"
        :protocol="protocol"
        :sub-organization-id="subOrganizationId"
        @status-updated="fetchProtocolDetail"
      />
      <!-- Protocol Information Section -->

      <router-view :protocol="protocol"></router-view>
    </div>
  </div>
</template>

<script>
import EsgService from '@/_services/EsgService';
import ProtocolInformation from './ProtocolInformation.vue';
import LoadingMixin from "@/mixins/LoadingMixin";
export default {
  components: {
    ProtocolInformation,
  },
  mixins: [LoadingMixin],
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t('esgPlatform.common.esgCompliance'),
          disabled: false,
          to: { name: 'eudrDashboard' },
        },
        {
          text: this.$t('dashboard'),
          link: true,
          exact: true,
          disabled: true,
        },
      ],
      protocolId: this.$route.params.id,
      subOrganizationId: this.$route.params.subOrganizationId,
      protocol: null,
    };
  },

  async created() {
    this.startLoading();
    await this.fetchProtocolDetail();
    this.stopLoading();
  },

  computed: {
    pageTitle() {
      const routeName = this.$route.name;
      const user = JSON.parse(localStorage.getItem('user'));
      
      switch (routeName) {
        case 'ProtocolRecommendationsOfSubOrganization':
          return this.$t('esgPlatform.recommendations');
        default:
          return user?.user_organization?.name || 'Unknown Organization';
      }
    },

    showActions() {
      return this.$route.name === 'ProtocolDetailsOfSubOrganization';
    },
  },

  methods: {
    async fetchProtocolDetail() {
      this.startLoading();
      const response = await EsgService.getEsgProgressForRespondent('sub-organization', this.$route.params.subOrganizationId, this.$route.params.id);
      this.protocol = response.data;
      this.stopLoading();
    }
  }
};
</script>
