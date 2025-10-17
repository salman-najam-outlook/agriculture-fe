<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid class="px-6 py-0">
      <div class="d-flex">
        <h2>{{ $t('dashboard') }}</h2>
        <v-spacer></v-spacer>
      </div>

      <v-card elevation="0" class="px-5 mt-7">
        <v-card-text>
          <v-row
            style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;"
          >
        
            <v-col cols="3">
              <v-card
                style="padding: 70px;width: 300px; height:230px"
                class="mx-auto rounded-lg d-flex flex-column align-center justify-center"
              >
                <v-img
                  max-height="100"
                  max-width="95"
                  src="/img/list.png"
                  class="img-center mb-3"
                ></v-img>
                <span class="card-title text-center"
                  >{{  $t('dueDiligence.dueDiligenceReports') }}</span
                >
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card
                style="padding: 70px;width: 300px; height:230px"
                class="mx-auto rounded-lg d-flex flex-column align-center justify-center"
              >
                <v-img
                  max-height="100"
                  max-width="95"
                  src="/img/farm.svg"
                  class="img-center mb-3"
                ></v-img>
                <span class="card-title text-center"
                  >{{  $t("dueDiligence.myFarms") }}</span
                >
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card
                style="padding: 70px;width: 300px; height:230px"
                class="mx-auto rounded-lg d-flex flex-column align-center justify-center"
              >
                <v-img
                  max-height="100"
                  max-width="95"
                  src="/img/list.png"
                  class="img-center mb-3"
                ></v-img>
                <span class="card-title text-center">{{  $t('dueDiligence.listOfProducers') }}</span>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import Breadcrumb from "@/components/core/Breadcrumb";

export default {
  components: {
    breadcrumb: Breadcrumb,
  },

  computed: {},

  mounted() {},

  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
      ],
    };
  },
  methods: {},

  mixins: [],
};
</script>

<style scoped>

.card-title {
  font-weight: 600;
  font-size: 18px;
  color: #1e1e1e;
}

.card-sub-title {
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 16px;
  color: #787878;
}

.heading-title {
  font-weight: 600;
  font-size: 22px;
  color: #1e1e1e;
}

.card-content {
  text-align: center;
}


</style>
