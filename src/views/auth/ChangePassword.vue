<template>
	<v-container fluid>
	  <v-row>
		<v-col cols="6" class="pa-0">
		  <AuthSidebar/>
		</v-col>
		<v-col cols="6" class="pa-0">
		  <v-card flat elevation="0" height="100%">
			<v-card-text>
			  <v-row class="text-right">
				<v-col cols="9"></v-col>
				<v-col cols="3" class="pr-0 mr-0 float-right">
				  <LanguageSelection/>
				</v-col>
			  </v-row>
			  <v-row align="center" justify="center">
				<v-col cols="10" class="pts">
				  <v-card flat elevation="0">
					<v-card-title class="px-0">
					  <div class="text-h4 font-weight-black">{{ $t('forgot.changePassword') }}</div>
					</v-card-title>
					<v-card-subtitle class="px-0">
					  <div class="">{{ $t('forgot.changePasswordSubtitle') }}</div>
					</v-card-subtitle>
					
					<v-form ref="changePasswordForm" v-model="isFormValid">
					  <v-text-field
						:placeholder="$t('email')"
						outlined
						dense
						type="email"
						prepend-inner-icon="mdi-email-outline"
						v-model="email"
						:error-messages="emailError"
						:rules="emailRules"
					  ></v-text-field>

					  <v-text-field
						:placeholder="$t('forgot.oldPassword')"
						outlined
						dense
						:type="oldPasswordType"
						prepend-inner-icon="mdi-lock-outline"
						v-model="oldPassword"
						:error-messages="oldPasswordError"
						:append-icon="oldPasswordIcon"
						@click:append="toggleOldPasswordVisibility"
						:rules="[v => !!v || $t('forgot.oldPasswordRequired')]"
					  ></v-text-field>

					  <v-text-field
						:placeholder="$t('forgot.newPassword')"
						outlined
						dense
						:type="newPasswordType"
						prepend-inner-icon="mdi-lock-outline"
						v-model="newPassword"
						:error-messages="newPasswordError"
						:append-icon="newPasswordIcon"
						@click:append="toggleNewPasswordVisibility"
						:rules="passwordRules"
					  ></v-text-field>
  
					  <v-text-field
						:placeholder="$t('forgot.confirmPassword')"
						outlined
						dense
						:type="confirmPasswordType"
						prepend-inner-icon="mdi-lock-outline"
						v-model="confirmPassword"
						:error-messages="confirmPasswordError"
						:append-icon="confirmPasswordIcon"
						@click:append="toggleConfirmPasswordVisibility"
						:rules="confirmPasswordRules"
					  ></v-text-field>
  
					  <v-btn 
						block 
						color="primary" 
						@click="handleChangePassword"
						:loading="loading"
						:disabled="!isFormValid"
					  >
						{{ $t('forgot.resetPassword') }}
					  </v-btn>
  
					  <div class="mt-5 font-weight-bold">
						<router-link class="text-decoration-none primary--text" :to="{name: 'login'}">
						  {{ $t('forgot.backToLogin') }}
						</router-link>
					  </div>
					</v-form>
				  </v-card>
				</v-col>
			  </v-row>
			</v-card-text>
		  </v-card>
		</v-col>
	  </v-row>
	</v-container>
  </template>
  
  <script>
  import AuthSidebar from "./AuthSidebar.vue"
  import LanguageSelection from "@/components/LanguageSelection.vue"
import ForgotPasswordService from '@/_services/ForgotPassword'
  
  export default {
	name: 'ChangePassword',
	components: {
	  AuthSidebar,
	  LanguageSelection
	},
	data() {
	  return {
		isFormValid: false,
		loading: false,
		email: '',
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
		emailError: '',
		oldPasswordError: '',
		newPasswordError: '',
		confirmPasswordError: '',
		oldPasswordType: 'password',
		newPasswordType: 'password',
		confirmPasswordType: 'password',
		oldPasswordIcon: 'mdi-eye',
		newPasswordIcon: 'mdi-eye',
		confirmPasswordIcon: 'mdi-eye',
		emailRules: [
		  v => !!v || 'Email is required',
		  v => /.+@.+\..+/.test(v) || 'Email must be valid'
		],
		passwordRules: [
		  v => !!v || 'Password is required',
		  v => v.length >= 8 || 'Password must be at least 8 characters',
		  v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
		  v => /[a-z]/.test(v) || 'Password must contain at least one lowercase letter',
		  v => /[0-9]/.test(v) || 'Password must contain at least one number',
		  v => /[!@#$%^&*]/.test(v) || 'Password must contain at least one special character (!@#$%^&*)'
		],
		confirmPasswordRules: [
		  v => !!v || 'Confirm password is required',
		  v => v === this.newPassword || 'Passwords do not match'
		]
	  }
	},
	methods: {
	  toggleOldPasswordVisibility() {
		this.oldPasswordType = this.oldPasswordType === 'password' ? 'text' : 'password'
		this.oldPasswordIcon = this.oldPasswordType === 'password' ? 'mdi-eye' : 'mdi-eye-off'
	  },
	  
	  toggleNewPasswordVisibility() {
		this.newPasswordType = this.newPasswordType === 'password' ? 'text' : 'password'
		this.newPasswordIcon = this.newPasswordType === 'password' ? 'mdi-eye' : 'mdi-eye-off'
	  },
	  
	  toggleConfirmPasswordVisibility() {
		this.confirmPasswordType = this.confirmPasswordType === 'password' ? 'text' : 'password'
		this.confirmPasswordIcon = this.confirmPasswordType === 'password' ? 'mdi-eye' : 'mdi-eye-off'
	  },
	  
	  async handleChangePassword() {
		if (!this.$refs.changePasswordForm.validate()) return
		
		this.loading = true
		try {
		  const response = await ForgotPasswordService.resetPassword({
			email: this.email,
			oldPassword: this.oldPassword,
			newPassword: this.newPassword,
			confirmPassword: this.confirmPassword
		  })
		  
		  if (response.success) {
			this.$notify({
				title: this.$t("forgot.passwordResetSuccess"),
				type: 'success'
			});
			this.$router.push({ name: 'login' })
		  } else {
			this.$notify({
				title: response.message || this.$t('forgot.passwordResetFailed'),
				type: 'error'
			});
		  }
		} catch (error) {
			this.$notify({
				title: error.message || this.$t('forgot.errorOccurred'),
				type: 'error'
			});
		} finally {
		  this.loading = false
		}
	  }
	}
  }
  </script>
  
  <style scoped lang="scss">
  .pts {
	margin-top: 15%;
	vertical-align: middle;
  }
  
  ::v-deep .v-input__slot {
	margin-bottom: 0;
  }
  
  ::v-deep .v-text-field__details {
	margin-bottom: 8px;
  }
  </style>