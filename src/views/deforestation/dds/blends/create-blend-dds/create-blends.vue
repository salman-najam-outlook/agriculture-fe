<template>
  <div class="mx-4">
    <breadcrumb :items="breadcrumbs"></breadcrumb>

    <!-- main component -->
    <GenerateReports :blendId="blendId" />

  </div>
</template>

<script>
import GenerateReports from './components/Generate-Reportss.vue';


export default {
  async mounted() {
    document.title = this.$t("dashboard");
    if(this.$route.params.id) {
      this.blendId = this.$route.params.id;
    }
  },
  components: {
    GenerateReports,
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("blends.createBlends.eudrDueDiligence"),
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
          text: this.$t("blends.createBlendDds"),
          disabled: true,
          to: "/",
        },
      ],
      blendId: null,
    };
  },
  methods: {
    redirectListPage() {
      this.$router.push({
        name: "Blends",
      });
    },
    rejectBlends() {
      // Add implementation
    },
    saveAndContinueLater() {
      // Add implementation
    },
    triggerSubmit() {
      // Add implementation
    }
  },
};
</script>

<style lang="scss" scoped></style>