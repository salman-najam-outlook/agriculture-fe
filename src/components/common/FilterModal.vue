<template>
  <v-dialog v-model="showModal" max-width="400" @click:outside="closeModal">
    <v-card>
      <v-toolbar color="primary" class="white--text">
        <v-toolbar-title class="font-weight-bold">{{ $t('dueDiligence.filterBy') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon style="color:white !important;">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      
      <v-card-text class="pa-4">
        <!-- Country Filter -->
        <div class="filter-section mb-4">
          <label class="filter-label">{{ $t('country') }}</label>
          <v-select
            v-model="localCountry"
            :items="countryOptions"
            item-text="name"
            item-value="value"
            :placeholder="$t('dueDiligence.makeSelection')"
            outlined
            dense
            disabled
          ></v-select>
        </div>
        
        <!-- Region Filter -->
        <!-- <div class="filter-section mb-4">
          <label class="filter-label">{{ $t('region') }}</label>
          <v-select
            v-model="localRegion"
            :items="regionOptions"
            item-text="name"
            item-value="value"
            :placeholder="$t('dueDiligence.makeSelection')"
            outlined
            dense
            clearable
          ></v-select>
        </div> -->
        
        <!-- Product Filter -->
        <div class="filter-section mb-4">
          <label class="filter-label">{{ $t('product') }}</label>
          <v-select
            v-model="localProduct"
            :items="productOptions"
            item-text="name"
            item-value="value"
            :placeholder="$t('dueDiligence.makeSelection')"
            outlined
            dense
            clearable
          ></v-select>
        </div>
      </v-card-text>
      
      <v-card-actions class="pa-4">
        <v-btn color="grey" text @click="clearAllFilters">{{ $t('clearAll') }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="applyFilters">{{ $t('dueDiligence.applyFilter') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'FilterModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    selectedCountry: {
      type: String,
      default: 'indonesia'
    },
    selectedRegion: {
      type: String,
      default: null
    },
    selectedProduct: {
      type: String,
      default: null
    },
    countryOptions: {
      type: Array,
      default: () => [
        { name: 'Indonesia', value: 'indonesia' }
      ]
    },
    regionOptions: {
      type: Array,
      default: () => []
    },
    productOptions: {
      type: Array,
      default: () => [
        { name: 'Coffee', value: 2 },
        { name: 'Cocoa', value: 3 },
        { name: 'Rubber', value: 5 }
      ]
    }
  },
  data() {
    return {
      localCountry: this.selectedCountry,
      localRegion: this.selectedRegion,
      localProduct: this.selectedProduct
    };
  },
  computed: {
    showModal: {
      get() {
        return this.show;
      },
      set(value) {
        this.$emit('update:show', value);
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('update:show', false);
    },
    applyFilters() {
      this.$emit('filter-applied', {
        country: this.localCountry,
        region: this.localRegion,
        product: this.localProduct
      });
      this.closeModal();
    },
    clearAllFilters() {
      this.localCountry = 'indonesia';
      this.localRegion = null;
      this.localProduct = null;
      this.$emit('filters-cleared');
    }
  },
  watch: {
    selectedCountry(newVal) {
      this.localCountry = newVal;
    },
    selectedRegion(newVal) {
      this.localRegion = newVal;
    },
    selectedProduct(newVal) {
      this.localProduct = newVal;
    }
  }
};
</script>

<style scoped>
.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.filter-section {
  margin-bottom: 16px;
}
</style>
