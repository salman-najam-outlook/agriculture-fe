<template>
  <div class="publishing-blockchain-dialog" v-if="isVisible">
    <div class="dialog-overlay" @click="closeDialog"></div>
    <div class="dialog-container">
      <!-- Header -->
      <div class="dialog-header">
        <h2 class="dialog-title">{{ getHeaderTitle }}</h2>
        <button class="close-button" @click="closeDialog">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="dialog-content">
        <!-- Loading State -->
        <div v-if="currentState === 'loading'">
          <!-- Blockchain Icon -->
          <div class="blockchain-icon">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 10L90 30V70L60 90L30 70V30L60 10Z" stroke="#10B981" stroke-width="3" fill="none"/>
              <path d="M60 25L75 35V55L60 65L45 55V35L60 25Z" stroke="#10B981" stroke-width="2" fill="none"/>
              <!-- Blockchain nodes -->
              <circle cx="60" cy="30" r="4" fill="#10B981"/>
              <circle cx="75" cy="40" r="4" fill="#10B981"/>
              <circle cx="75" cy="50" r="4" fill="#10B981"/>
              <circle cx="60" cy="60" r="4" fill="#10B981"/>
              <circle cx="45" cy="50" r="4" fill="#10B981"/>
              <circle cx="45" cy="40" r="4" fill="#10B981"/>
              <!-- Connection lines -->
              <line x1="60" y1="30" x2="75" y2="40" stroke="#10B981" stroke-width="2"/>
              <line x1="75" y1="40" x2="75" y2="50" stroke="#10B981" stroke-width="2"/>
              <line x1="75" y1="50" x2="60" y2="60" stroke="#10B981" stroke-width="2"/>
              <line x1="60" y1="60" x2="45" y2="50" stroke="#10B981" stroke-width="2"/>
              <line x1="45" y1="50" x2="45" y2="40" stroke="#10B981" stroke-width="2"/>
              <line x1="45" y1="40" x2="60" y2="30" stroke="#10B981" stroke-width="2"/>
            </svg>
          </div>

          <!-- Status Text -->
          <p class="status-text">Publishing report to blockchain, please wait...</p>

          <!-- Progress Bar -->
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <span class="progress-percentage">{{ progress }}%</span>
          </div>
        </div>

        <!-- Completion State -->
        <div v-if="currentState === 'completion'">
          <!-- Blockchain Icon -->
          <div class="blockchain-icon">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 10L90 30V70L60 90L30 70V30L60 10Z" stroke="#10B981" stroke-width="3" fill="none"/>
              <path d="M60 25L75 35V55L60 65L45 55V35L60 25Z" stroke="#10B981" stroke-width="2" fill="none"/>
              <!-- Blockchain nodes -->
              <circle cx="60" cy="30" r="4" fill="#10B981"/>
              <circle cx="75" cy="40" r="4" fill="#10B981"/>
              <circle cx="75" cy="50" r="4" fill="#10B981"/>
              <circle cx="60" cy="60" r="4" fill="#10B981"/>
              <circle cx="45" cy="50" r="4" fill="#10B981"/>
              <circle cx="45" cy="40" r="4" fill="#10B981"/>
              <!-- Connection lines -->
              <line x1="60" y1="30" x2="75" y2="40" stroke="#10B981" stroke-width="2"/>
              <line x1="75" y1="40" x2="75" y2="50" stroke="#10B981" stroke-width="2"/>
              <line x1="75" y1="50" x2="60" y2="60" stroke="#10B981" stroke-width="2"/>
              <line x1="60" y1="60" x2="45" y2="50" stroke="#10B981" stroke-width="2"/>
              <line x1="45" y1="50" x2="45" y2="40" stroke="#10B981" stroke-width="2"/>
              <line x1="45" y1="40" x2="60" y2="30" stroke="#10B981" stroke-width="2"/>
            </svg>
          </div>

          <!-- Status Text -->
          <p class="status-text">Your ESG report is being published to blockchain. You will be redirected to the ESG reports list page to view the status.</p>

          <!-- Close Button -->
          <div class="button-container">
            <button class="close-btn" @click="closeDialog">CLOSE</button>
          </div>
        </div>

        <!-- Success State -->
        <div v-if="currentState === 'success'">
          <!-- Success Icon -->
          <div class="success-icon">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="50" fill="#10B981"/>
              <path d="M40 60L52 72L80 44" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <!-- Status Text -->
          <p class="status-text">Success! The ESG report has been successfully published to the Blockchain.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PublishingBlockchainDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    initialProgress: {
      type: Number,
      default: 0
    },
    state: {
      type: String,
      default: 'loading', // 'loading', 'completion', 'success'
      validator: value => ['loading', 'completion', 'success'].includes(value)
    }
  },
  data() {
    return {
      progress: this.initialProgress,
      isVisible: this.visible,
      currentState: this.state,
      progressInterval: null
    }
  },
  computed: {
    getHeaderTitle() {
      switch (this.currentState) {
        case 'loading':
          return 'Publishing to Blockchain';
        case 'completion':
          return 'Publishing to Blockchain';
        case 'success':
          return 'Success';
        default:
          return 'Publishing to Blockchain';
      }
    }
  },
  watch: {
    visible(newVal) {
      this.isVisible = newVal;
      if (newVal && this.currentState === 'loading') {
        this.startProgress();
      }
    },
    state(newVal) {
      this.currentState = newVal;
      if (newVal === 'loading' && this.isVisible) {
        this.startProgress();
      } else if (newVal !== 'loading') {
        this.stopProgress();
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close');
      this.isVisible = false;
      this.stopProgress();
    },
    startProgress() {
      this.stopProgress(); // Clear any existing interval
      
      this.progressInterval = setInterval(() => {
        if (this.progress < 100) {
          this.progress += Math.random() * 10;
          if (this.progress > 100) this.progress = 100;
        } else {
          this.stopProgress();
          this.currentState = 'completion';
          this.$emit('progress-complete');
        }
      }, 500);
    },
    stopProgress() {
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
    },
    updateProgress(value) {
      this.progress = Math.min(100, Math.max(0, value));
    },
    setState(newState) {
      this.currentState = newState;
      this.$emit('state-changed', newState);
    },
    // Public methods to control the dialog states
    showLoading() {
      this.currentState = 'loading';
      this.progress = 0;
      this.isVisible = true;
      this.startProgress();
    },
    showCompletion() {
      this.currentState = 'completion';
      this.stopProgress();
    },
    showSuccess() {
      this.currentState = 'success';
      this.stopProgress();
    }
  },
  mounted() {
    if (this.visible && this.currentState === 'loading') {
      this.startProgress();
    }
  },
  beforeDestroy() {
    this.stopProgress();
  }
}
</script>

<style scoped>
.publishing-blockchain-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-container {
  position: relative;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-header {
  background: #10B981;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog-title {
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dialog-content {
  padding: 60px 30px;
  text-align: center;
}

.blockchain-icon {
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
}

.success-icon {
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
}

.status-text {
  font-size: 18px;
  color: #6B7280;
  margin: 0 0 40px 0;
  line-height: 1.5;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.button-container {
  margin-top: 40px;
}

.close-btn {
  background: transparent;
  border: 2px solid #10B981;
  color: #10B981;
  padding: 12px 40px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.close-btn:hover {
  background: #10B981;
  color: white;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10B981 0%, #059669 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-percentage {
  font-size: 18px;
  font-weight: 600;
  color: #10B981;
  min-width: 50px;
}

/* Responsive */
@media (max-width: 640px) {
  .dialog-container {
    margin: 20px;
    width: calc(100% - 40px);
  }
  
  .dialog-header {
    padding: 15px 20px;
  }
  
  .dialog-title {
    font-size: 20px;
  }
  
  .dialog-content {
    padding: 40px 20px;
  }
  
  .blockchain-icon svg {
    width: 100px;
    height: 100px;
  }
  
  .status-text {
    font-size: 16px;
  }
}
</style>