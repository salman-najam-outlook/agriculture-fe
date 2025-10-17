<template>
  <v-dialog
    v-model="isOpen"
    max-width="1400"
    @click:outside="closeModal"
    @keydown.esc="closeModal"
  >
    <v-card class="dds-modal">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-content">
          <div class="header-left">
            <h2 class="modal-title">{{ $t('dueDiligence.ddsReports') }}</h2>
          </div>
          <v-btn
            icon
            @click="closeModal"
            class="close-btn white--text"
            style="color: white !important;"
          >
            <v-icon size="24" color="white" style="color: white !important;">mdi-close</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="modal-body">
        <div class="content-wrapper">
          <AdminDueDiligenceReports 
            ref="reportsComponent"
            :is-in-modal="true" 
          />
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import AdminDueDiligenceReports from '../AdminDueDiligenceReportsComponent.vue';

export default {
  name: 'DDSCardModal',
  components: {
    AdminDueDiligenceReports
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    cardData: {
      type: Object,
      default: () => ({
        title: '',
        value: 0,
        icon: '',
        color: '#0170E5',
        trend: null,
        category: '',
        description: '',
        subtitle: ''
      })
    },
    filterData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    iconPath() {
      return `/icons/dds/${this.cardData.icon}.svg`;
    },
    iconContainerStyle() {
      return {
        backgroundColor: `${this.cardData.color}20`,
        borderRadius: '12px',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
    }
  },
  watch: {
    isOpen(newVal) {
      if (!newVal) {
        this.$emit('close');
      } else if (newVal && this.filterData && Object.keys(this.filterData).length > 0) {
        // When modal opens with filter data, apply filters to the reports component
        this.$nextTick(() => {
          if (this.$refs.reportsComponent) {
            this.$refs.reportsComponent.handleDashboardCardClick(this.filterData);
          }
        });
      }
    },
    filterData: {
      handler(newVal) {
        // When filter data changes and modal is open, apply the new filters
        if (this.isOpen && newVal && Object.keys(newVal).length > 0) {
          this.$nextTick(() => {
            if (this.$refs.reportsComponent) {
              this.$refs.reportsComponent.handleDashboardCardClick(newVal);
            }
          });
        }
      },
      deep: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.dds-modal {
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  background: #184980;
  padding: 16px 24px;
  position: relative;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.modal-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.close-btn {
  color: white !important;
  position: absolute;
  top: 12px;
  right: 12px;
  border-radius: 50% !important;
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
}

.close-btn:hover {
  transform: scale(1.05);
  transition: all 0.2s ease;
  background-color: rgba(0, 0, 0, 0.259) !important;
}

.close-btn .v-icon {
  color: white !important;
  font-size: 24px !important;
}

/* Additional strong overrides for white color */
.close-btn.v-btn,
.close-btn.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined),
.close-btn.v-btn .v-btn__content,
.close-btn .v-icon,
.close-btn i.v-icon {
  color: white !important;
}

.close-btn.white--text,
.close-btn.white--text .v-icon,
.close-btn.white--text i.v-icon {
  color: white !important;
}

.modal-body {
  background: #ffffff;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.content-wrapper {
  padding: 16px;
  min-height: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-header {
    padding: 16px !important;
  }
  
  .modal-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .modal-header .d-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .close-btn {
    align-self: flex-end;
    margin-top: -8px;
  }
}
</style>