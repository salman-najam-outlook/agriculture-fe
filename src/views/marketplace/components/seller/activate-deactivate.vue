<template>
  <v-card>
    <v-card-title class="card-header-green white--text">
      {{ headerTitle }}
      <v-spacer></v-spacer>
      <v-btn icon dark @click="closeDialog" aria-label="Close dialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text class="pt-4" v-if="!isDeactivated">
      <div class="text-h6 mb-4">
        {{ deactivateConfirmationText }}
      </div>
      <v-text-field v-model="reason" label="Reason" outlined multiline rows="4"></v-text-field>
      <div class="mb-4">
        <div class="text-h6 mb-2">{{ $t('marketplace.sellers.predefinedRangeLabel')}}</div>
        <v-radio-group v-model="selectedRange" row>
          <v-col cols="12" md="6">
            <v-radio :label="$t('marketplace.sellers.rangeOneDay')" value="day"></v-radio>
          </v-col>
          <v-col cols="12" md="6">
            <v-radio  :label="$t('marketplace.sellers.rangeOneWeek')" value="week"></v-radio>
          </v-col>
          <v-col cols="12" md="6">
            <v-radio  :label="$t('marketplace.sellers.rangeOneMonth')" value="month"></v-radio>
          </v-col>
          <v-col cols="12" md="6">
            <v-radio  :label="$t('marketplace.sellers.rangeLifetime')" value="lifetime"></v-radio>
          </v-col>
          <v-col cols="12" md="6">
            <v-radio  :label="$t('marketplace.sellers.rangeCustom')" value="custom"></v-radio>
          </v-col>
        </v-radio-group>
      </div>
      <div class="mb-4" v-if="selectedRange === 'custom'">
        <v-row>
          <v-col cols="6">
            <v-menu v-model="fromDateMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
              <template v-slot:activator="{ on }">
                <v-text-field v-model="fromDate" label="From" readonly outlined dense append-icon="mdi-calendar" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="fromDate" no-title @input="fromDateMenu = false" :min="minDate"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6">
            <v-menu v-model="toDateMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
              <template v-slot:activator="{ on }">
                <v-text-field v-model="toDate" label="To" readonly outlined dense append-icon="mdi-calendar" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="toDate" no-title @input="toDateMenu = false" :min="minDate"></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </div>
    </v-card-text>

    <v-card-text class="pt-4" v-else>
      <div class="text-h6 mb-4">
        {{ $t('marketplace.sellers.activationDateLabel') }} : {{ activationDate }}
      </div>
      <div>
        {{ $t('marketplace.sellers.deactivationReasonLabel') }}
        <p>{{ selectedUser.deactivation_reason }}</p>
      </div>
      <div class="mb-4">
        {{ $t('marketplace.sellers.activateConfirmationText')  }} "{{ selectedUser.full_name }}"?
      </div>
      <div class="d-flex align-switch">
        <span class="text-h6">{{ $t('marketplace.sellers.activateLabel') }}</span>
        <v-switch inset v-model="activationStatus" :value="isDeactivated"></v-switch>
      </div>
    </v-card-text>

    <v-card-actions class="pb-6 px-6 d-flex justify-end">
      <v-btn outlined class="px-6" color="green" @click="closeDialog">{{ $t('cancel') }}</v-btn>
      <v-btn class="card-header-green px-6" @click="submitForm" :disabled="activationStatus !== true">{{ successButton }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import UserService from "@/_services/UserService";
import loadingMixin from "@/mixins/LoadingMixin";

export default {
  name: "DeactivateAccountDialog",
  mixins: [loadingMixin],
  props: {
    showActivateDeactivate: { type: Boolean, default: false },
    selectedUser: { type: Object, default: () => ({}) },
  },
  computed: {
    isDeactivated() {
      return this.selectedUser.is_active === false;
    },
    deactivateConfirmationText() {
      return `${this.$t('marketplace.sellers.deactivateConfirmationText')} "${this.selectedUser.full_name}"?`;
    },
    activationDate() {
      return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    }
  },
  watch: {
    selectedRange(newRange) {
      this.setDateRange(newRange);
    },
  },
  data() {
    const today = new Date();
    return {
      dialog: false,
      reason: "",
      selectedRange: "day",
      fromDate: today.toISOString().substr(0, 10),
      toDate: "",
      fromDateMenu: false,
      toDateMenu: false,
      successButton: "Complete",
      headerTitle: this.$t('marketplace.sellers.headerTitleActivate'),
      activationStatus: true,
      minDate: today.toISOString().substr(0, 10),
    };
  },
  mounted() {
    this.headerTitle = this.isDeactivated ? this.$t('marketplace.sellers.headerTitleActivate') : this.$t('marketplace.sellers.headerTitleDeactivate');
    this.successButton = this.isDeactivated ? this.$t('marketplace.sellers.completeButton') : this.$t('marketplace.sellers.deactivateButton');
    this.setDateRange(this.selectedRange);
  },
  methods: {
    setDateRange(range) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      switch (range) {
        case "day":
          this.fromDate = today.toISOString().substr(0, 10);
          this.toDate = tomorrow.toISOString().substr(0, 10);
          break;
        case "week":{
          this.fromDate = today.toISOString().substr(0, 10);
          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() + 7);
          this.toDate = nextWeek.toISOString().substr(0, 10);
          break;
        }
        case "month": {
          this.fromDate = today.toISOString().substr(0, 10);
          const nextMonth = new Date();
          nextMonth.setMonth(today.getMonth() + 1);
          this.toDate = nextMonth.toISOString().substr(0, 10);
          break;
        }
        case "lifetime":
          this.fromDate = today.toISOString().substr(0, 10);
          this.toDate = "";
          break;
        case "custom":
          this.fromDate = "";
          this.toDate = "";
          break;
      }
    },
    closeDialog() {
      this.$emit("closeModel");
      this.dialog = false;
      this.resetForm();
    },
    submitForm() {
      if (this.isDeactivated) {
        this.reactivateAccount();
      } else {
        this.deactivateAccount();
      }
    },
    resetForm() {
      this.reason = "";
      this.selectedRange = "week";
      this.setDateRange(this.selectedRange);
    },
    deactivateAccount() {
      this.startLoading();
      UserService.deactivateUser(this.selectedUser.connected_farmer_user_id, "marketplace", {
        deactivation_reason: this.reason,
        is_active: false,
        range: this.selectedRange,
        deactivation_start_date: this.fromDate,
        deactivation_end_date: this.toDate,
      })
        .then(() => {
          this.closeDialog();
          this.$emit("successResponse");
          this.$notify({
            title: this.$t("marketplace.sellers.deactivateSuccessMessage"),
            type: "success",
          });
        })
        .catch((error) => {
          console.error("Error deactivating account:", error);
          this.$notify({
            title: this.$t("marketplace.sellers.deactivateErrorMessage"),
            type: "error",
          });
        })
        .finally(() => {
          this.stopLoading();
        });
    },
    reactivateAccount() {
      this.startLoading();
      UserService.reactivateUser(this.selectedUser.connected_farmer_user_id, "marketplace", {})
        .then(() => {
            this.closeDialog();
            this.$emit("successResponse");
            this.$notify({
            title: this.$t("marketplace.sellers.reactivateSuccessMessage"),
            type: "success",
          });
          })
        .catch((error) => {
          console.error("Error reactivating account:", error);
          this.$notify({
            title: this.$t("marketplace.sellers.reactivateErrorMessage"),
            type: "error",
          });
        })
        .finally(() => {
          this.stopLoading();
        });
    },
  },
};
</script>

<style scoped>
.card-header-green {
  background: #00bd73 !important;
  color: #ffffff !important;
}

.v-card__title {
  position: relative;
}

.align-switch {
  align-items: center;
  margin-right: 10px;
}
</style>