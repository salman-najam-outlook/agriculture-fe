
<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div v-if="isImportResponse">
        <BlendsBulkImportDetails :responseImport="responseImport" />
      </div>
      <v-card v-else class="pa-4" outlined>
        <div class=" py-3">
          <v-card elevation="0">
            <v-tabs class="tabs-pill" v-model="tab">
              <v-tab class="text-capitalize" @click="type = 'import'">{{ $t('oma.import') }}</v-tab>
              <v-tab class="text-capitalize" @click="type = 'history'">{{ $t('oma.history') }}</v-tab>
            </v-tabs>
            <v-divider></v-divider>
          </v-card>
        </div>
        <v-tabs-items v-model="tab">
          <v-tab-item key="import">
            <BlendsBulkImportTab @importSuccess="importSuccessCallback" />
          </v-tab-item>
          <v-tab-item key="history">
            <BlendsImportHistory />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import generalMixin from "@/mixins/GeneralMixin";
import loading from "@/mixins/LoadingMixin";
import BlendsImportHistory from "./components/BlendsImportHistory.vue";
import BlendsBulkImportTab from "./components/BlendsBulkImportTab.vue";
import BlendsBulkImportDetails from "./components/BlendsBulkImportDetails.vue";
export default {
  async mounted() {
    document.title = this.$t("dashboard");
  },
  components: {
    BlendsImportHistory,
    BlendsBulkImportTab,
    BlendsBulkImportDetails,
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("blends.eudrDueDiligence"),
          disabled: false,
          exact: true,
        },
        {
          text: this.$t("blends.blends"),
          disabled: false,
          to: { name: "Blends" },
          exact: true,
        },
        {
          text: this.$t("blends.blendSettings.blendSettings"),
          disabled: false,
          to: { name: "blendSettings" },
          exact: true,
        },
        {
          text: this.$t("blends.blendSettings.importBlends"),
          disabled: true,
          href: "breadcrumbs_link_2",
        },
      ],
      tab: 'import',
      responseImport: null,
      isImportResponse: false,
    };
  },
  methods: {
    importSuccessCallback(response) {
      this.responseImport = response;
      this.isImportResponse = !!response?.data;
    },
    redirectListPage() {
      this.$router.push({ name: 'blendSettings' })
    },
    createBlendSettings() {
      this.$router.push({ name: 'createBlendSettings' })      
    },
  },
  mixins: [loading, generalMixin],
};
</script>

<style lang="scss" scoped>
</style>
