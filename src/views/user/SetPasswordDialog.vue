<template>
  <v-dialog max-width="800px" @click:outside="onCancel" scrollable v-bind="$attrs">
    <v-card>
      <v-toolbar flat color="primary" class="white--text">
        <v-toolbar-title class="font-weight-bold">{{ $t('password.updatePassword') }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="px-4 py-4" style="max-height: 480px">
        <h2 class="text-h6 black--text mb-3">{{ $t('password.generateNewPassword') }}</h2>
        <p class="text-body-2">
          {{ $t('password.assignPasswordMessage') }}
        </p>
        <div class="d-flex align-center mt-1" style="gap: 12px">
          <v-btn
            plain
            color="primary"
            class="font-weight-bold"
            style="color: #0ebf67 !important; padding: 0"
            @click="generatePassword"
          >
            {{ $t('password.generateSecurePassword') }}
          </v-btn>
          <v-text-field
            v-if="generatedPassword.length > 0"
            :value="generatedPassword"
            readonly
            outlined
            dense
            hide-details="auto"
            style="max-width: 140px"
            @click="$event.target.select()"
            @focus="$event.target.select()"
          ></v-text-field>
          <v-btn
            plain
            color="primary"
            class="font-weight-bold"
            style="color: #0ebf67 !important; padding: 0"
            @click="copyToClipboard"
            v-if="generatedPassword.length > 0"
          >
            {{ $t('copy') }}
            <v-icon right>mdi-content-copy</v-icon>
          </v-btn>
        </div>

        <v-form
          @submit.prevent="onFormSubmit"
          ref="form"
          v-model="form.valid"
          lazy-validation
          class="mt-6 d-flex flex-wrap"
          style="gap: 12px"
        >
          <label class="d-flex flex-column">
            <span class="mb-1">{{ $t('password.newPassword') }}</span>
            <v-text-field
              v-model="form.data.password"
              :rules="form.rules.password"
              type="password"
              outlined
              hide-details="auto"
              required
              dense
              :placeholder="$t('password.enterNewPassword')"
              validate-on-blur
            ></v-text-field>
          </label>
          <label class="d-flex flex-column">
            <span class="mb-1">{{ $t('password.confirmNewPassword') }}</span>
            <v-text-field
              v-model="form.data.confirmPassword"
              :rules="form.rules.confirmPassword"
              type="password"
              outlined
              hide-details="auto"
              required
              dense
              :placeholder="$t('password.reenterNewPassword')"
              validate-on-blur
            ></v-text-field>
          </label>
        </v-form>

        <div v-if="passwordHistories.length > 0">
          <v-divider class="mt-6 mb-6"></v-divider>
          <h2 class="text-h6 mb-3 black--text">{{ $t('password.passwordHistory') }}</h2>
          <ul style="list-style: none; gap: 8px" class="pl-0 d-flex flex-column">
            <li v-for="history in passwordHistories" :key="history.id" class="mb-1 text-body-2">
              <span v-if="history.type === 'UPDATE'">
                {{ $t('password.passwordUpdatedLog', { userName: history.actionUser.fullName, date: formatDateTime(history.createdAt) }) }}
              </span>
              <span v-else-if="history.type === 'FORGOT_REQUEST'">
                {{ $t('password.forgotPasswordLog', { userName: history.actionUser.fullName, date: formatDateTime(history.createdAt) }) }}
              </span>
            </li>
          </ul>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-end">
        <v-btn outlined color="primary" @click="onCancel">{{ $t('cancel') }}</v-btn>
        <v-btn color="primary" @click="onFormSubmit">{{ $t('confirm') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import LoadingMixin from '@/mixins/LoadingMixin';
import UserService from '../../_services/UserService';
import moment from 'moment';

export default {
  mixins: [LoadingMixin],

  props: {
    userId: {
      type: [String, Number],
      required: false,
    },
  },

  watch: {
    '$attrs.value': async function (newValue) {
      if (!newValue) {
        this.onCancel(false);
      } else {
        this.startLoading();
        await this.fetchPasswordHistories();
        this.stopLoading();
      }
    },
  },

  data() {
    return {
      passwordHistories: [],
      generatedPassword: '',
      form: {
        valid: true,
        data: {
          password: '',
          confirmPassword: '',
        },
        rules: {
          password: [
            (v) => !!v || this.$t('addEdituser.pswRequired'),
            (v) => !v ? true : v.length >= 8 || this.$t('password.min8CharacterMessage'),
          ],
          confirmPassword: [
            (v) => !!v || this.$t('addEdituser.pswRequired'),
            (v) => v === this.form.data.password || this.$t('passwordDoesNotMatch'),
          ],
        },
      },
    };
  },

  methods: {
    getHistoryUserName(history) {
      if(history.actionUser?.fullName) return history.actionUser.fullName;

      if(history.actionUserId === history.userId) {
        return this.$t('user');
      }

      return this.$t('admin');
    },
    generatePassword() {
      // Generate a simple secure password containing letters, numbers and special characters only
      const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@_+-=';
      let password = '';
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }
      this.generatedPassword = password;
    },

    copyToClipboard() {
      navigator.clipboard.writeText(this.generatedPassword);
    },

    async fetchPasswordHistories() {
      if (!this.userId) return;
      try {
        const response = await UserService.getAllPasswordHistoriesByUserId(this.userId);
        this.passwordHistories = response.data;
      } catch (error) {
        console.error('Error fetching password histories:', error);
      }
    },

    formatDateTime(dateString) {
      return moment(dateString).format('DD-MMM-YYYY | hh:mm:ss A');
    },

    onFormSubmit() {
      if (this.$refs.form.validate()) {
        this.$emit('passwordSet', {
          password: this.form.data.password,
          userId: this.userId,
        });
      }
    },

    onCancel(shouldEmit = true) {
      this.passwordHistories = [];
      this.generatedPassword = '';
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
      if (shouldEmit) {
        this.$emit('cancel');
      }
    },
  },
};
</script>
