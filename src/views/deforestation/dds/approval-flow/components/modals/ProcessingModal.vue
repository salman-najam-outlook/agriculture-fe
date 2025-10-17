<template>
  <v-dialog v-model="localDialog" persistent :max-width="$vuetify.breakpoint.mobile ? '95vw' : '800'">
    <v-card>
      <v-toolbar color="primary" elevation="0">
        <v-toolbar-title class="white--text">
          {{ $t('dueDiligence.processing') }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="white" icon @click="closeModal">
          <v-icon style="color:white !important">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pt-5 black--text">
        <div class="mb-4 flex-item">
          <v-progress-circular
            indeterminate
            color="primary"
            size="100"
            width="10"
          ></v-progress-circular>

          <p class="processing-text">
            {{ $t('dueDiligence.ddsReportProcessing') }}
          </p>

          <span v-if="hasTimer">
            <strong>{{ timeLeft }} sec</strong>
          </span>
        </div>
      </v-card-text>

      <v-card-actions class="px-6 pb-4">
        <v-spacer></v-spacer>
        <v-btn outlined color="primary" @click="closeModal">
          {{ $t('close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      localDialog: false,
      timeLeft: 50,
      hasTimer: true,
      timer: null,
      timerRunning: false,
    }
  },
  watch: {
    dialog(val) {
      this.localDialog = val;
      if (val) {
        this.startTimer();
      } else {
        this.resetTimer();
      }
    },
  },
  methods: {
    startTimer() {
      if (this.timerRunning) return;

      this.timerRunning = true;
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.stopTimer();
          this.closeModal();   // ⏹️ automatically close when time's up
        }
      }, 1000);
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.timerRunning = false;
    },
    resetTimer() {
      this.stopTimer();
      this.timeLeft = 50;
    },
    closeModal() {
      this.$emit('close');
      this.localDialog = false;
      this.resetTimer();
    }
  },
  beforeUnmount() {
    this.stopTimer();
  },
}
</script>

<style scoped>
.flex-item {
  display: flex;
  align-items: center;
  flex-direction: column;
}
p.processing-text {
  font-size: 20px;
  line-height: 28px;
  text-align: center;
}
</style>
