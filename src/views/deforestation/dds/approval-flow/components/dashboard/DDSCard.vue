<template>
  <v-card
    class="dds-card pa-4"
    :class="cardClass"
    elevation="0"
    outlined
    @click="handleCardClick"
    :style="{ cursor: 'pointer' }"
    :ripple="false"
    flat
  >
    <div class="card-main-layout">
      <!-- Left Section: Icon, Value, Title -->
      <div class="left-section">
        <div class="icon-container" :style="iconContainerStyle">
          <img :src="iconPath" :alt="title" class="card-icon" />
        </div>
        
        <div class="content-section">
          <h2 class="card-value" :style="valueStyle">{{ formattedValue }}</h2>
          <p class="card-title">{{ title }}</p>
        </div>
      </div>
      
      <!-- Right Section: Tooltip and Trend -->
      <div class="right-section">
        <!-- Top: Info tooltip -->
        <div class="tooltip-container" v-if="showInfo">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                size="20"
                class="card-info-icon"
              >
                mdi-information
              </v-icon>
            </template>
            <span>{{ infoTooltip }}</span>
          </v-tooltip>
        </div>
        
        <!-- Bottom: Trend indicator -->
        <div v-if="showTrend" class="trend-container">
          <img 
            :src="trendIconPath"
            :alt="trend >= 0 ? 'Up trend' : 'Down trend'"
            class="trend-arrow"
          />
          <span class="trend-text" :style="{ color: trendColor }">{{ trendPercentage }}%</span>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import {isIndonesianClient, isKenyaClient} from '@/utils';
export default {
  name: 'DDSCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#0170E5'
    },
    trend: {
      type: Number,
      default: null
    },
    showInfo: {
      type: Boolean,
      default: true
    },
    infoTooltip: {
      type: String,
      default: 'Additional information'
    },
    variant: {
      type: String,
      default: 'default', // default, mobile
      validator: value => ['default', 'mobile'].includes(value)
    }
  },
  computed: {
    iconPath() {
      return `/icons/dds/${this.icon}.svg`;
    },
    formattedValue() {
      if (typeof this.value === 'number') {
        return this.value.toLocaleString();
      }
      return this.value;
    },
    iconContainerStyle() {
      return {
        borderRadius: '50%',
        width: this.variant === 'mobile' ? '60px' : '50px',
        height: this.variant === 'mobile' ? '60px' : '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
    },
    valueStyle() {
      return {
        color: '#111827',
        fontSize: this.variant === 'mobile' ? '3.5rem' : '3.25rem',
        fontWeight: '800',
        lineHeight: '1',
        margin: '0',
        letterSpacing: '-0.02em'
      };
    },
    cardClass() {
      return {
        'mobile-card': this.variant === 'mobile',
        'desktop-card': this.variant === 'default'
      };
    },
    showTrend() {
      return this.trend !== null && this.trend !== undefined;
    },
    trendIconPath() {
      return this.trend >= 0 ? '/icons/dds/upArrow.svg' : '/icons/dds/downArrow.svg';
    },
    trendColor() {
      return this.trend >= 0 ? '#4CAF50' : '#F44336';
    },
    trendPercentage() {
      return Math.abs(this.trend);
    },
    isIndonesianClient() {
      return isIndonesianClient();
    },
    isKenyaClient() {
      return isKenyaClient();
    }
  },
  methods: {
    handleCardClick() {
      this.$emit('card-click', {
        title: this.title,
        value: this.value,
        icon: this.icon,
        color: this.color,
        trend: this.trend,
        infoTooltip: this.infoTooltip
      });
    }
  }
};
</script>

<style scoped>
.card-info-icon {
  color: v-bind('isIndonesianClient ? "#00559F" : isKenyaClient ? "#944A00" : "#00bd73"');
}

.dds-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  padding: 24px !important;
}

.dds-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  transform: translateY(0);
}

/* Prevent unwanted color changes and visual effects on click/focus */
.dds-card:active,
.dds-card:focus {
  outline: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  transform: translateY(0);
  background: #ffffff !important;
  border: 1px solid #E5E7EB !important;
}

.dds-card:active *,
.dds-card:focus * {
  color: inherit !important;
}

/* Ensure no focus ring appears */
.dds-card:focus-visible {
  outline: none !important;
}

/* Override any Vuetify default styles */
.dds-card.v-card--link:before {
  display: none !important;
}

.dds-card.v-card:not(.v-card--flat):not(.v-card--hover):focus:before,
.dds-card.v-card:not(.v-card--flat):not(.v-card--hover):hover:before {
  opacity: 0 !important;
}

/* Disable any ripple or overlay effects */
.dds-card .v-ripple__container {
  display: none !important;
}

.dds-card::before,
.dds-card::after {
  display: none !important;
}

.desktop-card {
  min-height: 140px;
}

.mobile-card {
  min-height: 160px;
  margin: 8px;
}

.card-main-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 80px;
}

.left-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  flex: 1;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.right-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-end;
  min-height: 100%;
  position: relative;
}

.icon-container {
  flex-shrink: 0;
  margin-top: 0;
}

.tooltip-container {
  display: flex;
  justify-content: flex-end;
  padding-right: 5px;
  align-items: flex-start;
}

.card-icon {
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.mobile-card .card-icon {
  width: 64px;
  height: 64px;
}

.card-title {
  font-size: 0.95rem;
  color: #374151;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
  letter-spacing: -0.01em;
}

.mobile-card .card-title {
  font-size: 1.1rem;
}

.trend-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.trend-text {
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1;
  margin-top: 0;
}

.trend-arrow {
  width: 28px;
  height: 28px;
  object-fit: contain;
  margin-right: 0;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .dds-card {
    margin: 4px;
    padding: 20px !important;
  }
  
  .card-main-layout {
    min-height: 70px;
  }
  
  .left-section {
    gap: 8px;
    flex-direction: row;
    align-items: center;
  }
  
  .right-section {
    min-height: 50px;
    justify-content: space-between;
  }
}

@media (max-width: 600px) {
  .mobile-card {
    min-height: 140px;
  }
  
  .dds-card {
    padding: 16px !important;
  }
  
  .left-section {
    gap: 10px;
    flex-direction: row;
    align-items: center;
  }
  
  .card-main-layout {
    min-height: 60px;
  }
  
  .right-section {
    min-height: 60px;
    justify-content: space-between;
  }
  
  .card-value {
    font-size: 2.5rem !important;
  }
  
  .card-title {
    font-size: 0.9rem !important;
  }
  
  .card-icon {
    width: 48px !important;
    height: 48px !important;
  }
}
</style>