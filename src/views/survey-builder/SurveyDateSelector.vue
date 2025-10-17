<template>
  <div>
  <v-dialog v-model="dialog" width="350" @click:outside="closeModal" :retain-focus="false">
    <v-card height="520" rounded="0">
      <v-toolbar color="primary" class="white--text">
        <v-toolbar-title class="font-weight-bold">
          {{ $t("surveyBuilder.chooseDate") }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="pa-5 d-flex flex-column align-center">
        <v-date-picker v-model="date" no-title show-adjacent-months :min="minDay"></v-date-picker>
        <div>
          <label class="font-weight-bold">{{
            $t("surveyBuilder.selectedDate")
          }}</label>
          <div v-if="date">
            <v-icon class="pb-1" small @click="date = null;">
              mdi-close-circle
            </v-icon>
            <span>
            {{ formatDate(date) }}
            </span>
          </div>
          <div v-else class="mt-10">
          </div>
        </div>
        <v-row justify="center" class="mt-10">
          <v-btn absolute bottom height="44" width="150" depressed color="primary"
            @click="dateSelect">{{
            $t("surveyBuilder.select")
          }}
          </v-btn>
        </v-row>
      </div>
    </v-card>
  </v-dialog>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      date: '',
    }
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    defaultDate: {
      type: String,
      required: false,
    },
    startDate: {
      type: String,
      required: false,
    }
  },
  watch: {
    defaultDate: {
      handler() {
        this.date = this.defaultDate;
      }
    }
  },
  computed: {
    minDay() {
      if (this.startDate) {
        let addOneDay = new Date(this.startDate);
        addOneDay.setDate(addOneDay.getDate() + 1)
        return addOneDay.toISOString().split('T')[0];
      }
      let today = new Date();
      return today.toISOString().split('T')[0];
    }
  },
  mounted() {
    this.date = this.defaultDate;
  },
  methods: {
    closeModal() {
      this.$emit("closeDialog");
    },
    formatDate(date) {
      return moment(date).format("DD-MMM-YYYY");
    },
    dateSelect() {
      this.$emit("setDate", this.date);
      this.date = '';
      this.closeModal();
    }
  }
}
</script>
<style scoped>
</style>