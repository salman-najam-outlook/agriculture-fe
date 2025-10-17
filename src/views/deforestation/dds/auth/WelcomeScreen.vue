<template>
  <div>
    <!-- <breadcrumb :items="breadcrumbs"></breadcrumb> -->
    <v-container fluid class="welcome-screen">
      <div class="content-wrapper">
        <div class="logo-image"><img src="/img/dimitra-logo.png" style="width: 220px;"/></div>

        <v-card
          class="mx-auto main-card card-content card-shadow"
          flat
          style="background-color: #F4F8F7;"
        >
          <p class="main-card-title">{{ $t('welcomeScreenDiligenceGuide.title') }}</p>
          <p class="main-card-sub-title">
            {{ $t('welcomeScreenDiligenceGuide.description') }}
          </p>
          <v-row justify="center">
            <v-col
              cols="4"
              class="cursor-pointer"
              @click="redirectTo('PdfManual')"
            >
              <v-card
                elevation="2"
                class="mx-auto card-content inner-card card-shadow"
                flat
              >
                <v-img
                  max-height="90"
                  max-width="95"
                  src="/img/pdf.png"
                  class="img-center"
                ></v-img>
                <span class="card-title">{{$t("diligenceGuide.downloadPdfManual")}}</span>
              </v-card>
            </v-col>
            <v-col
              cols="4"
              class="cursor-pointer"
              @click="redirectTo('DemoVideo')"
            >
              <v-card
                elevation="2"
                class="mx-auto card-content inner-card card-shadow"
                flat
              >
                <v-img
                  max-height="80"
                  max-width="95"
                  src="/img/video.png"
                  class="img-center"
                ></v-img>
                <span class="card-title">{{$t("diligenceGuide.watchDemoVideo")}}</span>
              </v-card>
            </v-col>
            <v-col
              cols="4"
              class="cursor-pointer"
              @click="redirectTo('WebManual')"
            >
              <v-card
                elevation="2"
                class="mx-auto card-content inner-card card-shadow"
                flat
              >
                <v-img
                  max-height="90"
                  max-width="95"
                  src="/img/info.png"
                  class="img-center"
                ></v-img>
                <span class="card-title">{{$t("diligenceGuide.viewManualOnWeb")}}</span>
              </v-card>
            </v-col>
          </v-row>

          <v-btn
            color="primary"
            @click="redirectToDashboard"
            class="action-button py-6"
            >{{ $t("welcomeScreenDiligenceGuide.continueToTheDueDiligenceSystem") }}</v-btn
          >
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
export default {
  created() {},
  components: {},
  watch: {},
  data() {
    return {};
  },
  methods: {
    redirectTo(type) {
      console.log(type);
    },
    redirectToDashboard() {
      this.startLoading();
      setTimeout(() => {
        this.stopLoading();
        this.$router.push({ name: "dueDiligenceDashboard" });
      }, 1000);
    },
  },
  mixins: [loadingMixin],
};
</script>

<style lang="scss" scoped>
.welcome-screen {
  background-image: url("/img/welcome.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  margin: 0;
  padding: 0;
  height: 100vh;
  position: relative;
}

.welcome-screen .content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
}

.logo-image {
  margin-bottom: 20px;
}

/* Center the text inside the card */
.card-content {
  text-align: center;
}

.inner-card {
  width: 360px;
  height: 275px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center; /* Ensure text is centered */
}

.img-center {
  display: block;
  margin: 0 auto;
}

/* Add border-radius and box-shadow to cards */
.card-shadow {
  border-radius: 15px; /* Adjust the radius as needed */
  box-shadow: 0 14px 8px rgba(0, 0, 0, 0.1); /* Adjust the shadow as needed */
}

.card-title {
  font-weight: 600;
  font-size: 22px;
  color: #373535;
  margin-top: 10px; /* Add some space between the image and title */
}

.main-card {
  width: 1200px;
  padding: 80px 120px 60px 60px;

  @media screen and (max-width: 1380px) {
    max-width: 1200px;
    padding: 62px 60px 27px 60px;
  }

  @media screen and (max-width: 1240px) {
    max-width: 991px;
    padding: 62px 60px 27px 60px;
  }
}

.main-card-title {
  font-weight: 700;
  font-size: 32px;
  color: #1e1e1e;
  margin-top: -50px;
  margin-bottom: 25px;
}

.main-card-sub-title {
  font-weight: 600;
  font-size: 16px;
  color: #353535;
}

.action-button {
  margin-top: 20px;
  font-weight: 700;
  font-size: 22px;
  color: #ffffff;
  width: 500px;
  text-transform: none; /* Override default uppercase transformation */
  height: 45px;
}
</style>
