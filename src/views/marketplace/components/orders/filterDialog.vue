<template>
  <v-dialog v-model="dialog" width="378" persistent>
    <v-card rounded="0">
      <v-toolbar class="white--text" color="primary" flat>
        <v-toolbar-title class="font-weight-bold">{{ $t("marketplace.orders.filterBy") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="white--text" icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <span class="header-text">{{ $t("marketplace.orders.date") }}</span>
                <div class="header-divider"></div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div>
                  <div class="controls d-flex justify-space-between align-center mb-4"
                    style="gap: 10px; padding-left: 35px; padding-right: 40px;">
                    <v-select v-model="selectedMonth" :items="months" :label="$t('marketplace.orders.month')"
                      variant="plain" class="dropdown" style="font-size: small;" dense
                      @change="syncDatePicker"></v-select>

                    <v-select v-model="selectedYear" :items="years" :label="$t('marketplace.orders.year')"
                      variant="plain" class="dropdown" dense style="font-size: small;"
                      @change="syncDatePicker"></v-select>
                  </div>

                  <div class="toggle-buttons d-flex mb-4">
                    <v-btn :style="{
                      fontWeight: 12,
                      backgroundColor: activeTab === 'specific' ? '#0EBF67' : '#F0F1F2',
                      color: activeTab === 'specific' ? 'white' : 'black',
                      marginLeft: '9%',
                    }" dense small @click="setTab('specific')">
                      {{ $t('marketplace.orders.specificDate') }}
                    </v-btn>
                    <v-btn :style="{
                      fontWeight: 12,
                      backgroundColor: activeTab === 'range' ? '#0EBF67' : '#F0F1F2',
                      color: activeTab === 'range' ? 'white' : 'black',
                      marginLeft: '20%',
                    }" dense small @click="setTab('range')">
                      {{ $t('marketplace.orders.range') }}
                    </v-btn>
                  </div>
                  <v-date-picker v-model="selectedDate" @change="updateDateFilter" scrollable :range="activeTab === 'range'" :reactive="true"
                    class="hide-date-header"></v-date-picker>
                </div>

              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <span class="header-text">{{ $t("marketplace.orders.category") }}</span>
                <div class="header-divider"></div>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="categories" v-for="category in categories" :key="category.id">
                <v-checkbox v-model="category.checked" :label="category.name"
                  @change="updateCategoryFilter(category)"></v-checkbox>
                <v-slide-y-transition>
                  <div v-if="category.checked && category.subcategories.length > 0" class="subcategories">
                    <v-checkbox v-for="subcategory in category.subcategories" :key="subcategory.id"
                      v-model="subcategory.checked" :label="subcategory.name"
                      @change="updateSubCategoryFilter(subcategory)"></v-checkbox>
                  </div>
                </v-slide-y-transition>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <span class="header-text">{{ $t("marketplace.orders.product") }}</span>
                <div class="header-divider"></div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-autocomplete v-model="selectedItems" :items="items"  multiple chips deletable-chips outlined
                  class="autocomplete-custom"></v-autocomplete>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels>
            <v-expansion-panel elevation="0">
              <v-expansion-panel-header>
                <span class="header-text">{{ $t("marketplace.orders.orderStatus") }}</span>
                <div class="header-divider"></div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div>
                  <v-checkbox v-model="filters.orderStatus.pending"><template v-slot:label>
                      <span class="label-text">{{ $t("marketplace.orders.pending") }}</span>
                      <span class="status-circle" style="background-color: #C6C6C6; margin-left: 100px;"></span>
                    </template></v-checkbox>
                </div>
                <div>
                  <v-checkbox v-model="filters.orderStatus.processing"><template v-slot:label>
                      <span class="label-text">{{ $t("marketplace.orders.processing") }}</span>
                      <span class="status-circle" style="background-color: #913800; margin-left: 100px;"></span>
                    </template></v-checkbox>
                </div>
                <div>
                  <v-checkbox v-model="filters.orderStatus.packing"><template v-slot:label>
                      <span class="label-text">{{ $t("marketplace.orders.packing") }}</span>
                      <span class="status-circle" style="background-color: #FC863B; margin-left: 100px;"></span>
                    </template></v-checkbox>
                </div>
                <div>
                  <v-checkbox v-model="filters.orderStatus.shipped"><template v-slot:label>
                      <span class="label-text">{{ $t("marketplace.orders.shipped") }}</span>
                      <span class="status-circle" style="background-color: #6940BF; margin-left: 100px;"></span>
                    </template></v-checkbox>
                </div>

                <div>
                  <v-checkbox v-model="filters.orderStatus.readyForPickup"><template v-slot:label>
                      <span class="label-text">{{ $t("marketplace.orders.readyForPickup") }}</span>
                      <span class="status-circle" style="background-color: #1CA6C5; margin-left: 100px;"></span>
                    </template></v-checkbox>
                </div>
                <div>
                  <v-checkbox v-model="filters.orderStatus.delivered"><template v-slot:label>
                      <span class="label-text">{{ $t("marketplace.orders.delivered") }}</span>
                      <span class="status-circle" style="background-color: #00BD73; margin-left: 100px;"></span>
                    </template></v-checkbox>
                </div>
                <div>
                  <v-checkbox v-model="filters.orderStatus.cancelled"><template v-slot:label>
                      <span class="label-text">{{ $t("marketplace.orders.cancelled") }}</span>
                      <span class="status-circle" style="background-color: #DA3D3D; margin-left: 100px;"></span>
                    </template></v-checkbox>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels>
            <v-expansion-panel elevation="0">
              <v-expansion-panel-header>
                <span class="header-text">{{ $t("marketplace.orders.type") }}</span>
                <div class="header-divider"></div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-checkbox v-model="filters.type.productPriceQuote"
                  :label="this.$t('marketplace.orders.productPriceQuote')"></v-checkbox>
                <v-checkbox v-model="filters.type.shippingQuote"
                  :label="this.$t('marketplace.orders.shippingQuote')"></v-checkbox>
                <v-checkbox v-model="filters.type.pickUp" :label="this.$t('marketplace.orders.pickUp')"></v-checkbox>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-form>
      </v-card-text>
      <v-card-actions class="mt-10">
        <v-spacer></v-spacer>
        <v-btn class="" color="primary" outlined width="112" @click="clearAll">
          {{ $t('marketplace.orders.clearAll') }}
        </v-btn>
        <v-btn class="btn-11 btn-22" color="primary" type="submit" width="112" @click="search">
          {{ $t('search') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import marketplaceService from "@/_services/MarketplaceService";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DownloadMixin from "@/mixins/DownloadMixin";

export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
  },

  mounted() {
    this.fetchCategoriesData()
    this.fetchProductsData()
  },
  data() {
    return {
      selectedItems: [],
      items: [],
      expandedPanel: 0,
      categories: [],
      filters: {
        specificDate: '',
        range: '',
        product: '',
        selectedProducts: [],
        category_ids: [],
        subcategory_ids: [],
        orderStatus: {
          pending: '',
          processing: '',
          packing: '',
          shipped: '',
          readyForPickup: '',
          delivered: '',
          cancelled: '',
        },
        type: {
          productPriceQuote: '',
          shippingQuote: '',
          pickUp: '',
        },
      },
      products: ['Apple', 'Apricot'],
      activeTab: "specific",
      selectedMonth: null,
      selectedYear: null,
      selectedDate: null,
      months: [
        { text: "January", value: 1 },
        { text: "February", value: 2 },
        { text: "March", value: 3 },
        { text: "April", value: 4 },
        { text: "May", value: 5 },
        { text: "June", value: 6 },
        { text: "July", value: 7 },
        { text: "August", value: 8 },
        { text: "September", value: 9 },
        { text: "October", value: 10 },
        { text: "November", value: 11 },
        { text: "December", value: 12 },
      ],
      years: Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i),
    };
  },
  methods: {
    updateCategoryFilter(category) {
      if (category.checked) {
        if (!this.filters.category_ids.includes(category.id)) {
          this.filters.category_ids.push(category.id);
        }
      } else {
        this.filters.category_ids = this.filters.category_ids.filter(id => id !== category.id);
      }
    },
    updateSubCategoryFilter(subcategory) {
      if (subcategory.checked) {
        if (!this.filters.subcategory_ids.includes(subcategory.id)) {
          this.filters.subcategory_ids.push(subcategory.id);
        }
      } else {
        this.filters.subcategory_ids = this.filters.subcategory_ids.filter(id => id !== subcategory.id);
      }
    },
    updateDateFilter() {
      if (this.activeTab === "specific") {
        this.filters.specificDate = this.selectedDate;
        this.filters.range = '';
      } else {
        this.filters.range = this.selectedDate;
        this.filters.specificDate = '';
      }
    },
   
    async fetchCategoriesData() {
      try {
        this.startLoading()
        const response = await marketplaceService.getCategoriesWithoutPagination();
        this.categories = response
        this.stopLoading();
      } catch (error) {
        this.stopLoading();
        console.error('Error fetching categories:', error);
      }
    },

    async fetchProductsData() {
        try {
          this.startLoading();
          const response = await marketplaceService.getProducts();
          this.items= response.items.map(item => item.name);
          this.stopLoading();
        } catch (error) {
          this.stopLoading();
          console.error('Error fetching products:', error);
        }
      },

    emitFilters() {
      this.$emit('update:filters', this.filters);
    },

    closeModal() {
      this.$emit("closeFilterModal");
    },

    removeItem(item) {
      const index = this.selectedItems.indexOf(item);
      if (index !== -1) {
        this.selectedItems.splice(index, 1);
      }
    },

    clearAll() {
      this.filters = {
        product: '',
        selectedProducts: [],
        selectedItems: [],
        category_ids: [],
        subcategory_ids: [],
        orderStatus: {
          pending: false,
          processing: false,
          packing: false,
          shipped: false,
          readyForPickup: false,
          delivered: false,
          cancelled: false,
        },
        type: {
          productPriceQuote: false,
          shippingQuote: false,
          pickUp: false,
        },
      };
    },
    search() {
      console.log('Search with filters:', this.filters);
      this.emitFilters();
      this.closeModal();
    },
    setTab(tab) {
      this.activeTab = tab;
    },
    syncDatePicker() {
      if (this.selectedMonth && this.selectedYear) {

        this.selectedDate = new Date(
          this.selectedYear,
          this.selectedMonth - 1,
          2
        ).toISOString().substr(0, 10);
      }
    },
  },
  mixins: [loadingMixin, getPermittedActions, DownloadMixin]
};
</script>


