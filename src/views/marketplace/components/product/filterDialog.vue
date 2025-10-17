<template>
  <v-dialog v-model="dialog" width="378" persistent>
    <v-card rounded="0">
      <v-toolbar class="white--text" color="primary" flat>
        <v-toolbar-title class="font-weight-bold">{{ $t('marketplace.common.filterBy') }}</v-toolbar-title>
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
                <span class="header-text">{{ $t('marketplace.category.categories') }}</span>
                <div class="header-divider"></div>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="categories" v-for="category in categories" :key="category.id">
                <v-checkbox v-model="category.checked" :label="category.name"
                  @change="updateCategoryFilter(category)"></v-checkbox>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels v-if="subcategories && subcategories.length > 0">
            <v-expansion-panel>
              <v-expansion-panel-header>
                <span class="header-text">{{ $t('marketplace.category.subcategories') }}</span>
                <div class="header-divider"></div>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="categories" v-for="subcat in subcategories" :key="subcat.id">
                <v-checkbox v-model="subcat.checked" :label="subcat.name"
                  @change="updateSubCategoryFilter(subcat)"></v-checkbox>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels v-model="expandedPanel">
            <v-expansion-panel>
              <v-expansion-panel-header>
                <span class="header-text">{{ $t('marketplace.common.products') }}</span>
                <div class="header-divider"></div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-text-field v-model="filters.search" outlined dense></v-text-field>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels>
            <v-expansion-panel elevation="0">
              <v-expansion-panel-header>
                <span class="header-text">{{ $t('marketplace.common.countries') }}</span>
                <div class="header-divider"></div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div v-for="(country, index) in countries" :key="index">
                  <v-checkbox :value="country.id" :label="country.name"
                    :checked="filters.country_ids.includes(country.id)"
                    @change="updateCountryFilter(country.id)"></v-checkbox>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <span class="header-text">{{ $t('marketplace.products.priceRange') }}</span>
                <div class="header-divider"></div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete v-model="filters.currency" :items="currencies"
                      :placeholder="$t('marketplace.products.selectCurrency')" outlined dense
                      clearable></v-autocomplete>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="filters.min_price" outlined dense :placeholder="$t('from')"></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="filters.max_price" outlined dense :placeholder="$t('to')"></v-text-field>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <span class="header-text">{{ $t('marketplace.products.productStatus') }}</span>
                <div class="header-divider"></div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-radio-group v-model="filters.visibility" column>
                  <v-radio :label="$t('marketplace.products.public')" value="Public"></v-radio>
                  <v-radio :label="$t('marketplace.products.private')" value="Private"></v-radio>
                  <v-radio :label="$t('marketplace.products.all')" value="All"></v-radio>
                </v-radio-group>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-form>
      </v-card-text>
      <v-card-actions class="mt-10">
        <v-spacer></v-spacer>
        <v-btn class="" color="primary" outlined width="112" @click="clearAll">
          {{ $t('marketplace.common.clearAll') }}
        </v-btn>
        <v-btn class="btn-11 btn-22" color="primary" type="submit" width="112" @click="search">
          {{ $t('search') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DownloadMixin from "@/mixins/DownloadMixin";
import MarketplaceService from "@/_services/MarketplaceService";

export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
  },
  mounted() {
    this.fetchCategoriesData();
    this.getCountries();
    this.getCurrencies();

  },

  data() {
    return {
      selectedItems: [],
      expandedPanel: 0,
      categories: [],
      subcategories: [],
      countries: [],
      currencies: [],
      filters: {
        search: '',
        category_ids: [],
        subcategory_ids: [],
        country_ids: [],
        currency: null,
        priceRange: [500, 2000],
        pre_order_available: false,
        allow_quote: false,
        visibility: "All",
        min_price: null,
        max_price: null
      },
    };
  },
  methods: {
    async getCountries() {
      MarketplaceService.getCountries()
        .then((res) => {
          this.countries = res?.map((item) => ({
            id: item.id,
            name: item.name,
            code: item.country_code
          }));
        })
        .catch((err) => {
          console.error("Error fetching countries:", err);
        });
    },

    async getCurrencies() {
      MarketplaceService.getCurrencies()
        .then((res) => {
          this.currencies = res;
        })
        .catch((err) => {
          console.error("Error fetching currencies:", err);
        });
    },

    updateCountryFilter(countryId) {
      const index = this.filters.country_ids.indexOf(countryId);

      if (index === -1) {
        // Add country ID if it's not in the array
        this.filters.country_ids.push(countryId);
      } else {
        // Remove country ID if it's already in the array
        this.filters.country_ids.splice(index, 1);
      }
    },


    updateCategoryFilter(category) {
      if (category.checked) {
        if (!this.filters.category_ids.includes(category.id)) {
          this.filters.category_ids.push(category.id);
        }

        const newSubCategories = category.subcategories?.map(subcat => ({
          ...subcat,
          parentCategoryId: category.id,
          checked: false
        }));

        this.subcategories = [
          ...this.subcategories.filter(subcat => subcat.parentCategoryId !== category.id),
          ...newSubCategories,
        ]
      } else {
        this.filters.category_ids = this.filters.category_ids.filter(id => id !== category.id);
        this.subcategories = this.subcategories.filter(subcat => subcat.parentCategoryId !== category.id);
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
    async fetchCategoriesData() {
      try {
        this.startLoading()
        const response = await MarketplaceService.getCategoriesWithoutPagination();
        this.categories = response
        this.stopLoading();
      } catch (error) {
        this.stopLoading();
        console.error('Error fetching categories:', error);
      }
    },
    emitFilters() {
      this.$emit('update:filters', this.filters);
    },
    closeModal() {
      this.$emit("closeFilterModal");
    },
    clearAll() {
      this.filters = {
        product: '',
        selectedProducts: [],
        category_ids: [],
        subcategory_ids: [],
        countries: null,
        priceRange: [500, 2000],
        preOrder: false,
        requestQuote: false,
      };
    },
    search() {
      console.log('Search with filters:', this.filters);
      this.emitFilters();
      this.closeModal();
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

/deep/ .v-input--selection-controls__ripple::before {
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

.v-expansion-panels {
  max-height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.v-expansion-panels::-webkit-scrollbar {
  display: none;
}
</style>
