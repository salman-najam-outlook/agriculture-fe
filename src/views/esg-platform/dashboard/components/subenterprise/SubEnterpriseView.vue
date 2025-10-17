<template>
  <v-dialog v-model="dialog" max-width="700px" @click:outside="closeDialog">
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title class="white--text">{{ !enterpriseData ? $t('blends.manageProducts.addNewProduct') :
          enterpriseData.name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-card-text>
          <v-row class="pt-4">
            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.enterpriseName') }}</h4>
              <p>{{ enterpriseData.name }}</p>
            </v-col>

            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.enterpriseEmail') }}</h4>
              <p>{{ enterpriseData.primaryUser ? enterpriseData.primaryUser.email : '-' }}</p>
            </v-col>

            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.enterprisePhoneNumber') }}</h4>
              <p>{{ enterpriseData.primaryUser ? enterpriseData.primaryUser.mobile : '-' }}</p>
            </v-col>

            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.country') }}</h4>
              <p>{{ enterpriseData.primaryUser ? enterpriseData.primaryUser.country : '-' }}</p>
            </v-col>
            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.province') }}</h4>
              <p>{{ enterpriseData.primaryUser ? enterpriseData.primaryUser.stateId : '-' }}</p>
            </v-col>

            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.region') }}</h4>
              <p>{{ enterpriseData.primaryUser ? enterpriseData.primaryUser.district : '-' }}</p>
            </v-col>
            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.village') }}</h4>
              <p>{{ enterpriseData.primaryUser ? enterpriseData.primaryUser.village : '-' }}</p>
            </v-col>

            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.address') }}</h4>
              <p>{{ enterpriseData.primaryUser ? enterpriseData.primaryUser.address : '-' }}</p>
            </v-col>
            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.membershipPlan') }}</h4>
              <p>-</p>
            </v-col>

            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.dateOfRegistration') }}</h4>
              <p>{{ this.formatDate(enterpriseData.registrationDate) }}</p>
            </v-col>
            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.subscriptionUpTo') }}</h4>
              <p>{{ this.formatDate(enterpriseData.subscriptionEndDate) }}</p>
            </v-col>

            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.licenseID') }}</h4>
              <p>{{ enterpriseData.licenseId || '-' }}</p>
            </v-col>
            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.activationKeys') }}</h4>
              <p>{{ enterpriseData.activationKeysAllowed }}</p>
            </v-col>

            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.users') }}</h4>
              <p>{{ enterpriseData.users.length || 0 }}</p>
            </v-col>
            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.status') }}</h4>
              <v-btn small rounded min-width="150" depressed class="m-6 green-button" height="40"
                v-if="enterpriseData.status?.toLowerCase() === 'active'">
                {{ $t("esgPlatform.common.active") }}
              </v-btn>
              <v-btn small rounded min-width="150" depressed class="m-6 red-button" height="40" v-else>
                {{ $t("esgPlatform.common.deactivated") }}
              </v-btn>
            </v-col>

            <v-col cols="6">
              <h4>{{ $t('esgPlatform.dashboard.products') }}</h4>
              <p>{{ productNames }}</p>
            </v-col>

            <v-col cols="6" v-if="enterpriseData.accessmentReportUrl">
              <h4>{{ $t('esgPlatform.dashboard.initialAssessmentReport') }}</h4>

              <div class="docs-preview">
                <div class="pdf-box">
                  <a :href="enterpriseData.accessmentReportUrl" target="_blank" title="View PDF" aria-label="View PDF">
                    <v-icon color="primary" class="pdf-eye">mdi-eye</v-icon>
                  </a>
                  <h1>PDF</h1>
                </div>
                <span>Attachment1</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="py-6 px-2" style="padding-right: 0">
          <v-spacer></v-spacer>
          <v-btn outlined class="mr-2" right height="44" width="116" depressed color="primary" @click="closeDialog">
            {{ $t('blends.manageProducts.cancel') }}
          </v-btn>

          <v-btn class="mr-2" right height="44" width="116" depressed color="primary" @click="editAccount"
            :disabled="isUploading">
            {{ $t('blends.manageProducts.edit') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import DateMixin from '@/mixins/DateMixin';

export default {
  components: {
  },
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    enterpriseData: {
      type: Object,
      default: null
    }
  },
  computed: {
    productNames() {
      if (!this.enterpriseData.products || this.enterpriseData.products.length === 0) {
        return '-';
      }
      return this.enterpriseData.products.map(product => product.name).join(', ')
    }
  },
  data() {
    return {
    };
  },
  watch: {
    enterpriseData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.productTitle = newVal.name || '';
          this.hsCode = newVal.hsCode || '';
          this.uploadedFileUrl = newVal.s3Key || '';
        }
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    editAccount() {
      this.$emit('save', this.enterpriseData);
    }
  },
  mixins: [DateMixin]
};
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}

.v-btn {
  font-weight: bold;
}

.pdf-box {
  height: 75px;
  width: 75px;
  background-color: #e5f8f1;
  position: relative;
  line-height: 75px;
  text-align: center;
  display: flex;
  justify-content: center;
  border-radius: 4px;
}

.pdf-box h1 {
  color: #135B00;
  font-size: 12px;
}

.pdf-eye {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 16px;
}
</style>
