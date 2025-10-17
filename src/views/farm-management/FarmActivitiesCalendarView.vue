<template>
      <v-container fluid>
        <v-row>
          <v-col cols="2">             
            <v-text-field
              outlined
              dense
              v-model="searchPhrase"
               append-icon="mdi-magnify"
               :label="$t('farm.searchEvents')"
            ></v-text-field></v-col>
          <!-- <v-col cols="2">       
                 <CountrySelect
              v-model="country"
              optionValue="country"
              optionText="country"
              outlined
              dense
              :list="countryList"
            /></v-col> -->
          <v-col cols="2">             <v-select
                item-text="farmName"
                item-value="id"
              outlined
              dense
              :items="farmNames"
              v-model="localFarmId"
              :label="$t('farm.filterByFarmName')"
              @change="filterByFarmName"
            ></v-select></v-col>
        </v-row>

        <v-row>
          <v-col xs="12" sm="2" md="2" lg="2" xl="2"> <v-btn class="today-button" color="white" elevation="1" rounded dense @click="$refs.vuecal.switchView('day', new Date())">Today</v-btn></v-col>

          <v-col xs="12" sm="4" md="4" lg="7" xl="8">  <span v-show="activeView != 'year'">
              <v-row justify="center" class="main-middle-date">
                <v-col cols="3" class="d-flex justify-center align-center" @click="previousDateInstance"><button class="round-button">&lt;</button></v-col>
                <v-col cols="6"   v-if="events" class="d-flex justify-center align-center">{{ currentInstanceDate }}</v-col>
                <v-col cols="3" class="d-flex justify-center align-center" @click="nextDateInstance"> <button class="round-button">&gt;</button></v-col>
              </v-row>
            </span>
          </v-col>

          <v-col xs="12" sm="2" md="2" lg="1" xl="2">      
             <v-btn-toggle
  :elevation="30"
            v-model="activeView"
            rounded
            dense
            class="view-select-btn-group"
          >
            <v-btn       color="white" value="year" @click="activeView = 'year'">
              Year
            </v-btn>
            <v-btn       color="white" value="week" @click="activeView = 'week'">
              Week
            </v-btn>
            <v-btn       color="white" value="month" @click="activeView = 'month'">
              Month
            </v-btn>
            <v-btn       color="white" value="day" @click="activeView = 'day'">
              Day
            </v-btn>
          </v-btn-toggle>
 </v-col>
        </v-row>
        <vue-cal
        v-if="events"
        ref="vuecal"
        hide-view-selector
        hide-title-bar
        :active-view="activeView"
        :time-from="9 * 60"
        :time-to="23 * 60"
        :events="events"
        events-on-month-view
        :disable-views="['years']"
        view="year"
         @view-change="customYearView('view-change', $event)"
         @event-mouse-leave="eventMouseLeave($event)"
         :selected-date="selectedDate"
        >
        <template #event="{ event }">
          <div :style="`border: 4px ${event.data.colorPreference} solid; height: 100%; display: flex; flex-direction: column; border-radius: 5px;`" @click="eventClick(event)">
            <small class="vuecal__event-time" style="align-self: flex-start;" >
              <v-chip>{{event.start.formatTime()}} </v-chip>
              <v-chip>{{event.end.formatTime()}} </v-chip>
            </small>
            <div class="vuecal__event-title" style="align-self: flex-start; margin-left: 10px;" v-html="event.title" > </div>
            <div style="align-self: flex-start; margin-top: auto; margin-left: 10px;"> User: {{ event.data.user.fullName }}</div>
          </div>
  
        </template>
      </vue-cal>
      <div>
    <Ctooltip v-if="eventHoverStatus" :toolTipData="hoveredEventData">
      <v-row>
        <v-col cols="6">{{$t('farm.activityDetails')}}</v-col>
     

      </v-row>
      <v-row>
        <v-col cols="6">{{$t('farm.activity')}} : {{ hoveredEventData.title }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="6">{{$t('farm.farmName')}} : {{ hoveredEventData.data.user_farm.farmName }}</v-col>
        <v-col cols="6">{{$t('farm.farmerName')}} : {{ hoveredEventData.data.user.fullName }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="6">{{$t('farm.cropType')}} : {{ hoveredEventData.data?.cropType?.name || "-" }}</v-col>
      </v-row>
      <v-row>
        <v-col cols="6">{{$t('farm.startDate')}} : {{getFormattedDate( hoveredEventData.start )}}</v-col>
        <v-col cols="6">{{$t('farm.endDate')}}: {{ getFormattedDate(hoveredEventData.end )}}</v-col>
      </v-row>
      <v-row>
        <v-col cols="6">{{$t('farm.description')}} : {{ hoveredEventData.description || "-" }}</v-col>
      </v-row>
    </Ctooltip>

  </div>
      <CalendarFullYear style="margin-top: 0px;" v-if="activeView == 'year'" @eventClicked="eventClicked"/>
      </v-container>

</template>

<script>
// Documentation: https://antoniandre.github.io/vue-cal
// import CountrySelect from "@/components/CountrySelect.vue";
import CalendarFullYear from "./components/CalendarFullYear.vue";
import Ctooltip from "./components/CalendarEventTooltip.vue";
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import axios from 'axios';
import FarmService from "@/_services/FarmService";
import loadingMixin from "@/mixins/LoadingMixin";

export default {
  mixins: [loadingMixin],
  components: { VueCal, CalendarFullYear , Ctooltip},
  data() {
    return {
      toggle_exclusive:"",
      events: null,
      activeView: 'week',
      firstDay: '',
      lastDay: '',
      farmNames: [],
      countryList: [],
      country: null,
      searchPhrase: "",
      eventsCopy: [],
      eventHoverStatus: false,
      hoveredEventData: null,
      localFarmId: this.farmId,
      currentInstanceDate: "",
      selectedDate: new Date(),
    }
  },
  watch: {
    farmId(newVal) {
      this.localFarmId = newVal;
    },
    searchPhrase(nV) {
      if(nV) {
        this.events  = this.events.filter(e => {
          return e.title.toLowerCase().includes(nV)
        })
      } else {
        this.events = this.eventsCopy;
      }
    }
  },
  async mounted() {
        this.startLoading();
    await this.fetchOptions()
    await this.fetchEventsList()
    await this.setInitialTitle()
            this.stopLoading();
  },
  props: ["farmId"],
  methods: {
    eventClicked(targetDate) {
      this.activeView = "week"
      this.selectedDate = targetDate;
    },
    getViewTitle() { 
        this.currentInstanceDate =  this.$refs.vuecal.viewTitle
        return this.currentInstanceDate
    },
    setInitialTitle() {
      const startDate = this.$refs.vuecal.viewCells[0].startDate;
      const weekNumber = this.$refs.vuecal.viewTitle.split("(")[0]; // Get week number

      const monthName = startDate.toLocaleString('default', { month: 'long' });
      const year = startDate.getFullYear();

      this.currentInstanceDate = `Week ${weekNumber} (${monthName} ${year})`;
      return;
    },
   previousDateInstance() {

    this. $refs.vuecal.previous()
    this.getViewTitle()

   },
   nextDateInstance() { 
    this. $refs.vuecal.next()
    this.getViewTitle()

   },
    async filterByFarmName() {
      this.startLoading();
      await this.fetchEventsList()
      this.stopLoading();
    },
    eventMouseLeave() {

      this.eventHoverStatus = false
    },  
    eventHover(eventData) {

      this.eventHoverStatus = true
      this.hoveredEventData = eventData
    },  
    eventClick(eventData) {
      this.eventHoverStatus = true
      this.hoveredEventData = eventData
    },
    async customYearView(a, b){
      this.startLoading();
      this.activeView = b.view
      await this.fetchEventsList()
      this.currentInstanceDate = this.$refs.vuecal.viewTitle
      this.stopLoading();
    },
    async fetchOptions(){
      try {
        const { data } = await FarmService.getFarmCalenderActivitiesOptions();
        if (data) {
          this.cropTypes = data.cropTypeList;
          this.farmNames = data.farmNameList;
          this.countryList = Array.from(new Set(data.countryList));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
     getWeekStartEnd(date = new Date()) {

      if(this.$refs?.vuecal?.viewTitle) {
        let weekYear = this.$refs?.vuecal?.viewTitle;
        const [weekNumber, year] = weekYear.match(/\d+/g).map(Number);

        const firstDayOfYear = new Date(Date.UTC(year, 0, 1));    
        const dayOffset = (firstDayOfYear.getUTCDay() + 6) % 7; 

        const weekStartDate = new Date(firstDayOfYear);
        weekStartDate.setUTCDate(firstDayOfYear.getUTCDate() + (weekNumber - 1) * 7 - dayOffset);


        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setUTCDate(weekStartDate.getUTCDate() + 6);

        this.firstDay = weekStartDate.toISOString().split('T')[0],
        this.lastDay = weekEndDate.toISOString().split('T')[0]
      } else {
        const dayOfWeek = date.getDay();
      
        const firstDay = new Date(date);
        firstDay.setDate(date.getDate() - dayOfWeek);
        
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        

          this.firstDay = this.getFormattedDate(firstDay),
          this.lastDay = this.getFormattedDate(lastDay)
      }
      
     
    },

     getMonthStartEnd(date = new Date()) {

      if(this.$refs?.vuecal?.viewTitle) { 
        let monthYear = this.$refs?.vuecal?.viewTitle;
        const [monthName, year] = monthYear.split(' ');
        
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
        
        const monthStartDate = new Date(year, monthIndex, 2);

        const monthEndDate = new Date(year, monthIndex + 1, 1);

           this.firstDay = monthStartDate.toISOString().split('T')[0],
           this.lastDay = monthEndDate.toISOString().split('T')[0]
      } else {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); 
        
          this.firstDay = this.getFormattedDate(firstDay),
          this.lastDay = this.getFormattedDate(lastDay)

      }

       
    },
    getDayStartEnd(date = new Date()) {
      if(this.$refs.vuecal.viewTitle) {
        let dayString = this.$refs?.vuecal?.viewTitle;
        let dateString = dayString.replace(/^\w+,\s*/, '');
        dateString = dateString.replace(/(\d+)(st|nd|rd|th)/, '$1');
        const dayDate = new Date(dateString);
        if (isNaN(dayDate)) {
            return 'Invalid date format';
        }

        const dayStartDate = new Date(dayDate);
        dayStartDate.setHours(23, 59, 59, 999);


        const dayEndDate = new Date(dayDate);
        dayEndDate.setDate(dayStartDate.getDate() + 1)

        this.firstDay = dayStartDate.toISOString().split('T')[0],
        this.lastDay = dayEndDate.toISOString().split('T')[0]
        
      } else  {
        const firstDay = date

        let lastDay = new Date(firstDay); // Create a copy of the date

         lastDay.setDate(lastDay.getDate() + 1)
        
        
          this.firstDay = this.getFormattedDate(firstDay),
          this.lastDay = this.getFormattedDate(lastDay)
      }
         
    },

    getFormattedDate(dateObj) {
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const year = dateObj.getFullYear();
      return `${day}-${month}-${year}`;
    },


    async fetchEventsList() {
        switch (this.activeView) {
          case "week":
            this.getWeekStartEnd()
            break;
          case "month":
            this.getMonthStartEnd()
            break;
          case "day":
            this.getDayStartEnd()
            break;
          case "year":
            break;
        
          default:
            this.getWeekStartEnd()
            break;
        }
        let requestParams = {
          farmId: this.localFarmId,
          startDate: this.firstDay,
          endDate: this.lastDay,
          country: this.country
        }
        let eventRes = await axios.get(`/farm/farm-calendar-activities/calendar-view`, {
          params: requestParams,
        });
        this.events = eventRes.data.data.rows.map(eve => {

          let tmpObj = {}

    

          tmpObj.title = eve.title
          tmpObj.data = eve
          tmpObj.class = 'leisure'

          if(eve.startDateTime.split("T")[0] == eve.endDateTime.split("T")[0]) {
            tmpObj.start =  `${eve.startDateTime.split("T")[0]} 00:00` 
            tmpObj.end = `${eve.endDateTime.split("T")[0]} 23:59`
          } else {
            tmpObj.start =  `${eve.startDateTime.split("T")[0]} ${eve.startDateTime.split("T")[1].slice(0,5)}` 
            tmpObj.end = `${eve.endDateTime.split("T")[0]} ${eve.endDateTime.split("T")[1].slice(0,5)}`
          }
        
          return tmpObj
        })

        this.eventsCopy = this.events; // for search functionality

    },
  }
}
</script>

<style scoped>

.vuecal__menu, .vuecal__cell-events-count {background-color: #42b983;}
.vuecal__title-bar {background-color: #ffffff;}
.vuecal__cell--today, .vuecal__cell--current {background-color: rgba(240, 240, 255, 0.4);}
.vuecal:not(.vuecal--day-view) .vuecal__cell--selected {background-color: rgba(235, 255, 245, 0.4);}
.vuecal__cell--selected:before {border-color: rgba(66, 185, 131, 0.5);}
html {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.vuecal {height: 90vh; margin-top: 30px}

.vuecal__cell {
  text-align: start !important;
}
.vuecal__event-time {
  display: inline-block;
  margin-top: 12px;
  padding-bottom: 12px;
  margin-left: 10px;

}
.container {
  min-height: 1100px;
  background: white;
}

.v-btn {
  text-transform:none !important;
}

.round-button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f0f0f0; /* Light background */
  border: none; /* No border for minimal look */
  color: #333; /* Text color */
  font-size: 20px; /* Size of the text (icon or character) */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional shadow */
  transition: background-color 0.2s ease;
}

.round-button:hover {
  background-color: #e0e0e0; /* Slightly darker background on hover */
}

.round-button:focus {
  outline: none; /* Remove focus outline for minimalism */
  background-color: #d0d0d0; /* Darker background when focused */
}

.main-middle-date {
  margin-left: 31%;
    max-width: 36%;
}
</style>

<style>
.year-view {
  display: none;
}

</style>
