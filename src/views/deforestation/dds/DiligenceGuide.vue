<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-8">
        <div>
          <h2 class="text-capitalize">{{ $t("diligenceGuide.guide") }}</h2>
        </div>
      </div>
      <v-card elevation="0" class="pt-6 pb-16 px-6">
        <v-row justify="left" style="margin-top:10px;">
          <v-col
            cols="3"
            class="cursor-pointer"
            @click="redirectTo('PdfManual')"
          >
            <v-card
              elevation="2"
              class="mx-auto pb-5 card-content inner-card card-shadow"
              flat
            >
              <v-img
                max-height="90"
                max-width="95"
                :src="isKenyaClient ? '/img/ke/pdff.svg' : '/img/pdf.png'"
                class="img-center mb-5"
              ></v-img>
              <span class="card-title"> {{ $t('diligenceGuide.downloadPdfManual') }}</span>
            </v-card>
          </v-col>
          <v-col
            cols="3"
            class="cursor-pointer"
            @click="redirectTo('DemoVideo')"
          >
            <v-card
              elevation="2"
              class="mx-auto pb-5 card-content inner-card card-shadow"
              flat
            >
              <v-img
                max-height="80"
                max-width="95"
                :src="isKenyaClient ? '/img/ke/video.svg' : '/img/video.png'"
                class="img-center mb-5"
              ></v-img>
              <span class="card-title">{{ $t('diligenceGuide.watchDemoVideo')}}</span>
            </v-card>
          </v-col>
          <v-col
            cols="3"
            class="cursor-pointer"
            @click="redirectTo('WebManual')"
          >
            <v-card
              elevation="2"
              class="mx-auto pb-5 card-content inner-card card-shadow"
              flat
            >
              <v-img
                max-height="90"
                max-width="95"
                :src="isKenyaClient ? '/img/ke/info.svg' : '/img/info.png'"
                class="img-center mb-5"
              ></v-img>
              <span class="card-title">{{ $t('diligenceGuide.viewManualOnWeb')}}</span>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { isKenyaClient } from '@/utils';

export default {
  computed: {
    isKenyaClient() {
      return isKenyaClient();
    },
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "eudrDashboard" },
        },
      ],
    };
  },
  methods: {
    redirectTo(type) {
      console.log(type);
    },
  },
};
</script>

<style scoped>

/* Center the text inside the card */
.card-content {
  text-align: left;
}

.inner-card {
  width: 360px;
  height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 10%;
}

.img-center {
  display: block;
  margin: 0 auto;
}

</style>
