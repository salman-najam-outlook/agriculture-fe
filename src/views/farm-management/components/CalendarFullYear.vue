<template>
  <div id="app">
    <div class="top-bar vuecal__flex">
      <button class="vuecal__arrow vuecal__arrow--prev" @click="previous">
        <i class="angle"></i>
      </button>
      <h1>{{ selectedDate.format('YYYY') }}</h1>
      <button class="vuecal__arrow vuecal__arrow--next" @click="next">
        <i class="angle"></i>
      </button>
    </div>

    <div class="vuecal__flex" wrap>
      <div 
        v-for="(monthNumber, index) in 12"
        :key="monthNumber"
        class="calendar__container"
      >
      <div class="">
        {{ months[index] }} 
      </div>
      <vue-cal
        ref="vuecal"
        class="vuecal__flex vuecal--blue-theme vuecal--rounded-theme"
        xsmall
        hide-title-bar
        :selected-date="index === 0 ? selectedDate.add(0, 'month').format('DD-MMM-YYYY'): selectedDate.add(1, 'month').format('DD-MMM-YYYY')"
        :disable-views="['years', 'year', 'week', 'day']"
        hide-view-selector
        active-view="month"
        :transitions="false"
        :clickToNavigate="false"
        :dblclickToNavigate="false"
        @cell-dblclick="emitDate"
      >
      </vue-cal>
      </div>
    </div>
    <a href="https://antoniandre.github.io/vue-cal" target="_blank">
      Documentation @ //antoniandre.github.io/vue-cal
    </a>
  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import moment from 'moment';
export default {
  components: { VueCal },
  name: "fullYear",
  data() {
    return {
      selectedDate: moment().startOf('year'),
      months: [
        "January", 
        "February", 
        "March", 
        "April", 
        "May", 
        "June", "July", 
        "August", "September", 
        "October", "November", "December"
      ]
    }
  },
  methods: {
    emitDate(date) {
      this.$emit('eventClicked', date);
    },
    previous () {
      this.selectedDate = moment(this.selectedDate).subtract(1, 'year').startOf('year');
    },
    next () {
      this.selectedDate = moment(this.selectedDate).add(1, 'year').startOf('year');

    },
    addDays(date, days) {
      let newDate = new Date(date);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    },
  },
  mounted() {
    Date.prototype.addDays = function(days) {
      const date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };

    Date.prototype.subtractDays = function(days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
    return date;
  };
  }
};
</script>

<style scoped>
.calendar__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 56px;
}

body {font: 12px sans-serif;}
* {margin: 0;}

#app {
  margin: 30px auto;
  max-width: 1000px;
  height: 100px;
  position: absolute;
  top: 250px;
    min-width: 92%;
    left: 75px;
}

.top-bar {padding: 12px; position: absolute;}
.top-bar button {
  background: transparent;
  border: none;
  font-size: 1.6em;
  outline: none;
}
h1 {display: flex;flex-grow: 1;justify-content: center;}

.vuecal {max-width: 284px; max-height: 370px;padding: 8px;box-shadow: none;box-sizing: border-box;}
.vuecal .vuecal__arrow {display: none;}
.vuecal--blue-theme .vuecal__title-bar {background-color: transparent;}
.vuecal__title {
  justify-content: start;
  padding-left: 12px;
}

.vuecal--rounded-theme .vuecal__cell-content {
  font-size: 0.9em;
  width: 20px;
  height: 20px;
  margin-bottom: 5px;
}

a {position: fixed;top: 5px;right: 5px;color: #333;}

.vuecal__flex {
  margin-left: 0.6%;
}

.top-bar {
  max-width: 400px;
  margin-left: 35.5%;
  bottom: 87px;
  min-width: 377px;
}

</style>