<style>
.subcategories {
  margin-left: 40px;
}

.v-expansion-panels {
  z-index: auto !important;
  border-bottom: none !important;
  background: none !important;
  padding: 0 !important;
}

.v-expansion-panel-header {
  padding: 0 !important;
  margin: 0 !important;
  background-color: transparent !important;
}

.v-expansion-panel-content {
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.header-divider {
  min-width: 165px;
  height: 1px;
  background-color: #C6C6C6;
  margin-right: 30px;
}

.v-expansion-panel-content__wrap {
  padding: 0 !important;
}

.v-checkbox {
  border-color: #0EBF67;
}

.header-text {
  font-size: 15px;
  font-weight: 500;
  color: #000000;
  ;
}

.v-input--selection-controls__ripple::before {
  border-color: #0EBF67 !important;
}

.v-input--selection-controls__input .v-icon {
  color: #0EBF67 !important;
}


.autocomplete-custom .v-input__control {
  background-color: white !important;
}

.v-input__icon--append .v-icon {
  display: none !important;
}

.status-circle {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.label-text {
  display: inline-block;
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

}

.date-picker-container {
  max-width: 400px;
  margin: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: white;
}

.controls .control-select {
  width: 48%;
}

.toggle-buttons .v-btn {
  text-transform: none;
  font-weight: bold;
  margin: 0 8px;
}

.hide-date-header .v-date-picker-title {
  display: none;
}

.hide-date-header .v-date-picker-header {
  justify-content: center;
}

.hide-date-header .v-picker__title {
  display: none;
}
</style>
