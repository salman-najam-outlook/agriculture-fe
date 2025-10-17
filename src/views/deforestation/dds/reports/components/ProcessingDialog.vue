<template>
  <v-dialog transition="dialog-top-transition" max-width="600" v-model="dialog" persistent>
    <v-card rounded="0">
      <v-toolbar color="primary" class="white--text" flat :elevation="0">
        <v-toolbar-title class="font-weight-bold">
          {{ heading }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pt-5 text-center">
        <slot>
          <v-progress-circular color="primary" indeterminate :size="100"></v-progress-circular>
        </slot>
        <p class="text-center black--text text-body-1 mt-3">
          {{ description }} 
          <span class="" v-if="hasTimer">
            <strong>
              {{ timeLeft }} sec
            </strong>
          </span>
        </p>
        <div class="d-flex align-center mb-2" v-if="showProgress">
          <v-progress-linear
            v-model="progress"
            color="primary"
            height="8"
            rounded
          ></v-progress-linear>
          <span class="ml-2">{{ progress }}%</span>
        </div>
        <v-btn color="primary" outlined @click="onClose">{{ $t('dueDiligence.close')}}</v-btn>
      </v-card-text>
    </v-card>

    <!-- </template> -->
  </v-dialog>
</template>

<script>
export default {
  props: {
    heading: {
      type: String,
      default: 'Processing',
      required: false,
    },
    description: {
      type: String,
      default: 'Your task is being processed.',
    },
    dialog: {
      required: false,
      type: Boolean,
      default: true,
    },
    showProgress: {
      required: false,
      type: Boolean,
      default: false,
    },
    progress: {
      required: false,
      type: Number,
      default: 50
    },
    startTimerModel: {
      required: false,
      type: Number
    },
    hasTimer: {
      required: false,
      type: Boolean,
    },
  },
  data() {
    return {
      timeLeft: 30,
      timer: null, // To store the setInterval ID
      timerRunning: false,
      timerExpired: false,
    };
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
        startTimer() {
      if (this.timerRunning) return; // Prevent multiple timers

      this.timerRunning = true;
      this.timerExpired = false;
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.stopTimer();
          this.timerExpired = true;
        }
      }, 1000); // Update every second
    },
    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.timerRunning = false;
    },
    resetTimer() {
      this.stopTimer();
      this.timeLeft = 30;
      this.timerExpired = false;
    },
  },
  watch: {
    startTimerModel() {
        console.log('startTimerModel changed:', this.startTimerModel);
        this.startTimer();

    },
  },
    beforeUnmount() {
    this.stopTimer();
  },
};
</script>
