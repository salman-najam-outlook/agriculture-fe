<template>
    <v-dialog v-model="dialogIsOpen" width="800">
      <v-card>
        <v-card-title class="primary white--text">
          Progress Filters
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div v-for="filter in filterLabels" :key="filter.label" class="mb-6 py-4">
            <label class="font-weight-bold">{{ filter.labelName }}</label>
            <div class="slider-container">
              <v-range-slider
                v-model="filter.range"
                :min="0"
                :max="100"
                :step="1"
                hide-details
                thumb-label
                class="mt-2"
              ></v-range-slider>
              <div class="slider-scale">
                <span v-for="n in 6" :key="n">{{ (n - 1) * 20 }}</span>
              </div>
            </div>
          </div>
          <v-btn text color="primary" @click="resetFilters">
            REMOVE FILTERS
          </v-btn>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">CANCEL</v-btn>
          <v-btn color="success" @click="applyFilters">APPLY</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      dialog: {
        type: Boolean,
        default: false,
      },
      filters: {
        type: Array,
        default: () => [
          { labelName: 'Overall Progress', range: [25, 100] },
          { labelName: 'Environmental', range: [25, 100] },
          { labelName: 'Social', range: [25, 100] },
          { labelName: 'Governance', range: [25, 100] },
        ],
      },
    },
    data(){
      return {
        dilogI:null
      }
    },
    computed:{
      filterLabels() {
        return this.filters
      },
      dialogIsOpen:{
        get(){
           return this.dialog
        },
        set(val){
          this.dilogI = val
        }
      }
    },
    methods: {
      resetFilters() {
        this.filterLabels.forEach((filter) => {
          filter.range = [25, 100];
        });
      },
      applyFilters() {
        this.$emit('apply', this.filterLabels);
        this.dialogIsOpen = false;
      },
      closeDialog() {
        this.dialogIsOpen = false;
        this.$emit('close');
      },
    },
  };
  </script>
  
  <style scoped>
  .slider-container {
    position: relative;
  }
  
  .slider-scale {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #666;
    padding: 8px 0;
  }
  
  .slider-scale span {
    position: relative;
  }
  
  .slider-scale span::before {
    content: '';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 8px;
    background-color: #ccc;
  }
  </style>