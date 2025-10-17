<template>
  <div class="top-card-container">
    <v-row class="d-flex justify-space-between align-start" dense>
      <div class="d-flex align-center">
        <div class="text-h5 font-weight-bold mr-4">
          {{ $t('marketplace.dashboard.topChart') }}
        </div>
        <v-btn-toggle v-model="toggle_exclusive" dense color="primary" no-caps>
          <v-btn class="time-btn" value="today">
            {{ $t('marketplace.dashboard.today') }}
          </v-btn>
          <v-btn class="time-btn" value="week">
            {{ $t('marketplace.dashboard.week') }}
          </v-btn>
          <v-btn class="time-btn" value="month">
            {{ $t('marketplace.dashboard.month') }}
          </v-btn>
          <v-btn class="time-btn" value="year">
            {{ $t('marketplace.dashboard.year') }}
          </v-btn>
          <v-btn value="custom">
            <v-icon color="primary">mdi-calendar-month</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
      <div class="d-flex align-center">
        <v-select :items="items" placeholder="Select Product Category" class="mr-4" outlined color="primary" dense
          style="width: 250px;"></v-select>
        <v-select :items="items" outlined placeholder="Export" dense style="width: 100px;"
          @change="handleExport"></v-select>
      </div>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-card elevation="3" class="mx-auto pa-1" rounded="lg">
          <div class="text-h6 font-weight-medium pt-3 pl-3">
            Top Sellers
          </div>
          <div class="top-charts">
            <div v-for="seller in topCharts.topSellers" :key="seller.id">
              <v-list-item class="mb-3" three-line>
                <v-avatar class="mr-3" size="70">
                  <v-img :src="seller.profile_picture || '/img/marketplace/no_image.png'"></v-img>
                </v-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">{{
                    seller.full_name
                  }}</v-list-item-title>
                  <div class="d-flex align-center">
                    <v-rating class="mr-2" v-model="seller.average_reviews" background-color="primary" color="primary"
                      dense half-increments hover size="14"></v-rating>
                    <span class="text-caption mr-1">
                      {{ seller.average_reviews }}
                    </span>
                    <span class="text-caption mr-2">
                      ({{ seller.total_reviews }})
                    </span>
                  </div>
                  <v-list-item-subtitle>
                    Products: {{ seller.total_products }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Sales: {{ seller.total_products }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>

          </div>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card elevation="3" class="mx-auto pa-1" rounded="lg">
          <div class="text-h6 font-weight-medium pt-3 pl-3">
            Top Products
          </div>
          <div class="top-charts">
            <div v-for="product in topCharts.topProducts" :key="product.id">
              <v-list-item class="mb-3" three-line>
                <v-avatar class="mr-3" size="70">
                  <v-img :src="product.thumbnail_image || '/img/marketplace/no_image.png'"></v-img>
                </v-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">{{
                    product.name
                  }}</v-list-item-title>
                  <div class="d-flex align-center">
                    <v-rating class="mr-2" v-model="product.average_reviews" background-color="primary" color="primary"
                      dense half-increments hover size="14"></v-rating>
                    <span class="text-caption mr-1">
                      {{ product.average_reviews }}
                    </span>
                    <span class="text-caption mr-2">
                      ({{ product.total_reviews }})
                    </span>
                  </div>
                  <v-list-item-subtitle>
                    Price: {{ product.minimum_price || 0 }} to {{ product.maximum_price || 0 }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Seller: {{ product.seller }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>

          </div>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card elevation="3" class="mx-auto pa-1" rounded="lg">
          <div class="text-h6 font-weight-medium pt-3 pl-3">
            Top Buyers
          </div>
          <div class="top-charts">
            <div v-for="buyer in topCharts.topBuyers" :key="buyer.id">
              <v-list-item class="mb-3" three-line>
                <v-avatar class="mr-3" size="70">
                  <v-img :src="buyer.thumbnail_image || '/img/marketplace/no_image.png'"></v-img>
                </v-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">{{
                    buyer.full_name
                  }}</v-list-item-title>
                  <div class="d-flex align-center">
                    <v-rating class="mr-2" v-model="buyer.average_reviews" background-color="primary" color="primary"
                      dense half-increments hover size="14"></v-rating>
                    <span class="text-caption mr-1">
                      {{ buyer.average_reviews }}
                    </span>
                    <span class="text-caption mr-2">
                      ({{ buyer.total_reviews }})
                    </span>
                  </div>
                  <v-list-item-subtitle>
                    Orders: {{ buyer.total_products || 0 }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Orders Values: {{ buyer.total_products || 0 }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>

          </div>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card elevation="3" class="mx-auto pa-1" rounded="lg">
          <div class="text-h6 font-weight-medium pt-3 pl-3">
            Top Countries
          </div>
          <div class="top-charts">
            <div v-for="country in topCharts.topCountries" :key="country.id">
              <v-list-item class="mb-3" three-line>
                <v-avatar class="mr-3" size="70">
                  <v-img :src="getCountryFlagUrl(country.country_code)"></v-img>
                </v-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">{{
                    country.country
                  }}</v-list-item-title>
                  <v-list-item-subtitle>
                    Top Products: {{ country.topProduct || 0 }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Spent: {{ country.totalSpent || 0  }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>

import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";

export default {
  props: {
    topCharts: {
      type: Object,
      required: true
    }
  },
  mounted() {
    console.log(this.topCharts)
  },
  data() {
    return {
      toggle_exclusive: "year",
      items: [
        this.$t("marketplace.dashboard.exportAsPdf"),
        this.$t("marketplace.dashboard.exportAsCsv"),
      ],
    };
  },
  methods: {
    getCountryFlagUrl(countryName) {
      if(countryName){
        return `https://flagcdn.com/w160/${countryName.toLowerCase()}.png`
      }
      return '/img/marketplace/no_image.png';
    },
    handleExport(selectedItem) {
      if (selectedItem === this.$t("marketplace.dashboard.exportAsPdf")) {
        this.exportAsPdf();
      } else if (selectedItem === this.$t("marketplace.dashboard.exportAsCsv")) {
        this.exportAsCsv();
      }
    },
    async exportAsPdf() {
      const token = this.$store.state.auth.token;
      this.startLoading();
      const url = process.env.VUE_APP_MARKETPLACE_API_BASE_URL || "http://localhost:4001/api";
      try {
        await this.downloadSourceFileWithToken(`${url}/admin/pdf`, "application/pdf", token, "marketplace-report.pdf");
        this.stopLoading();
      } catch (error) {
        console.log(error);
        this.stopLoading();
      }
    },
    exportAsCsv() {
      console.log("Export as CSV");
    }
  },
  mixins: [loadingMixin, download],
};
</script>
<style scoped>
.top-card-container {
  margin-bottom: 40px;
}

.top-charts {
  height: 500px;
  overflow: auto;
}
</style>
