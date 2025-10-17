<template>
  <div class="d-flex tabs-container">
    <div
      v-for="(tab, index) in tabs"
      :key="tab.number"
      :class="['d-flex', 'tab-header', headerClass(tab.number)]"
      @click="changeStep(tab.number)"
      @mouseover="showTooltip(tab.number)"
      @mouseleave="hideTooltip"
    >
      <p v-if="tooltipTitle && stepShow == tab.number" class="tooltip-title"> {{ tooltipTitle }}</p>
      <div class="square">
        <span class="number">{{ tab.number }}</span>
      </div>
      <span class="headline-text-color">
        {{ tab.title }}
      </span>
      <span class="next-tab-arrow" v-if="index < tabs.length - 1">
        >
      </span>
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash';
export default {
  props: {
    activeTab: {
      required: false,
    },
    tabs: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      debouncedChangeStep: debounce(this.changeStep, 200),
      tooltipTitle: null,
      stepShow:null
    };
  },
  computed: {
    getDiligenceDetails(){
      return this.$store.getters["eudrDDS/getDiligenceDetails"];
    }
  },
  mounted() {
    console.log(this.tabs);
  },
  methods: {
    showTooltip(number){
      if(
        this.activeTab <= 3 &&
        number > 3 &&
        !this.getDiligenceDetails?.is_dds_status_update
      ){
        this.stepShow = number;
        this.tooltipTitle = this.$t('dueDiligence.finishStepsTooltip');
      }
      return;
    },
    hideTooltip(){
      this.stepShow = null;
      this.tooltipTitle = null;
    },
    changeStep(number) {
      if(number > 3 && !this.getDiligenceDetails.is_dds_status_update){
        return;
      }
      this.$emit("changeStep", number);
    },
    headerClass(step) {
      return step === this.activeTab
        ? "active-header-navigation"
        : "header-navigation";
    },
  },
};
</script>

<style scoped>

.tabs-container {
  display: flex;
  overflow-x: auto; 
  white-space: nowrap; 
  width: 100%;
}
.tab-header {
  cursor: pointer;
}

.tab-header .next-tab-arrow,
.tab-header .headline-text-color {
  display: flex;
  justify-content: center;
  align-items: center;
}

.next-tab-arrow {
  margin-left: 20px;
  margin-right: 10px;
  font-size: 30px;
  font-weight: 500;
}

.active-header-navigation .headline-text-color {
  color: var(--primary-color) !important;
}

.headline-text-color {
  color: #4b4b4b !important;
}

.square {
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: #d2d2d2;
  margin: 10px;
}

.active-header-navigation .square {
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: var(--primary-color);
  margin: 10px;
}

.number {
  font-size: 20px;
  font-weight: 400;
  color: #4b4b4b;
}
.header-navigation {
  position: relative;
  height: 80px;
  align-items: center;
}
.active-header-navigation {
  position: relative;
  height: 80px;
  align-items: center;
}

.active-header-navigation .number {
  font-size: 20px;
  font-weight: 400;
  color: #ffffff;
}
.tooltip-title{
  position: absolute;
  top: 0;
  left: 54px;
  background: #fddaaa;
  z-index: 100;
  overflow: hidden;
  padding: 4px;
  border-radius: 7px;
}
</style>
